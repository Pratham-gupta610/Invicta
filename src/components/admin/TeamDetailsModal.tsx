import { useEffect, useState } from 'react';
import { getAdminTeamDetails } from '@/db/api';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Loader2, Users, Trophy } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface TeamDetailsModalProps {
  teamId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface TeamDetails {
  team_name: string;
  sport_name: string;
  event_name: string;
  registration_type: string;
  leader_username: string;
  members: { username: string }[];
}

export default function TeamDetailsModal({ teamId, open, onOpenChange }: TeamDetailsModalProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [teamDetails, setTeamDetails] = useState<TeamDetails | null>(null);

  useEffect(() => {
    if (open && teamId) {
      loadTeamDetails();
    } else {
      setTeamDetails(null);
    }
  }, [open, teamId]);

  const loadTeamDetails = async () => {
    if (!teamId) return;

    setLoading(true);
    try {
      const data = await getAdminTeamDetails(teamId);
      setTeamDetails(data);
    } catch (error: any) {
      console.error('Failed to load team details:', error);
      toast({
        title: 'Error',
        description: 'Failed to load team details',
        variant: 'destructive',
      });
      onOpenChange(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Team Details
          </DialogTitle>
          <DialogDescription>
            View team information and members (Admin view)
          </DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : teamDetails ? (
          <div className="space-y-6">
            {/* Team Info */}
            <div className="space-y-3">
              <div>
                <p className="text-sm text-muted-foreground">Team Name</p>
                <p className="text-lg font-semibold">{teamDetails.team_name}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Sport</p>
                  <p className="font-medium">{teamDetails.sport_name}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Event</p>
                  <p className="font-medium">{teamDetails.event_name}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Registration Type</p>
                  <Badge variant="outline" className="mt-1">
                    {teamDetails.registration_type}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Team Leader</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Trophy className="h-4 w-4 text-yellow-500" />
                    <p className="font-medium">{teamDetails.leader_username}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Team Members */}
            <div>
              <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                <Users className="h-4 w-4" />
                Team Members ({teamDetails.members.length})
              </h3>

              {teamDetails.members.length === 0 ? (
                <p className="text-sm text-muted-foreground py-4 text-center bg-muted/30 rounded-lg">
                  No additional members
                </p>
              ) : (
                <div className="space-y-2">
                  {teamDetails.members.map((member, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-muted/30 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                          <span className="text-sm font-medium text-primary">
                            {member.username.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <p className="font-medium">{member.username}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Privacy Notice */}
            <div className="text-xs text-muted-foreground bg-muted/30 p-3 rounded-lg">
              ℹ️ Admin View: Only usernames are displayed for privacy. Email addresses and phone numbers are not shown.
            </div>
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
