# Komal Kids — GTM-Aligned Site Architecture & Go-to-Market Map

## Product Context

Komal is the first psychology-informed "Talk-to-Play" platform for children and families. We don't just block apps; we build the social, emotional, and cognitive foundations children need to thrive in a digital world.

---

## Overall GTM Positioning Tree

```
Overall_Positioning
├── B2B
│   ├── Schools & Districts
│   │   ├── School Districts (IT procurement)
│   │   ├── Private School Networks
│   │   ├── Charter School Operators
│   │   ├── International School Groups (IB, CBSE, ICSE, GCSE)
│   │   ├── High Schools
│   │   └── Middle & Elementary Schools
│   ├── EdTech Partnerships
│   │   ├── LMS Platforms (Canvas, Google Classroom)
│   │   ├── Device Manufacturers (Chromebook OEMs, tablet brands)
│   │   ├── MDM Providers
│   │   ├── Browser Companies
│   │   ├── Kids Content Platforms
│   │   ├── After-School Platforms
│   │   └── Homeschool Platforms
│   ├── Healthcare & Clinical
│   │   ├── Pediatricians
│   │   ├── Child Psychiatrists
│   │   ├── Developmental Pediatricians
│   │   ├── School Counselors
│   │   ├── Clinical Psychologists
│   │   ├── Behavioral Therapists
│   │   ├── Occupational Therapists
│   │   ├── Speech Therapists
│   │   └── Autism Centers
│   ├── Government & Policy
│   │   ├── Ministry of Education
│   │   ├── Digital India Initiatives
│   │   ├── State Education Boards
│   │   ├── Child Protection Agencies
│   │   └── Public Health Departments
│   └── CSR Programs (large corporates)
│
├── B2B2C
│   ├── Insurance (digital mental health benefit add-on)
│   ├── Corporate HR (parent benefit)
│   ├── Employee Benefits Providers
│   ├── Therapy Networks
│   ├── Pediatric Hospital Networks
│   ├── NGOs in Child Safety
│   ├── Parenting Apps
│   └── Telehealth Platforms
│
├── B2C
│   ├── Parents by Age Segment
│   │   ├── Parents of 0-5 (Toddlers & Preschoolers)
│   │   ├── Parents of 6-10 (Early Elementary)
│   │   ├── Parents of 10-13 (Preteens)
│   │   ├── Parents of 13-16 (Teenagers)
│   │   └── Parents of 16+ (Older Teens)
│   ├── Specialty Parents
│   │   ├── High-Income / Tech Parents
│   │   ├── Autism / ADHD Parents
│   │   ├── Homeschool Parents
│   │   └── Grandparents
│   ├── Influencers & Community
│   │   ├── Family Influencers
│   │   ├── Mom Blogger Network
│   │   ├── Parenting YouTubers
│   │   ├── Reddit Communities
│   │   └── Indian WhatsApp Parent Groups
│   └── Paid Acquisition
│
├── Pioneer GTM (Community-Led Growth)
│   ├── Teen Ambassadors
│   ├── Student Councils
│   ├── Youth Policy Groups
│   ├── Digital Literacy Clubs
│   ├── Libraries
│   ├── Community Centers
│   ├── After-School Programs
│   ├── Tutoring Centers
│   ├── Religious Schools
│   └── Summer Camps
│
├── Authority Layer
│   ├── Pediatric Advisory Board
│   ├── School Partnerships
│   ├── Academic Collaborations
│   └── Published Studies
│
├── Content Engine
│   ├── SEO (pillar + blog content)
│   ├── Research Reports
│   ├── Whitepapers
│   ├── Age-Based Screen Time Data
│   └── Child Safety Index
│
├── Community Layer
│   ├── Parent Webinars
│   ├── Online Support Groups
│   ├── Slack / Discord for Parents
│   └── Offline Parent Meetups
│
├── Policy & Standards
│   ├── Policy Advocacy
│   ├── Standards Bodies
│   ├── Child Safety Certification
│   └── Digital Age Labeling Framework
│
├── International
│   ├── US GTM (COPPA)
│   ├── India GTM (DPDP)
│   ├── Canada GTM
│   ├── UK GTM (GDPR-K, Age Appropriate Design Code)
│   ├── Singapore GTM
│   └── UAE GTM
│
└── Monetization
    ├── B2C: Freemium → Pioneer ($19.99 lifetime w/ SUNSHINE50)
    ├── B2B Schools: Web filter ($2/student/yr) | Filter + SEL ($5) | SEL only ($3)
    ├── B2B Enterprise: Per-seat licensing
    └── Data Insights Layer (privacy-compliant, aggregated)
```

---

## Full Site Map

### Primary Navigation

```
/                           Homepage
/parents                    Parents Hub (landing)
  /parents/0-5              Parents of Children 0-5
  /parents/6-10             Parents of Children 6-10
  /parents/10-13            Parents of Children 10-13
  /parents/13-16            Parents of Children 13-16
  /parents/16-plus          Parents of Children 16+
/pioneer                    Pioneer Program (children + parents)
/for-schools                Educators & Schools
/for-clinics                Clinicians & Psychologists
/about-komal                About / Science
/pricing                    Pricing & Plans
/blog                       Resources (blog, guides, webinars)
/demo                       Book a Demo
```

### Secondary Pages

```
/why                        Philosophy / Manifesto
/team                       Team (E-E-A-T)
/safety-trust               Safety & Trust
/content-safety             Content Safety
/privacy-policy             Privacy Policy
/investors                  Investor Information
/ai-companion-for-kids      Category pillar page
/ambassadors                Legacy redirect → /pioneer
```

### Geo Pages

```
/geo/usa                    United States (COPPA)
/geo/india                  India (DPDP)
/geo/canada                 Canada
/geo/singapore              Singapore
/geo/uk                     United Kingdom (AADC)
/geo/uae                    UAE
```

### Blog / Content Hub

```
/blog                                         Blog listing
/blog/is-ai-safe-for-kids                     Main pillar
/blog/is-ai-safe-for-kids-parent              Parent persona
/blog/is-ai-safe-for-kids-educator            Educator persona
/blog/is-ai-safe-for-kids-tech                Tech persona
/blog/is-ai-safe-for-kids-trust               Trust & safety persona
/blog/is-ai-safe-for-kids-policy              Policy persona
/blog/what-is-digital-buddy-for-children      Digital buddy explainer
```

---

## Page-Level Architecture

### 1. Homepage `/`

- **Primary Objective**: Email signup / Start Free Trial
- **Primary Persona**: Any parent or educator discovering Komal for the first time
- **Core Anxiety**: "Is my child safe online? Am I doing enough?"
- **Core Aspiration**: "I want to guide, not spy on, my child"
- **SEO Themes**:
  - psychology-informed digital safety for kids
  - talk-to-play platform for children
  - alternative to parental control apps
  - child digital wellbeing platform
  - safe internet for kids without surveillance
  - ethical AI for children

### 2. Parents Hub `/parents`

- **Primary Objective**: Route to age-specific subpage; secondary: email signup
- **Primary Persona**: Parent actively researching screen time / digital safety solutions
- **Core Anxiety**: "Every child is different—I need something that fits MY child's age"
- **SEO Themes**:
  - parental controls without dark patterns
  - digital wellbeing for kids by age
  - screen time guidance for parents
  - child online safety by age group
  - psychology-based parental controls

### 3. Parents: Ages 0-5 `/parents/0-5`

- **Primary Objective**: Waitlist / Early Access signup
- **Primary Persona**: New parent (often first child), anxious about introducing screens
- **Core Anxiety**: "Should my toddler even be using screens? Am I damaging their development?"
- **SEO Themes**:
  - screen time for toddlers
  - digital play for ages 0-5
  - is screen time bad for toddlers
  - age-appropriate apps for preschoolers
  - healthy screen habits for young children

### 4. Parents: Ages 6-10 `/parents/6-10`

- **Primary Objective**: Start Free Trial
- **Primary Persona**: Parent of early-elementary child getting first device or more internet access
- **Core Anxiety**: "My child needs the internet for school, but I can't watch them every minute"
- **SEO Themes**:
  - online safety for 6-10 year olds
  - safe internet browsing for kids
  - screen time limits for elementary school kids
  - child-safe browser for kids
  - digital literacy for young children

### 5. Parents: Ages 10-13 `/parents/10-13`

- **Primary Objective**: Start Free Trial
- **Primary Persona**: Parent of preteen navigating social media pressure and growing independence
- **Core Anxiety**: "My child wants social media. Their friends all have it. How do I handle this?"
- **SEO Themes**:
  - preteens and social media safety
  - digital safety for tweens
  - online safety for 10-13 year olds
  - should my 11 year old have social media
  - preteen internet safety guide

### 6. Parents: Ages 13-16 `/parents/13-16`

- **Primary Objective**: Start Free Trial / Pioneer Program signup
- **Primary Persona**: Parent of teenager struggling with screen dependency, peer pressure, online risks
- **Core Anxiety**: "I'm losing control. They push back on every restriction. Are they safe?"
- **SEO Themes**:
  - digital wellbeing for teenagers
  - healthy phone habits for teens
  - teen online safety without surveillance
  - screen time for 13-16 year olds
  - how to talk to teens about internet safety

### 7. Parents: Ages 16+ `/parents/16-plus`

- **Primary Objective**: Pioneer Program signup / Share with teen
- **Primary Persona**: Parent of older teen preparing for independence; or the teen themselves
- **Core Anxiety**: "They're almost adults. I need to let go, but are they ready?"
- **SEO Themes**:
  - digital independence for older teens
  - preparing teens for safe internet use
  - digital citizenship for 16+
  - transitioning from parental controls
  - ethical AI literacy for young adults

### 8. Pioneer Program `/pioneer`

- **Primary Objective**: Apply with code SUNSHINE50
- **Primary Persona**: Motivated teen (13-18) or engaged parent who wants to co-lead
- **Core Aspiration**: "I want to be part of something meaningful. I want to lead, not just consume."
- **SEO Themes**:
  - youth digital leadership program
  - digital citizenship for teens
  - teen ambassador program digital wellbeing
  - student leadership opportunities online safety
  - ethical AI program for young people

### 9. Educators & Schools `/for-schools`

- **Primary Objective**: Book a Demo / Request Pilot
- **Primary Persona**: School IT director, principal, or counselor evaluating web filters / SEL tools
- **Core Anxiety**: "CIPA compliance + student safety + limited budget + teacher resistance"
- **SEO Themes**:
  - school web filter with SEL
  - CIPA compliant web filtering
  - student digital safety platform
  - SEL-aligned technology for schools
  - alternative to GoGuardian for schools

### 10. Clinicians & Psychologists `/for-clinics`

- **Primary Objective**: Partner / Refer patients
- **Primary Persona**: Pediatrician, child psychologist, or developmental therapist
- **Core Anxiety**: "I see screen-related behavioral issues daily but have no tools for between-session insight"
- **SEO Themes**:
  - digital wellbeing tool for pediatricians
  - child screen time assessment tool
  - between-session behavioral insights
  - child psychology digital safety referral
  - clinician tools for child digital health

---

## Monetization & Pricing Reference

### B2C

- **Freemium tier**: Core browsing safety features
- **Pioneer Program**: $19.99 lifetime (with SUNSHINE50), standard $39.99

### B2B Schools (per-student/year)

| Configuration              | Price Range           |
|----------------------------|-----------------------|
| Web filter only            | $2 / student / year   |
| Web filter + SEL add-on    | $5 / student / year   |
| SEL / mindfulness only     | $3 / student / year   |

Volume discounts above 5,000 students. Competitive with GoGuardian ($3-5), Lightspeed ($3-6), Securly ($4-7).

### Competitive Context (School Filters)

| Category                      | Examples                                              |
|-------------------------------|-------------------------------------------------------|
| Most-cited K-12 filters       | GoGuardian, Lightspeed, Securly, Linewize, Blocksi    |
| Growing AI-based filters      | Deledao ActiveScan                                    |
| General DNS/web filters       | Control D, Cloudflare Gateway, WebTitan               |

Typical district spend: $2-7/student/year for software license; $30-54/student total cost of ownership with infrastructure.

### Funding Context

- E-rate requires CIPA-compliant filtering
- Some districts bundle filtering into ISP contracts
- Device-level filtering (Komal's model) lowers total cost of ownership vs. network appliances

---

## Internal Linking Strategy

```
Homepage → Parents Hub → Age-specific pages
Homepage → Pioneer Program
Homepage → For Schools
Homepage → For Clinics
Parents Hub → Pioneer Program (for 13+ segments)
For Schools → Pricing (school licensing)
For Clinics → Demo
Pioneer Program → Parents Hub (for parent pioneers)
All pages → Blog (contextual links)
Blog → Relevant landing pages (SEO pillar strategy)
Age pages → Adjacent age pages (internal cross-linking)
All pages → GEO pages (where contextually relevant)
```

---

## GTM Funnel Tracking

Each page fires GTM events:
- `page_view` with segment tag (e.g., `parents_6-10`, `schools`, `pioneer`)
- `cta_click` with action type (e.g., `start_trial`, `book_demo`, `apply_pioneer`)
- `scroll_depth` at 25%, 50%, 75%, 100%
- `faq_expand` with question text

Route-level tracking examples:
- `/parents/6-10/assessment-started`
- `/pioneer/apply-started`
- `/for-schools/demo-requested`

---

## International SEO & GEO Hooks

### Core Markets

| Market     | Compliance        | School Types                    | Key Channels              |
|------------|-------------------|---------------------------------|---------------------------|
| US         | COPPA, CIPA, FERPA| Public, Charter, Private        | District IT, EdTech       |
| India      | DPDP              | CBSE, ICSE, IB, State Boards   | WhatsApp groups, CSR      |
| UK         | GDPR-K, AADC      | State, Academy, Independent     | Trusts, MATs              |
| Singapore  | PDPA              | MOE, International              | MOE partnerships          |
| Canada     | PIPEDA             | Public, Catholic, French        | Provincial boards         |
| UAE        | PDPL              | International, American, British| MOE, private groups       |

### Language

Write in global, simple English that can be easily localized. Organically reference "parents in India, the US, UK, Singapore, and the UAE" where contextually appropriate. Reference school types naturally (CBSE, IB, GCSE, US public/charter) without forced keyword insertion.

---

## B2B School Outreach Templates

### Pilot Program

- 4-6 weeks, small cohort (school chooses grades/classes)
- Quick setup: browser extension on Chromebooks/desktops
- End-of-pilot report: usage patterns, student feedback
- No cost for pilot participants
- Staff onboarding + parent-facing explainer provided
- Designed to complement existing digital citizenship / SEL efforts

### Deployment Options

1. **Web filter only** — CIPA-compliant blocking with three-tier system
2. **Web filter + SEL add-on** — Filtering + mindful browsing + classroom dashboards
3. **SEL / mindfulness only** — For districts with existing filters, adds peer-avatar guidance

---

## Pioneer GTM Channels

| Channel                | Description                                              |
|------------------------|----------------------------------------------------------|
| Teen Ambassadors       | Youth leaders who model digital wellbeing                |
| Student Councils       | Integrate Pioneer into existing leadership structures     |
| Youth Policy Groups    | Engage policy-minded teens                               |
| Digital Literacy Clubs | Complement technical programs with ethics/wellbeing      |
| Libraries              | Public spaces where families gather                      |
| Community Centers      | Local engagement, especially in underserved areas        |
| After-School Programs  | Extend digital wellbeing beyond the school day           |
| Tutoring Centers       | Complement academic support with digital safety          |
| Religious Schools      | Values-aligned digital citizenship                       |
| Summer Camps           | Seasonal engagement and onboarding                       |

---

## Clinical Referral Channels

| Specialty                       | Komal Value Prop                                       |
|---------------------------------|--------------------------------------------------------|
| Pediatricians                   | Screen time guidance with objective engagement data     |
| Child Psychiatrists             | Between-session behavioral pattern insights             |
| Developmental Pediatricians     | Longitudinal milestone tracking                         |
| School Counselors               | Aggregate student wellbeing patterns                    |
| Clinical Psychologists          | Emotional regulation trend data                         |
| Behavioral Therapists           | Self-regulation development tracking                    |
| Occupational Therapists         | Fine motor / attention engagement data                  |
| Speech Therapists               | Communication pattern observations                     |
| Autism Centers                  | Sensory engagement and routine pattern data             |

---

## B2B2C Distribution Partners

| Partner Type              | Integration Model                                      |
|---------------------------|--------------------------------------------------------|
| Insurance Companies       | Digital mental health benefit add-on                   |
| Corporate HR              | Parent employee benefit                                |
| Employee Benefits         | Wellness platform integration                          |
| Pediatric Hospital Networks| Clinical referral pathway                             |
| NGOs in Child Safety      | Co-branded programs                                    |
| Parenting Apps            | API integration / cross-referral                       |
| Telehealth Platforms      | Between-session insight sharing                        |

---

## Strategic Scale Additions

### Become Infrastructure, Not Just an App

- **Policy Advocacy**: Participate in child digital safety policy discussions
- **Standards Bodies**: Contribute to emerging standards for child-safe AI
- **Child Safety Certification**: Build toward becoming a certification authority
- **Digital Age Labeling Framework**: Create the standard for age-appropriate digital content

---

**Last updated**: February 2026
