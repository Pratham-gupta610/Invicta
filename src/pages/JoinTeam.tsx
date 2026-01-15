import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { joinTeamViaInvite, getTeamDetails } from '@/db/api';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Users, ArrowLeft, CheckCircle, AlertCircle } from 'lucide-react';

export default function JoinTeam() {
  const { inviteCode } = useParams<{ inviteCode: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [loading, setLoading] = useState(false);
  const [teamInfo, setTeamInfo] = useState<any>(null);
  const [loadingTeamInfo, setLoadingTeamInfo] = useState(true);
  const [memberName, setMemberName] = useState('');
  const [memberEmail, setMemberEmail] = useState('');
  const [joined, setJoined] = useState(false);

  useEffect(() => {
    if (!user) {
      toast({
        title: 'Login Required',
        description: 'Please log in to join a team',
        variant: 'destructive',
      });
      navigate('/login');
      return;
    }

    // Pre-fill with user's profile data if available
    if (user.email) {
      setMemberEmail(user.email);
    }
    if (user.user_metadata?.full_name) {
      setMemberName(user.user_metadata.full_name);
    }

    setLoadingTeamInfo(false);
  }, [user, navigate, toast]);

  const handleJoinTeam = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user || !inviteCode) return;

    if (!memberName.trim()) {
      toast({
        title: 'Missing Information',
        description: 'Please enter your name',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);

    try {
      const result = await joinTeamViaInvite(inviteCode, user.id, {
        member_name: memberName,
        member_email: memberEmail || '',
      });

      console.log('Join team result:', result);

      if (result.success) {
        setJoined(true);
        toast({
          title: 'Success!',
          description: `You have joined ${result.data?.team_name || 'the team'}`,
        });
        
        // Redirect to dashboard after 2 seconds
        setTimeout(() => {
          navigate('/dashboard');
        }, 2000);
      } else {
        // Display the exact error message from backend
        const errorMessage = result.error || 'Failed to join team';
        const errorCode = (result as any).error_code;
        
        console.error('Join team failed:', { errorCode, errorMessage });
        
        toast({
          title: 'Failed to Join Team',
          description: errorMessage,
          variant: 'destructive',
        });
      }
    } catch (error: any) {
      console.error('Failed to join team (exception):', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to join team. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  if (loadingTeamInfo) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (joined) {
    return (
      <div className="min-h-screen py-12 xl:pt-24 xl:pb-12">
        <div className="container max-w-2xl">
          <Card className="text-center">
            <CardContent className="pt-12 pb-12">
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">Successfully Joined!</h2>
              <p className="text-muted-foreground mb-4">
                You are now part of the team. Redirecting to dashboard...
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 xl:pt-24 xl:pb-12">
      <div className="container max-w-2xl">
        <div className="mb-8">
          <Button
            variant="outline"
            size="default"
            onClick={() => navigate('/')}
            className="bg-card/80 backdrop-blur-sm border-primary/30 text-primary hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all duration-200"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Button>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <div>
                <CardTitle className="text-2xl">Join Team</CardTitle>
                <CardDescription>Enter your details to join the team</CardDescription>
              </div>
            </div>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleJoinTeam} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  value={memberName}
                  onChange={(e) => setMemberName(e.target.value)}
                  placeholder="Enter your full name"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={memberEmail}
                  onChange={(e) => setMemberEmail(e.target.value)}
                  placeholder="your.email@example.com"
                />
              </div>

              <div className="bg-muted p-4 rounded-md">
                <div className="flex items-start gap-2">
                  <AlertCircle className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div className="text-sm text-muted-foreground">
                    <p className="font-medium mb-1">Important:</p>
                    <ul className="list-disc list-inside space-y-1">
                      <li>Make sure you haven't already registered for this event</li>
                      <li>You can only join if the team hasn't reached its maximum size</li>
                      <li>Once you join, you'll be part of this team for the event</li>
                    </ul>
                  </div>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={loading}
              >
                {loading ? 'Joining Team...' : 'Join Team'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
