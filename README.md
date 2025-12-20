# KOMAL - Next.js Application

This is a Next.js application for KOMAL - an AI companion that understands how children feel and learns.

## Getting Started

First, install the dependencies:

```bash
npm install
# or
yarn install
# or
pnpm install
```

Then, run the development server on port 3000

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3001](http://localhost:3001) with your browser to see the result.

## Project Structure

```
.
├── app/
│   ├── page.tsx              # Home page
│   ├── not-found.tsx         # 404 error page
│   ├── how-komal-works/      # How KOMAL Works page
│   │   └── page.tsx
│   ├── meet-komal/           # Meet KOMAL platform page
│   │   └── page.tsx
│   ├── privacy-policy/       # Privacy Policy page
│   │   └── page.tsx
│   ├── team/                 # Team page
│   │   └── page.tsx
│   ├── layout.tsx            # Root layout with navigation and footer
│   └── globals.css           # Global styles
├── components/
│   ├── Navbar.tsx            # Navigation component
│   ├── Footer.tsx            # Footer component
│   ├── ClientScripts.tsx     # Client-side scripts for animations
│   ├── TestimonialsCarousel.tsx
│   ├── PricingSection.tsx
│   └── FaqAccordion.tsx
├── docs/
│   └── design_guide.md       # Design guide documentation
├── public/                   # Static assets
├── package.json              # Dependencies and scripts
├── next.config.ts            # Next.js configuration
├── tsconfig.json             # TypeScript configuration
└── eslint.config.mjs         # ESLint configuration
```

## Features

- **Server-Side Rendering (SSR)**: Fast page loads with Next.js App Router
- **TypeScript**: Full type safety across the application
- **Responsive Design**: Mobile-first design that works on all devices
- **SEO Optimized**: Proper metadata and structured data for search engines
- **Smooth Animations**: Scroll-triggered animations and smooth scrolling
- **Modern Architecture**: Using the latest Next.js 16 and React 19

## Pages

1. **Home** (`/`) - Landing page with hero section, features, pricing, and FAQ
2. **How KOMAL Works** (`/how-komal-works`) - Detailed explanation of the technology
3. **Meet KOMAL** (`/meet-komal`) - Platform overview and technical details
4. **Team** (`/team`) - Meet the team behind KOMAL
5. **Privacy Policy** (`/privacy-policy`) - Comprehensive privacy policy with COPPA, DPDPA, and GDPR compliance
6. **404 Page** (`/not-found`) - Custom 404 error page

## Build for Production

```bash
npm run build
npm start              # serves on port 3001
```

## Technologies Used

- **Next.js 16.0.10** - React framework with App Router
- **React 19.2.1** - UI library
- **TypeScript** - Type safety
- **CSS** - Custom styling with CSS variables

## License

All rights reserved © KOMAL AI Inc.
