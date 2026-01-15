import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { SportCard } from '@/components/sports/SportCard';
import { getSports } from '@/db/api';
import { useAuth } from '@/contexts/AuthContext';
import type { Sport } from '@/types/types';
import { Trophy, Users, Calendar, Bookmark } from 'lucide-react';
import MerchandiseSection from '@/components/merchandise/MerchandiseSection';
import PageMeta from '@/components/common/PageMeta';
import {
  CricketIcon,
  FootballIcon,
  TableTennisIcon,
  BadmintonIcon,
  VolleyballIcon,
  ChessIcon,
  SevenStonesIcon,
  TugOfWarIcon,
  PushUpsIcon,
  GullyCricketIcon,
  HundredMeterRaceIcon,
  RelayIcon,
  ShotPutIcon,
  CarromIcon,
  DodgeballIcon,
  KabaddiIcon,
} from '@/components/icons/SportIcons';

const sportIcons: Record<string, React.ReactNode> = {
  cricket: <CricketIcon />,
  football: <FootballIcon />,
  'table-tennis': <TableTennisIcon />,
  badminton: <BadmintonIcon />,
  volleyball: <VolleyballIcon />,
  chess: <ChessIcon />,
  '7-stones': <SevenStonesIcon />,
  'tug-of-war': <TugOfWarIcon />,
  'push-ups': <PushUpsIcon />,
  'gully-cricket': <GullyCricketIcon />,
  '100m-race': <HundredMeterRaceIcon />,
  relay: <RelayIcon />,
  'shot-put': <ShotPutIcon />,
  dodgeball: <DodgeballIcon />,
  kabaddi: <KabaddiIcon />,
  carrom: <CarromIcon />,
};

export default function Home() {
  const [sports, setSports] = useState<Sport[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();
  const sportsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadSports = async () => {
      try {
        const data = await getSports();
        // Sort sports: pre-events first, then others
        const sortedSports = data.sort((a, b) => {
          if (a.is_pre_event && !b.is_pre_event) return -1;
          if (!a.is_pre_event && b.is_pre_event) return 1;
          return 0;
        });
        setSports(sortedSports);
      } catch (error) {
        console.error('Failed to load sports:', error);
      } finally {
        setLoading(false);
      }
    };

    loadSports();
  }, []);

  // Intersection Observer for scroll animations
  useEffect(() => {
    if (!sportsRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.1 }
    );

    const cards = sportsRef.current.querySelectorAll('.animate-on-scroll');
    cards.forEach((card) => observer.observe(card));

    return () => observer.disconnect();
  }, [sports]);

  const scrollToSports = () => {
    const sportsSection = document.getElementById('sports-section');
    sportsSection?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <PageMeta
        title="Home"
        description="IIIT Guwahati Sports Carnival - Register for multiple sports events including Cricket, Football, Basketball, and more. Shop official merchandise including jerseys and hoodies."
        keywords="IIIT Guwahati, Sports Carnival, Sports Events, College Sports, IIITG Sports Board, Sports Registration, Sports Merchandise, IIITG Jersey, IIITG Hoodie, Sports Apparel"
      />
      {/* Hero Section - Mobile-First: 80px top, 24px horizontal padding */}
      <section className="relative overflow-hidden pt-20 pb-12 px-6 xl:pt-32 xl:pb-20" aria-label="Hero section">
        <div className="container relative z-10 max-w-7xl mx-auto">
          <div className="flex flex-col items-center text-center">
            {/* Badge with trophy icon - pulse animation */}
            <div className="inline-flex items-center justify-center mb-6 xl:mb-8">
              <span className="invicta-badge animate-badge" role="status" aria-label="2026 Edition">
                <Trophy className="h-4 w-4" aria-hidden="true" />
                2026 Edition
              </span>
            </div>
            
            {/* INVICTA Main Title - Mobile: 48px, Desktop: 72px with cascade animation */}
            <h1 className="mb-3 xl:mb-4 w-full flex justify-center">
              <span className="invicta-title animate-title-1">INVICTA</span>
            </h1>
            
            {/* Subtitle Line 1 - The Annual Sports Meet */}
            <p className="invicta-subtitle-1 mb-2 xl:mb-3 animate-title-2">
              The Annual Sports Meet
            </p>
            
            {/* Subtitle Line 2 - IIIT GUWAHATI */}
            <p className="invicta-subtitle-2 mb-8 xl:mb-10 animate-title-2">
              IIIT GUWAHATI
            </p>
            
            {/* Description - Mobile: 16px, Desktop: 18px */}
            <p className="text-body text-muted-foreground mb-8 xl:mb-12 max-w-[340px] xl:max-w-2xl mx-auto animate-title-3">
              Join the ultimate sports experience. Choose from multiple sports, register individually or as a team, and compete for glory.
            </p>
            
            {/* Stats Section - Mobile: Vertical stack, Desktop: Horizontal row */}
            <div className="flex flex-col xl:flex-row gap-4 xl:gap-6 max-w-md xl:max-w-3xl mx-auto mb-8 xl:mb-12 mt-12 xl:mt-20" role="region" aria-label="Event statistics">
              {/* Stat 1 - Trophy: Mobile 80px height, horizontal layout */}
              <div className="stat-card flex-1 animate-stat-1">
                <div className="flex xl:flex-col items-center xl:justify-center gap-4 xl:gap-0">
                  <Trophy className="h-8 w-8 xl:h-10 xl:w-10 icon-orange-glow icon-bounce xl:mb-3 shrink-0" aria-hidden="true" />
                  <div className="flex items-baseline gap-2 xl:flex-col xl:gap-0">
                    <div className="text-3xl xl:text-4xl font-bold text-foreground" aria-label={`${sports.length} sports available`}>{sports.length}+</div>
                    <div className="text-sm text-muted-foreground">Sports</div>
                  </div>
                </div>
              </div>
              
              {/* Stat 2 - Users */}
              <div className="stat-card flex-1 animate-stat-2">
                <div className="flex xl:flex-col items-center xl:justify-center gap-4 xl:gap-0">
                  <Users className="h-8 w-8 xl:h-10 xl:w-10 icon-orange-glow icon-bounce xl:mb-3 shrink-0" aria-hidden="true" />
                  <div className="flex items-baseline gap-2 xl:flex-col xl:gap-0">
                    <div className="text-3xl xl:text-4xl font-bold text-foreground" aria-label="Over 500 participants">500+</div>
                    <div className="text-sm text-muted-foreground">Participants</div>
                  </div>
                </div>
              </div>
              
              {/* Stat 3 - Calendar */}
              <div className="stat-card flex-1 animate-stat-3">
                <div className="flex xl:flex-col items-center xl:justify-center gap-4 xl:gap-0">
                  <Calendar className="h-8 w-8 xl:h-10 xl:w-10 icon-orange-glow icon-bounce xl:mb-3 shrink-0" aria-hidden="true" />
                  <div className="flex items-baseline gap-2 xl:flex-col xl:gap-0">
                    <div className="text-3xl xl:text-4xl font-bold text-foreground" aria-label="Over 30 events">30+</div>
                    <div className="text-sm text-muted-foreground">Events</div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* CTA Buttons - Mobile: Full width stacked, Desktop: Horizontal */}
            <div className="flex flex-col xl:flex-row gap-4 items-stretch xl:items-center justify-center max-w-md xl:max-w-none mx-auto animate-stat-3">
              <button 
                onClick={scrollToSports}
                className="btn-primary w-full xl:w-auto"
                aria-label="Browse available sports"
              >
                Browse Sports
              </button>
              
              {user && (
                <button 
                  onClick={() => navigate('/dashboard')}
                  className="btn-secondary w-full xl:w-auto"
                  aria-label="View my registered events"
                >
                  My Events
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Merchandise Section */}
      <MerchandiseSection />

      {/* Sports Grid Section - Mobile-First */}
      <section id="sports-section" className="py-12 xl:py-20 px-6" ref={sportsRef} aria-label="Available sports">
        <div className="container max-w-7xl mx-auto">
          {/* Section Header - Mobile: 32px, Desktop: 42px */}
          <div className="text-center mb-12 xl:mb-16">
            <h2 className="text-heading-lg text-foreground mb-3 xl:mb-4">
              Choose Your Sport
            </h2>
            <p className="text-body text-muted-foreground max-w-[340px] xl:max-w-2xl mx-auto">
              Select from our wide range of sports and start your registration journey
            </p>
          </div>

          {/* Points Distribution Section */}
          <div className="mb-6 xl:mb-8 bg-gradient-to-br from-primary/5 to-secondary/5 border border-border rounded-lg p-4 xl:p-6 max-w-4xl mx-auto">
            <h3 className="text-lg xl:text-xl font-bold text-foreground mb-4 xl:mb-5 text-center">Points Distribution</h3>
            
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 xl:gap-6">
              {/* Boys Only Games */}
              <div className="bg-background/80 rounded-lg p-4 border border-border">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs font-bold shrink-0">
                    ♂
                  </div>
                  <h4 className="text-sm xl:text-base font-semibold text-foreground">Boys Only Games</h4>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs xl:text-sm text-muted-foreground">Winner</span>
                    <span className="text-sm xl:text-base font-bold text-primary">20 pts</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs xl:text-sm text-muted-foreground">Runner-up</span>
                    <span className="text-sm xl:text-base font-bold text-secondary">14 pts</span>
                  </div>
                </div>
              </div>

              {/* Boys & Girls Events */}
              <div className="bg-background/80 rounded-lg p-4 border border-border">
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex -space-x-1">
                    <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs font-bold shrink-0 border-2 border-background">
                      ♂
                    </div>
                    <div className="w-5 h-5 rounded-full bg-pink-500 flex items-center justify-center text-white text-xs font-bold shrink-0 border-2 border-background">
                      ♀
                    </div>
                  </div>
                  <h4 className="text-sm xl:text-base font-semibold text-foreground">Boys & Girls Events</h4>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs xl:text-sm text-muted-foreground">Winner</span>
                    <span className="text-sm xl:text-base font-bold text-primary">10 pts</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs xl:text-sm text-muted-foreground">Runner-up</span>
                    <span className="text-sm xl:text-base font-bold text-secondary">7 pts</span>
                  </div>
                </div>
              </div>

              {/* Special Events */}
              <div className="bg-background/80 rounded-lg p-4 border border-border">
                <div className="flex items-center gap-2 mb-3">
                  <Trophy className="w-5 h-5 text-primary shrink-0" />
                  <h4 className="text-sm xl:text-base font-semibold text-foreground">100m, Shot Put, Relay</h4>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs xl:text-sm text-muted-foreground">1st Place</span>
                    <span className="text-sm xl:text-base font-bold text-primary">14 pts</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs xl:text-sm text-muted-foreground">2nd Place</span>
                    <span className="text-sm xl:text-base font-bold text-secondary">10 pts</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs xl:text-sm text-muted-foreground">3rd Place</span>
                    <span className="text-sm xl:text-base font-bold text-foreground">7 pts</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Gender Category Legend */}
          <div className="mb-6 xl:mb-8 flex flex-wrap items-center justify-center gap-4 xl:gap-6 bg-muted/50 border border-border rounded-lg p-4 max-w-2xl mx-auto">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 xl:w-7 xl:h-7 rounded-full bg-blue-500 flex items-center justify-center text-white text-sm xl:text-base font-bold shrink-0">
                ♂
              </div>
              <span className="text-sm xl:text-base text-foreground font-medium">Boys</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 xl:w-7 xl:h-7 rounded-full bg-pink-500 flex items-center justify-center text-white text-sm xl:text-base font-bold shrink-0">
                ♀
              </div>
              <span className="text-sm xl:text-base text-foreground font-medium">Girls</span>
            </div>
          </div>

          {/* Pre-Event Legend */}
          {sports.some(sport => sport.is_pre_event) && (
            <div className="mb-8 xl:mb-10 flex items-center justify-center gap-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 max-w-2xl mx-auto">
              <Bookmark className="w-5 h-5 xl:w-6 xl:h-6 text-yellow-500 fill-yellow-500 shrink-0" />
              <p className="text-sm xl:text-base text-foreground font-medium">
                <span className="text-yellow-600 dark:text-yellow-400 font-bold">Pre-events</span> will take place on <span className="font-bold">17 and 18 January 2026</span>
              </p>
            </div>
          )}

          {/* Sports Grid - Mobile: 2x2 grid, Desktop: 4 columns */}
          <div className="grid grid-cols-2 xl:grid-cols-4 gap-3 xl:gap-6" role="list" aria-label="Sports list">
            {sports.map((sport, index) => (
              <div 
                key={sport.id} 
                className="animate-on-scroll"
                style={{ transitionDelay: `${index * 0.1}s` }}
                role="listitem"
              >
                <SportCard
                  sport={sport}
                  icon={sportIcons[sport.slug] || <Trophy className="h-10 w-10 xl:h-16 xl:w-16 text-primary" />}
                />
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
