# QwikBuild Design Schema & UI/UX Guide

## 1. OVERALL DESIGN PHILOSOPHY

**Brand Approach**: Modern, minimalist, accessibility-focused
- **Primary Goal**: Simplicity and clarity through conversation-first messaging
- **Target Audience**: Non-technical entrepreneurs, creators, small business owners
- **Key Principle**: "If you can talk, you can build" - voice-first simplicity

---

## 2. COLOR PALETTE

### Core Colors
| Color | Hex | Usage |
|-------|-----|-------|
| **Primary Teal** | `#32B8C6` or similar | CTAs, highlights, accent elements |
| **White/Off-White** | `#FFFFFF` / `#FAFAFA` | Background, cards, typography on dark |
| **Dark Charcoal** | `#1F2121` / `#262828` | Primary text, headings |
| **Light Gray** | `#F5F5F5` | Secondary backgrounds, borders |
| **Medium Gray** | `#A7A9A9` | Secondary text, muted elements |
| **Slate Blue** | `#134252` | Deep accents, text on light backgrounds |

### Gradient Usage
- **Line Gradients**: Horizontal gradient separators (white to light gray)
- **Background Gradients**: Subtle color transitions for section differentiation
- **Accent Gradients**: Multi-color spheres and decorative elements

### Color Psychology
- **Teal**: Trust, innovation, technology
- **Neutrals (White/Gray)**: Clean, professional, distraction-free
- **Dark Text**: High contrast, excellent readability

---

## 3. TYPOGRAPHY

### Font Families
| Style | Font | Usage |
|-------|------|-------|
| **Headings** | System font stack or modern sans-serif | H1, H2, H3, H4, H5 (likely `-apple-system`, `BlinkMacSystemFont`, `Segoe UI`, `Roboto`) |
| **Body Text** | Same system stack | Paragraph, lists, body copy |
| **Monospace** | `Monaco`, `Courier New` (if needed) | Code snippets, technical elements |

### Typography Hierarchy
```
H1 (Hero): ~48-56px, Bold/600, Line height 1.2
H2 (Section Title): ~32-40px, Semibold/600, Tight line height
H3 (Card Title): ~20-24px, Semibold/600
H4 (Small Title): ~16-18px, Semibold/600
Body: ~14-16px, Regular/400, Line height 1.5-1.6
Small Text: ~12-13px, Regular/400, Color: medium gray
```

### Key Typography Rules
- **High contrast**: Dark text on light backgrounds (4.5:1+ WCAG AA)
- **Generous spacing**: ~1.5x line height for readability
- **Tight headings**: 1.2x line height for visual hierarchy
- **Uppercase for emphasis**: Used sparingly in CTAs, badges

---

## 4. SPACING & LAYOUT

### Spacing System (8px base unit)
```
xs: 4px (2x base)
sm: 8px (1x base)
md: 16px (2x base)
lg: 24px (3x base)
xl: 32px (4x base)
2xl: 48px (6x base)
3xl: 64px (8x base)
4xl: 96px (12x base)
```

### Layout Grid
- **Max Width**: ~1200-1280px for desktop
- **Padding**: 16-32px on sides (responsive)
- **Gutter**: 16-24px between columns
- **Section Vertical Spacing**: 64-96px between major sections

### Responsive Breakpoints
```
Mobile: 375px - 480px
Tablet: 768px - 1024px
Desktop: 1280px+
```

### Container Structure
```html
.container (max-width: 1200px, margin: auto, padding: 0 16px-32px)
  .section-wrapper (padding: 64px 0 - 96px 0)
    .grid-2col / .grid-3col (gap: 16px-24px)
```

---

## 5. COMPONENTS & PATTERNS

### Navigation Bar
- **Background**: White or very light gray
- **Height**: 64-72px
- **Layout**: Logo left, Links center/right, Language selector + Login right
- **Link Color**: Dark text, hover → Teal accent
- **Mobile**: Hamburger menu, sticky positioning

### Hero Section
- **Layout**: Centered text + visual element (sphere, QR code)
- **Background**: White with subtle gradient overlay or animated background
- **Text Alignment**: Center
- **Main CTA**: Prominent teal button, 44-48px height
- **Supporting Elements**: Multicolor sphere graphic, animated clouds/decorative elements

### Feature Cards / Sections
- **Background**: White or light gray
- **Border**: Subtle 1px border or no border (shadow-based depth)
- **Padding**: 24-32px internal
- **Text**: Heading + 3-5 bullet points or descriptive text
- **Icons/Images**: Optional, positioned top or left

### Call-to-Action Buttons
- **Primary CTA**: 
  - Background: Teal (`#32B8C6`)
  - Text: White
  - Padding: 12-16px 32-48px
  - Border-radius: 6-8px
  - Font-weight: 600
  - Hover: Slightly darker teal
  - Shadow: Subtle (0 2px 8px rgba(50,184,198,0.15))

- **Secondary CTA**:
  - Background: Transparent or light gray
  - Border: 1px solid teal or gray
  - Text: Teal or dark text
  - Hover: Light gray background or border darkening

### Pricing Cards
- **Layout**: 4 columns (responsive to 2/1 on mobile/tablet)
- **Card Style**: White background, border, shadow on hover
- **Border Color**: Light gray or subtle teal on "Popular" card
- **Badge**: "Popular" label in teal background
- **Features List**: Bullet points, secondary text color
- **CTA**: Full-width or right-aligned button
- **Spacing**: 24px vertical gap between cards

### Testimonial/Success Story Section
- **Layout**: Carousel/slider with 3+ visible cards
- **Card Content**:
  - Quote (italicized, ~14-16px)
  - Author name (bold)
  - Company/Title (secondary color, smaller)
  - Avatar (optional, circular)
- **Navigation**: Previous/Next arrows
- **Spacing**: ~16-24px between cards

### Feature Grid (6 items)
- **Columns**: 3 on desktop, 2 on tablet, 1 on mobile
- **Content**: Icon + Title + Description
- **Card Style**: Minimal, centered text, icon above title
- **Hover Effect**: Subtle shadow or color shift

### FAQ Accordion
- **Style**: Expandable sections, no borders or minimal borders
- **Active State**: Section highlighted, chevron rotated
- **Text**: Question in bold, answer in regular gray
- **Spacing**: 12-16px padding per item

---

## 6. VISUAL ELEMENTS & DECORATIONS

### Gradient Line Dividers
- **Pattern**: Horizontal line that fades left and right
- **Usage**: Between major sections
- **Color**: Subtle gradient from white to light gray to white
- **Height**: 1-2px
- **Effect**: Psychological break between content blocks

### Multicolor Sphere/3D Elements
- **Purpose**: Decorative, adds visual interest and modernity
- **Placement**: 
  - Top section (animated, floating)
  - Middle of page (positioned absolutely, semi-transparent)
  - Bottom or side areas
- **Colors**: Mix of teal, purple, pink, gradient transitions
- **Effect**: Subtle animations (floating, rotation) on scroll

### Hero Graphic Elements
- **Clouds**: Animated SVG clouds in hero (very light opacity)
- **QR Code**: Displayed in hero for WhatsApp link
- **Images**: Product screenshots, user testimonials (rounded corners, subtle shadow)

### Hover Effects
- **Buttons**: Color shift, shadow increase, slight scale (1.02-1.05)
- **Links**: Underline or color change, smooth transition
- **Cards**: Shadow increase, slight scale, opacity changes
- **Transition**: 200-300ms duration, ease function

---

## 7. PAGE-BY-PAGE BREAKDOWN

### **Page 1: Hero / Landing**
```
1. Navigation Bar (sticky)
   - Logo + Links + Language + Login

2. Hero Section (full viewport or ~80vh)
   - Background: White with decorative elements
   - Left/Center: Heading + Subheading + CTA
   - Right/Center: Animated graphics (sphere, clouds)
   - Heading: "Idea to App in 7 minutes"
   - Subheading: "No tech skills needed!"

3. Funded By Section
   - Logos of investors (Curefood founder, Groww founder, etc.)
   - Text: "Funded by the best"
   - Layout: Horizontal scroll or grid

4. Trust Metric
   - "10000+ Trusted Business and Creators"
   - Typography: Large, bold, centered

5. Early Adopters Carousel
   - 3+ example apps built with QwikBuild
   - Each card: Image + Title + Link
   - Navigation: Previous/Next arrows
```

### **Page 2: Value Propositions (Section)**
```
1. Main Heading
   - "Go Beyond a Simple Website"
   - Secondary: "With QwikBuild, you're not just..."

2. Three Feature Cards (Grid)
   Card 1: Professional Websites & Apps
   - Icon/Image
   - 3 bullet points
   - CTA link or icon

   Card 2: Your App is a Living Conversation
   Card 3: Your Proactive AI Assistant

3. Section Divider (Gradient line)

4. Technology Principles Section
   - Heading: "Technology That Finally Understands You"
   - 6 Feature Cards:
     * Voice-First Simplicity
     * Build in Your Language
     * Edit with Conversation
     * Secure and Reliable
     * Bring Any Idea to Life
     * All-in-One Platform
   - Layout: 3 cols on desktop, responsive down
   - Each card: Title + Description (~40-60 chars)
```

### **Page 3: Success Stories**
```
1. Heading
   - "Real Success Stories"
   - Subheading: "See how QwikBuild is helping..."

2. Testimonial Carousel
   - Layout: Visible 3 cards with scrollable
   - Each Testimonial Card:
     * Quote (in quotes, italicized)
     * User Image/Avatar
     * Name (bold)
     * Title/Company (secondary color)
     * Project Type badge

3. Navigation
   - Previous/Next arrows
   - Dot indicators (optional)
```

### **Page 4: Use Cases (One Platform Section)**
```
1. Heading
   - "One Platform, Endless Possibilities"
   - Subheading: "From professional websites..."

2. 6 Use Case Cards (Grid)
   - Websites
   - AI Bots
   - eCommerce
   - Booking Systems
   - Event Invites
   - Payments
   - Layout: 3x2 grid, each with icon + title
   - Images: Behind each use case (woman, man photos)

3. Decorative Elements
   - Multicolor sphere positioned absolutely
```

### **Page 5: Demographics Section**
```
1. Heading
   - "Built for Every Creator"
   - Subheading: Description text

2. Visual Split
   - Left: Testimonial or image
   - Right: Benefits list or features
   - Symmetric or asymmetric layout
```

### **Page 6: Pricing**
```
1. Heading
   - "Simple Pricing for Modern Needs"

2. Toggle
   - "Monthly" / "Yearly (Save 25%)"
   - Toggle switch design

3. Pricing Cards (4 columns)
   - Free
   - Starter
   - Pro (marked "Popular")
   - Ultra
   - Each Card:
     * Plan name (bold, larger)
     * Price (huge, bold)
     * Billing period
     * Included features list
     * CTA button
     * Note: "₹X One-Time/Monthly Credit"

4. Features per plan displayed as checkmarks/bullets

5. Enterprise Section
   - Smaller card or banner
   - Heading + Description + CTA
```

### **Page 7: FAQ**
```
1. Heading
   - "Your Questions, Answered"
   - Subheading: "Everything you need to know..."

2. Accordion Items (8-10 questions)
   - Question title (clickable, bold)
   - Answer (hidden until expanded)
   - Chevron icon (rotating on expand)
   - Default: Some expanded, others collapsed

3. Layout
   - Single column or 2 columns on desktop
   - Max-width: ~900-1000px
   - Spacing: 12px between items
```

### **Page 8: Final CTA**
```
1. Heading
   - "Ready to Build Your Idea?"
   - Subheading: "Your next great idea is just a voice note away"

2. CTA Elements
   - Primary button "Start for Free"
   - Secondary: QR code for WhatsApp
   - Dark or light background (contrasting)
```

### **Footer**
```
1. Logo/Branding
2. Link Groups (3-4 columns)
   - Home, QwikBuilders, Founders, Pricing, Contact
   - Manifesto, Ethos, Blog, Privacy, T&C
3. Social Links
   - YouTube, Instagram, LinkedIn, X/Twitter, etc.
4. Copyright
   - "All rights reserved © Snowmountain AI Pvt. Ltd"
```

---

## 8. INTERACTION PATTERNS

### Scroll Animations
- **Fade-in on scroll**: Cards, sections appear as user scrolls
- **Parallax effect**: Decorative elements move at different speeds
- **Stagger effect**: Multiple elements animate in sequence

### Hover States
- **Buttons**: Darken, scale slightly, add shadow
- **Links**: Color shift to teal, underline appears
- **Cards**: Shadow increase, lift effect (translate -2px on Y-axis)

### Mobile Interactions
- **Touch-friendly**: Minimum 44px tap targets
- **Swipe navigation**: Carousel swipe support
- **Hamburger menu**: Slide-in from left
- **Sticky header**: Navigation stays at top

### Transitions
- **Default duration**: 200-300ms
- **Easing**: Cubic bezier (ease-in-out) or Spring-like easing
- **All properties**: Smooth transitions on color, transform, opacity

---

## 9. IMAGERY STYLE

### Photography
- **People**: Professional, diverse, approachable
- **Tone**: Modern, tech-forward but human
- **Style**: Clean backgrounds, good lighting, authentic expressions

### Illustrations
- **Style**: Modern, minimalist line-art or gradient-based
- **Purpose**: Explanation, visual breaks, engagement
- **Color**: Uses brand colors and extended palette

### Icons
- **Style**: Stroke-based, 24-48px size
- **Color**: Teal or dark gray depending on context
- **Weight**: 2px stroke

---

## 10. BRAND VOICE & MESSAGING

### Key Messaging Patterns
- **Voice-first emphasis**: "Just send a voice note"
- **Non-technical focus**: "No tech skills needed"
- **Speed emphasis**: "7 minutes", "Ready in Minutes, Not Months"
- **Empowerment**: "If you can talk, you can build"
- **Language diversity**: "Create in Hindi, Tamil, Bengali..."

### Text Patterns
- **Taglines**: Short, punchy, benefit-focused
- **Descriptions**: 1-2 sentences per feature
- **Lists**: 3-5 bullet points per section
- **CTAs**: Action-oriented, first-person benefit ("Get Started", "Start for Free", "Join")

---

## 11. TECHNICAL IMPLEMENTATION NOTES

### Performance
- **Lazy loading**: Images load as scrolled into view
- **Optimized graphics**: SVGs for icons/illustrations
- **Responsive images**: Different sizes for mobile/tablet/desktop

### Accessibility
- **Contrast ratio**: 4.5:1 for body text, 3:1 for large text
- **Focus states**: Visible keyboard navigation
- **Alt text**: Descriptive for all images
- **Semantic HTML**: Proper heading hierarchy, landmarks

### SEO
- **Meta tags**: Title, description for each page
- **Heading hierarchy**: H1 for page title, H2/H3 for sections
- **Structured data**: Schema markup for testimonials, pricing

---

## 12. COLOR VARIANTS BY CONTEXT

### Light Mode (Default)
- Background: White
- Text: Dark charcoal
- Accents: Teal

### Dark Mode (Optional)
- Background: Dark charcoal
- Text: Off-white/light gray
- Accents: Bright teal or lighter shade

---

## 13. QUICK REFERENCE CHECKLIST

- [ ] Navigation: Sticky, responsive, 64px height
- [ ] Hero: Full viewport, centered, with decorative elements
- [ ] Sections: 64-96px vertical padding
- [ ] Cards: White/light background, subtle borders/shadows
- [ ] CTAs: Teal background, white text, 12-16px padding
- [ ] Typography: System fonts, 1.5x line height for body
- [ ] Spacing: 8px base unit system
- [ ] Gradients: Line separators between sections
- [ ] Hover effects: 200-300ms transitions, scale + shadow
- [ ] Mobile: Touch-friendly, single column layout
- [ ] Carousel: Previous/Next navigation, smooth scroll
- [ ] Pricing: Toggle monthly/yearly, 4 visible columns
- [ ] Footer: 3-4 link columns, social media
- [ ] Colors: Teal primary, white/gray neutrals, dark text

---

## 14. DESIGN DECISION FRAMEWORK

### When to use which component:
- **Hero CTA**: Full-width button or side-by-side with image
- **Feature highlight**: Use 3-card grid, minimal text
- **Testimonial**: Use carousel, include quote + name + title
- **Pricing**: Use toggle + card grid
- **Navigation**: Use horizontal menu on desktop, hamburger on mobile
- **Dividers**: Use gradient lines for visual breaks
- **Spacing**: Always respect 8px grid

---

## 15. FILE STRUCTURE FOR IMPLEMENTATION

```
assets/
├── images/
│   ├── hero/
│   ├── testimonials/
│   ├── use-cases/
│   └── logos/
├── icons/
│   ├── features/
│   └── ui-icons/
├── svg/
│   ├── sphere.svg
│   ├── clouds.svg
│   └── gradients.svg
└── fonts/
    └── system-fonts (no files needed)

css/
├── reset.css
├── variables.css (colors, spacing, typography)
├── components.css (buttons, cards, modals)
├── layout.css (grid, flex, responsive)
├── animations.css (scroll effects, transitions)
└── responsive.css (media queries)

html/
├── index.html
├── pricing.html
├── about.html
└── contact.html

js/
├── carousel.js
├── animations.js
├── interactions.js
└── responsive-menu.js
```

---

## 16. NOTES FOR YOUR BUILD

**Critical Details to Replicate:**
1. The exact Teal color (`#32B8C6` or similar) for all primary actions
2. Gradient line separators between sections (white → light gray → white)
3. Multicolor sphere graphics (use SVG or CSS gradients)
4. System font stack for maximum performance
5. 8px grid system for consistent spacing
6. Smooth scroll behavior and lazy loading
7. Carousel with smooth transitions (Swiper.js or similar)
8. Mobile hamburger menu with smooth slide-in
9. Sticky navigation on scroll
10. WhatsApp link integration with QR code

**Tools Recommendation:**
- **Figma**: For design mockups and component library
- **Framer.com**: For interactive prototypes with animations
- **Next.js + Tailwind**: For fast, responsive implementation
- **Swiper.js**: For carousel/slider functionality
- **AOS.js**: For scroll animations
- **GSAP**: For complex animations

---

This schema should give you a complete blueprint to recreate the QwikBuild design system!