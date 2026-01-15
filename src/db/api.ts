import { supabase } from './supabase';
import type { Sport, Event, Registration, EventFormData, RegistrationFormData, TeamMember, Document } from '@/types/types';

// Sports API
export const getSports = async (): Promise<Sport[]> => {
  const { data, error } = await supabase
    .from('sports')
    .select('*')
    .order('name');

  if (error) throw error;
  return Array.isArray(data) ? data : [];
};

export const getSportBySlug = async (slug: string): Promise<Sport | null> => {
  const { data, error } = await supabase
    .from('sports')
    .select('*')
    .eq('slug', slug)
    .maybeSingle();

  if (error) throw error;
  return data;
};

// Events API
export const getEvents = async (filters?: {
  sport_id?: string;
  date?: string;
  location?: string;
  registration_type?: string;
}): Promise<Event[]> => {
  let query = supabase
    .from('events')
    .select('*, sport:sports!events_sport_id_fkey(*)')
    .eq('status', 'upcoming')
    .order('event_date', { ascending: true });

  if (filters?.sport_id) {
    query = query.eq('sport_id', filters.sport_id);
  }
  if (filters?.date) {
    query = query.eq('event_date', filters.date);
  }
  if (filters?.location) {
    query = query.ilike('location', `%${filters.location}%`);
  }
  if (filters?.registration_type) {
    query = query.eq('registration_type', filters.registration_type);
  }

  const { data, error } = await query;

  if (error) throw error;
  return Array.isArray(data) ? data : [];
};

export const getEventById = async (id: string): Promise<Event | null> => {
  const { data, error } = await supabase
    .from('events')
    .select('*, sport:sports!events_sport_id_fkey(*)')
    .eq('id', id)
    .maybeSingle();

  if (error) throw error;
  return data;
};

export const createEvent = async (eventData: EventFormData): Promise<Event> => {
  // Remove total_slots from the data since we no longer use slot limits
  const { total_slots, ...eventDataWithoutSlots } = eventData;
  
  const { data, error } = await supabase
    .from('events')
    .insert({
      ...eventDataWithoutSlots,
      status: 'upcoming',
    })
    .select('*, sport:sports!events_sport_id_fkey(*)')
    .single();

  if (error) {
    console.error('Create event error:', error);
    throw error;
  }
  return data;
};

export const updateEvent = async (id: string, eventData: Partial<EventFormData>): Promise<Event> => {
  // Remove total_slots from the data since we no longer use slot limits
  const { total_slots, ...eventDataWithoutSlots } = eventData;
  
  const { data, error } = await supabase
    .from('events')
    .update({
      ...eventDataWithoutSlots,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select('*, sport:sports!events_sport_id_fkey(*)')
    .single();

  if (error) {
    console.error('Update event error:', error);
    throw error;
  }
  return data;
};

export const deleteEvent = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('events')
    .delete()
    .eq('id', id);

  if (error) throw error;
};

// Registrations API
export const createRegistration = async (
  registrationData: RegistrationFormData,
  userId: string
): Promise<Registration> => {
  // CRITICAL: Check for duplicate registration (user_id + event_id)
  const { data: duplicateCheck } = await supabase
    .from('registrations')
    .select('id')
    .eq('user_id', userId)
    .eq('event_id', registrationData.event_id)
    .maybeSingle();

  if (duplicateCheck) {
    // Log the blocked duplicate attempt
    try {
      await supabase
        .from('duplicate_registration_attempts')
        .insert({
          user_id: userId,
          event_id: registrationData.event_id,
          ip_address: null,
          user_agent: typeof navigator !== 'undefined' ? navigator.userAgent : null,
        });
      console.log('Duplicate registration attempt logged');
    } catch (err) {
      console.error('Failed to log duplicate attempt:', err);
    }

    throw new Error('You have already registered for this event.');
  }

  // Validate team name uniqueness per event
  if (registrationData.team_name) {
    const { data: existingRegistration } = await supabase
      .from('registrations')
      .select('id')
      .eq('event_id', registrationData.event_id)
      .eq('team_name', registrationData.team_name)
      .maybeSingle();

    if (existingRegistration) {
      throw new Error('This team name is already taken for this event. Please choose a different name.');
    }
  }

  const qrCodeData = `REG-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  const { data: registration, error: regError } = await supabase
    .from('registrations')
    .insert({
      event_id: registrationData.event_id,
      user_id: userId,
      registration_type: registrationData.registration_type,
      team_name: registrationData.team_name || null,
      leader_mobile_number: registrationData.leader_mobile_number || null,
      qr_code_data: qrCodeData,
      status: 'confirmed',
    })
    .select('*')
    .single();

  if (regError) {
    // Check if error is due to unique constraint violation
    if (regError.code === '23505') {
      throw new Error('You have already registered for this event.');
    }
    throw regError;
  }

  // Add team members if team registration
  if (registrationData.registration_type === 'team' && registrationData.team_members && registrationData.team_members.length > 0) {
    const teamMembersData = registrationData.team_members.map(member => ({
      registration_id: registration.id,
      member_name: member.member_name,
      member_email: member.member_email || null,
    }));

    const { error: teamError } = await supabase
      .from('team_members')
      .insert(teamMembersData);

    if (teamError) throw teamError;
  }

  return registration;
};

// Check if user has already registered for an event
export const checkUserRegistration = async (
  userId: string,
  eventId: string
): Promise<boolean> => {
  const { data } = await supabase
    .from('registrations')
    .select('id')
    .eq('user_id', userId)
    .eq('event_id', eventId)
    .maybeSingle();

  return !!data;
};

export const getUserRegistrations = async (userId: string): Promise<Registration[]> => {
  // Use the new get_user_events function that includes both leader and member events
  const { data, error } = await supabase
    .rpc('get_user_events', { p_user_id: userId });

  if (error) {
    console.error('Failed to get user events:', error);
    throw error;
  }

  if (!Array.isArray(data)) return [];

  // Transform the data to match Registration type
  const registrations = await Promise.all(data.map(async (event: any) => {
    // Get team members for this registration
    const { data: teamMembers } = await supabase
      .from('team_members')
      .select('*')
      .eq('registration_id', event.registration_id);

    // Get documents for this registration
    const { data: documents } = await supabase
      .from('documents')
      .select('*')
      .eq('registration_id', event.registration_id);

    // Get full event details
    const { data: fullEvent } = await supabase
      .from('events')
      .select('*, sport:sports!events_sport_id_fkey(*)')
      .eq('id', event.event_id)
      .maybeSingle();

    return {
      id: event.registration_id,
      event_id: event.event_id,
      user_id: userId,
      registration_type: event.registration_type,
      team_name: event.team_name,
      status: event.status,
      qr_code_data: event.qr_code_data,
      created_at: event.created_at,
      team_invite_code: event.team_invite_code,
      current_team_size: event.current_team_size,
      user_role: event.user_role, // 'Leader' or 'Member'
      event: fullEvent || undefined,
      team_members: teamMembers || [],
      documents: documents || []
    } as Registration;
  }));

  return registrations;
};

export const getEventRegistrations = async (eventId: string): Promise<Registration[]> => {
  const { data, error } = await supabase
    .from('registrations')
    .select(`
      *,
      team_members(*),
      documents(*)
    `)
    .eq('event_id', eventId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return Array.isArray(data) ? data : [];
};

export const checkExistingRegistration = async (
  userId: string,
  eventId: string
): Promise<boolean> => {
  const { data, error } = await supabase
    .from('registrations')
    .select('id')
    .eq('user_id', userId)
    .eq('event_id', eventId)
    .maybeSingle();

  if (error) throw error;
  return !!data;
};

// Team Members API
export const getTeamMembers = async (registrationId: string): Promise<TeamMember[]> => {
  const { data, error } = await supabase
    .from('team_members')
    .select('*')
    .eq('registration_id', registrationId)
    .order('created_at');

  if (error) throw error;
  return Array.isArray(data) ? data : [];
};

// Team Invite API
export const getTeamInviteCode = async (registrationId: string): Promise<string | null> => {
  const { data, error } = await supabase
    .from('registrations')
    .select('team_invite_code')
    .eq('id', registrationId)
    .eq('registration_type', 'team')
    .maybeSingle();

  if (error) throw error;
  return data?.team_invite_code || null;
};

export const joinTeamViaInvite = async (
  inviteCode: string,
  userId: string,
  memberData: {
    member_name: string;
    member_email: string;
  }
): Promise<{ success: boolean; error?: string; data?: any }> => {
  try {
    const { data, error } = await supabase.rpc('join_team_via_invite', {
      p_invite_code: inviteCode,
      p_user_id: userId,
      p_member_name: memberData.member_name,
      p_member_email: memberData.member_email || '',
    });

    if (error) {
      console.error('RPC error:', error);
      return { success: false, error: error.message };
    }

    if (!data) {
      return { success: false, error: 'No response from server' };
    }

    console.log('RPC response:', data);
    return data as { success: boolean; error?: string; data?: any };
  } catch (err: any) {
    console.error('Exception in joinTeamViaInvite:', err);
    return { success: false, error: err.message || 'An unexpected error occurred' };
  }
};

export const getTeamDetails = async (registrationId: string) => {
  const { data: registration, error: regError } = await supabase
    .from('registrations')
    .select(`
      *,
      events!inner(
        name,
        team_size,
        sport_id,
        sports!inner(name)
      )
    `)
    .eq('id', registrationId)
    .maybeSingle();

  if (regError) throw regError;

  const { data: members, error: membersError } = await supabase
    .from('team_members')
    .select('*')
    .eq('registration_id', registrationId)
    .order('created_at', { ascending: true });

  if (membersError) throw membersError;

  return {
    registration,
    members: Array.isArray(members) ? members : [],
    currentSize: registration?.current_team_size || 1,
    maxSize: registration?.events?.team_size || null,
  };
};

// Validate team size before adding member
export const canAddTeamMember = async (
  registrationId: string
): Promise<{ canAdd: boolean; reason?: string; currentSize?: number; maxSize?: number }> => {
  const { data: registration, error } = await supabase
    .from('registrations')
    .select(`
      current_team_size,
      events!inner(team_size)
    `)
    .eq('id', registrationId)
    .maybeSingle();

  if (error) throw error;
  if (!registration) {
    return { canAdd: false, reason: 'Registration not found' };
  }

  const currentSize = registration.current_team_size || 1;
  const maxSize = (registration.events as any)?.team_size;

  if (maxSize && currentSize >= maxSize) {
    return {
      canAdd: false,
      reason: `Team is full. Maximum ${maxSize} members allowed.`,
      currentSize,
      maxSize,
    };
  }

  return { canAdd: true, currentSize, maxSize };
};

// Documents API
export const uploadDocument = async (
  registrationId: string,
  file: File
): Promise<Document> => {
  const fileExt = file.name.split('.').pop();
  const fileName = `${registrationId}_${Date.now()}.${fileExt}`;
  const filePath = `${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from('app-8uulibpxqebl_documents')
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false,
    });

  if (uploadError) throw uploadError;

  const { data: { publicUrl } } = supabase.storage
    .from('app-8uulibpxqebl_documents')
    .getPublicUrl(filePath);

  const { data: document, error: docError } = await supabase
    .from('documents')
    .insert({
      registration_id: registrationId,
      file_name: file.name,
      file_url: publicUrl,
      file_type: file.type,
    })
    .select('*')
    .single();

  if (docError) throw docError;
  return document;
};

export const getDocuments = async (registrationId: string): Promise<Document[]> => {
  const { data, error } = await supabase
    .from('documents')
    .select('*')
    .eq('registration_id', registrationId)
    .order('uploaded_at', { ascending: false });

  if (error) throw error;
  return Array.isArray(data) ? data : [];
};

// Admin API
export const getAllRegistrations = async (): Promise<Registration[]> => {
  const { data, error } = await supabase
    .from('registrations')
    .select(`
      *,
      event:events!registrations_event_id_fkey(
        *,
        sport:sports!events_sport_id_fkey(*)
      ),
      team_members(*),
      documents(*)
    `)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return Array.isArray(data) ? data : [];
};

export const getAllEvents = async (): Promise<Event[]> => {
  const { data, error } = await supabase
    .from('events')
    .select('*, sport:sports!events_sport_id_fkey(*)')
    .order('event_date', { ascending: false });

  if (error) throw error;
  return Array.isArray(data) ? data : [];
};

export const getAllProfiles = async () => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return Array.isArray(data) ? data : [];
};

export const updateUserRole = async (userId: string, role: 'user' | 'admin') => {
  const { data, error } = await supabase
    .from('profiles')
    .update({ role, updated_at: new Date().toISOString() })
    .eq('id', userId)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const deleteUser = async (userId: string): Promise<{
  success: boolean;
  deleted_email: string;
  deleted_name: string;
  registrations_deleted: number;
  team_memberships_deleted: number;
}> => {
  const { data, error } = await supabase
    .rpc('delete_user_cascade', { user_id_to_delete: userId });

  if (error) {
    console.error('Delete user error:', error);
    throw error;
  }

  return data;
};

export const deleteRegistration = async (registrationId: string): Promise<void> => {
  // Get the registration to update event slots
  const { data: registration } = await supabase
    .from('registrations')
    .select('event_id')
    .eq('id', registrationId)
    .single();

  const { error } = await supabase
    .from('registrations')
    .delete()
    .eq('id', registrationId);

  if (error) throw error;

  // Increment available slots back
  if (registration) {
    await supabase
      .from('events')
      .update({ 
        available_slots: supabase.rpc('increment', { x: 1 }),
        updated_at: new Date().toISOString()
      })
      .eq('id', registration.event_id);
  }
};

export const getRegistrationStats = async () => {
  const { data: registrations } = await supabase
    .from('registrations')
    .select('id, registration_type, created_at');

  const { data: events } = await supabase
    .from('events')
    .select('id, status');

  const { data: users } = await supabase
    .from('profiles')
    .select('id');

  return {
    totalRegistrations: registrations?.length || 0,
    totalEvents: events?.length || 0,
    totalUsers: users?.length || 0,
    upcomingEvents: events?.filter(e => e.status === 'upcoming').length || 0,
    teamRegistrations: registrations?.filter(r => r.registration_type === 'team').length || 0,
    individualRegistrations: registrations?.filter(r => r.registration_type === 'individual').length || 0,
  };
};

// Team Management API
export const exitTeam = async (
  registrationId: string,
  userId: string
): Promise<{ success: boolean; error?: string; error_code?: string; message?: string }> => {
  try {
    const { data, error } = await supabase.rpc('exit_team', {
      p_registration_id: registrationId,
      p_user_id: userId
    });

    if (error) {
      console.error('Exit team RPC error:', error);
      throw error;
    }

    return data as { success: boolean; error?: string; error_code?: string; message?: string };
  } catch (error: any) {
    console.error('Failed to exit team:', error);
    return {
      success: false,
      error: error.message || 'Failed to exit team'
    };
  }
};

export const deleteTeam = async (
  registrationId: string,
  userId: string
): Promise<{ success: boolean; error?: string; error_code?: string; message?: string }> => {
  try {
    const { data, error } = await supabase.rpc('delete_team', {
      p_registration_id: registrationId,
      p_user_id: userId
    });

    if (error) {
      console.error('Delete team RPC error:', error);
      throw error;
    }

    return data as { success: boolean; error?: string; error_code?: string; message?: string };
  } catch (error: any) {
    console.error('Failed to delete team:', error);
    return {
      success: false,
      error: error.message || 'Failed to delete team'
    };
  }
};

export const removeTeamMember = async (
  memberId: string,
  requestingUserId: string
): Promise<{ success: boolean; error?: string; error_code?: string; message?: string; http_status?: number; removed_user_id?: string }> => {
  try {
    const { data, error } = await supabase.rpc('remove_team_member', {
      p_member_id: memberId,
      p_requesting_user_id: requestingUserId
    });

    if (error) {
      console.error('Remove team member RPC error:', error);
      throw error;
    }

    return data as { success: boolean; error?: string; error_code?: string; message?: string; http_status?: number; removed_user_id?: string };
  } catch (error: any) {
    console.error('Failed to remove team member:', error);
    return {
      success: false,
      error: error.message || 'Failed to remove team member'
    };
  }
};

export const checkTeamMemberAccess = async (
  registrationId: string,
  userId: string
): Promise<{ 
  success: boolean; 
  is_leader?: boolean; 
  is_member?: boolean; 
  access_granted?: boolean;
  error?: string; 
  error_code?: string; 
  http_status?: number;
  debug_info?: any;
}> => {
  try {
    const { data, error } = await supabase.rpc('check_team_member_access', {
      p_registration_id: registrationId,
      p_user_id: userId
    });

    if (error) {
      console.error('Check team member access RPC error:', error);
      throw error;
    }

    return data as { 
      success: boolean; 
      is_leader?: boolean; 
      is_member?: boolean; 
      access_granted?: boolean;
      error?: string; 
      error_code?: string; 
      http_status?: number;
      debug_info?: any;
    };
  } catch (error: any) {
    console.error('Failed to check team member access:', error);
    return {
      success: false,
      error: error.message || 'Failed to check team access',
      error_code: 'CLIENT_ERROR',
      http_status: 500
    };
  }
};

// ============================================
// ADMIN DASHBOARD APIs
// ============================================

/**
 * Get all events for a specific sport (Admin only)
 * Used in SPORT → EVENT flow
 */
export const getEventsBySport = async (sportId: string): Promise<Event[]> => {
  try {
    const { data, error } = await supabase
      .from('events')
      .select(`
        *,
        sport:sports!events_sport_id_fkey(*)
      `)
      .eq('sport_id', sportId)
      .order('event_date', { ascending: true });

    if (error) {
      console.error('Failed to fetch events by sport:', error);
      throw error;
    }

    return Array.isArray(data) ? data : [];
  } catch (error: any) {
    console.error('getEventsBySport error:', error);
    throw error;
  }
};

/**
 * Get all teams registered for a specific event (Admin only)
 * Used in EVENT → TEAM flow
 */
export const getTeamsByEvent = async (eventId: string): Promise<any[]> => {
  try {
    const { data, error } = await supabase
      .from('registrations')
      .select(`
        id,
        team_name,
        registration_type,
        current_team_size,
        leader_mobile_number,
        created_at,
        user_id,
        profiles!inner(
          id,
          username
        ),
        events!inner(
          id,
          title,
          sport_id,
          sports!inner(
            id,
            name
          )
        )
      `)
      .eq('event_id', eventId)
      .eq('status', 'confirmed')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Failed to fetch teams by event:', error);
      throw error;
    }

    // Transform data
    const teams = data?.map((reg: any) => ({
      id: reg.id,
      team_name: reg.team_name || reg.profiles.username,
      registration_type: reg.registration_type,
      team_size: reg.current_team_size || 1,
      leader_username: reg.profiles.username,
      leader_id: reg.user_id,
      leader_mobile_number: reg.leader_mobile_number || 'N/A',
      sport_name: reg.events.sports.name,
      event_name: reg.events.title,
      created_at: reg.created_at,
    })) || [];

    return teams;
  } catch (error: any) {
    console.error('getTeamsByEvent error:', error);
    throw error;
  }
};

/**
 * Get team details with all members (Admin only)
 * Used in TEAM → MEMBERS flow
 * Returns ONLY usernames (no emails, no phone numbers)
 */
export const getAdminTeamDetails = async (teamId: string): Promise<{
  team_name: string;
  sport_name: string;
  event_name: string;
  registration_type: string;
  leader_username: string;
  members: { username: string }[];
}> => {
  try {
    // Get registration details
    const { data: registration, error: regError } = await supabase
      .from('registrations')
      .select(`
        id,
        team_name,
        registration_type,
        user_id,
        profiles!inner(
          id,
          username
        ),
        events!inner(
          id,
          title,
          sports!inner(
            id,
            name
          )
        )
      `)
      .eq('id', teamId)
      .maybeSingle();

    if (regError) {
      console.error('Failed to fetch registration:', regError);
      throw regError;
    }

    if (!registration) {
      throw new Error('Team not found');
    }

    // Get team members
    const { data: members, error: membersError } = await supabase
      .from('team_members')
      .select('member_name')
      .eq('registration_id', teamId)
      .order('created_at', { ascending: true });

    if (membersError) {
      console.error('Failed to fetch team members:', membersError);
      throw membersError;
    }

    return {
      team_name: registration.team_name || (registration.profiles as any).username,
      sport_name: (registration.events as any).sports.name,
      event_name: (registration.events as any).title,
      registration_type: registration.registration_type,
      leader_username: (registration.profiles as any).username,
      members: members?.map(m => ({
        username: m.member_name
      })) || []
    };
  } catch (error: any) {
    console.error('getAdminTeamDetails error:', error);
    throw error;
  }
};

/**
 * Export event data to CSV or Excel (Admin only)
 * Exports ONLY selected event data
 */
export const exportEventData = async (
  eventId: string,
  format: 'csv' | 'excel'
): Promise<{ data: any[]; eventName: string; sportName: string }> => {
  try {
    // Get all registrations for the event
    const { data: registrations, error } = await supabase
      .from('registrations')
      .select(`
        id,
        team_name,
        registration_type,
        leader_mobile_number,
        user_id,
        profiles!inner(
          id,
          username
        ),
        events!inner(
          id,
          title,
          sports!inner(
            id,
            name
          )
        )
      `)
      .eq('event_id', eventId)
      .eq('status', 'confirmed')
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Failed to fetch registrations for export:', error);
      throw error;
    }

    if (!registrations || registrations.length === 0) {
      return {
        data: [],
        eventName: 'Unknown Event',
        sportName: 'Unknown Sport'
      };
    }

    const eventName = (registrations[0].events as any).title;
    const sportName = (registrations[0].events as any).sports.name;

    // Get team members for each registration
    const exportData: any[] = [];

    for (const reg of registrations) {
      const teamName = reg.team_name || (reg.profiles as any).username;
      const leaderUsername = (reg.profiles as any).username;
      const leaderMobileNumber = reg.leader_mobile_number || 'N/A';

      // Add leader
      exportData.push({
        'Team Name': teamName,
        'Team Leader Name': leaderUsername,
        'Team Leader Contact Number': leaderMobileNumber,
        'Username': leaderUsername,
        'Sport': sportName,
        'Event': eventName,
        'Registration Type': reg.registration_type,
        'Role': 'Leader'
      });

      // Get team members if team registration
      if (reg.registration_type === 'team') {
        const { data: members } = await supabase
          .from('team_members')
          .select('member_name')
          .eq('registration_id', reg.id);

        if (members) {
          for (const member of members) {
            exportData.push({
              'Team Name': teamName,
              'Team Leader Name': leaderUsername,
              'Team Leader Contact Number': leaderMobileNumber,
              'Username': member.member_name,
              'Sport': sportName,
              'Event': eventName,
              'Registration Type': reg.registration_type,
              'Role': 'Member'
            });
          }
        }
      }
    }

    return {
      data: exportData,
      eventName,
      sportName
    };
  } catch (error: any) {
    console.error('exportEventData error:', error);
    throw error;
  }
};
