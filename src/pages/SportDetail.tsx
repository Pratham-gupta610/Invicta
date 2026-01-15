const [rules, setRules] = useState<string | null>(null);
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getSportBySlug, getEvents, checkUserRegistration } from '@/db/api';
import type { Sport, Event } from '@/types/types';
import { Button } from '@/components/ui/button';
import { Trophy, CheckCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export default function SportDetail() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [sport, setSport] = useState<Sport | null>(null);
  const [activeEvent, setActiveEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [alreadyRegistered, setAlreadyRegistered] = useState(false);
  const [checkingRegistration, setCheckingRegistration] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      if (!slug) return;
      
      try {
        const sportData = await getSportBySlug(slug);
        setSport(sportData);
        
        if (sportData) {
          // Get the first upcoming event for this sport
          const eventsData = await getEvents({ sport_id: sportData.id });
          if (eventsData && eventsData.length > 0) {
            setActiveEvent(eventsData[0]);
            
            // Check if user has already registered for this event
            if (user) {
              setCheckingRegistration(true);
              const isRegistered = await checkUserRegistration(user.id, eventsData[0].id);
              setAlreadyRegistered(isRegistered);
              setCheckingRegistration(false);
            }
          }
        }
      } catch (error) {
        console.error('Failed to load data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [slug, user]);

  const handleRegisterClick = () => {
    if (!user) {
      toast({
        title: 'Login Required',
        description: 'Please log in to register for events',
        variant: 'destructive',
      });
      navigate('/login');
      return;
    }

    if (!activeEvent) {
      toast({
        title: 'No Active Event',
        description: 'There are no active events for this sport at the moment',
        variant: 'destructive',
      });
      return;
    }

    // Navigate to registration page with sport slug for better UX
    navigate(`/register/${activeEvent.id}?sport=${slug}`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!sport) {
    return (
      <div className="container py-20 text-center">
        <h1 className="text-2xl font-bold">Sport not found</h1>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <section className="py-8 xl:py-12 relative pt-20 xl:pt-8">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none"></div>
        <div className="container relative z-10">
          {/* Large Sport Section */}
          <div className="max-w-4xl mx-auto text-center space-y-8">
            {/* Sport Icon */}
            <div className="flex justify-center">
              <div className="w-32 h-32 rounded-full bg-primary/10 flex items-center justify-center neon-border">
                <Trophy className="w-16 h-16 text-primary" />
              </div>
            </div>

            {/* Sport Name */}
            <h1 className="text-5xl xl:text-6xl font-bold dynamic-header">{sport.name}</h1>
            
            {/* Rules & Regulations */}
            <div className="bg-card/50 backdrop-blur-sm p-8 rounded-lg border border-border/50 neon-border text-left">
              <h2 className="text-2xl font-bold mb-4 text-secondary">Rules & Guidelines</h2>
              <p className="text-card-foreground text-lg leading-relaxed whitespace-pre-line">{sport.rules}</p>
            </div>

            {/* Large Register Button */}
            <div className="pt-8">
              {alreadyRegistered ? (
                <div className="space-y-4">
                  <Button
                    size="lg"
                    disabled
                    className="text-xl px-12 py-8 h-auto font-bold bg-muted text-muted-foreground shadow-lg cursor-not-allowed"
                  >
                    <CheckCircle className="w-6 h-6 mr-3" />
                    ALREADY REGISTERED
                  </Button>
                  <p className="text-sm text-green-600 dark:text-green-400 font-medium">
                    ✓ You have successfully registered for this event
                  </p>
                </div>
              ) : (
                <Button
                  size="lg"
                  onClick={handleRegisterClick}
                  disabled={!activeEvent || checkingRegistration}
                  className="text-xl px-12 py-8 h-auto font-bold bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-300 neon-border disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Trophy className="w-6 h-6 mr-3" />
                  {checkingRegistration ? 'CHECKING...' : 'REGISTER HERE'}
                </Button>
              )}
              
              {!activeEvent && !alreadyRegistered && (
                <p className="text-sm text-muted-foreground mt-4">
                  No active events available for this sport at the moment
                </p>
              )}
              
              {activeEvent && !alreadyRegistered && (
                <p className="text-sm text-muted-foreground mt-4">
                  {activeEvent.registration_type === 'team' ? 'Team' : 'Individual'} registration • Open for all participants
                </p>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
