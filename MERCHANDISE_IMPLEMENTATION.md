# Merchandise Section & Website Credits Implementation

## Overview
This document describes the implementation of the official merchandise section and developer credits on the IIITG Sports Carnival website.

## Changes Implemented

### 1. Merchandise Section

#### Location
- Positioned after the "Choose Your Sport" section on the homepage
- Before the footer
- Full-width section with gradient background

#### Components Created

**MerchandiseCard Component** (`src/components/merchandise/MerchandiseCard.tsx`)
- Reusable product card with glassmorphism design
- Features:
  - Product image with hover zoom effect
  - Title, subtitle, and description
  - Feature list with checkmarks
  - Optional price display
  - CTA button with gradient styling
  - External link with icon

**MerchandiseSection Component** (`src/components/merchandise/MerchandiseSection.tsx`)
- Main section component containing all merchandise
- Features:
  - Section header with shopping bag icon
  - Responsive grid layout
  - Two product cards (Jersey and Hoodie)

#### Product Details

**Official Sports Jersey**
- Image: Blue jersey with front and back views
- Features:
  - Premium polyester fabric
  - Customizable player number
  - Official IIITG branding
  - Front & back design
  - Available in all sizes
- CTA: "Buy Jersey Now"
- Link: https://forms.gle/Zz64gJjWMjPC4ZvHA

**IIITG Zipper Hoodies**
- Image: Maroon and navy blue hoodies
- Features:
  - Premium cotton blend fabric
  - Full-zip front closure
  - Front kangaroo pocket
  - Available in Maroon & Navy Blue
  - Sizes: S, M, L, XL, XXL
- CTA: "Buy Hoodie Now"
- Link: https://forms.gle/CNCC67eLv1y5dYc7A

### 2. Footer Credits Section

#### Developer Credits
Updated `src/components/layouts/Footer.tsx` to include:
- Darker background section (#1a1f2e)
- "Website Developed By" heading
- Developer names: Pratham Gupta & Vedaant Mishra
- Email contact section with Mail icon
- Clickable mailto: links
- Decorative horizontal lines

#### Contact Information
- Email 1: pratham.gupta25b@iiitg.ac.in
- Email 2: vedaant.mishra25b@iiitg.ac.in
- Separator: "|" on desktop, stacked on mobile
- Hover effects: underline and color change

### 3. SEO Enhancements

#### Updated PageMeta Component
Enhanced `src/components/common/PageMeta.tsx` with:
- Basic meta tags (title, description, keywords, author)
- Open Graph meta tags (for social media sharing)
- Twitter Card meta tags
- Additional SEO tags (robots, language, canonical)

#### Home Page SEO
Added comprehensive meta tags to Home page:
- Title: "Home | IIITG Sports Carnival"
- Description: Includes sports events and merchandise
- Keywords: Sports events, merchandise, jerseys, hoodies
- Open Graph and Twitter Card support

## Design Specifications

### Merchandise Section Styling

**Section Header**
- Icon: ShoppingBag (Lucide React)
- Title: 42px font size (desktop), 32px (mobile)
- Subtitle: 18px font size
- Center aligned
- Margin: 60px top, 40px bottom

**Product Cards**
- Background: Semi-transparent white (rgba(255, 255, 255, 0.08))
- Backdrop blur: 10px (glassmorphism)
- Border: 1px solid rgba(255, 255, 255, 0.12)
- Border radius: 16px
- Padding: 24px
- Hover effects:
  - Scale: 1.02
  - Shadow: Enhanced
  - Image zoom: 1.05
  - Transition: 300ms ease

**Typography**
- Title: 24px, bold, white
- Subtitle: 16px, primary color (orange/yellow)
- Description: 15px, light gray (#d1d5db)
- Features: 14px, lighter gray
- Line height: 1.6

**CTA Button**
- Gradient: #FFB84D to #FFA500
- Hover gradient: #FFC55D to #FFB520
- Text: White, 16px, font-weight 600
- Padding: 24px vertical (py-6)
- Border radius: 8px
- Hover effects:
  - Translate Y: -2px
  - Shadow: Enhanced
  - Transition: 300ms

**Grid Layout**
- Desktop (≥1024px): 2 columns, 40px gap
- Tablet (640px-1023px): 2 columns, 24px gap
- Mobile (<640px): 1 column, 32px gap
- Max width: 1200px
- Center aligned

### Footer Credits Styling

**Background**
- Color: #1a1f2e (darker than main content)
- Border top: 1px solid border/30

**Typography**
- "Website Developed By": 14px, muted
- Developer names: 16px, font-weight 600
- Email links: 14px, primary color
- Hover: Underline, color transition

**Layout**
- Padding: 32px vertical
- Center aligned
- Decorative lines: 1px height, max-width 320px
- Email separator: Hidden on mobile, visible on desktop

**Spacing**
- Section spacing: 16px between elements
- Email gap: 12px (mobile), 16px (desktop)
- Decorative line gap: 16px

## Responsive Behavior

### Desktop (≥1024px)
- Merchandise cards side by side
- Equal width (48% each)
- 40px gap between cards
- Email addresses on same line with separator

### Tablet (640px-1023px)
- Merchandise cards side by side
- Reduced gap (24px)
- Slightly narrower cards
- Email addresses on same line

### Mobile (<640px)
- Merchandise cards stacked vertically
- Full width (minus 20px padding)
- 32px vertical spacing
- Email addresses stacked vertically
- No separator between emails

## Accessibility Features

### Keyboard Navigation
- All links are keyboard accessible
- Focus states clearly visible
- Tab order is logical

### Screen Reader Support
- Descriptive alt text for images
- ARIA labels where appropriate
- Semantic HTML structure

### Visual Accessibility
- Color contrast meets WCAG AA standards
- Touch targets minimum 44x44px
- Hover states clearly visible
- External link icons for clarity

## Image Handling

### Jersey Image
- URL: https://miaoda-site-img.s3cdn.medo.dev/images/f91b2421-0101-4d9c-b850-c6cb87a4b362.jpg
- Shows front and back views
- Aspect ratio: 16:9
- Lazy loading enabled

### Hoodie Image
- URL: https://miaoda-site-img.s3cdn.medo.dev/images/bab8c26d-3059-43d7-84b7-9047fffee744.jpg
- Shows maroon and navy blue variants
- Aspect ratio: 16:9
- Lazy loading enabled

## External Links

### Jersey Purchase
- URL: https://forms.gle/Zz64gJjWMjPC4ZvHA
- Opens in new tab (target="_blank")
- Security: rel="noopener noreferrer"
- Icon: ExternalLink (Lucide React)

### Hoodie Purchase
- URL: https://forms.gle/CNCC67eLv1y5dYc7A
- Opens in new tab (target="_blank")
- Security: rel="noopener noreferrer"
- Icon: ExternalLink (Lucide React)

### Email Links
- pratham.gupta25b@iiitg.ac.in (mailto:)
- vedaant.mishra25b@iiitg.ac.in (mailto:)
- Opens default email client

## SEO Implementation

### Meta Tags Added
```html
<!-- Basic Meta Tags -->
<title>Home | IIITG Sports Carnival</title>
<meta name="description" content="..." />
<meta name="keywords" content="..." />
<meta name="author" content="IIIT Guwahati Sports Board" />

<!-- Open Graph Meta Tags -->
<meta property="og:title" content="..." />
<meta property="og:description" content="..." />
<meta property="og:type" content="website" />
<meta property="og:url" content="..." />
<meta property="og:image" content="..." />
<meta property="og:site_name" content="IIITG Sports Carnival" />

<!-- Twitter Card Meta Tags -->
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="..." />
<meta name="twitter:description" content="..." />
<meta name="twitter:image" content="..." />

<!-- Additional Meta Tags -->
<meta name="robots" content="index, follow" />
<meta name="language" content="English" />
<meta name="revisit-after" content="7 days" />
<link rel="canonical" href="..." />
```

### Keywords
- IIIT Guwahati
- Sports Carnival
- Sports Events
- College Sports
- IIITG Sports Board
- Sports Registration
- Sports Merchandise
- IIITG Jersey
- IIITG Hoodie
- Sports Apparel

## File Structure

```
src/
├── components/
│   ├── merchandise/
│   │   ├── MerchandiseCard.tsx       # Reusable product card
│   │   └── MerchandiseSection.tsx    # Main merchandise section
│   ├── layouts/
│   │   └── Footer.tsx                # Updated with credits
│   └── common/
│       └── PageMeta.tsx              # Enhanced SEO component
└── pages/
    └── Home.tsx                      # Updated with merchandise section
```

## Testing Checklist

### Visual Testing
- [x] Merchandise section appears on homepage
- [x] Jersey card displays correctly
- [x] Hoodie card displays correctly
- [x] Images load properly
- [x] Hover effects work smoothly
- [x] CTA buttons are styled correctly
- [x] Footer credits section displays correctly
- [x] Email links are clickable

### Functional Testing
- [x] Jersey "Buy Now" button links to correct Google Form
- [x] Hoodie "Buy Now" button links to correct Google Form
- [x] Both links open in new tab
- [x] Email links open default email client
- [x] External link icons display

### Responsive Testing
- [x] Desktop layout (2 columns)
- [x] Tablet layout (2 columns, reduced gap)
- [x] Mobile layout (1 column, stacked)
- [x] Email addresses stack on mobile
- [x] Images scale properly
- [x] Text is readable on all screen sizes

### Accessibility Testing
- [x] Keyboard navigation works
- [x] Focus states are visible
- [x] Alt text for images
- [x] Color contrast is adequate
- [x] Touch targets are large enough

### SEO Testing
- [x] Meta tags are present
- [x] Open Graph tags work
- [x] Twitter Card tags work
- [x] Canonical URL is set
- [x] Keywords are relevant

## Performance Considerations

### Image Optimization
- Lazy loading enabled for all product images
- Images served from CDN
- Appropriate image sizes for web

### CSS Optimization
- Backdrop blur for glassmorphism
- Hardware-accelerated transforms
- Smooth transitions (300ms)

### Code Splitting
- Merchandise components loaded with Home page
- No additional bundle size impact

## Browser Compatibility

Tested and working on:
- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile Safari (iOS)
- Chrome Mobile (Android)

## Future Enhancements

### Potential Additions
1. Product image carousel for multiple views
2. Size selection before purchase
3. Color variant selector
4. Price display (if needed)
5. Stock availability indicator
6. Product reviews/testimonials
7. Related products section
8. Wishlist functionality

### Analytics
- Track "Buy Now" button clicks
- Monitor conversion rates
- Analyze popular products
- User engagement metrics

## Maintenance Notes

### Updating Product Information
To update product details:
1. Edit `src/components/merchandise/MerchandiseSection.tsx`
2. Modify the MerchandiseCard props
3. Update features array as needed

### Changing Images
To change product images:
1. Update image URLs in MerchandiseSection.tsx
2. Ensure images are optimized for web
3. Maintain aspect ratio consistency

### Updating Links
To change Google Form links:
1. Edit ctaLink prop in MerchandiseSection.tsx
2. Test new links in new tab
3. Verify form accessibility

### Updating Credits
To update developer information:
1. Edit `src/components/layouts/Footer.tsx`
2. Update names and email addresses
3. Test mailto: links

## Support & Troubleshooting

### Common Issues

**Issue: Images not loading**
- Solution: Check CDN availability
- Verify: Image URLs are correct
- Check: Network tab for errors

**Issue: Links not working**
- Solution: Verify Google Form URLs
- Check: target="_blank" attribute
- Verify: rel="noopener noreferrer"

**Issue: Layout broken on mobile**
- Solution: Check responsive classes
- Verify: Grid breakpoints
- Test: Different screen sizes

**Issue: Hover effects not working**
- Solution: Check CSS transitions
- Verify: group class on parent
- Test: Browser compatibility

## Conclusion

All requested features have been successfully implemented:
1. ✅ Merchandise section with jersey and hoodie cards
2. ✅ Glassmorphism design with hover effects
3. ✅ Responsive grid layout
4. ✅ External links to Google Forms
5. ✅ Developer credits in footer
6. ✅ Email contact links
7. ✅ Comprehensive SEO meta tags
8. ✅ All code passes lint validation
9. ✅ Mobile responsive and accessible
10. ✅ Smooth animations and transitions

The platform now features a professional merchandise section and proper developer attribution, enhancing both functionality and credibility.
