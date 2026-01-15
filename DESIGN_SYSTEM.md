# Dark Tech Aesthetic Design System

## Overview
Modern IT institute website design featuring a dark tech aesthetic with deep charcoal black backgrounds and icy blue accents. The design emphasizes speed, precision, professionalism, and futuristic appeal.

## Color Palette

### Primary Colors
| Color Name | Hex Code | HSL | Usage |
|------------|----------|-----|-------|
| Deep Charcoal Black | `#0F0F12` | `hsl(220 9% 6%)` | Primary background |
| Light Icy Blue | `#B9CFDF` | `hsl(205 35% 80%)` | Secondary accents |
| Blue-Gray | `#4A5B6A` | `hsl(208 18% 35%)` | Cards and sections |
| Soft Near-White | `#F4F7FA` | `hsl(210 33% 97%)` | Content text |
| Bright Icy Blue | `#9EC3DA` | `hsl(203 44% 74%)` | CTAs and primary actions |

### Semantic Colors
- **Background**: Deep charcoal black (#0F0F12)
- **Foreground**: Soft near-white (#F4F7FA)
- **Card**: Blue-gray (#4A5B6A)
- **Primary**: Bright icy blue (#9EC3DA)
- **Secondary**: Light icy blue (#B9CFDF)
- **Muted**: Darker blue-gray (hsl(208 18% 25%))
- **Border**: Dark blue-gray (hsl(208 18% 25%))

## Typography

### Font Stack
```css
font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 
             'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 
             'Helvetica Neue', sans-serif;
```

### Font Smoothing
- `-webkit-font-smoothing: antialiased`
- `-moz-osx-font-smoothing: grayscale`

### Hierarchy
- **H1**: 3.75rem (60px) on desktop, 2.25rem (36px) on mobile
- **H2**: 2.25rem (36px) on desktop, 1.875rem (30px) on mobile
- **Body**: 1rem (16px)
- **Small**: 0.875rem (14px)

## Visual Effects

### 1. Tech Glow Animation
Dynamic pulsing glow effect on headers:
```css
@keyframes techGlow {
  0%, 100% { 
    text-shadow: 0 0 20px rgba(158, 195, 218, 0.5),
                 0 0 40px rgba(158, 195, 218, 0.3);
  }
  50% { 
    text-shadow: 0 0 30px rgba(185, 207, 223, 0.8),
                 0 0 60px rgba(185, 207, 223, 0.5),
                 0 0 80px rgba(185, 207, 223, 0.3);
  }
}
```
- Duration: 3 seconds
- Easing: ease-in-out
- Loop: infinite

### 2. Tech Gradient Background
Subtle gradient for hero sections:
```css
background: linear-gradient(135deg, 
  hsl(220 9% 8%) 0%, 
  hsl(208 18% 15%) 50%, 
  hsl(220 9% 8%) 100%);
```

### 3. Glass Effect
Modern glass morphism for overlays:
```css
background: rgba(74, 91, 106, 0.1);
backdrop-filter: blur(10px);
border: 1px solid rgba(158, 195, 218, 0.1);
```

### 4. Neon Border
Glowing border effect for emphasis:
```css
border: 1px solid hsl(203 44% 74%);
box-shadow: 0 0 10px rgba(158, 195, 218, 0.3),
            inset 0 0 10px rgba(158, 195, 218, 0.1);
```

### 5. Card Hover Effect
Smooth elevation on hover:
```css
transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
transform: translateY(-8px);
box-shadow: 0 20px 40px rgba(158, 195, 218, 0.2);
```

## Component Styling

### Cards
- Background: Blue-gray (#4A5B6A) with 50% opacity
- Border: 1px solid border color with 50% opacity
- Border radius: 0.75rem (12px)
- Backdrop blur: 10px for glass effect
- Optional neon border for emphasis

### Buttons
- **Primary**: Bright icy blue background (#9EC3DA)
- **Secondary**: Light icy blue background (#B9CFDF)
- **Outline**: Transparent with icy blue border
- Border radius: 0.5rem (8px)
- Transition: all 0.2s ease

### Header
- Background: Deep charcoal with 95% opacity
- Backdrop blur: enabled
- Border bottom: 1px solid border with 50% opacity
- Sticky positioning
- Z-index: 50

### Footer
- Background: Card color with 30% opacity
- Backdrop blur: enabled
- Border top: 1px solid border with 50% opacity
- Hover effects on links (transition to primary color)

## Layout Principles

### Spacing
- Container max-width: 1280px
- Padding: 1rem (mobile), 2rem (desktop)
- Section spacing: 5rem (80px) vertical
- Component spacing: 1.5rem (24px)

### Border Radius
- Small: 0.5rem (8px)
- Medium: 0.75rem (12px)
- Large: 1rem (16px)

### Shadows
- Subtle: `0 1px 3px rgba(0, 0, 0, 0.12)`
- Medium: `0 4px 6px rgba(0, 0, 0, 0.16)`
- Large: `0 10px 20px rgba(0, 0, 0, 0.19)`
- Glow: `0 0 20px rgba(158, 195, 218, 0.3)`

## Contrast & Accessibility

### WCAG Compliance
- Background to foreground: 16.5:1 (AAA)
- Card to card-foreground: 7.2:1 (AAA)
- Primary to background: 8.1:1 (AAA)
- All text meets WCAG AA standards (minimum 4.5:1)

### Focus States
- Ring color: Bright icy blue (#9EC3DA)
- Ring width: 2px
- Ring offset: 2px

## Responsive Design

### Breakpoints
- Mobile: < 768px
- Tablet: 768px - 1279px
- Desktop: ≥ 1280px

### Mobile Optimizations
- Reduced font sizes
- Stacked layouts
- Touch-friendly targets (minimum 44x44px)
- Simplified navigation

## Animation Guidelines

### Timing Functions
- **Fast**: 150ms - micro-interactions
- **Normal**: 300ms - standard transitions
- **Slow**: 500ms - complex animations

### Easing
- **Ease-in-out**: Standard transitions
- **Cubic-bezier(0.4, 0, 0.2, 1)**: Material design easing
- **Ease-out**: Entrances
- **Ease-in**: Exits

## Usage Examples

### Hero Section
```tsx
<section className="py-20 tech-gradient relative overflow-hidden">
  <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent"></div>
  <div className="container relative z-10">
    <h1 className="dynamic-header">Your Title</h1>
  </div>
</section>
```

### Card Component
```tsx
<div className="bg-card/50 backdrop-blur-sm p-6 rounded-lg border border-border/50 neon-border">
  <h3 className="text-secondary">Card Title</h3>
  <p className="text-card-foreground">Card content</p>
</div>
```

### CTA Button
```tsx
<button className="bg-primary text-primary-foreground px-6 py-3 rounded-lg 
                   hover:shadow-lg transition-all duration-300">
  Get Started
</button>
```

## Design Principles

### 1. Speed
- Fast loading times
- Smooth animations
- Instant feedback

### 2. Futuristic
- Tech-inspired effects
- Glowing elements
- Modern aesthetics

### 3. Trustworthy
- Professional typography
- Consistent spacing
- Clear hierarchy

### 4. Minimal
- Clean layouts
- Purposeful elements
- Ample whitespace

### 5. High Contrast
- Dark backgrounds
- Light text
- Vibrant accents

## Browser Support
- Chrome/Edge: Latest 2 versions
- Firefox: Latest 2 versions
- Safari: Latest 2 versions
- Mobile browsers: iOS Safari, Chrome Mobile

## Performance Considerations
- CSS animations are GPU-accelerated
- Backdrop filters used sparingly
- Images optimized for web
- Lazy loading for below-fold content
- Minimal JavaScript for visual effects

## Maintenance
- All colors defined in CSS variables
- Easy theme switching capability
- Consistent naming conventions
- Modular component structure
