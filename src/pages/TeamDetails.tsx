import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/db/supabase';
import { removeTeamMember, checkTeamMemberAccess } from '@/db/api';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Users, Crown, UserX, Loader2 } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

interface TeamMemberData {
  id: string;
  user_id: string | null;
  member_name: string;
  member_email: string | null;
  created_at: string;
}

interface TeamData {
  registration_id: string;
  team_name: string;
  event_title: string;
  event_date: string;
  event_time: string;
  event_location: string;
  sport_name: string;
  leader_id: string;
  leader_name: string;
  current_team_size: number;
  max_team_size: number | null;
  members: TeamMemberData[];
}

export default function TeamDetails() {
  const { registrationId } = useParams<{ registrationId: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [teamData, setTeamData] = useState<TeamData | null>(null);
  const [loading, setLoading] = useState(true);
  const [removingMemberId, setRemovingMemberId] = useState<string | null>(null);
  const [isLeader, setIsLeader] = useState(false);

  useEffect(() => {
    if (!user || !registrationId) {
      navigate('/login');
      return;
    }

    loadTeamData();
  }, [user, registrationId, navigate]);

  const loadTeamData = async () => {
    if (!registrationId || !user) {
      console.error('Missing required parameters:', { registrationId, userId: user?.id });
      return;
    }

    try {
      setLoading(true);

      // CRITICAL FIX: Use backend access check function
      // This handles ALL access scenarios including email-based matching
      console.log('Checking team access:', { registrationId, userId: user.id });
      
      const accessCheck = await checkTeamMemberAccess(registrationId, user.id);

      console.log('Access check result:', accessCheck);

      // Handle access denied
      if (!accessCheck.success) {
        if (accessCheck.error_code === 'TEAM_NOT_FOUND') {
          console.error('Team not found:', { registrationId, userId: user.id });
          toast({
            title: 'Team Not Found',
            description: 'The team you are looking for does not exist or has been deleted',
            variant: 'destructive',
          });
        } else if (accessCheck.error_code === 'ACCESS_DENIED') {
          console.error('Access denied:', accessCheck.debug_info || { registrationId, userId: user.id });
          toast({
            title: 'Access Denied',
            description: 'You are not a member of this team',
            variant: 'destructive',
          });
        } else {
          console.error('Team access check failed:', accessCheck);
          toast({
            title: 'Error Loading Team',
            description: accessCheck.error || 'Team data unavailable. Please refresh the page.',
            variant: 'destructive',
          });
        }
        navigate('/dashboard');
        return;
      }

      // Access granted - set role
      const userIsLeader = accessCheck.is_leader || false;
      setIsLeader(userIsLeader);

      console.log('Access granted:', { isLeader: userIsLeader, isMember: accessCheck.is_member });

      // Fetch registration details
      const { data: registration, error: regError } = await supabase
        .from('registrations')
        .select(`
          id,
          team_name,
          user_id,
          current_team_size,
          event:events!registrations_event_id_fkey(
            id,
            title,
            event_date,
            event_time,
            location,
            team_size,
            sport:sports!events_sport_id_fkey(name)
          )
        `)
        .eq('id', registrationId)
        .eq('registration_type', 'team')
        .maybeSingle();

      if (regError) {
        console.error('Error fetching registration:', regError);
        throw regError;
      }

      if (!registration) {
        console.error('Registration not found after access check passed:', registrationId);
        toast({
          title: 'Team Not Found',
          description: 'The team you are looking for does not exist or has been deleted',
          variant: 'destructive',
        });
        navigate('/dashboard');
        return;
      }

      // Get leader profile
      const { data: leaderProfile } = await supabase
        .from('profiles')
        .select('username')
        .eq('id', registration.user_id)
        .maybeSingle();

      // Get team members
      const { data: members, error: membersError } = await supabase
        .from('team_members')
        .select('*')
        .eq('registration_id', registrationId)
        .order('created_at', { ascending: true });

      if (membersError) {
        console.error('Error fetching team members:', membersError);
        throw membersError;
      }

      const event = registration.event as any;
      const sport = event?.sport as any;

      setTeamData({
        registration_id: registration.id,
        team_name: registration.team_name || 'Unnamed Team',
        event_title: event?.title || 'Unknown Event',
        event_date: event?.event_date || '',
        event_time: event?.event_time || '',
        event_location: event?.location || '',
        sport_name: sport?.name || 'Unknown Sport',
        leader_id: registration.user_id,
        leader_name: leaderProfile?.username || 'Team Leader',
        current_team_size: registration.current_team_size || 1,
        max_team_size: event?.team_size || null,
        members: members || [],
      });

      console.log('Team data loaded successfully:', {
        teamName: registration.team_name,
        memberCount: members?.length || 0,
        isLeader: userIsLeader
      });

    } catch (error: any) {
      console.error('Failed to load team data:', {
        error: error.message || error,
        stack: error.stack,
        userId: user?.id,
        registrationId
      });
      toast({
        title: 'Error Loading Team',
        description: 'Team data unavailable. Please refresh the page.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveMember = async (memberId: string, memberName: string) => {
    if (!user) return;

    setRemovingMemberId(memberId);

    try {
      const result = await removeTeamMember(memberId, user.id);

      if (result.success) {
        toast({
          title: 'Success',
          description: result.message || `${memberName} has been removed from the team`,
        });

        // Reload team data
        await loadTeamData();
      } else {
        // Handle specific error codes
        if (result.http_status === 403 || result.error_code === 'FORBIDDEN') {
          console.error('Unauthorized removal attempt:', {
            userId: user.id,
            memberId,
            errorCode: result.error_code
          });
          toast({
            title: 'Access Denied',
            description: 'Only the team leader can remove members',
            variant: 'destructive',
          });
        } else if (result.error_code === 'CANNOT_REMOVE_LEADER') {
          toast({
            title: 'Cannot Remove Leader',
            description: 'Team leader cannot be removed. Use "Delete Team" instead.',
            variant: 'destructive',
          });
        } else if (result.error_code === 'MEMBER_NOT_FOUND') {
          toast({
            title: 'Member Not Found',
            description: 'This member may have already been removed',
            variant: 'destructive',
          });
          // Reload to refresh the list
          await loadTeamData();
        } else {
          console.error('Failed to remove member:', result);
          toast({
            title: 'Failed to Remove Member',
            description: result.error || 'An error occurred while removing the member',
            variant: 'destructive',
          });
        }
      }
    } catch (error: any) {
      console.error('Exception while removing member:', error);
      toast({
        title: 'Error',
        description: 'Network error occurred. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setRemovingMemberId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!teamData) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-muted-foreground">Team not found</p>
      </div>
    );
  }

  const formattedDate = new Date(teamData.event_date).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="min-h-screen py-12 xl:pt-24 xl:pb-12">
      <div className="container max-w-4xl">
        <div className="mb-8">
          <Button
            variant="outline"
            size="default"
            onClick={() => navigate('/dashboard')}
            className="bg-card/80 backdrop-blur-sm border-primary/30 text-primary hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all duration-200"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-3xl mb-2">{teamData.team_name}</CardTitle>
                <CardDescription className="text-base">
                  {teamData.event_title} • {teamData.sport_name}
                </CardDescription>
                <p className="text-sm text-muted-foreground mt-2">
                  {formattedDate} at {teamData.event_time} • {teamData.event_location}
                </p>
              </div>
              <Badge variant="secondary" className="text-sm">
                <Users className="h-3 w-3 mr-1" />
                {teamData.current_team_size}
                {teamData.max_team_size && `/${teamData.max_team_size}`}
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Team Leader */}
            <div>
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <Crown className="h-5 w-5 text-primary" />
                Team Leader
              </h3>
              <div className="bg-muted/50 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{teamData.leader_name}</p>
                    <p className="text-sm text-muted-foreground">Leader</p>
                  </div>
                  <Badge variant="default">Leader</Badge>
                </div>
              </div>
            </div>

            {/* Team Members */}
            <div>
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                Team Members
                {teamData.members.length > 0 && (
                  <span className="text-sm font-normal text-muted-foreground">
                    ({teamData.members.length})
                  </span>
                )}
              </h3>

              {teamData.members.length === 0 ? (
                <div className="bg-muted/30 rounded-lg p-8 text-center">
                  <Users className="h-12 w-12 mx-auto mb-3 text-muted-foreground/50" />
                  <p className="text-muted-foreground">No team members yet</p>
                  {isLeader && (
                    <p className="text-sm text-muted-foreground mt-1">
                      Share your team invite link to add members
                    </p>
                  )}
                </div>
              ) : (
                <div className="space-y-2">
                  {teamData.members.map((member) => (
                    <div
                      key={member.id}
                      className="bg-muted/30 rounded-lg p-4 flex items-center justify-between gap-3"
                    >
                      {/* Member Info - Flexible width with text truncation */}
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{member.member_name}</p>
                        {member.member_email && (
                          <p className="text-xs text-muted-foreground truncate mt-1">
                            {member.member_email}
                          </p>
                        )}
                      </div>

                      {/* CRITICAL: Remove button ONLY visible to leader - Fixed width */}
                      {isLeader && (
                        <div className="flex-shrink-0">
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-destructive hover:text-destructive hover:bg-destructive/10 h-9 w-9 p-0"
                                disabled={removingMemberId === member.id}
                              >
                                {removingMemberId === member.id ? (
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                  <UserX className="h-4 w-4" />
                                )}
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Remove Team Member?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to remove "{member.member_name}" from the team?
                                  They will lose access to this event and will need a new invite to rejoin.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleRemoveMember(member.id, member.member_name)}
                                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                >
                                  Remove Member
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Team Info */}
            {isLeader && (
              <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
                <p className="text-sm text-muted-foreground">
                  <strong>Leader Actions:</strong> You can remove team members, share invite links,
                  or delete the entire team from the dashboard.
                </p>
              </div>
            )}

            {!isLeader && (
              <div className="bg-muted/30 rounded-lg p-4">
                <p className="text-sm text-muted-foreground">
                  <strong>Team Member:</strong> You can view team details and exit the team from the dashboard.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
