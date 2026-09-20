# Leonida Forge — Frontend Redesign & Backend Integration Specification

## 1. Document Purpose

This document defines the redesign of the existing **Leonida Forge** React application into a **GTA VI news-first platform** while preserving the existing evergreen utility features.

The existing frontend already contains:

- Vehicle database
- Vehicle comparison
- Money/heist calculator
- 100% completion tracker
- Mission directory
- Locations / POI explorer
- Gameplay guides
- Global search
- SEO infrastructure
- React 19
- TypeScript
- Vite
- Tailwind CSS v4
- Lucide React
- Motion

The backend being developed separately provides:

- X/Twitter monitoring through `watcher.py`
- Rockstar Newswire collection through `news.py`
- AI content generation through `ai.py`
- Supabase persistence
- OpenRouter integration through `lib/llm.py`
- Flask API through `app.py`

The objective is to combine these two systems without rewriting the existing frontend or backend from scratch.

---

# 2. Product Direction

## 2.1 New Product Identity

Leonida Forge should become:

> A GTA VI information hub combining breaking news, official updates, community/social updates, guides, vehicles, missions, locations, and player tools.

The website should no longer feel like only a vehicle database.

The **news/content experience becomes the primary public experience**, while the existing database and utility features remain important evergreen sections.

### New hierarchy

```text
Leonida Forge
│
├── News
│   ├── Latest
│   ├── Rockstar Newswire
│   └── Social / X Updates
│
├── Guides
│
├── Vehicles
│   ├── Database
│   └── Compare
│
└── Tools
    ├── Money Calculator
    ├── Completion Tracker
    ├── Missions
    └── Locations
```

---

# 3. Core UX Principle

A visitor should understand the website within a few seconds:

1. This is a GTA VI site.
2. New information is available here.
3. I can read the latest news.
4. I can also use GTA VI tools and databases.

The homepage should therefore prioritize **fresh information**, not static database utilities.

---

# 4. High-Level Architecture

```text
                         ┌─────────────────────┐
                         │      X Accounts     │
                         └──────────┬──────────┘
                                    │
                              watcher.py
                                    │
                                    ▼
                         ┌─────────────────────┐
                         │      Supabase       │
                         │  monitored_posts    │
                         └──────────┬──────────┘
                                    │
                                    │
┌──────────────────┐                │
│ Rockstar Newswire│                │
└────────┬─────────┘                │
         │                          │
       news.py                      │
         │                          │
         ▼                          ▼
                 ┌───────────────────────────┐
                 │         Supabase           │
                 │          news              │
                 └────────────┬──────────────┘
                              │
                             ai.py
                              │
                       ┌──────┴───────┐
                       ▼              ▼
                 YouTube script  Instagram script
                       │              │
                       └──────┬───────┘
                              ▼
                         ┌───────────┐
                         │ Supabase  │
                         │  scripts  │
                         └─────┬─────┘
                               │
                               ▼
                        Flask REST API
                               │
                               │ HTTP/JSON
                               ▼
                       React Frontend
```

---

# 5. Frontend Application Structure

Keep the existing React project but reorganize the presentation layer around the new product hierarchy.

Recommended structure:

```text
src/
├── components/
│   ├── common/
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   ├── Breadcrumbs.tsx
│   │   ├── SearchBar.tsx
│   │   ├── LoadingState.tsx
│   │   ├── ErrorState.tsx
│   │   └── EmptyState.tsx
│   │
│   ├── news/
│   │   ├── FeaturedNews.tsx
│   │   ├── NewsCard.tsx
│   │   ├── NewsGrid.tsx
│   │   ├── NewsList.tsx
│   │   ├── NewsSourceBadge.tsx
│   │   ├── NewsArticle.tsx
│   │   ├── NewsSidebar.tsx
│   │   └── SocialPostCard.tsx
│   │
│   ├── scripts/
│   │   ├── ScriptCard.tsx
│   │   ├── ScriptViewer.tsx
│   │   ├── ScriptTabs.tsx
│   │   └── ScriptStatus.tsx
│   │
│   ├── home/
│   │   ├── Hero.tsx
│   │   ├── LatestNewsSection.tsx
│   │   ├── RockstarUpdatesSection.tsx
│   │   ├── SocialUpdatesSection.tsx
│   │   ├── FeaturedGuides.tsx
│   │   └── UtilityHighlights.tsx
│   │
│   ├── vehicles/
│   ├── compare/
│   ├── tracker/
│   ├── missions/
│   ├── locations/
│   └── guides/
│
├── pages/
│   ├── Home.tsx
│   ├── News.tsx
│   ├── NewsArticlePage.tsx
│   ├── SocialPage.tsx
│   ├── Scripts.tsx
│   ├── Vehicles.tsx
│   ├── VehicleDetail.tsx
│   ├── Compare.tsx
│   ├── Guides.tsx
│   ├── GuideDetail.tsx
│   ├── Missions.tsx
│   ├── Locations.tsx
│   ├── MoneyCalculator.tsx
│   ├── Tracker.tsx
│   └── NotFound.tsx
│
├── services/
│   ├── api.ts
│   ├── newsService.ts
│   ├── socialService.ts
│   ├── scriptService.ts
│   └── searchService.ts
│
├── hooks/
│   ├── useNews.ts
│   ├── useSocialPosts.ts
│   ├── useScripts.ts
│   ├── useVehicles.ts
│   └── useLocalStorage.ts
│
├── types/
│   ├── news.ts
│   ├── social.ts
│   ├── scripts.ts
│   └── index.ts
│
├── config/
│   ├── api.ts
│   └── seoConfig.ts
│
├── App.tsx
├── main.tsx
└── index.css
```

Existing components should be reused whenever practical.

---

# 6. Navigation Redesign

## Main navigation

Use:

```text
Home
News
Guides
Vehicles
Tools
```

Optional right-side utilities:

```text
Search
```

## News dropdown

```text
Latest News
Rockstar Newswire
Social / X Updates
```

## Vehicles dropdown

```text
Vehicle Database
Compare Vehicles
```

## Tools dropdown

```text
Money Calculator
100% Tracker
Missions
Locations
```

The header should not contain every individual tool as a top-level item.

---

# 7. Homepage Redesign

The homepage is the most important redesign.

## Section order

### Section 1 — Header

Contains:

- Leonida Forge logo/name
- Main navigation
- Search
- Responsive mobile menu

---

## Section 2 — Featured / Breaking Story

Large editorial area.

Structure:

```text
┌────────────────────────────────────────────────────┐
│                                                    │
│               LARGE ARTICLE IMAGE                 │
│                                                    │
│     ROCKSTAR NEWSWIRE                              │
│     GTA VI headline                                │
│     Short summary                                  │
│     Read Article →                                 │
│                                                    │
└────────────────────────────────────────────────────┘
```

The backend should determine which current article is featured.

For V1 this can simply be:

- Most recently published news article
- Or newest collected news article

Later this can become manually curated.

---

# 8. Latest News Section

Display the newest news items in a responsive grid.

Desktop:

```text
┌────────────┐ ┌────────────┐ ┌────────────┐
│ News Card  │ │ News Card  │ │ News Card  │
└────────────┘ └────────────┘ └────────────┘
```

Each card contains:

- Image
- Source
- Title
- Short description
- Published date
- Read link

Example:

```text
ROCKSTAR NEWSWIRE
September 19, 2026

GTA VI News Headline

Short description...

Read Article →
```

---

# 9. News Source Design

Every content item should show its source.

Possible source labels:

```text
ROCKSTAR NEWSWIRE
X / SOCIAL
LEONIDA FORGE
```

Do not make the source ambiguous.

Use a reusable:

```text
NewsSourceBadge
```

component.

---

# 10. Rockstar Newswire Page

Route:

```text
/news
```

or:

```text
/news/rockstar
```

Recommended public route:

```text
/news
```

Page structure:

```text
Latest GTA VI News
─────────────────────────────

[ Filters ]

All   Rockstar   Social

[ News Grid ]

[ Load More / Pagination ]
```

The frontend fetches from Flask instead of accessing Supabase directly.

---

# 11. Individual News Article Page

Route:

```text
/news/:id
```

or preferably a slug route later:

```text
/news/:slug
```

Page layout:

```text
┌───────────────────────────────────────────┐
│ Source                                     │
│ Article title                              │
│ Published date                             │
│                                           │
│          HERO IMAGE                       │
│                                           │
│ Article content                            │
│                                           │
│ Original source →                          │
└───────────────────────────────────────────┘

Related GTA VI News
```

The article page should preserve the original source URL.

The site should not imply Rockstar officially published the Leonida Forge page.

---

# 12. Social / X Updates Page

Route:

```text
/social
```

Display collected X posts from `monitored_posts`.

Each post can show:

- Username
- Post text
- Date
- Original X URL
- Source badge
- Optional account/avatar information later

Example:

```text
X UPDATE

@ExampleAccount
September 19, 2026

Post text goes here...

View on X →
```

Do not fabricate profile information that is not stored.

---

# 13. AI Script Area

The AI system is primarily an internal content-production tool.

There are two possible frontend experiences.

## Public

Do not expose the entire internal generation dashboard.

## Private / Content dashboard

Route:

```text
/admin/scripts
```

This page should show:

```text
Generated Content
─────────────────────────────

News article

YouTube      Instagram

[View Script] [View Script]
```

Use tabs:

```text
YouTube
Instagram
```

The script viewer should preserve paragraphs and make copying easy.

Buttons:

```text
Copy Script
Open Source Article
Open News
```

---

# 14. Guides

Existing guides remain.

Route:

```text
/guides
```

The guides section should become one of the evergreen content categories.

Homepage can show:

```text
GTA VI Guides

[Guide] [Guide] [Guide]
```

Example topics:

- Fastest vehicles
- Money strategies
- Completion roadmap
- Beginner guides

Do not automatically claim unreleased details as confirmed facts.

---

# 15. Vehicles

The vehicle database remains largely intact.

Routes:

```text
/vehicles
/vehicles/:slug
/compare
```

No need to redesign the vehicle data architecture unless required by the visual redesign.

Its position changes from being the entire identity of the site to being one major section.

---

# 16. Tools

Group utility features together.

```text
/tools
```

Cards:

```text
Money Calculator
100% Completion Tracker
Mission Directory
Locations
Vehicle Compare
```

These are evergreen tools and should continue working even when there is no new news.

---

# 17. Search

The global search should search across:

```text
News
Vehicles
Guides
Missions
Locations
```

For V1, search can remain client-side for static datasets while news can come from the Flask API.

Later, create:

```text
GET /api/search?q=gta
```

for unified backend search.

---

# 18. Backend API Contract

The frontend must not directly use the Supabase service-role key.

The correct flow is:

```text
React
  ↓
Flask API
  ↓
Supabase
```

Never put:

```text
SUPABASE_SERVICE_KEY
OPENROUTER_API_KEY
```

inside the React application.

---

# 19. API Base URL

Development:

```text
http://localhost:5000/api
```

Production:

```text
https://your-backend-domain.com/api
```

Frontend environment variable:

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

Do not hardcode production URLs throughout the application.

---

# 20. Required API Endpoints

## News

### GET `/api/news`

Returns latest collected Rockstar news.

Query parameters:

```text
?page=1
&limit=12
```

Optional:

```text
?source=rockstar_newswire
```

Example response:

```json
{
  "data": [
    {
      "id": 12,
      "source": "rockstar_newswire",
      "title": "Example GTA VI News",
      "url": "https://www.rockstargames.com/newswire/article/example",
      "raw_content": "Article body...",
      "published_at": "2026-09-19T10:00:00Z",
      "image_url": "https://...",
      "collected_at": "2026-09-19T10:01:00Z"
    }
  ],
  "page": 1,
  "limit": 12
}
```

---

## GET `/api/news/:id`

Returns one news item.

---

## GET `/api/news/latest`

Returns the newest item or a small latest-news set.

---

# 21. Social API

### GET `/api/social`

Returns monitored X posts.

Example:

```json
{
  "data": [
    {
      "id": 1,
      "username": "ExampleAccount",
      "post_id": "123456",
      "raw_script": "Post text",
      "url": "https://x.com/ExampleAccount/status/123456",
      "date": "2026-09-19T10:00:00Z"
    }
  ]
}
```

---

# 22. Scripts API

### GET `/api/scripts`

Returns generated scripts.

### GET `/api/scripts/:id`

Returns one script record.

Example:

```json
{
  "id": 5,
  "news_id": 12,
  "youtube_script": "YouTube script...",
  "instagram_script": "Instagram script...",
  "status": "generated",
  "created_at": "2026-09-19T10:05:00Z"
}
```

---

# 23. Optional Future API Endpoints

Later:

```text
GET /api/guides
GET /api/vehicles
GET /api/missions
GET /api/locations
GET /api/search?q=
GET /api/categories
```

These are not required for the first backend integration.

---

# 24. TypeScript Models

Create explicit frontend types.

## News

```ts
export interface News {
  id: number;
  source: string;
  title: string;
  url: string;
  raw_content: string | null;
  published_at: string | null;
  image_url: string | null;
  collected_at: string;
}
```

## Social post

```ts
export interface SocialPost {
  id: number;
  username: string;
  post_id: string;
  raw_script: string;
  url: string | null;
  date: string | null;
}
```

## Scripts

```ts
export interface Script {
  id: number;
  news_id: number;
  youtube_script: string | null;
  instagram_script: string | null;
  status: string;
  created_at: string;
}
```

---

# 25. API Service Layer

Do not put `fetch()` calls directly inside visual components.

Create:

```text
src/services/api.ts
```

and service modules:

```text
src/services/newsService.ts
src/services/socialService.ts
src/services/scriptService.ts
```

Example:

```ts
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export async function getLatestNews() {
  const response = await fetch(`${API_BASE_URL}/news/latest`);

  if (!response.ok) {
    throw new Error("Failed to fetch latest news");
  }

  return response.json();
}
```

This keeps UI components focused on rendering.

---

# 26. React Data Flow

Example homepage:

```text
Home.tsx
   ↓
useNews()
   ↓
newsService.ts
   ↓
api.ts
   ↓
Flask
   ↓
Supabase
   ↓
JSON
   ↓
useNews()
   ↓
Home components
```

The browser should never know how Supabase works.

---

# 27. Loading States

Every API-driven section needs a loading state.

Example:

```text
Loading latest news...
```

Use skeleton cards where appropriate.

Do not display an empty page while a network request is running.

---

# 28. Error States

If Flask is offline:

```text
Unable to load latest news.

Please try again.
```

Provide a retry button.

The rest of the site should continue working where possible.

---

# 29. Empty States

For example:

```text
No recent news found.

Check back later for the latest GTA VI updates.
```

For scripts:

```text
No generated script is available for this article yet.
```

---

# 30. Responsive Design

The redesigned UI must support:

- Desktop
- Laptop
- Tablet
- Mobile

Desktop:

```text
3-column news grid
```

Tablet:

```text
2-column news grid
```

Mobile:

```text
1-column news list
```

The navigation should collapse into a mobile menu.

---

# 31. SEO

Continue using the existing SEO infrastructure.

News pages should have:

- Unique `<title>`
- Meta description
- Canonical URL
- OpenGraph title
- OpenGraph description
- OpenGraph image
- Article structured data where appropriate
- Breadcrumb structured data

Example title:

```text
GTA VI News — Example Headline | Leonida Forge
```

Do not claim an article is an official Rockstar publication unless the source is actually Rockstar.

---

# 32. Performance

Avoid making the homepage perform many API calls independently.

Prefer:

```text
GET /api/home
```

later if necessary, returning:

- Featured news
- Latest news
- Latest social updates
- Featured guides

For V1, separate endpoints are acceptable.

Images should use appropriate dimensions and lazy loading.

---

# 33. Frontend Security

Never expose:

```text
SUPABASE_SERVICE_KEY
OPENROUTER_API_KEY
```

in:

```text
VITE_* environment variables
```

The `VITE_` prefix is for values that are exposed to the browser.

Only public frontend configuration should use `VITE_*`.

---

# 34. Admin / Internal Content Area

Recommended later route:

```text
/admin
```

Possible pages:

```text
/admin/news
/admin/social
/admin/scripts
```

This can initially be unprotected during local development but must receive proper authentication before production use.

Do not expose generation controls publicly.

---

# 35. Visual Design Direction

The current visual identity can remain dark and gaming-oriented.

The redesign should emphasize:

- Strong typography
- Large editorial images
- Clear source badges
- High-contrast cards
- Fast navigation
- Clean information hierarchy
- Minimal unnecessary animation

Motion should support navigation and feedback, not slow down reading.

The site should look like a **gaming information publication**, not an admin dashboard.

---

# 36. What Existing Features Stay

Keep:

```text
Vehicle database
Vehicle comparison
Money calculator
Completion tracker
Mission directory
Locations
Guides
Search
SEO
```

Change:

```text
Homepage priority
Navigation hierarchy
News system
News cards
Article pages
Social feed
Content dashboard
Backend integration
```

---

# 37. V1 Implementation Order

Do not redesign the entire site at once.

### Phase 1

Build:

```text
News API
News service
News types
News cards
News page
```

### Phase 2

Redesign homepage:

```text
Featured news
Latest news
Social updates
Guides
Existing tools
```

### Phase 3

Add:

```text
News article page
Social page
```

### Phase 4

Add:

```text
AI script dashboard
```

### Phase 5

Refine:

```text
Search
SEO
Performance
Mobile
```

---

# 38. Definition of Done

The frontend redesign is complete when:

- The homepage is news-first.
- Latest Rockstar news appears automatically from the backend.
- X updates can be displayed.
- News detail pages work.
- Source URLs are preserved.
- AI-generated scripts can be viewed through an internal content interface.
- Existing vehicle/tools sections still work.
- No Supabase service key exists in the frontend.
- Loading, empty, and error states exist.
- Mobile layout works.
- SEO metadata works on news pages.
- Frontend and Flask communicate through documented API endpoints.
