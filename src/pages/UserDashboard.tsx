import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { getUserRegistrations, getTeamInviteCode, exitTeam, deleteTeam } from '@/db/api';
import type { Registration } from '@/types/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, MapPin, Users, User, Share2, Copy, LogOut, Trash2, Eye } from 'lucide-react';
import QRCodeDataUrl from '@/components/ui/qrcodedataurl';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
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

export default function UserDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);
  const [teamInviteCodes, setTeamInviteCodes] = useState<Record<string, string>>({});

  useEffect(() => {
    const loadRegistrations = async () => {
      if (!user) return;
      
      try {
        const data = await getUserRegistrations(user.id);
        setRegistrations(data);
        
        // Load team invite codes for team registrations
        const codes: Record<string, string> = {};
        for (const reg of data) {
          if (reg.registration_type === 'team') {
            const code = await getTeamInviteCode(reg.id);
            if (code) {
              codes[reg.id] = code;
            }
          }
        }
        setTeamInviteCodes(codes);
      } catch (error) {
        console.error('Failed to load registrations:', error);
      } finally {
        setLoading(false);
      }
    };

    loadRegistrations();
  }, [user]);

  const copyInviteCode = (code: string) => {
    const inviteUrl = `${window.location.origin}/join-team/${code}`;
    navigator.clipboard.writeText(inviteUrl);
    toast({
      title: 'Copied!',
      description: 'Team invite link copied to clipboard',
    });
  };

  const handleExitTeam = async (registrationId: string, teamName: string) => {
    if (!user) return;

    try {
      const result = await exitTeam(registrationId, user.id);

      if (result.success) {
        toast({
          title: 'Success',
          description: result.message || `You have exited ${teamName}`,
        });
        
        // Reload registrations
        const data = await getUserRegistrations(user.id);
        setRegistrations(data);
      } else {
        toast({
          title: 'Failed to Exit Team',
          description: result.error || 'An error occurred',
          variant: 'destructive',
        });
      }
    } catch (error: any) {
      console.error('Failed to exit team:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to exit team',
        variant: 'destructive',
      });
    }
  };

  const handleDeleteTeam = async (registrationId: string, teamName: string) => {
    if (!user) return;

    try {
      const result = await deleteTeam(registrationId, user.id);

      if (result.success) {
        toast({
          title: 'Success',
          description: result.message || `Team "${teamName}" has been deleted`,
        });
        
        // Reload registrations
        const data = await getUserRegistrations(user.id);
        setRegistrations(data);
      } else {
        toast({
          title: 'Failed to Delete Team',
          description: result.error || 'An error occurred',
          variant: 'destructive',
        });
      }
    } catch (error: any) {
      console.error('Failed to delete team:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete team',
        variant: 'destructive',
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 xl:pt-24 xl:pb-12">
      <div className="container">
        <div className="mb-8">
          <h1 className="text-3xl xl:text-4xl font-bold mb-2 dynamic-header">My Events</h1>
          <p className="text-foreground">
            View and manage your event registrations
          </p>
        </div>

        {registrations.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground mb-4">
                You haven't registered for any events yet.
              </p>
              <Button onClick={() => window.location.href = '/'}>
                Browse Events
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            {registrations.map((registration) => {
              const event = registration.event;
              if (!event) return null;

              const eventDate = new Date(event.event_date);
              const formattedDate = eventDate.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              });

              return (
                <Card key={registration.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <CardTitle className="text-xl">{event.title}</CardTitle>
                        <p className="text-sm text-muted-foreground mt-1">
                          {event.sport?.name}
                        </p>
                      </div>
                      <Badge>{registration.status}</Badge>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        <span>{formattedDate} at {event.event_time}</span>
                      </div>
                      
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <MapPin className="h-4 w-4" />
                        <span>{event.location}</span>
                      </div>
                      
                      <div className="flex items-center gap-2 text-muted-foreground">
                        {registration.registration_type === 'team' ? (
                          <>
                            <Users className="h-4 w-4" />
                            <span>Team: {registration.team_name}</span>
                            {registration.user_role && (
                              <Badge variant={registration.user_role === 'Leader' ? 'default' : 'secondary'}>
                                {registration.user_role}
                              </Badge>
                            )}
                          </>
                        ) : (
                          <>
                            <User className="h-4 w-4" />
                            <span>Individual Registration</span>
                          </>
                        )}
                      </div>
                    </div>

                    {registration.registration_type === 'team' && registration.team_members && registration.team_members.length > 0 && (
                      <div className="border-t pt-4">
                        <h4 className="font-medium mb-2 text-sm">Team Members</h4>
                        <ul className="space-y-1 text-sm text-muted-foreground">
                          {registration.team_members.map((member) => (
                            <li key={member.id}>
                              {member.member_name}
                              {member.member_email && ` (${member.member_email})`}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* CRITICAL: View Team button - visible to ALL team members (leaders and members) */}
                    {registration.registration_type === 'team' && (
                      <div className="border-t pt-4">
                        <Button
                          variant="outline"
                          className="w-full"
                          onClick={() => navigate(`/team/${registration.id}`)}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          View Team
                        </Button>
                      </div>
                    )}

                    {registration.registration_type === 'team' && teamInviteCodes[registration.id] && (
                      <div className="border-t pt-4">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button className="w-full">
                              <Share2 className="h-4 w-4 mr-2" />
                              Share Team Invite
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Invite Team Members</DialogTitle>
                              <DialogDescription>
                                Share this QR code or link with your team members to join
                              </DialogDescription>
                            </DialogHeader>
                            <div className="flex flex-col items-center gap-4 py-4">
                              <QRCodeDataUrl 
                                text={`${window.location.origin}/join-team/${teamInviteCodes[registration.id]}`} 
                                width={256} 
                              />
                              <div className="text-center w-full">
                                <p className="font-medium">{registration.team_name}</p>
                                <p className="text-sm text-muted-foreground">
                                  {event.title}
                                </p>
                                <div className="mt-4 p-3 bg-muted rounded-md text-xs break-all">
                                  {`${window.location.origin}/join-team/${teamInviteCodes[registration.id]}`}
                                </div>
                                <Button
                                  variant="secondary"
                                  size="sm"
                                  className="mt-3"
                                  onClick={() => copyInviteCode(teamInviteCodes[registration.id])}
                                >
                                  <Copy className="h-3 w-3 mr-2" />
                                  Copy Link
                                </Button>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </div>
                    )}

                    {/* Role-based team actions */}
                    {registration.registration_type === 'team' && registration.user_role === 'Member' && (
                      <div className="border-t pt-4">
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="outline" className="w-full text-destructive hover:text-destructive">
                              <LogOut className="h-4 w-4 mr-2" />
                              Exit Team
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Exit Team?</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to exit "{registration.team_name}"? This action cannot be undone.
                                You will need a new invite link to rejoin.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleExitTeam(registration.id, registration.team_name || 'the team')}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              >
                                Exit Team
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    )}

                    {registration.registration_type === 'team' && registration.user_role === 'Leader' && (
                      <div className="border-t pt-4">
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="outline" className="w-full text-destructive hover:text-destructive">
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete Team
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Team?</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete "{registration.team_name}"? This will remove all team members
                                and invalidate all invite links. This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDeleteTeam(registration.id, registration.team_name || 'the team')}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              >
                                Delete Team
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
