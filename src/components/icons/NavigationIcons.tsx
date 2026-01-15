/**
 * Navigation Icons for Sports Event Registration Platform
 * 
 * Design Philosophy:
 * - Clean, minimal, modern outlined aesthetic matching lucide-react icon style
 * - Fully outlined design (no solid fills) for consistency with Admin/Logout icons
 * - Rounded edges (strokeLinecap="round", strokeLinejoin="round")
 * - Uniform stroke thickness (2-3.5px)
 * - Professional and sporty, not playful
 * - Uses currentColor for automatic theme adaptation (dark/light mode)
 * - Optimized for 64x64 viewBox with scalable design
 * 
 * Hover Behavior:
 * - Icons inherit color transitions from .nav-link CSS class
 * - Subtle scale transform on hover (scale-110) for desktop
 * - Color changes from soft blue-white (#b8dce8) to honey yellow (#ffeaa7)
 */

interface NavigationIconProps {
  className?: string;
}

/**
 * Home Icon - Simple house/dashboard style
 * Clean, minimal outlined design matching lucide-react style
 */
export function HomeIcon({ className = "h-5 w-5" }: NavigationIconProps) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Roof - outlined triangle */}
      <path
        d="M 8 30 L 32 8 L 56 30"
        stroke="currentColor"
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      
      {/* House body - outlined rectangle */}
      <rect
        x="14"
        y="28"
        width="36"
        height="28"
        rx="2"
        stroke="currentColor"
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      
      {/* Door - outlined */}
      <path
        d="M 26 56 L 26 42 C 26 40.5 26.5 38 28 38 L 36 38 C 37.5 38 38 40.5 38 42 L 38 56"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/**
 * My Events Icon - Ticket-based design
 * Represents registered events with a modern outlined ticket/pass aesthetic
 */
export function MyEventsIcon({ className = "h-5 w-5" }: NavigationIconProps) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Main ticket body - outlined rounded rectangle */}
      <path
        d="M 12 18 L 52 18 C 54 18 56 20 56 22 L 56 28 C 54 28 52 30 52 32 C 52 34 54 36 56 36 L 56 42 C 56 44 54 46 52 46 L 12 46 C 10 46 8 44 8 42 L 8 36 C 10 36 12 34 12 32 C 12 30 10 28 8 28 L 8 22 C 8 20 10 18 12 18 Z"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      
      {/* Perforation line - dashed vertical line in center */}
      <line
        x1="32"
        y1="22"
        x2="32"
        y2="42"
        stroke="currentColor"
        strokeWidth="2"
        strokeDasharray="3 3"
        strokeLinecap="round"
      />
      
      {/* Ticket details - horizontal lines on left */}
      <line
        x1="16"
        y1="26"
        x2="26"
        y2="26"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      
      <line
        x1="16"
        y1="32"
        x2="24"
        y2="32"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      
      <line
        x1="16"
        y1="38"
        x2="26"
        y2="38"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      
      {/* QR code representation - right side outlined */}
      <rect
        x="38"
        y="26"
        width="12"
        height="12"
        rx="1"
        stroke="currentColor"
        strokeWidth="2.5"
      />
      
      {/* QR code inner pattern - small squares */}
      <rect
        x="40"
        y="28"
        width="3"
        height="3"
        stroke="currentColor"
        strokeWidth="1"
      />
      <rect
        x="45"
        y="28"
        width="3"
        height="3"
        stroke="currentColor"
        strokeWidth="1"
      />
      <rect
        x="40"
        y="33"
        width="3"
        height="3"
        stroke="currentColor"
        strokeWidth="1"
      />
      <rect
        x="45"
        y="33"
        width="3"
        height="3"
        stroke="currentColor"
        strokeWidth="1"
      />
    </svg>
  );
}

/**
 * Alternative Calendar-based My Events Icon
 * Represents scheduled events with an outlined calendar aesthetic
 */
export function MyEventsCalendarIcon({ className = "h-5 w-5" }: NavigationIconProps) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Calendar body - outlined */}
      <rect
        x="10"
        y="14"
        width="44"
        height="42"
        rx="4"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      
      {/* Calendar header separator line */}
      <line
        x1="10"
        y1="24"
        x2="54"
        y2="24"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
      
      {/* Top binding rings */}
      <line
        x1="22"
        y1="10"
        x2="22"
        y2="18"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <line
        x1="42"
        y1="10"
        x2="42"
        y2="18"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
      
      {/* Calendar grid - horizontal lines */}
      <line
        x1="14"
        y1="32"
        x2="50"
        y2="32"
        stroke="currentColor"
        strokeWidth="2"
      />
      <line
        x1="14"
        y1="40"
        x2="50"
        y2="40"
        stroke="currentColor"
        strokeWidth="2"
      />
      <line
        x1="14"
        y1="48"
        x2="50"
        y2="48"
        stroke="currentColor"
        strokeWidth="2"
      />
      
      {/* Calendar grid - vertical lines */}
      <line
        x1="22"
        y1="28"
        x2="22"
        y2="52"
        stroke="currentColor"
        strokeWidth="2"
      />
      <line
        x1="32"
        y1="28"
        x2="32"
        y2="52"
        stroke="currentColor"
        strokeWidth="2"
      />
      <line
        x1="42"
        y1="28"
        x2="42"
        y2="52"
        stroke="currentColor"
        strokeWidth="2"
      />
      
      {/* Highlighted event dates - outlined circles */}
      <circle
        cx="27"
        cy="36"
        r="2.5"
        stroke="currentColor"
        strokeWidth="2"
      />
      <circle
        cx="37"
        cy="44"
        r="2.5"
        stroke="currentColor"
        strokeWidth="2"
      />
      <circle
        cx="47"
        cy="36"
        r="2.5"
        stroke="currentColor"
        strokeWidth="2"
      />
    </svg>
  );
}
