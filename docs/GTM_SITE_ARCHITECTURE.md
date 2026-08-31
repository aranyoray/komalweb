# Komal Kids - GTM-Aligned Site Architecture

## Full Site Map

### Top-Level Navigation

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

### Secondary Pages (existing)

```
/why                        Philosophy / Manifesto
/safety-trust               Safety & Trust
/content-safety             Content Safety
/privacy-policy             Privacy Policy
/investors                  Investor Information
/ambassadors                Ambassador Directory (legacy, links to /pioneer)
```

### Geo Pages (existing)

```
/in                         India
/us                         United States
/sg                         Singapore
/ca                         Canada
/jp                         Japan
/kr                         Korea
```

---

## Page-Level Architecture

### 1. Homepage `/`

- **Primary Objective**: Email signup / Start Free Trial
- **Primary Persona**: Any parent or educator discovering Komal for the first time
- **Core Anxiety**: "Is my child safe online? Am I doing enough?"
- **SEO Themes**:
  - psychology-informed digital safety for kids
  - talk-to-play platform for children
  - alternative to parental control apps
  - child digital wellbeing platform
  - safe internet for kids without surveillance

---

### 2. Parents Hub `/parents`

- **Primary Objective**: Route to age-specific subpage; secondary: email signup
- **Primary Persona**: Parent actively researching screen time / digital safety solutions
- **Core Anxiety**: "Every child is different, I need something that fits MY child's age"
- **SEO Themes**:
  - parental controls without dark patterns
  - digital wellbeing for kids by age
  - screen time guidance for parents
  - child online safety by age group
  - psychology-based parental controls

---

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

---

### 4. Parents: Ages 6-10 `/parents/6-10`

- **Primary Objective**: Start Free Trial
- **Primary Persona**: Parent of early-elementary child getting their first device or more internet access
- **Core Anxiety**: "My child needs the internet for school, but I can't watch them every minute"
- **SEO Themes**:
  - online safety for 6-10 year olds
  - safe internet browsing for kids
  - screen time limits for elementary school kids
  - child-safe browser for kids
  - digital literacy for young children

---

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

---

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

---

### 7. Parents: Ages 16+ `/parents/16-plus`

- **Primary Objective**: Pioneer Program signup / Share with teen
- **Primary Persona**: Parent of older teen preparing for independence; or teen themselves
- **Core Anxiety**: "They're almost adults. I need to let go, but are they ready?"
- **SEO Themes**:
  - digital independence for older teens
  - preparing teens for safe internet use
  - digital citizenship for 16+
  - transitioning from parental controls
  - ethical AI literacy for young adults

---

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

---

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

---

### 10. Clinicians & Psychologists `/for-clinics`

- **Primary Objective**: Partner / Refer Patients
- **Primary Persona**: Pediatrician, child psychologist, or developmental therapist
- **Core Anxiety**: "I see screen-related behavioral issues daily but have no tools for between-session insight"
- **SEO Themes**:
  - digital wellbeing tool for pediatricians
  - child screen time assessment tool
  - between-session behavioral insights
  - child psychology digital safety referral
  - clinician tools for child digital health

---

## Internal Linking Strategy

```
Homepage -> Parents Hub -> Age-specific pages
Homepage -> Pioneer Program
Homepage -> For Schools
Homepage -> For Clinics
Parents Hub -> Pioneer Program (for 13+ segments)
For Schools -> Pricing (school licensing)
For Clinics -> Demo
Pioneer Program -> Parents Hub (for parent pioneers)
All pages -> Blog (contextual links)
Blog -> Relevant landing pages (SEO pillar strategy)
```

## GTM Funnel Tracking

Each page should fire GTM events:
- `page_view` with segment tag (e.g., `parents_6-10`, `schools`, `pioneer`)
- `cta_click` with action type (e.g., `start_trial`, `book_demo`, `apply_pioneer`)
- `scroll_depth` at 25%, 50%, 75%, 100%
- `faq_expand` with question text

Route-level tracking examples:
- `/parents/6-10/assessment-started`
- `/pioneer/apply-started`
- `/for-schools/demo-requested`
