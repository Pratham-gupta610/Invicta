import { Link } from 'react-router-dom';
import { Bookmark } from 'lucide-react';
import type { Sport } from '@/types/types';

interface SportCardProps {
  sport: Sport;
  icon: React.ReactNode;
}

export function SportCard({ sport, icon }: SportCardProps) {
  const renderGenderIcon = () => {
    const genderCategory = sport.gender_category || 'both';
    
    if (genderCategory === 'both') {
      return (
        <div className="flex items-center gap-1">
          {/* Male symbol */}
          <div className="w-5 h-5 xl:w-6 xl:h-6 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs xl:text-sm font-bold">
            ♂
          </div>
          {/* Female symbol */}
          <div className="w-5 h-5 xl:w-6 xl:h-6 rounded-full bg-pink-500 flex items-center justify-center text-white text-xs xl:text-sm font-bold">
            ♀
          </div>
        </div>
      );
    }
    
    if (genderCategory === 'boys') {
      return (
        <div className="w-6 h-6 xl:w-7 xl:h-7 rounded-full bg-blue-500 flex items-center justify-center text-white text-sm xl:text-base font-bold">
          ♂
        </div>
      );
    }
    
    if (genderCategory === 'girls') {
      return (
        <div className="w-6 h-6 xl:w-7 xl:h-7 rounded-full bg-pink-500 flex items-center justify-center text-white text-sm xl:text-base font-bold">
          ♀
        </div>
      );
    }
    
    return null;
  };

  return (
    <Link to={`/sports/${sport.slug}`} className="block">
      <div className="sport-card h-full gpu-accelerated relative">
        {/* Pre-event bookmark indicator */}
        {sport.is_pre_event && (
          <div className="absolute top-0 right-0 z-10">
            <Bookmark 
              className="w-8 h-8 xl:w-10 xl:h-10 text-yellow-500 fill-yellow-500 drop-shadow-lg" 
              strokeWidth={1.5}
            />
          </div>
        )}
        
        {/* Gender indicator - bottom right */}
        <div className="absolute bottom-2 right-2 xl:bottom-3 xl:right-3 z-10">
          {renderGenderIcon()}
        </div>
        
        {/* Mobile: 160px height, Desktop: 240px min-height */}
        <div className="flex flex-col items-center justify-center text-center h-full min-h-[160px] xl:min-h-[240px]">
          {/* Icon - Mobile: 40px, Desktop: 64px with rotation on hover */}
          <div className="mb-4 xl:mb-6 sport-card-icon transition-all duration-300" style={{ color: '#ffffff' }}>
            {icon}
          </div>
          
          {/* Sport name - Mobile: 20px, Desktop: 24px */}
          <h3 className="text-card-title text-foreground mb-2 xl:mb-3">
            {sport.name}
          </h3>
          
          {/* Subtitle - Mobile: 14px, Desktop: 14px */}
          <p className="text-sm text-muted-foreground leading-relaxed hidden xl:block">
            {sport.description ? sport.description.substring(0, 60) + '...' : 'Click to view events'}
          </p>
        </div>
      </div>
    </Link>
  );
}
