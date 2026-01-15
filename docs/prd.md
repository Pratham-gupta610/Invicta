# IIITG SPORTS CARNIVAL Requirements Document (Updated - Points System Display)

## 1. Application Overview

### 1.1 Application Name
IIITG SPORTS CARNIVAL

### 1.2 Application Description
A production-ready web application that enables users to register for multiple sports events with a smooth UI, dynamic pages, and high performance. The platform supports multiple sports categories with gender-specific event classifications, provides comprehensive event management capabilities for users, admins, and secretaries, features an official merchandise section for carnival gear, and includes a dedicated merchandise store for jerseys and hoodies. Organized by Sports Board. The system is optimized for high concurrency, fast registrations, zero duplicate entries, secure user authentication with institute email verification, scalable database design with unlimited participant capacity, and a robust role-based sports management and approval system.

### 1.3 Core Purpose
To provide a seamless registration experience for sports enthusiasts to discover, register, and manage their participation in various sporting events (with clear gender-specific eligibility indicators), purchase official carnival merchandise including jerseys and hoodies, while enabling authorized personnel (Secretaries and Admins) to create, edit, approve, and publish sports through a secure, auditable, and institution-grade governance system.

### 1.4 Sports List with Gender Classification

**Pre-Events (17-18 January 2026):**
1. Push Ups\n2. 7 Stones - Boys & Girls
3. Gully Cricket - Girls Only

**Main Events:**
\n**Boys & Girls Events:**
1. Table Tennis
2. Chess
3. Carrom
4. Badminton
5. Tug of War
6. Shotput
7. 100m
8. Dodgeball

**Boys Only Events:**
1. Cricket\n2. Football
3. Volleyball
4. Relay
5. Kabaddi

**Girls Only Events:**
1. Gully Cricket\n
**Other Events (Gender classification to be determined):**
1. Basketball
2. Tennis
3. Swimming
4. Athletics/Track & Field (other than 100m)
5. [Any other existing sports not explicitly mentioned]

## 2. Points System Display Section (NEW)

### 2.1 Points System Overview

#### 2.1.1 Purpose
- Display scoring rules for different event categories
- Clarify points distribution for winners and runners-up
- Provide transparency in competition scoring system
- Help participants understand reward structure

#### 2.1.2 Points Categories
- **Boys Only Events**: Winner 20 points, Runner-up 14 points
- **Boys & Girls Events**: Winner 10 points, Runner-up 7 points
- **Special Events (100m, Shot Put, Relay)**: 1st place 14 points, 2nd place 10 points, 3rd place 7 points

### 2.2 Section Position and Layout

#### 2.2.1 Section Position
- Position: Above the gender key/legend section
- Position: Below the Choose Your Sport heading or above Pre-Events section
- Clear visual separation from other sections
- Prominent placement for easy visibility

#### 2.2.2 Section Structure
```
┌─────────────────────────────────────────────────┐
│         POINTS DISTRIBUTION SYSTEM              │
│                                                 │
│  🏆 Boys Only Events                           │
│     Winner: 20 points | Runner-up: 14 points   │
│                                                 │
│  🏆 Boys & Girls Events                        │
│     Winner: 10 points | Runner-up: 7 points    │
│                                                 │
│  🏆 Special Events (100m, Shot Put, Relay)     │
│     1st: 14 points | 2nd: 10 points | 3rd: 7 points │
└─────────────────────────────────────────────────┘\n```

### 2.3 Design Specifications

#### 2.3.1 Container Styling
- Background: Semi-transparent gradient or solid color
  - Option 1: rgba(255, 255, 255, 0.1) with subtle gradient
  - Option 2: rgba(33, 150, 243, 0.15) (light blue tint)
- Border: 1px solid rgba(255, 255, 255, 0.2)
- Border-radius: 12px
- Padding: 24px 32px
- Margin-bottom: 32px
- Box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1)\n- Max-width: 900px
- Margin: 0 auto 32px auto (centered)

#### 2.3.2 Section Header
- Text: POINTS DISTRIBUTION SYSTEM or SCORING SYSTEM
- Font size: 20-24px
- Font weight: Bold (700)
- Color: White (#FFFFFF)
- Text alignment: Center
- Margin-bottom: 20px
- Optional: Add trophy icon 🏆 before text

#### 2.3.3 Points Category Styling
\n**Category Title:**
- Font size: 16-18px
- Font weight: 600
- Color: Light yellow (#FFD54F) or White (#FFFFFF)
- Margin-bottom: 8px
- Display: Flex with icon\n- Icon: Trophy emoji 🏆 or medal icon\n- Icon size: 20px
- Gap between icon and text: 8px

**Points Details:**
- Font size: 14-16px
- Font weight: 400
- Color: Light gray (#E0E0E0) or White (#FFFFFF)
- Line height: 1.6
- Margin-bottom: 16px (between categories)
- Format: Winner: XX points | Runner-up: XX points
- Separator: Vertical bar | or bullet •

#### 2.3.4 Visual Hierarchy
- Each category separated by 16-20px margin
- Optional: Add subtle divider line between categories
- Divider: 1px solid rgba(255, 255, 255, 0.1)
- Divider margin: 12px 0
\n### 2.4 Responsive Design

#### 2.4.1 Desktop Layout (≥1024px)
- Container width: 900px max-width
- Padding: 24px 32px
- Font sizes as specified above
- All categories displayed in single column

#### 2.4.2 Tablet Layout (768px - 1023px)
- Container width: 90% of viewport
- Padding: 20px 24px
- Font sizes slightly reduced (18px header, 14px details)
- Maintain single column layout

#### 2.4.3 Mobile Layout (<768px)
- Container width: 95% of viewport
- Padding: 16px 20px
- Font sizes: 18px header, 14px category title, 13px details
- Stack categories vertically\n- Reduce margins between categories to 12px

### 2.5 Content Structure

#### 2.5.1 Category 1: Boys Only Events
- Title: 🏆 Boys Only Events or Games Only for Boys
- Points: Winner: 20 points | Runner-up: 14 points
- Alternative format: Winner 20 points and Runner-up 14 points\n\n#### 2.5.2 Category 2: Boys & Girls Events
- Title: 🏆 Boys & Girls Events or Events for Both Boys and Girls
- Points: Winner: 10 points | Runner-up: 7 points
- Alternative format: Winner 10 points and Runner-up 7 points

#### 2.5.3 Category 3: Special Events
- Title: 🏆 Special Events (100m, Shot Put, Relay)
- Points: 1st: 14 points | 2nd: 10 points | 3rd: 7 points\n- Alternative format: 1st place 14 points, 2nd place 10 points, and 3rd place 7 points
- Note: Explicitly list event names: 100m, Shot Put, Relay

### 2.6 Implementation Example

#### 2.6.1 HTML Structure
```html
<div class=\"points-system-section\">
  <h3 class=\"points-system-header\">🏆 POINTS DISTRIBUTION SYSTEM</h3>
  \n  <div class=\"points-category\">
    <div class=\"category-title\">
      <span class=\"icon\">🏆</span>\n      <span class=\"text\">Boys Only Events</span>\n    </div>
    <div class=\"category-details\">
      Winner: 20 points | Runner-up: 14 points
    </div>
  </div>
  
  <div class=\"points-divider\"></div>
  \n  <div class=\"points-category\">
    <div class=\"category-title\">
      <span class=\"icon\">🏆</span>
      <span class=\"text\">Boys & Girls Events</span>
    </div>
    <div class=\"category-details\">
      Winner: 10 points | Runner-up: 7 points
    </div>
  </div>
  
  <div class=\"points-divider\"></div>
  
  <div class=\"points-category\">\n    <div class=\"category-title\">
      <span class=\"icon\">🏆</span>
      <span class=\"text\">Special Events (100m, Shot Put, Relay)</span>
    </div>\n    <div class=\"category-details\">
      1st: 14 points | 2nd: 10 points | 3rd: 7 points
    </div>
  </div>
</div>
```\n
#### 2.6.2 CSS Styling
```css
.points-system-section {
  background: linear-gradient(135deg, rgba(33, 150, 243, 0.15), rgba(33, 150, 243, 0.05));
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  padding: 24px 32px;
  margin: 0 auto 32px auto;
  max-width: 900px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}\n
.points-system-header {
  font-size: 24px;
  font-weight: 700;
  color: #FFFFFF;
  text-align: center;
  margin-bottom: 20px;
}\n
.points-category {
  margin-bottom: 16px;
}

.category-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 18px;
  font-weight: 600;
  color: #FFD54F;
  margin-bottom: 8px;
}\n
.category-title .icon {
  font-size: 20px;
}\n
.category-details {
  font-size: 16px;
  font-weight: 400;
  color: #E0E0E0;
  line-height: 1.6;
  padding-left: 28px;
}

.points-divider {
  height: 1px;
  background: rgba(255, 255, 255, 0.1);
  margin: 12px 0;
}
\n@media (max-width: 1023px) {
  .points-system-section {
    width: 90%;
    padding: 20px 24px;
  }
  
  .points-system-header {
    font-size: 20px;
  }
  
  .category-title {
    font-size: 16px;
  }
  
  .category-details {
    font-size: 14px;\n  }
}
\n@media (max-width: 767px) {
  .points-system-section {
    width: 95%;
    padding: 16px 20px;
  }
  \n  .points-system-header {
    font-size: 18px;
  }\n  
  .category-title {
    font-size: 15px;
  }
  
  .category-details {
    font-size: 13px;
    padding-left: 24px;\n  }
  
  .points-category {
    margin-bottom: 12px;
  }\n}
```

#### 2.6.3 React Component Example
```jsx
const PointsSystemSection = () => {
  const pointsCategories = [
    {
      title: \"Boys Only Events\",
      details: \"Winner: 20 points | Runner-up: 14 points\"\n    },
    {\n      title: \"Boys & Girls Events\",
      details: \"Winner: 10 points | Runner-up: 7 points\"
    },
    {
      title: \"Special Events (100m, Shot Put, Relay)\",
      details: \"1st: 14 points | 2nd: 10 points | 3rd: 7 points\"
    }
  ];

  return (
    <div className=\"points-system-section\">
      <h3 className=\"points-system-header\">
        🏆 POINTS DISTRIBUTION SYSTEM
      </h3>
      
      {pointsCategories.map((category, index) => (
        <React.Fragment key={index}>
          <div className=\"points-category\">
            <div className=\"category-title\">
              <span className=\"icon\">🏆</span>
              <span className=\"text\">{category.title}</span>
            </div>\n            <div className=\"category-details\">
              {category.details}
            </div>
          </div>
          {index < pointsCategories.length - 1 && (
            <div className=\"points-divider\"></div>
          )}
        </React.Fragment>\n      ))}
    </div>
  );
};
```

### 2.7 Accessibility\n
#### 2.7.1 ARIA Labels
- Add aria-label to section: Points distribution system for sports events
- Add role=\"region\" to section container
- Add aria-labelledby to section header

#### 2.7.2 Screen Reader Support
- Ensure all text content is readable by screen readers
- Use semantic HTML (h3 for header, div for categories)
- Provide clear hierarchy with proper heading levels

#### 2.7.3 Keyboard Navigation
- Section is not interactive, no keyboard navigation required
- Ensure section does not interfere with page navigation
- Maintain proper focus order

### 2.8 Content Management

#### 2.8.1 Static Content
- Points system is static content, not stored in database
- Content hardcoded in frontend component
- No admin/secretary editing required

#### 2.8.2 Future Enhancement (Optional)
- Add database table for points configuration
- Enable admin/secretary to modify points values
- Add API endpoint for points system retrieval
- Add admin interface for points system management

### 2.9 Integration with Existing Sections

#### 2.9.1 Page Structure Order
```\n1. Hero Section (INVICTA header)
2. Choose Your Sport heading
3. Points Distribution System Section (NEW)
4. Gender Key/Legend Section (if exists)
5. Pre-Events Section\n6. Main Events Section
7. Merchandise Section
8. Footer
```

#### 2.9.2 Visual Flow
- Points system section provides context before event browsing
- Clear separation from gender key section (if exists)
- Maintains visual consistency with existing design
- Does not disrupt existing user flow

### 2.10 Performance Considerations

#### 2.10.1 Rendering\n- Static content, no API calls required
- Minimal DOM elements\n- CSS-only styling, no JavaScript animations
- Fast initial render

#### 2.10.2 Optimization
- Use CSS variables for colors and spacing
- Minimize CSS specificity
- Use efficient selectors
- Avoid unnecessary re-renders

## 3. Gender-Specific Event System (Existing - No Changes)

### 3.1 Gender Classification Overview

#### 3.1.1 Purpose
- Clearly indicate which events are open to boys, girls, or both
- Provide visual gender indicators on sport cards
- Enable gender-based filtering and registration validation
- Ensure users can quickly identify eligible events

#### 3.1.2 Gender Categories
- **Boys & Girls**: Events open to all participants
- **Boys Only**: Events restricted to male participants
- **Girls Only**: Events restricted to female participants
\n### 3.2 Gender Icon System

#### 3.2.1 Icon Position
- Position: Bottom-right corner of sport card
- Z-index: Higher than card content
- Margin: 12px from bottom, 12px from right
\n#### 3.2.2 Icon Design Specifications
\n**Boys Icon:**
- Symbol: ♂ (Mars symbol) or male figure icon
- Color: Blue (#2196F3 or #1976D2)
- Size: 20-24px
- Background: Optional semi-transparent white circle (rgba(255, 255, 255, 0.2))
- Border-radius: 50% (if background used)
- Padding: 4px (if background used)

**Girls Icon:**
- Symbol: ♀ (Venus symbol) or female figure icon
- Color: Pink (#E91E63 or #F06292)
- Size: 20-24px
- Background: Optional semi-transparent white circle (rgba(255, 255, 255, 0.2))
- Border-radius: 50% (if background used)
- Padding: 4px (if background used)

**Boys & Girls Icons (Both):**
- Display: Both icons side by side
- Layout: Boys icon (blue) on left, Girls icon (pink) on right
- Gap: 6-8px between icons
- Container: Flex row layout
- Alignment: Center aligned

#### 3.2.3 Icon Tooltip
- Boys icon tooltip: Boys Only\n- Girls icon tooltip: Girls Only
- Both icons tooltip: Boys & Girls
- Tooltip appears on hover
- Tooltip background: rgba(0, 0, 0, 0.8)
- Tooltip text color: White\n- Tooltip font size: 12px
- Tooltip padding: 6px 10px
- Tooltip border-radius: 4px

### 3.3 Sport Card Layout Update

#### 3.3.1 Card Structure (Updated)
```\n┌─────────────────────────────────┐
│  [Yellow Bookmark] (if pre-event)│
│                                 │
│        [Sport Icon]             │
│                                 │
│       Sport Name                │
│                                 │\n│   [Pre-Event Badge] (optional)  │
│                                 │
│                    [Gender Icons]│
└─────────────────────────────────┘
```

#### 3.3.2 Gender Icons Container
- Position: Absolute\n- Bottom: 12px
- Right: 12px
- Display: Flex
- Flex-direction: Row
- Gap: 8px
- Align-items: Center
\n### 3.4 Database Schema Updates

#### 3.4.1 Sports Table Update
```sql
ALTER TABLE sports\nADD COLUMN gender_eligibility VARCHAR(20) DEFAULT 'both',
ADD CONSTRAINT check_gender_eligibility CHECK (gender_eligibility IN ('boys', 'girls', 'both'));
\nCREATE INDEX idx_sports_gender_eligibility ON sports(gender_eligibility);
```\n
#### 3.4.2 Gender Eligibility Data Population
```sql
-- Boys & Girls Events
UPDATE sports
SET gender_eligibility = 'both'\nWHERE name IN ('Table Tennis', 'Chess', 'Carrom', 'Badminton', 'Tug of War', 'Shotput', '100m', 'Dodgeball', '7 Stones');
\n-- Boys Only Events
UPDATE sports
SET gender_eligibility = 'boys'
WHERE name IN ('Cricket', 'Football', 'Volleyball', 'Relay', 'Kabaddi');

-- Girls Only Events
UPDATE sports\nSET gender_eligibility = 'girls'
WHERE name IN ('Gully Cricket');
```

### 3.5 API Endpoints Updates

#### 3.5.1 GET /sports/list (Updated)
Get all sports with gender eligibility\n
Response:
```json
{\n  \"pre_events\": [
    {
      \"id\": \"uuid\",
      \"name\": \"Push Ups\",
      \"icon_url\": \"path/to/icon.svg\",
      \"is_pre_event\": true,
      \"pre_event_dates\": \"17-18 January 2026\",
      \"gender_eligibility\": \"both\",
      \"status\": \"live\"
    },
    {
      \"id\": \"uuid\",
      \"name\": \"7 Stones\",
      \"icon_url\": \"path/to/icon.svg\",
      \"is_pre_event\": true,
      \"pre_event_dates\": \"17-18 January 2026\",\n      \"gender_eligibility\": \"both\",
      \"status\": \"live\"\n    },
    {
      \"id\": \"uuid\",\n      \"name\": \"Gully Cricket\",
      \"icon_url\": \"path/to/icon.svg\",\n      \"is_pre_event\": true,
      \"pre_event_dates\": \"17-18 January 2026\",\n      \"gender_eligibility\": \"girls\",
      \"status\": \"live\"
    }
  ],
  \"main_events\": [
    {
      \"id\": \"uuid\",
      \"name\": \"Football\",
      \"icon_url\": \"path/to/icon.svg\",
      \"is_pre_event\": false,
      \"gender_eligibility\": \"boys\",
      \"status\": \"live\"
    },\n    {
      \"id\": \"uuid\",
      \"name\": \"Table Tennis\",
      \"icon_url\": \"path/to/icon.svg\",
      \"is_pre_event\": false,
      \"gender_eligibility\": \"both\",
      \"status\": \"live\"
    }
  ]
}
```
\n### 3.6 Frontend Implementation

#### 3.6.1 Component Structure (React Example)
```jsx
import { User, Users } from 'lucide-react';

const GenderIcons = ({ genderEligibility }) => {\n  const renderIcons = () => {
    switch (genderEligibility) {
      case 'boys':
        return (
          <div className=\"gender-icon\" title=\"Boys Only\">
            <User size={22} color=\"#2196F3\" />
          </div>
        );
      case 'girls':
        return (
          <div className=\"gender-icon\" title=\"Girls Only\">
            <User size={22} color=\"#E91E63\" />
          </div>
        );
      case 'both':
        return (
          <div className=\"gender-icons-container\" title=\"Boys & Girls\">
            <User size={22} color=\"#2196F3\" />
            <User size={22} color=\"#E91E63\" />\n          </div>
        );
      default:
        return null;
    }
  };

  return <div className=\"gender-indicator\">{renderIcons()}</div>;
};
\nconst SportCard = ({ sport, isPreEvent }) => {
  return (
    <div className=\"sport-card\">
      {isPreEvent && (
        <div className=\"yellow-bookmark\">
          <BookmarkIcon size={24} color=\"#FFC107\" />
        </div>
      )}
      <img src={sport.icon_url} alt={`${sport.name} icon`} className=\"sport-icon\" />\n      <h4 className=\"sport-name\">{sport.name}</h4>
      {isPreEvent && (
        <span className=\"pre-event-badge\">Pre-Event</span>
      )}
      <GenderIcons genderEligibility={sport.gender_eligibility} />
    </div>
  );
};\n```

#### 3.6.2 CSS Styling\n```css
.sport-card {
  position: relative;
  background: rgba(255, 255, 255, 0.08);
  border-radius: 16px;
  padding: 24px;
  text-align: center;
  transition: all 0.3s ease;
  min-height: 200px;
}\n
.sport-card:hover {
  transform: scale(1.05);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
}

.gender-indicator {
  position: absolute;
  bottom: 12px;
  right: 12px;
  display: flex;
  align-items: center;
  gap: 8px;
  z-index: 5;
}

.gender-icon {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  padding: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.gender-icon:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: scale(1.1);
}

.gender-icons-container {
  display: flex;
  gap: 6px;
  align-items: center;
}\n
.gender-icons-container .gender-icon {\n  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  padding: 6px;
}\n
/* Tooltip styling */
.gender-indicator [title]:hover::after {
  content: attr(title);
  position: absolute;
  bottom: 100%;
  right: 0;
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 6px 10px;
  border-radius: 4px;
  font-size: 12px;
  white-space: nowrap;
  margin-bottom: 8px;
  z-index: 100;
}
```
\n### 3.7 Registration Validation

#### 3.7.1 Gender-Based Registration Rules
- Users must provide gender information during registration
- System validates gender eligibility before allowing event registration
- Boys can only register for Boys Only and Boys & Girls events
- Girls can only register for Girls Only and Boys & Girls events
\n#### 3.7.2 Validation Logic
```javascript
const validateGenderEligibility = (userGender, sportGenderEligibility) => {
  if (sportGenderEligibility === 'both') {
    return true;
  }
  if (sportGenderEligibility === 'boys' && userGender === 'male') {
    return true;\n  }
  if (sportGenderEligibility === 'girls' && userGender === 'female') {
    return true;
  }
  return false;
};
```

#### 3.7.3 Error Messages
- Boys attempting to register for Girls Only events: This event is only open to female participants.\n- Girls attempting to register for Boys Only events: This event is only open to male participants.
\n### 3.8 Admin/Secretary Management

#### 3.8.1 Gender Eligibility Management
- Admins and Secretaries can set gender eligibility for each sport
- Gender eligibility can be changed in sport edit form
- Gender eligibility options: Boys Only, Girls Only, Boys & Girls

#### 3.8.2 Sport Edit Form Update
```\nExisting fields:
- Sport Name
- Sport Icon\n- Rules & Guidelines
- Is Pre-Event (checkbox)
- Pre-Event Dates (text input)
\nNew field:
- Gender Eligibility (dropdown)
  Options:\n  - Boys & Girls (default)
  - Boys Only
  - Girls Only
```

#### 3.8.3 Validation\n- Gender Eligibility is required field
- Default value: Boys & Girls
- Cannot be left empty
\n### 3.9 Filtering and Search

#### 3.9.1 Gender Filter (Optional Enhancement)
- Add filter dropdown: All Events, Boys Events, Girls Events, Co-ed Events
- Filter updates sport card display dynamically
- Filter persists across page navigation

#### 3.9.2 Filter Logic
```javascript
const filterSportsByGender = (sports, filterValue) => {
  switch (filterValue) {
    case 'boys':
      return sports.filter(sport => \n        sport.gender_eligibility === 'boys' || sport.gender_eligibility === 'both'
      );
    case 'girls':
      return sports.filter(sport => \n        sport.gender_eligibility === 'girls' || sport.gender_eligibility === 'both'
      );
    case 'coed':
      return sports.filter(sport => sport.gender_eligibility === 'both');
    default:
      return sports;
  }\n};
```
\n### 3.10 Accessibility\n
#### 3.10.1 ARIA Labels
- Add aria-label to gender icons: Boys Only, Girls Only, or Boys & Girls
- Add aria-label to gender indicator container: Gender eligibility: [value]
- Ensure screen readers announce gender eligibility\n
#### 3.10.2 Screen Reader Support
- Gender eligibility announced when sport card is focused
- Gender icons have descriptive alt text
- Tooltip content accessible to screen readers

#### 3.10.3 Keyboard Navigation
- Gender icons do not interfere with keyboard navigation
- Focus indicators visible on sport cards
- Tab order follows visual order

### 3.11 Mobile Responsiveness

#### 3.11.1 Mobile Layout Adjustments
- Gender icons remain visible on mobile\n- Icon size may reduce to 18-20px on small screens
- Icons maintain bottom-right position
- Touch targets meet minimum size requirements (44x44px)

#### 3.11.2 Mobile CSS
```css
@media (max-width: 767px) {
  .gender-indicator {
    bottom: 10px;
    right: 10px;
  }
  \n  .gender-icon {
    padding: 4px;
  }
  
  .gender-icons-container {
    gap: 4px;
  }
}
```

## 4. Pre-Events Display System (Existing - No Changes)

### 4.1 Pre-Events Section Overview

#### 4.1.1 Purpose
- Highlight pre-events that take place before main carnival events
- Clearly distinguish pre-events from main events
- Provide date information for pre-events
- Enable early registration for pre-events
\n#### 4.1.2 Pre-Events Definition
- Pre-events are sports/activities that occur on 17 and 18 January 2026\n- Pre-events: Push Ups, 7 Stones, Gully Cricket
- Pre-events appear BEFORE main events on homepage
- Pre-events are flagged with yellow bookmark icon

### 4.2 Pre-Events Section Layout

#### 4.2.1 Section Position
- Position: After Choose Your Sport heading, BEFORE main events grid
- Separate section with distinct visual treatment
- Clear separation from main events section

#### 4.2.2 Section Header
- Section title: Pre-Events or Upcoming Pre-Events
- Title styling:\n  - Font size: 28-32px
  - Font weight: Bold
  - Color: White (#FFFFFF)
  - Text alignment: Left or Center
  - Margin bottom: 16px

#### 4.2.3 Legend/Info Banner
- Display above pre-events grid
- Content: Pre-events will take place on 17 and 18 January 2026
- Banner styling:
  - Background: Semi-transparent yellow/orange rgba(255, 193, 7, 0.15)
  - Border: 1px solid rgba(255, 193, 7, 0.3)
  - Border-radius: 8px
  - Padding: 12px 20px
  - Font size: 14-16px
  - Color: Light yellow/white (#FFF9C4 or #FFFFFF)
  - Icon: Calendar icon or info icon (optional)
  - Margin bottom: 24px

### 4.3 Pre-Event Card Design

#### 4.3.1 Yellow Bookmark Flag
- Position: Top-right corner of sport card
- Icon: Bookmark icon (filled) from Lucide React or similar
- Color: Yellow (#FFC107 or #FFD54F)
- Size: 24-28px
- Background: Optional semi-transparent dark background for contrast
- Z-index: Higher than card content to appear on top
- Tooltip on hover: Pre-Event (optional)

#### 4.3.2 Card Structure
- Same card structure as main events
- Sport icon at top
- Sport name below icon
- Yellow bookmark flag in top-right corner
- Gender icons in bottom-right corner (NEW)
- Optional: Pre-Event badge below sport name
\n#### 4.3.3 Pre-Event Badge (Optional)
- Text: Pre-Event or Early Event
- Position: Below sport name, above description (if any)
- Background: Yellow gradient (#FFC107 to #FFD54F)
- Text color: Dark navy or black (high contrast)
- Font size: 12px
- Font weight: 600
- Padding: 4px 12px
- Border-radius: 12px (pill shape)
- Display: Inline-block\n- Margin top: 8px

#### 4.3.4 Card Hover Effects
- Same hover effects as main event cards
- Scale up slightly: transform: scale(1.05)
- Increase shadow intensity\n- Transition: all 0.3s ease
- Yellow bookmark may pulse or glow on hover (optional)

### 4.4 Pre-Events Grid Layout

#### 4.4.1 Desktop Layout (≥1024px)
- Display: Grid\n- Grid columns: 3 (3 pre-events in a row)
- Gap: 24-32px between cards
- Max-width: 1200px\n- Margin: 0 auto (centered)
- Padding: 0 20px

#### 4.4.2 Tablet Layout (768px - 1023px)
- Grid columns: 3 (may wrap to 2+1 on smaller tablets)
- Gap: 20px between cards
- Padding: 0 20px

#### 4.4.3 Mobile Layout (<768px)
- Grid columns: 1 or 2 (depending on screen width)
- Gap: 16px between cards
- Padding: 0 15px
- Cards stack vertically or 2 per row

### 4.5 Main Events Section (Updated)

#### 4.5.1 Section Header
- Section title: Main Events or All Sports
- Title styling: Same as pre-events section
- Position: Below pre-events section
- Margin top: 60-80px (clear separation from pre-events)

#### 4.5.2 Main Events Grid
- Same grid layout as before
- No yellow bookmark flags
- No pre-event badges
- Standard sport cards with gender icons (NEW)
\n### 4.6 Visual Hierarchy

#### 4.6.1 Section Order (Top to Bottom)
```
1. Choose Your Sport heading
2. Points Distribution System Section (NEW)
3. Pre-Events section
   - Legend/Info banner (17-18 January 2026)
   - Pre-events grid (Push Ups, 7 Stones, Gully Cricket)
4. Main Events section
   - Main events grid (Football, Basketball, Cricket, etc.)
```

#### 4.6.2 Visual Distinction
- Pre-events section has yellow/orange accent color theme
- Main events section maintains existing color theme
- Clear spacing between sections (60-80px)
- Legend banner provides context for pre-events
- Yellow bookmark flags provide instant visual identification
- Gender icons provide instant gender eligibility identification (NEW)

### 4.7 Database Schema Updates

#### 4.7.1 Sports Table Update
```sql
ALTER TABLE sports\nADD COLUMN is_pre_event BOOLEAN DEFAULT FALSE,
ADD COLUMN pre_event_dates VARCHAR(100) NULL;\n\nCREATE INDEX idx_sports_is_pre_event ON sports(is_pre_event);
```

#### 4.7.2 Pre-Event Data Population
```sql
UPDATE sports
SET is_pre_event = TRUE,
    pre_event_dates = '17-18 January 2026'\nWHERE name IN ('Push Ups', '7 Stones', 'Gully Cricket');
```

### 4.8 API Endpoints Updates

#### 4.8.1 GET /sports/list (Updated)
Get all sports with pre-event flag and gender eligibility

Response:
```json
{\n  \"pre_events\": [
    {
      \"id\": \"uuid\",
      \"name\": \"Push Ups\",\n      \"icon_url\": \"path/to/icon.svg\",
      \"is_pre_event\": true,
      \"pre_event_dates\": \"17-18 January 2026\",
      \"gender_eligibility\": \"both\",
      \"status\": \"live\"
    },
    {
      \"id\": \"uuid\",
      \"name\": \"7 Stones\",
      \"icon_url\": \"path/to/icon.svg\",
      \"is_pre_event\": true,
      \"pre_event_dates\": \"17-18 January 2026\",\n      \"gender_eligibility\": \"both\",
      \"status\": \"live\"\n    },
    {\n      \"id\": \"uuid\",
      \"name\": \"Gully Cricket\",
      \"icon_url\": \"path/to/icon.svg\",
      \"is_pre_event\": true,
      \"pre_event_dates\": \"17-18 January 2026\",
      \"gender_eligibility\": \"girls\",
      \"status\": \"live\"
    }
  ],
  \"main_events\": [
    {
      \"id\": \"uuid\",
      \"name\": \"Football\",
      \"icon_url\": \"path/to/icon.svg\",
      \"is_pre_event\": false,
      \"gender_eligibility\": \"boys\",
      \"status\": \"live\"
    }
  ]
}
```

### 4.9 Frontend Implementation

#### 4.9.1 Component Structure (React Example)
```jsx
const SportsSection = () => {
  const [preEvents, setPreEvents] = useState([]);
  const [mainEvents, setMainEvents] = useState([]);
\n  useEffect(() => {\n    fetchSports();
  }, []);

  const fetchSports = async () => {
    const response = await fetch('/api/sports/list');
    const data = await response.json();
    setPreEvents(data.pre_events);
    setMainEvents(data.main_events);
  };

  return (
    <div className=\"sports-section\">
      <h2 className=\"section-title\">Choose Your Sport</h2>
      
      {/* Points Distribution System Section */}
      <PointsSystemSection />
      
      {/* Pre-Events Section */}
      {preEvents.length > 0 && (
        <div className=\"pre-events-section\">\n          <h3 className=\"pre-events-title\">Pre-Events</h3>
          <div className=\"pre-events-legend\">
            📅 Pre-events will take place on 17 and 18 January 2026
          </div>
          <div className=\"pre-events-grid\">
            {preEvents.map(sport => (
              <SportCard key={sport.id} sport={sport} isPreEvent={true} />
            ))}
          </div>\n        </div>
      )}
      
      {/* Main Events Section */}
      <div className=\"main-events-section\">
        <h3 className=\"main-events-title\">Main Events</h3>
        <div className=\"main-events-grid\">
          {mainEvents.map(sport => (
            <SportCard key={sport.id} sport={sport} isPreEvent={false} />
          ))}
        </div>
      </div>
    </div>
  );
};\n\nconst SportCard = ({ sport, isPreEvent }) => {
  return (
    <div className=\"sport-card\">
      {isPreEvent && (
        <div className=\"yellow-bookmark\">
          <BookmarkIcon size={24} color=\"#FFC107\" />\n        </div>
      )}
      <img src={sport.icon_url} alt={`${sport.name} icon`} className=\"sport-icon\" />\n      <h4 className=\"sport-name\">{sport.name}</h4>
      {isPreEvent && (
        <span className=\"pre-event-badge\">Pre-Event</span>
      )}\n      <GenderIcons genderEligibility={sport.gender_eligibility} />
    </div>
  );
};
```

#### 4.9.2 CSS Styling\n```css
.pre-events-section {
  margin-bottom: 80px;
}\n
.pre-events-title {
  font-size: 32px;
  font-weight: bold;
  color: #FFFFFF;
  margin-bottom: 16px;
}

.pre-events-legend {
  background: rgba(255, 193, 7, 0.15);
  border: 1px solid rgba(255, 193, 7, 0.3);
  border-radius: 8px;
  padding: 12px 20px;
  font-size: 16px;
  color: #FFFFFF;
  margin-bottom: 24px;
  display: flex;
  align-items: center;
  gap: 8px;
}
\n.pre-events-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 32px;
}

.sport-card {
  position: relative;
  background: rgba(255, 255, 255, 0.08);
  border-radius: 16px;
  padding: 24px;
  text-align: center;
  transition: all 0.3s ease;
  min-height: 200px;
}\n
.sport-card:hover {
  transform: scale(1.05);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
}

.yellow-bookmark {
  position: absolute;
  top: 12px;
  right: 12px;
  z-index: 10;
}\n
.pre-event-badge {
  display: inline-block;
  background: linear-gradient(135deg, #FFC107, #FFD54F);
  color: #1a1f2e;
  font-size: 12px;
  font-weight: 600;
  padding: 4px 12px;
  border-radius: 12px;
  margin-top: 8px;
}\n
.main-events-section {
  margin-top: 80px;
}

.main-events-title {
  font-size: 32px;
  font-weight: bold;
  color: #FFFFFF;
  margin-bottom: 24px;
}

.main-events-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 32px;
}\n\n@media (max-width: 1023px) {
  .pre-events-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;
  }
  
  .main-events-grid {
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;
  }
}\n\n@media (max-width: 767px) {
  .pre-events-grid {\n    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
  }
  
  .main-events-grid {
    grid-template-columns: repeat(2, 1fr);\n    gap: 16px;\n  }
  
  .pre-events-title,
  .main-events-title {
    font-size: 24px;
  }
  
  .pre-events-legend {
    font-size: 14px;
    padding: 10px 16px;
  }
}
```
\n### 4.10 Accessibility\n
#### 4.10.1 ARIA Labels
- Add aria-label to yellow bookmark icon: Pre-event indicator
- Add aria-label to pre-events section: Pre-events section - Events on 17-18 January 2026
- Add aria-label to main events section: Main events section\n
#### 4.10.2 Screen Reader Support
- Ensure pre-event status is announced by screen readers
- Legend banner content is readable by screen readers
- Yellow bookmark has descriptive alt text

#### 4.10.3 Keyboard Navigation
- All sport cards are keyboard accessible
- Tab order follows visual order (pre-events first, then main events)
- Focus indicators visible on all interactive elements

### 4.11 Performance Optimization

#### 4.11.1 Lazy Loading\n- Lazy load sport icons for both pre-events and main events
- Prioritize loading pre-events section first
- Use intersection observer for main events section

#### 4.11.2 Caching
- Cache sports list API response
- Cache sport icons\n- Implement service worker for offline support (optional)

### 4.12 Admin/Secretary Management

#### 4.12.1 Pre-Event Flag Management
- Admins and Secretaries can mark sports as pre-events
- Admins and Secretaries can set pre-event dates
- Pre-event flag can be toggled in sport edit form

#### 4.12.2 Sport Edit Form Update
```\nExisting fields:
- Sport Name
- Sport Icon
- Rules & Guidelines
\nNew fields:
- Is Pre-Event (checkbox)
- Pre-Event Dates (text input, visible only if Is Pre-Event is checked)
- Gender Eligibility (dropdown)
```

#### 4.12.3 Validation
- If Is Pre-Event is checked, Pre-Event Dates is required
- Pre-Event Dates format: DD-DD Month YYYY (e.g., 17-18 January 2026)
- Pre-Event Dates validation: Must be valid date range

## 5. 7 Stones Sport Addition (Existing - No Changes)

### 5.1 Sport Details\n- Sport Name: 7 Stones\n- Alternative Names: Lagori, Pithu, Seven Stones
- Category: Traditional Indian sport
- Type: Team sport
- Pre-Event: Yes
- Pre-Event Dates: 17-18 January 2026
- Gender Eligibility: Boys & Girls (NEW)
\n### 5.2 Icon Design Guidelines
- Primary element: Stack of 7 flat stones
- Style: Simplified stone stack silhouette
- Alternative: Stones with ball\n- Color scheme: Monochrome white on light icy blue background (#B9CFDF)
- Background: Circular or rounded square container
- Line weight: Consistent with other sport icons
- Simplicity: Maximum 3-4 key elements

### 5.3 Database Entry
```sql
INSERT INTO sports (name, icon_url, rules, status, is_pre_event, pre_event_dates, gender_eligibility)\nVALUES (
  '7 Stones',
  'path/to/7-stones-icon.svg',\n  'Traditional Indian sport where teams throw a ball to knock down a pile of stones and then try to restore the pile while the opposing team throws the ball at them.',
  'live',
  TRUE,
  '17-18 January 2026',
  'both'
);
```

## 6. Updated Sports List Summary

### 6.1 Pre-Events (3 sports)
1. Push Ups - Pre-Event (17-18 January 2026) - Boys & Girls
2. 7 Stones - Pre-Event (17-18 January 2026) - Boys & Girls
3. Gully Cricket - Pre-Event (17-18 January 2026) - Girls Only

### 6.2 Main Events\n\n**Boys & Girls Events (8 sports):**
1. Table Tennis\n2. Chess
3. Carrom
4. Badminton
5. Tug of War
6. Shotput
7. 100m\n8. Dodgeball

**Boys Only Events (5 sports):**
1. Cricket
2. Football
3. Volleyball
4. Relay\n5. Kabaddi

**Girls Only Events (1 sport):**
1. Gully Cricket (also listed as pre-event)

**Other Events (Gender classification TBD):**
1. Basketball
2. Tennis
3. Swimming
4. Athletics/Track & Field (other than 100m)
5. [Any other existing sports not explicitly mentioned]

## 7. Final Validation Checklist (Updated)

**Points Distribution System Section:**
- [ ] Points system section created and positioned above gender key section
- [ ] Section displays three categories: Boys Only Events, Boys & Girls Events, Special Events
- [ ] Boys Only Events points: Winner 20, Runner-up 14\n- [ ] Boys & Girls Events points: Winner 10, Runner-up 7
- [ ] Special Events (100m, Shot Put, Relay) points: 1st 14, 2nd 10, 3rd 7
- [ ] Section header displays correctly: POINTS DISTRIBUTION SYSTEM
- [ ] Section header: 20-24px font, bold, white, centered
- [ ] Container background: Semi-transparent gradient or solid color
- [ ] Container border: 1px solid rgba(255, 255, 255, 0.2)
- [ ] Container border-radius: 12px
- [ ] Container padding: 24px 32px
- [ ] Container max-width: 900px, centered
- [ ] Container margin-bottom: 32px
- [ ] Trophy icons display correctly for each category
- [ ] Category titles: 16-18px font, 600 weight, yellow/white color
- [ ] Points details: 14-16px font, 400 weight, light gray/white color
- [ ] Divider lines between categories (optional)
- [ ] Responsive design works on desktop (900px max-width)
- [ ] Responsive design works on tablet (90% width, reduced padding)
- [ ] Responsive design works on mobile (95% width, reduced font sizes)
- [ ] Section positioned correctly in page structure
- [ ] Section does not interfere with existing sections
- [ ] ARIA labels added for accessibility
- [ ] Screen reader support implemented
- [ ] Content is static and hardcoded in frontend
- [ ] No database changes required for points system
- [ ] Visual consistency with existing design maintained
\n**Gender-Specific Event System:**
- [ ] Database sports table updated with gender_eligibility column
- [ ] Gender eligibility constraint check added (boys/girls/both)
- [ ] Index created on gender_eligibility column
- [ ] Table Tennis marked as Boys & Girls in database
- [ ] Chess marked as Boys & Girls in database
- [ ] Carrom marked as Boys & Girls in database
- [ ] Badminton marked as Boys & Girls in database
- [ ] Tug of War marked as Boys & Girls in database
- [ ] Shotput marked as Boys & Girls in database
- [ ] 100m marked as Boys & Girls in database
- [ ] Dodgeball marked as Boys & Girls in database
- [ ] 7 Stones marked as Boys & Girls in database
- [ ] Cricket marked as Boys Only in database
- [ ] Football marked as Boys Only in database
- [ ] Volleyball marked as Boys Only in database
- [ ] Relay marked as Boys Only in database
- [ ] Kabaddi marked as Boys Only in database\n- [ ] Gully Cricket marked as Girls Only in database
- [ ] Gender icons appear in bottom-right corner of all sport cards
- [ ] Boys icon displays correctly (blue color #2196F3)
- [ ] Girls icon displays correctly (pink color #E91E63)
- [ ] Both icons display correctly for Boys & Girls events
- [ ] Gender icons size: 20-24px
- [ ] Gender icons have optional semi-transparent white background
- [ ] Gender icons have 12px margin from bottom and right
- [ ] Gender icons z-index higher than card content
- [ ] Gender icon tooltips display on hover
- [ ] Boys Only tooltip displays correctly
- [ ] Girls Only tooltip displays correctly
- [ ] Boys & Girls tooltip displays correctly
- [ ] Tooltip styling: rgba(0, 0, 0, 0.8) background, white text, 12px font
- [ ] Gender icons do not overlap with other card elements
- [ ] Gender icons visible on both pre-event and main event cards
- [ ] API endpoint returns gender_eligibility for all sports
- [ ] Frontend displays gender icons based on gender_eligibility value
- [ ] Gender icons responsive on mobile (18-20px size)
- [ ] Gender icons maintain position on mobile (bottom-right)
- [ ] Touch targets meet minimum size (44x44px) on mobile
- [ ] Registration validation checks gender eligibility
- [ ] Boys cannot register for Girls Only events
- [ ] Girls cannot register for Boys Only events
- [ ] Both genders can register for Boys & Girls events
- [ ] Error messages display correctly for invalid registrations
- [ ] Admin/Secretary can set gender eligibility in sport edit form
- [ ] Gender eligibility dropdown has 3 options: Boys & Girls, Boys Only, Girls Only\n- [ ] Gender eligibility default value: Boys & Girls
- [ ] Gender eligibility validation works correctly
- [ ] ARIA labels added for gender icons
- [ ] Screen reader support for gender eligibility
- [ ] Keyboard navigation works with gender icons
- [ ] Gender filter functionality works (optional enhancement)
- [ ] Gender icons display correctly in all browsers
- [ ] Gender icons display correctly on all screen sizes
\n**Pre-Events Display System:**
- [ ] Pre-events section appears BEFORE main events section
- [ ] Pre-events section positioned after Choose Your Sport heading
- [ ] Pre-events section has distinct visual treatment
- [ ] Section header displays: Pre-Events or Upcoming Pre-Events
- [ ] Section header: 28-32px, bold, white, left/center aligned
- [ ] Legend banner displays: Pre-events will take place on 17 and 18 January 2026\n- [ ] Legend banner: Yellow/orange background rgba(255, 193, 7, 0.15)
- [ ] Legend banner: 1px border rgba(255, 193, 7, 0.3)
- [ ] Legend banner: 8px border-radius, 12px 20px padding
- [ ] Legend banner: 14-16px font size, light yellow/white color
- [ ] Legend banner: 24px margin-bottom
- [ ] Yellow bookmark flag appears on all pre-event cards
- [ ] Yellow bookmark position: Top-right corner of card
- [ ] Yellow bookmark icon: Bookmark (filled), 24-28px size
- [ ] Yellow bookmark color: Yellow (#FFC107 or #FFD54F)
- [ ] Yellow bookmark z-index higher than card content
- [ ] Pre-event badge displays below sport name (optional)
- [ ] Pre-event badge: Pre-Event or Early Event text
- [ ] Pre-event badge: Yellow gradient background (#FFC107 to #FFD54F)
- [ ] Pre-event badge: Dark navy/black text, 12px font, 600 weight
- [ ] Pre-event badge: 4px 12px padding, 12px border-radius
- [ ] Pre-events grid: 3 columns on desktop\n- [ ] Pre-events grid: 24-32px gap between cards
- [ ] Pre-events grid: Max-width 1200px, centered
- [ ] Pre-events grid: 2 columns on tablet, 1-2 columns on mobile
- [ ] Main events section appears AFTER pre-events section\n- [ ] Main events section: 60-80px margin-top (clear separation)
- [ ] Main events section header: Main Events or All Sports
- [ ] Main events have NO yellow bookmark flags
- [ ] Main events have NO pre-event badges
- [ ] Visual hierarchy clear: Pre-events → Main events\n- [ ] Yellow/orange accent color theme for pre-events section
- [ ] Existing color theme maintained for main events section
- [ ] Database sports table updated with is_pre_event column
- [ ] Database sports table updated with pre_event_dates column
- [ ] Push Ups marked as pre-event in database
- [ ] 7 Stones marked as pre-event in database
- [ ] Gully Cricket marked as pre-event in database
- [ ] API endpoint returns pre_events and main_events separately
- [ ] Frontend displays pre-events section before main events
- [ ] Frontend displays yellow bookmark on pre-event cards
- [ ] Frontend displays legend banner with correct dates
- [ ] Hover effects work on pre-event cards
- [ ] Hover effects work on main event cards
- [ ] Responsive layout works correctly on all screen sizes
- [ ] ARIA labels added for accessibility
- [ ] Screen reader support for pre-event status
- [ ] Keyboard navigation works correctly
- [ ] Lazy loading implemented for sport icons
- [ ] Admin/Secretary can mark sports as pre-events
- [ ] Admin/Secretary can set pre-event dates
- [ ] Sport edit form includes Is Pre-Event checkbox
- [ ] Sport edit form includes Pre-Event Dates input
- [ ] Validation works for pre-event dates
\n**7 Stones Sport Addition:**
- [ ] 7 Stones sport added to database\n- [ ] 7 Stones icon created following design guidelines
- [ ] 7 Stones icon displays correctly on homepage
- [ ] 7 Stones marked as pre-event\n- [ ] 7 Stones pre-event dates set to 17-18 January 2026
- [ ] 7 Stones appears in pre-events section
- [ ] 7 Stones has yellow bookmark flag
- [ ] 7 Stones has Boys & Girls gender icons
- [ ] 7 Stones icon follows plain and simple design philosophy
- [ ] 7 Stones icon consistent with other sport icons
\n**All Existing Features (Unchanged):**
- [ ] All authentication features work correctly
- [ ] All role management features work correctly
- [ ] All sport creation and management features work correctly
- [ ] All voting and publishing features work correctly
- [ ] All event management features work correctly
- [ ] Original merchandise section works correctly
- [ ] Merchandise store section works correctly
- [ ] Footer credits section works correctly
- [ ] Delete user functionality works correctly
- [ ] Hero section (INVICTA header) works correctly
- [ ] All UI/UX features work correctly
- [ ] All security features work correctly
- [ ] Mobile responsiveness works correctly
- [ ] Performance meets requirements
\n---

**END OF REQUIREMENTS DOCUMENT**