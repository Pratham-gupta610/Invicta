interface SportIconProps {
  className?: string;
}

export function CricketIcon({ className = "h-16 w-16 xl:h-24 xl:w-24" }: SportIconProps) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Batsman figure - solid silhouette */}
      <circle cx="22" cy="12" r="4.5" />
      {/* Body */}
      <path d="M 22 16 L 22 24 L 18 30 L 16 36" strokeWidth="4.5" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M 22 24 L 26 30 L 28 36" strokeWidth="4.5" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      {/* Bat raised */}
      <path d="M 22 18 L 32 8" strokeWidth="4.5" stroke="currentColor" fill="none" strokeLinecap="round" />
      <circle cx="32" cy="8" r="2.5" />
      
      {/* Stumps - three vertical lines */}
      <rect x="42" y="26" width="3.5" height="22" rx="1" />
      <rect x="48" y="26" width="3.5" height="22" rx="1" />
      <rect x="54" y="26" width="3.5" height="22" rx="1" />
    </svg>
  );
}

export function FootballIcon({ className = "h-16 w-16 xl:h-24 xl:w-24" }: SportIconProps) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Soccer Ball */}
      <circle cx="32" cy="32" r="24" fill="none" stroke="currentColor" strokeWidth="3" />
      {/* Pentagon in center */}
      <path d="M 32 20 L 38 25 L 35 33 L 29 33 L 26 25 Z" />
      {/* Hexagon patterns */}
      <path d="M 26 25 L 20 27 L 18 33" stroke="currentColor" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M 38 25 L 44 27 L 46 33" stroke="currentColor" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M 29 33 L 24 40 L 22 46" stroke="currentColor" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M 35 33 L 40 40 L 42 46" stroke="currentColor" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function BasketballIcon({ className = "h-16 w-16 xl:h-24 xl:w-24" }: SportIconProps) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Basketball */}
      <circle cx="32" cy="32" r="24" fill="none" stroke="currentColor" strokeWidth="3" />
      {/* Vertical line */}
      <line x1="32" y1="8" x2="32" y2="56" stroke="currentColor" strokeWidth="3" />
      {/* Horizontal line */}
      <line x1="8" y1="32" x2="56" y2="32" stroke="currentColor" strokeWidth="3" />
      {/* Curved lines */}
      <path d="M 8 32 Q 20 20 32 8" stroke="currentColor" strokeWidth="3" fill="none" />
      <path d="M 32 8 Q 44 20 56 32" stroke="currentColor" strokeWidth="3" fill="none" />
      <path d="M 56 32 Q 44 44 32 56" stroke="currentColor" strokeWidth="3" fill="none" />
      <path d="M 32 56 Q 20 44 8 32" stroke="currentColor" strokeWidth="3" fill="none" />
    </svg>
  );
}

export function TableTennisIcon({ className = "h-16 w-16 xl:h-24 xl:w-24" }: SportIconProps) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Player figure - solid silhouette */}
      <circle cx="20" cy="12" r="4.5" />
      {/* Body */}
      <path d="M 20 16 L 20 24 L 16 30 L 14 36" strokeWidth="4.5" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M 20 24 L 24 30 L 26 36" strokeWidth="4.5" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      {/* Arm with paddle */}
      <path d="M 20 18 L 32 14" strokeWidth="4.5" stroke="currentColor" fill="none" strokeLinecap="round" />
      
      {/* Table */}
      <rect x="36" y="30" width="24" height="3" rx="1" />
      <line x1="48" y1="30" x2="48" y2="24" stroke="currentColor" strokeWidth="2" />
      
      {/* Ball */}
      <circle cx="44" cy="18" r="2.5" />
    </svg>
  );
}

export function BadmintonIcon({ className = "h-16 w-16 xl:h-24 xl:w-24" }: SportIconProps) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Badminton icon - exact match to reference image */}
      
      {/* Shuttlecock - positioned at top left */}
      {/* Shuttlecock cone/feathers */}
      <path 
        d="M 18 16 L 14 10 M 18 16 L 18 9 M 18 16 L 22 10" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round"
      />
      {/* Shuttlecock base (cork) */}
      <circle cx="18" cy="18" r="2.5" fill="currentColor" />
      
      {/* Racket - positioned at bottom right */}
      {/* Racket head (oval frame) */}
      <ellipse 
        cx="38" 
        cy="38" 
        rx="10" 
        ry="13" 
        stroke="currentColor" 
        strokeWidth="2.5" 
        fill="none"
      />
      
      {/* String pattern - crosshatch inside racket head */}
      <line x1="38" y1="27" x2="38" y2="49" stroke="currentColor" strokeWidth="1.2" opacity="0.7" />
      <line x1="30" y1="38" x2="46" y2="38" stroke="currentColor" strokeWidth="1.2" opacity="0.7" />
      <line x1="33" y1="31" x2="43" y2="45" stroke="currentColor" strokeWidth="1.2" opacity="0.7" />
      <line x1="43" y1="31" x2="33" y2="45" stroke="currentColor" strokeWidth="1.2" opacity="0.7" />
      
      {/* Racket handle */}
      <rect 
        x="36" 
        y="49" 
        width="4" 
        height="10" 
        rx="2" 
        fill="currentColor"
      />
    </svg>
  );
}

export function VolleyballIcon({ className = "h-16 w-16 xl:h-24 xl:w-24" }: SportIconProps) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Volleyball */}
      <circle cx="32" cy="32" r="24" fill="none" stroke="currentColor" strokeWidth="3" />
      {/* Curved panel lines */}
      <path d="M 32 8 Q 38 20 40 32 Q 38 44 32 56" stroke="currentColor" strokeWidth="3" fill="none" />
      <path d="M 32 8 Q 26 20 24 32 Q 26 44 32 56" stroke="currentColor" strokeWidth="3" fill="none" />
      <path d="M 10 24 Q 21 28 32 28 Q 43 28 54 24" stroke="currentColor" strokeWidth="3" fill="none" />
      <path d="M 10 40 Q 21 36 32 36 Q 43 36 54 40" stroke="currentColor" strokeWidth="3" fill="none" />
    </svg>
  );
}

export function AthleticsIcon({ className = "h-16 w-16 xl:h-24 xl:w-24" }: SportIconProps) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Running figure - solid silhouette */}
      <circle cx="38" cy="14" r="5" />
      {/* Body leaning forward */}
      <path d="M 38 19 L 32 34" stroke="currentColor" strokeWidth="4.5" strokeLinecap="round" />
      {/* Front arm extended */}
      <path d="M 36 22 L 44 18" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
      {/* Back arm */}
      <path d="M 34 24 L 26 28" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
      {/* Front leg lifted */}
      <path d="M 32 34 L 36 42 L 38 48" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
      {/* Back leg pushing */}
      <path d="M 32 34 L 24 40 L 20 46" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
      {/* Motion lines */}
      <path d="M 14 20 L 20 20" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" opacity="0.6" />
      <path d="M 12 26 L 18 26" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" opacity="0.6" />
      <path d="M 10 32 L 16 32" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" opacity="0.6" />
    </svg>
  );
}

export function ChessIcon({ className = "h-16 w-16 xl:h-24 xl:w-24" }: SportIconProps) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Chess board base */}
      <rect x="10" y="44" width="44" height="10" rx="2" />
      {/* Board squares pattern */}
      <rect x="12" y="34" width="5" height="5" />
      <rect x="22" y="34" width="5" height="5" />
      <rect x="32" y="34" width="5" height="5" />
      <rect x="42" y="34" width="5" height="5" />
      <rect x="52" y="34" width="5" height="5" />
      <rect x="17" y="39" width="5" height="5" />
      <rect x="27" y="39" width="5" height="5" />
      <rect x="37" y="39" width="5" height="5" />
      <rect x="47" y="39" width="5" height="5" />
      
      {/* King piece */}
      <path d="M 20 34 L 22 26 L 26 26 L 28 34 Z" />
      <rect x="21" y="22" width="6" height="4" />
      <circle cx="24" cy="20" r="2.5" />
      <line x1="24" y1="14" x2="24" y2="18" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="21" y1="16" x2="27" y2="16" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      
      {/* Rook piece */}
      <path d="M 36 34 L 38 28 L 42 28 L 44 34 Z" />
      <rect x="37" y="24" width="8" height="4" />
      <rect x="37" y="20" width="2" height="4" />
      <rect x="41" y="20" width="2" height="4" />
    </svg>
  );
}

export function SevenStonesIcon({ className = "h-16 w-16 xl:h-24 xl:w-24" }: SportIconProps) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Player throwing - solid silhouette */}
      <circle cx="18" cy="12" r="4.5" />
      {/* Body */}
      <path d="M 18 16 L 18 24 L 14 30 L 12 36" strokeWidth="4.5" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M 18 24 L 22 30 L 24 36" strokeWidth="4.5" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      {/* Throwing arm */}
      <path d="M 18 18 L 28 14" strokeWidth="4.5" stroke="currentColor" fill="none" strokeLinecap="round" />
      
      {/* Ball */}
      <circle cx="34" cy="12" r="3" />
      
      {/* Stack of stones */}
      <ellipse cx="48" cy="42" rx="8" ry="2.5" />
      <ellipse cx="48" cy="38" rx="7" ry="2.5" />
      <ellipse cx="48" cy="34" rx="6" ry="2.5" />
      <ellipse cx="48" cy="30" rx="5" ry="2.5" />
      <ellipse cx="48" cy="26" rx="4" ry="2.5" />
      <ellipse cx="48" cy="22" rx="3" ry="2.5" />
      <ellipse cx="48" cy="18" rx="2" ry="2" />
    </svg>
  );
}

export function TugOfWarIcon({ className = "h-16 w-16 xl:h-24 xl:w-24" }: SportIconProps) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Left player - solid silhouette */}
      <circle cx="18" cy="12" r="4.5" />
      <path d="M 18 16 L 18 24 L 14 30 L 12 36" strokeWidth="4.5" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M 18 24 L 22 30 L 24 36" strokeWidth="4.5" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M 18 18 L 26 20" strokeWidth="4.5" stroke="currentColor" fill="none" strokeLinecap="round" />
      
      {/* Right player - solid silhouette */}
      <circle cx="46" cy="12" r="4.5" />
      <path d="M 46 16 L 46 24 L 42 30 L 40 36" strokeWidth="4.5" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M 46 24 L 50 30 L 52 36" strokeWidth="4.5" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M 46 18 L 38 20" strokeWidth="4.5" stroke="currentColor" fill="none" strokeLinecap="round" />
      
      {/* Rope */}
      <line x1="26" y1="20" x2="38" y2="20" stroke="currentColor" strokeWidth="3" />
      <circle cx="32" cy="20" r="2.5" />
    </svg>
  );
}

export function PushUpsIcon({ className = "h-16 w-16 xl:h-24 xl:w-24" }: SportIconProps) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Person doing push-up - solid silhouette */}
      {/* Head */}
      <circle cx="18" cy="22" r="4.5" />
      
      {/* Body in plank position */}
      <path 
        d="M 18 26 L 38 26" 
        stroke="currentColor" 
        strokeWidth="5" 
        strokeLinecap="round"
      />
      
      {/* Left arm (bent, supporting) */}
      <path 
        d="M 20 26 L 14 32 L 10 36" 
        stroke="currentColor" 
        strokeWidth="4.5" 
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      
      {/* Right arm (bent, supporting) */}
      <path 
        d="M 28 26 L 28 32 L 26 38" 
        stroke="currentColor" 
        strokeWidth="4.5" 
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      
      {/* Legs extended */}
      <path 
        d="M 38 26 L 46 28 L 52 30" 
        stroke="currentColor" 
        strokeWidth="5" 
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      
      {/* Ground line */}
      <line 
        x1="6" 
        y1="38" 
        x2="54" 
        y2="38" 
        stroke="currentColor" 
        strokeWidth="2.5" 
        opacity="0.5"
      />
      
      {/* Motion lines indicating up/down movement */}
      <path 
        d="M 22 16 L 22 12" 
        stroke="currentColor" 
        strokeWidth="2.5" 
        strokeLinecap="round"
        opacity="0.6"
      />
      <path 
        d="M 26 16 L 26 12" 
        stroke="currentColor" 
        strokeWidth="2.5" 
        strokeLinecap="round"
        opacity="0.6"
      />
      <path 
        d="M 30 16 L 30 12" 
        stroke="currentColor" 
        strokeWidth="2.5" 
        strokeLinecap="round"
        opacity="0.6"
      />
    </svg>
  );
}

export function GullyCricketIcon({ className = "h-16 w-16 xl:h-24 xl:w-24" }: SportIconProps) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Street cricket scene - solid silhouette */}
      {/* Batsman */}
      <circle cx="28" cy="14" r="4.5" />
      <path 
        d="M 28 18 L 28 26 L 24 32 L 22 38" 
        strokeWidth="4.5" 
        stroke="currentColor" 
        fill="none" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
      />
      <path 
        d="M 28 26 L 32 32 L 34 38" 
        strokeWidth="4.5" 
        stroke="currentColor" 
        fill="none" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
      />
      
      {/* Cricket bat - angled for shot */}
      <path 
        d="M 28 22 L 38 16 L 40 18 L 30 24 Z" 
        fill="currentColor"
      />
      
      {/* Ball in motion */}
      <circle cx="48" cy="20" r="2.5" />
      
      {/* Motion lines for ball */}
      <path 
        d="M 42 22 L 46 21" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round"
        opacity="0.6"
      />
      <path 
        d="M 40 24 L 44 23" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round"
        opacity="0.6"
      />
      
      {/* Makeshift wicket (three sticks) */}
      <line x1="12" y1="32" x2="12" y2="42" stroke="currentColor" strokeWidth="2.5" />
      <line x1="16" y1="32" x2="16" y2="42" stroke="currentColor" strokeWidth="2.5" />
      <line x1="20" y1="32" x2="20" y2="42" stroke="currentColor" strokeWidth="2.5" />
      
      {/* Bails on top */}
      <line x1="11" y1="32" x2="17" y2="32" stroke="currentColor" strokeWidth="2" />
      <line x1="15" y1="32" x2="21" y2="32" stroke="currentColor" strokeWidth="2" />
      
      {/* Ground/street line */}
      <line 
        x1="8" 
        y1="42" 
        x2="56" 
        y2="42" 
        stroke="currentColor" 
        strokeWidth="2.5" 
        opacity="0.5"
      />
    </svg>
  );
}

export function HundredMeterRaceIcon({ className = "h-16 w-16 xl:h-24 xl:w-24" }: SportIconProps) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Sprinter in motion - solid silhouette */}
      <circle cx="42" cy="14" r="5" />
      {/* Body leaning forward aggressively */}
      <path d="M 42 19 L 34 34" stroke="currentColor" strokeWidth="5" strokeLinecap="round" />
      {/* Front arm pumping */}
      <path d="M 40 22 L 48 18" stroke="currentColor" strokeWidth="4.5" strokeLinecap="round" />
      {/* Back arm */}
      <path d="M 36 24 L 28 28" stroke="currentColor" strokeWidth="4.5" strokeLinecap="round" />
      {/* Front leg driving */}
      <path d="M 34 34 L 38 42 L 40 48" stroke="currentColor" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" />
      {/* Back leg extending */}
      <path d="M 34 34 L 26 40 L 22 46" stroke="currentColor" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" />
      {/* Speed lines */}
      <path d="M 10 16 L 18 16" stroke="currentColor" strokeWidth="3" strokeLinecap="round" opacity="0.7" />
      <path d="M 8 22 L 16 22" stroke="currentColor" strokeWidth="3" strokeLinecap="round" opacity="0.7" />
      <path d="M 6 28 L 14 28" stroke="currentColor" strokeWidth="3" strokeLinecap="round" opacity="0.7" />
      <path d="M 4 34 L 12 34" stroke="currentColor" strokeWidth="3" strokeLinecap="round" opacity="0.7" />
    </svg>
  );
}

export function RelayIcon({ className = "h-16 w-16 xl:h-24 xl:w-24" }: SportIconProps) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* First runner - solid silhouette */}
      <circle cx="20" cy="12" r="4.5" />
      <path d="M 20 16 L 20 24 L 16 30 L 14 36" strokeWidth="4.5" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M 20 24 L 24 30 L 26 36" strokeWidth="4.5" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M 20 18 L 26 20" strokeWidth="4.5" stroke="currentColor" fill="none" strokeLinecap="round" />
      
      {/* Second runner - solid silhouette */}
      <circle cx="44" cy="12" r="4.5" />
      <path d="M 44 16 L 44 24 L 40 30 L 38 36" strokeWidth="4.5" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M 44 24 L 48 30 L 50 36" strokeWidth="4.5" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M 44 18 L 38 20" strokeWidth="4.5" stroke="currentColor" fill="none" strokeLinecap="round" />
      
      {/* Baton */}
      <rect x="30" y="18" width="4" height="10" rx="2" />
    </svg>
  );
}

export function ShotPutIcon({ className = "h-16 w-16 xl:h-24 xl:w-24" }: SportIconProps) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Shot put athlete silhouette - exact match to reference image */}
      
      {/* Head */}
      <circle cx="28" cy="20" r="5" fill="currentColor" />
      
      {/* Torso - angled backward in throwing position */}
      <path 
        d="M 28 25 L 26 32 L 24 40" 
        stroke="currentColor" 
        strokeWidth="6" 
        strokeLinecap="round"
      />
      
      {/* Right arm (throwing arm) - extended upward and back */}
      <path 
        d="M 27 28 Q 24 24 20 18" 
        stroke="currentColor" 
        strokeWidth="4.5" 
        strokeLinecap="round"
      />
      
      {/* Left arm - extended backward for balance */}
      <path 
        d="M 26 32 Q 32 34 38 36" 
        stroke="currentColor" 
        strokeWidth="4.5" 
        strokeLinecap="round"
      />
      
      {/* Right leg (front) - bent, weight-bearing */}
      <path 
        d="M 24 40 Q 22 46 20 52" 
        stroke="currentColor" 
        strokeWidth="5" 
        strokeLinecap="round"
      />
      
      {/* Left leg (back) - extended for power */}
      <path 
        d="M 25 38 Q 29 44 34 50" 
        stroke="currentColor" 
        strokeWidth="5" 
        strokeLinecap="round"
      />
      
      {/* Shot put ball (in hand/just released) */}
      <circle cx="18" cy="16" r="3.5" fill="currentColor" />
      
      {/* Shot put ball (in flight trajectory) */}
      <circle cx="38" cy="12" r="3" fill="currentColor" />
      
      {/* Trajectory arc - dotted line showing ball path */}
      <path 
        d="M 21 16 Q 28 10 38 12" 
        stroke="currentColor" 
        strokeWidth="1.5" 
        strokeLinecap="round"
        strokeDasharray="2 3"
        opacity="0.7"
      />
    </svg>
  );
}

export function CarromIcon({ className = "h-16 w-16 xl:h-24 xl:w-24" }: SportIconProps) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Carrom board */}
      <rect x="10" y="10" width="44" height="44" rx="2" stroke="currentColor" strokeWidth="3" fill="none" />
      
      {/* Corner pockets */}
      <circle cx="12" cy="12" r="3.5" />
      <circle cx="52" cy="12" r="3.5" />
      <circle cx="12" cy="52" r="3.5" />
      <circle cx="52" cy="52" r="3.5" />
      
      {/* Center circle */}
      <circle cx="32" cy="32" r="8" stroke="currentColor" strokeWidth="2.5" fill="none" />
      
      {/* Carrom men pieces */}
      <circle cx="32" cy="26" r="2.5" />
      <circle cx="26" cy="32" r="2.5" />
      <circle cx="38" cy="32" r="2.5" />
      <circle cx="32" cy="38" r="2.5" />
      
      {/* Striker */}
      <circle cx="32" cy="46" r="3.5" stroke="currentColor" strokeWidth="2" fill="none" />
      
      {/* Diagonal lines in corners */}
      <line x1="10" y1="10" x2="18" y2="18" stroke="currentColor" strokeWidth="2" />
      <line x1="54" y1="10" x2="46" y2="18" stroke="currentColor" strokeWidth="2" />
      <line x1="10" y1="54" x2="18" y2="46" stroke="currentColor" strokeWidth="2" />
      <line x1="54" y1="54" x2="46" y2="46" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}

export function DodgeballIcon({ className = "h-16 w-16 xl:h-24 xl:w-24" }: SportIconProps) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Court line */}
      <path d="M 10 38 L 54 38" stroke="currentColor" strokeWidth="2.5" />
      <path d="M 10 34 L 10 42 M 54 34 L 54 42" stroke="currentColor" strokeWidth="2.5" />
      
      {/* Left player - solid silhouette */}
      <circle cx="18" cy="16" r="4.5" />
      <path d="M 18 20 L 18 28 L 14 32 M 18 28 L 22 32" strokeWidth="4.5" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M 18 22 L 24 24" strokeWidth="4.5" stroke="currentColor" fill="none" strokeLinecap="round" />
      
      {/* Right player - solid silhouette */}
      <circle cx="46" cy="16" r="4.5" />
      <path d="M 46 20 L 46 28 L 42 32 M 46 28 L 50 32" strokeWidth="4.5" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M 46 22 L 40 24" strokeWidth="4.5" stroke="currentColor" fill="none" strokeLinecap="round" />
      
      {/* Ball in motion */}
      <circle cx="32" cy="22" r="3.5" />
      <path d="M 28 20 L 24 18" stroke="currentColor" strokeWidth="2.5" opacity="0.5" />
    </svg>
  );
}

export function KabaddiIcon({ className = "h-16 w-16 xl:h-24 xl:w-24" }: SportIconProps) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Ground/mat base */}
      <path d="M 8 48 L 56 48 L 52 54 L 12 54 Z" />
      
      {/* Left player (raider) - solid silhouette */}
      <circle cx="22" cy="14" r="4.5" />
      <path d="M 22 18 L 22 26 L 18 32 L 16 38" strokeWidth="4.5" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M 22 26 L 26 32 L 28 38" strokeWidth="4.5" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M 22 20 L 28 22" strokeWidth="4.5" stroke="currentColor" fill="none" strokeLinecap="round" />
      
      {/* Right player (defender) - solid silhouette */}
      <circle cx="42" cy="14" r="4.5" />
      <path d="M 42 18 L 42 26 L 38 32 L 36 38" strokeWidth="4.5" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M 42 26 L 46 32 L 48 38" strokeWidth="4.5" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M 42 20 L 36 22" strokeWidth="4.5" stroke="currentColor" fill="none" strokeLinecap="round" />
      
      {/* Grappling indication */}
      <path d="M 28 22 L 36 22" stroke="currentColor" strokeWidth="3" strokeDasharray="3 3" />
    </svg>
  );
}
