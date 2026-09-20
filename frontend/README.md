# Leonida Forge 🌴

> **The ultimate independent utility toolkit, vehicle database, and progress tracker for GTA VI.**

[![React](https://img.shields.io/badge/React-19-61dafb.svg?style=flat-square&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178c6.svg?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6.2-646cff.svg?style=flat-square&logo=vite)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-38bdf8.svg?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg?style=flat-square)](LICENSE)

Leonida Forge is a fast, responsive, zero-account web companion designed for Grand Theft Auto VI. Built with modern React 19, TypeScript, and Tailwind CSS v4, it provides interactive tools, telemetry comparisons, financial calculators, 100% completion tracking, and tactical gameplay guides.

---

## 🚀 Live Demo

- **Production URL:** [https://leonidaforge.vercel.app](https://leonidaforge.vercel.app)

---

## ✨ Key Features

### 🏎️ Vehicle Database & Telemetry
- Comprehensive index of sports cars, supercars, muscle cars, motorcycles, boats, and aircraft.
- Detailed stat ratings for Top Speed, Acceleration, Handling, Braking, and Armor.
- Confirmed spawn coordinates, dealership costs, manufacturer badges, and class filters.
- Dedicated detail pages with rich telemetry and Schema.org `ItemPage` structured data.

### ⚖️ Side-by-Side Comparison Matrix
- Compare any two or more vehicles simultaneously.
- Interactive delta highlights revealing performance advantages and stat disparities.
- Direct quick-links to compare models from any vehicle card.

### 💰 Money & Heist Calculator
- Goal-based heist and asset planner.
- Calculate exact playtime and mission iterations required to purchase luxury properties, vehicles, and businesses.
- Passive income forecasting with payback period estimations.

### 📋 100% Completion Tracker
- Comprehensive checklist covering Story Missions, Collectibles, Stunts, Strangers & Freaks, and Random Events.
- Real-time percentage progress bar with category sub-totals.
- **Privacy-first:** All state persists exclusively in client-side `localStorage`. No sign-up required.

### 🎯 Mission Directory
- Searchable catalog of storyline contracts, heist setups, and side operations.
- Protagonist indicators (Lucia / Jason), rank prerequisites, and payout estimates.

### 🗺️ Locations & POI Explorer
- District guides for Vice City, Port Gellhorn, Ambrosia, Leonard County, and the Keys.
- Key points of interest, vehicle spawn zones, and points of interest overview.

### 📚 SEO-Optimized Gameplay Guides
- Tactical strategy articles targeting high-intent player queries (Fastest Car, Money Making, 100% Completion Roadmap, Bike Hierarchy).
- Interactive accordions with dynamic Schema.org `FAQPage` microdata for rich search snippets.

### 🔍 Global Search & Navigation
- Real-time instant search bar supporting vehicles, guides, missions, and tools.
- Breadcrumb navigation (`BreadcrumbList` JSON-LD) across all deep-linked routes.

### 🔒 Privacy by Design
- Zero mandatory user registration.
- All tracker progress and calculator states are stored locally on your device.
- Instant data-reset button available on the Privacy Policy page.

---

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| **React 19** | UI components & client-side rendering |
| **TypeScript 5.8** | End-to-end type safety |
| **Vite 6** | Ultra-fast development server & optimized production bundling |
| **Tailwind CSS v4** | Modern utility-first styling with dark-mode palette |
| **Motion** | Fluid page transitions and interactive micro-animations |
| **Lucide React** | Clean, accessible iconography |
| **Schema.org JSON-LD** | Rich structured data for search engine visibility |

---

## 📁 Project Structure

```
leonida-forge/
├── public/
│   ├── assets/              # Static vehicle & guide imagery
│   ├── favicon.svg          # Vector favicon
│   ├── og-image.png         # OpenGraph social preview card
│   ├── robots.txt           # Search engine crawler directives
│   ├── site.webmanifest     # PWA / web application manifest
│   └── sitemap.xml          # Canonical XML sitemap
├── src/
│   ├── components/
│   │   ├── common/          # Header, Footer, Breadcrumbs, Feedback, SEO
│   │   ├── compare/         # Vehicle comparison matrix components
│   │   ├── home/            # Homepage hero, quick-access grids, highlights
│   │   ├── tracker/         # Completion tracker cards and progress bars
│   │   └── vehicles/        # Vehicle cards, filters, and telemetry meters
│   ├── config/
│   │   └── seoConfig.ts     # Domain settings, default metadata, and social tags
│   ├── data/
│   │   ├── guidesData.ts    # Guide content, walkthroughs, and FAQs
│   │   ├── locationsData.ts # Region descriptions and points of interest
│   │   ├── missionsData.ts  # Mission directory and payout schemas
│   │   ├── trackerData.ts   # 100% completion checklist milestones
│   │   └── vehiclesData.ts  # Vehicle specifications, classes, and spawn lore
│   ├── hooks/
│   │   ├── useLocalStorage.ts # Reactive local storage state hook
│   │   └── useSEO.ts          # Document title, meta tags, and JSON-LD injector
│   ├── pages/               # Route views (Home, Vehicles, Compare, Money, Tracker, etc.)
│   ├── services/            # Client-side utility functions and search indexing
│   ├── types.ts             # Central TypeScript type definitions
│   ├── App.tsx              # Root application layout and client router
│   ├── main.tsx             # React entry point
│   └── index.css            # Tailwind CSS entry point
├── index.html               # HTML5 shell with preconnects, meta tags, and JSON-LD
├── vercel.json              # Vercel SPA rewrite configuration
├── package.json             # Dependencies and scripts
└── tsconfig.json            # TypeScript configuration
```

---

## 💻 Getting Started

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm** or **pnpm** / **yarn**

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/leonida-forge.git
   cd leonida-forge
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env
   ```
   Configure your site URL in `.env`:
   ```env
   VITE_SITE_URL="https://leonidaforge.vercel.app"
   ```

4. Start the local development server:
   ```bash
   npm run dev
   ```
   The application will be available at `http://localhost:3000`.

---

## 📜 Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Starts the Vite dev server on port `3000` |
| `npm run build` | Compiles TypeScript and builds production assets to `/dist` |
| `npm run preview` | Locally preview the production build |
| `npm run lint` | Runs `tsc --noEmit` to validate TypeScript types |
| `npm run clean` | Removes build artifacts and cached output |

---

## 🚢 Deployment (Vercel)

This project is configured out-of-the-box for zero-configuration deployment on **Vercel**:

1. Push your repository to GitHub or GitLab.
2. Import the project into your [Vercel Dashboard](https://vercel.com/new).
3. Set the Framework Preset to **Vite**.
4. Configure the environment variable:
   - `VITE_SITE_URL` = `https://your-domain.vercel.app`
5. Deploy!

The included `vercel.json` ensures that all deep URLs (e.g. `/vehicles/grotti-cheetah-classic`, `/tracker`) are routed through `index.html` without 404 errors:
```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

---

## 🔍 SEO & Search Optimization

- **Schema.org Structured Data:** Includes `WebSite` (with Sitelinks Searchbox), `BreadcrumbList`, `ItemPage` (vehicle telemetry), and `FAQPage` JSON-LD schemas.
- **Dynamic Meta Tags:** Managed via `useSEO` hook for dynamic titles, descriptions, canonical URLs, and OpenGraph/Twitter social cards on every route.
- **Site Name Verification:** Embedded `WebSite` metadata, manifest, and application meta tags to ensure search engines (like Google) display **Leonida Forge** as the primary site brand.

---

## ⚖️ Legal Disclaimer

*Leonida Forge is a fan-made, non-commercial community project. It is not affiliated with, endorsed by, sponsored by, or associated with Rockstar Games, Take-Two Interactive, or any of their subsidiaries. All trademarks, game titles, logos, vehicle names, and intellectual property belong to their respective owners.*

---

## 🤝 Contributing & Feedback

Contributions, suggestions, and feedback are warmly welcomed!
- Submit feature suggestions or bug reports via the in-app feedback module on any page.
- Pull requests are welcome for new vehicle telemetry data, mission info, and location coordinates.
