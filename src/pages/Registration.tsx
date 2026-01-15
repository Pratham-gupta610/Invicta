import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { getEventById, createRegistration, checkExistingRegistration } from '@/db/api';
import type { Event, RegistrationFormData } from '@/types/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from '@/hooks/use-toast';
import { Users, User, Plus, Trash2, Phone, Info } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function Registration() {
  const { eventId } = useParams<{ eventId: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [registrationType, setRegistrationType] = useState<'individual' | 'team'>('individual');
  const [teamName, setTeamName] = useState('');
  const [leaderMobileNumber, setLeaderMobileNumber] = useState('');
  const [teamMembers, setTeamMembers] = useState<Array<{ member_name: string; member_email: string }>>([]);

  useEffect(() => {
    const loadEvent = async () => {
      if (!eventId) return;
      
      try {
        const eventData = await getEventById(eventId);
        setEvent(eventData);
        
        if (eventData) {
          setRegistrationType(eventData.registration_type);
          
          // Check if user already registered
          if (user) {
            const alreadyRegistered = await checkExistingRegistration(user.id, eventId);
            if (alreadyRegistered) {
              toast({
                title: 'Already Registered',
                description: 'You have already registered for this event',
                variant: 'destructive',
              });
              navigate('/dashboard');
              return;
            }
          }
        }
      } catch (error) {
        console.error('Failed to load event:', error);
        toast({
          title: 'Error',
          description: 'Failed to load event details',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    loadEvent();
  }, [eventId, user, navigate, toast]);

  const addTeamMember = () => {
    // Check if adding another member would exceed team size
    if (event?.team_size) {
      const currentTotal = teamMembers.length + 1; // +1 for captain
      if (currentTotal >= event.team_size) {
        toast({
          title: 'Team Full',
          description: `Maximum ${event.team_size} members allowed (including captain)`,
          variant: 'destructive',
        });
        return;
      }
    }
    
    setTeamMembers([
      ...teamMembers,
      { member_name: '', member_email: '' },
    ]);
  };

  const removeTeamMember = (index: number) => {
    setTeamMembers(teamMembers.filter((_, i) => i !== index));
  };

  const updateTeamMember = (index: number, field: string, value: string) => {
    const updated = [...teamMembers];
    updated[index] = { ...updated[index], [field]: value };
    setTeamMembers(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user || !eventId || !event) {
      toast({
        title: 'Error',
        description: 'Please log in to register',
        variant: 'destructive',
      });
      navigate('/login');
      return;
    }

    // Team name is now required for ALL registration types
    if (!teamName || teamName.trim().length < 3) {
      toast({
        title: 'Missing Information',
        description: 'Please enter a team name (minimum 3 characters)',
        variant: 'destructive',
      });
      return;
    }

    // Validate leader mobile number for team registrations
    if (registrationType === 'team') {
      if (!leaderMobileNumber || leaderMobileNumber.trim() === '') {
        toast({
          title: 'Missing Information',
          description: 'Please enter your mobile number',
          variant: 'destructive',
        });
        return;
      }

      // Validate mobile number format (10 digits)
      const mobileRegex = /^[6-9]\d{9}$/;
      if (!mobileRegex.test(leaderMobileNumber)) {
        toast({
          title: 'Invalid Mobile Number',
          description: 'Please enter a valid 10-digit mobile number',
          variant: 'destructive',
        });
        return;
      }

      // Validate team size if members are added
      const validMembers = teamMembers.filter(m => m.member_name.trim() !== '');
      if (validMembers.length > 0) {
        const totalTeamSize = validMembers.length + 1; // +1 for captain
        if (event.team_size && totalTeamSize > event.team_size) {
          toast({
            title: 'Team Size Exceeded',
            description: `Maximum ${event.team_size} members allowed (including captain). You have ${totalTeamSize} members.`,
            variant: 'destructive',
          });
          return;
        }
      }
    }

    setSubmitting(true);

    try {
      const formData: RegistrationFormData = {
        event_id: eventId,
        registration_type: registrationType,
        team_name: teamName, // Always include team_name
      };

      if (registrationType === 'team') {
        formData.leader_mobile_number = leaderMobileNumber;
        const validMembers = teamMembers.filter(m => m.member_name.trim() !== '');
        if (validMembers.length > 0) {
          formData.team_members = validMembers;
        }
      }

      await createRegistration(formData, user.id);

      toast({
        title: 'Success',
        description: 'Registration completed successfully',
      });

      navigate('/dashboard');
    } catch (error) {
      console.error('Registration failed:', error);
      toast({
        title: 'Registration Failed',
        description: 'Failed to complete registration. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="container py-20 text-center">
        <h1 className="text-2xl font-bold">Event not found</h1>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 xl:pt-24 xl:pb-12">
      <div className="container max-w-4xl">
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-2xl">{event.title}</CardTitle>
            <CardDescription>{event.sport?.name}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-4 text-sm">
              <div className="flex items-center gap-2">
                {event.registration_type === 'team' ? (
                  <Users className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <User className="h-4 w-4 text-muted-foreground" />
                )}
                <span>
                  {event.registration_type === 'team' 
                    ? `Team Event${event.team_size ? ` (${event.team_size} members max)` : ''}`
                    : 'Individual Event'
                  } • Open for all
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Registration Form</CardTitle>
            <CardDescription>Complete the form to register for this event</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Team Name Field - Now required for ALL registration types */}
              <div className="space-y-2">
                <Label htmlFor="teamName">
                  Team Name * 
                  <span className="text-xs text-muted-foreground ml-2">
                    {registrationType === 'individual' 
                      ? '(Your individual identifier or group name)' 
                      : '(Your official team name)'}
                  </span>
                </Label>
                <Input
                  id="teamName"
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value)}
                  placeholder={registrationType === 'individual' ? 'e.g., Solo Warrior, Team Phoenix' : 'Enter your team name'}
                  required
                  minLength={3}
                  className={teamName && teamName.length < 3 ? 'border-destructive' : ''}
                />
                {teamName && teamName.length < 3 && (
                  <p className="text-xs text-destructive">Team name must be at least 3 characters</p>
                )}
              </div>

              {event.registration_type === 'team' && (
                <>
                  {/* Team Leader Identification Alert */}
                  <Alert className="bg-primary/5 border-primary/20">
                    <Info className="h-4 w-4 text-primary" />
                    <AlertDescription className="text-sm">
                      <strong>You are the Team Leader by default when creating a team.</strong> Your name and contact number will be recorded as the team leader.
                    </AlertDescription>
                  </Alert>

                  {/* Your Mobile Number Field */}
                  <div className="space-y-2">
                    <Label htmlFor="leaderMobile">
                      Your Mobile Number *
                      <span className="text-xs text-muted-foreground ml-2">
                        (Your contact number as Team Leader)
                      </span>
                    </Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="leaderMobile"
                        type="tel"
                        value={leaderMobileNumber}
                        onChange={(e) => setLeaderMobileNumber(e.target.value.replace(/\D/g, '').slice(0, 10))}
                        placeholder="Enter 10-digit mobile number"
                        required
                        maxLength={10}
                        className={`pl-10 ${leaderMobileNumber && leaderMobileNumber.length !== 10 ? 'border-destructive' : ''}`}
                      />
                    </div>
                    {leaderMobileNumber && leaderMobileNumber.length !== 10 && (
                      <p className="text-xs text-destructive">Mobile number must be exactly 10 digits</p>
                    )}
                  </div>

                  {/* Informative Alert about Team Invite Link */}
                  <Alert className="bg-secondary/10 border-secondary/20">
                    <Info className="h-4 w-4 text-secondary" />
                    <AlertDescription className="text-sm">
                      <strong>Quick Registration:</strong> After clicking "Complete Registration", you can share a team invite link with teammates. 
                      Adding team members manually below is optional, not required.
                    </AlertDescription>
                  </Alert>

                  {/* Add Member Section - Centered and Prominent */}
                  <div className="space-y-4">
                    {teamMembers.length === 0 ? (
                      <div className="flex flex-col items-center justify-center py-8 px-4 border-2 border-dashed border-muted-foreground/20 rounded-lg bg-muted/30">
                        <Users className="h-12 w-12 text-muted-foreground/40 mb-4" />
                        <p className="text-sm text-muted-foreground text-center mb-2">
                          <strong>Optional:</strong> Add team members now
                        </p>
                        <p className="text-xs text-muted-foreground text-center mb-4 max-w-md">
                          You can add team members manually or share the team invite link after registration
                        </p>
                        <Button 
                          type="button" 
                          variant="default" 
                          size="lg"
                          onClick={addTeamMember}
                          className="shadow-md hover:shadow-lg transition-shadow"
                        >
                          <Plus className="h-5 w-5 mr-2" />
                          Add Team Member
                        </Button>
                      </div>
                    ) : (
                      <>
                        <div className="flex items-center justify-between">
                          <Label className="text-base font-semibold">
                            Team Members
                            {event.team_size && (
                              <span className="text-xs text-muted-foreground ml-2 font-normal">
                                ({teamMembers.length} of {event.team_size - 1} max members added)
                              </span>
                            )}
                          </Label>
                          <Button 
                            type="button" 
                            variant="outline" 
                            size="sm" 
                            onClick={addTeamMember}
                          >
                            <Plus className="h-4 w-4 mr-2" />
                            Add Another
                          </Button>
                        </div>

                        {teamMembers.map((member, index) => (
                          <Card key={index} className="border-l-4 border-l-primary/30">
                            <CardContent className="pt-6">
                              <div className="flex items-start justify-between mb-4">
                                <h4 className="font-medium">Member {index + 1}</h4>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => removeTeamMember(index)}
                                  className="text-destructive hover:text-destructive hover:bg-destructive/10"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>

                              <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                  <Label>Name</Label>
                                  <Input
                                    value={member.member_name}
                                    onChange={(e) => updateTeamMember(index, 'member_name', e.target.value)}
                                    placeholder="Member name"
                                  />
                                </div>

                                <div className="space-y-2">
                                  <Label>Email</Label>
                                  <Input
                                    type="email"
                                    value={member.member_email}
                                    onChange={(e) => updateTeamMember(index, 'member_email', e.target.value)}
                                    placeholder="Member email (optional)"
                                  />
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </>
                    )}
                  </div>
                </>
              )}

              {event.registration_type === 'individual' && (
                <div className="bg-muted p-4 rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    You are registering as an individual participant for this event.
                  </p>
                </div>
              )}

              <div className="flex gap-4">
                <Button type="button" variant="outline" onClick={() => navigate(-1)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={submitting || event.available_slots === 0}>
                  {submitting ? 'Registering...' : 'Complete Registration'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
