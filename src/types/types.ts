export type UserRole = 'user' | 'admin';
export type RegistrationType = 'individual' | 'team';
export type EventStatus = 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
export type UserCategory = 
  | 'BTech 1st Year'
  | 'BTech 2nd Year'
  | 'BTech 3rd Year'
  | 'BTech 4th Year'
  | 'MTech 1st Year'
  | 'MTech 2nd Year'
  | 'PhD Scholar'
  | 'Faculty'
  | 'Staff'
  | 'Alumni';
export type ParticipationType = 'Friendly' | 'Competitive';

export interface Profile {
  id: string;
  username: string | null;
  full_name: string | null;
  email: string | null;
  phone: string | null;
  role: UserRole;
  user_category: UserCategory | null;
  participation_type: ParticipationType | null;
  created_at: string;
  updated_at: string;
}

export type GenderCategory = 'both' | 'boys' | 'girls';

export interface Sport {
  id: string;
  name: string;
  slug: string;
  description: string;
  rules: string;
  icon_url: string | null;
  is_pre_event?: boolean;
  gender_category?: GenderCategory;
  created_at: string;
}

export interface Event {
  id: string;
  sport_id: string;
  title: string;
  description: string | null;
  event_date: string;
  event_time: string;
  location: string;
  registration_type: RegistrationType;
  total_slots?: number | null;
  available_slots?: number | null;
  team_size: number | null;
  status: EventStatus;
  created_by: string | null;
  created_at: string;
  updated_at: string;
  sport?: Sport;
}

export interface Registration {
  id: string;
  event_id: string;
  user_id: string;
  registration_type: RegistrationType;
  team_name: string | null;
  leader_mobile_number?: string | null;
  status: string;
  qr_code_data: string;
  created_at: string;
  team_invite_code?: string | null;
  current_team_size?: number | null;
  user_role?: 'Leader' | 'Member'; // Role of current user in this team
  event?: Event;
  team_members?: TeamMember[];
  documents?: Document[];
}

export interface TeamMember {
  id: string;
  registration_id: string;
  user_id?: string | null; // Added for proper user tracking
  member_name: string;
  member_email: string | null;
  created_at: string;
}

export interface Document {
  id: string;
  registration_id: string;
  file_name: string;
  file_url: string;
  file_type: string;
  uploaded_at: string;
}

export interface EventFormData {
  sport_id: string;
  title: string;
  description: string;
  event_date?: string;
  event_time?: string;
  location?: string;
  registration_type: RegistrationType;
  total_slots?: number;
  team_size?: number;
}

export interface RegistrationFormData {
  event_id: string;
  registration_type: RegistrationType;
  team_name?: string;
  leader_mobile_number?: string;
  team_members?: {
    member_name: string;
    member_email: string;
  }[];
}
