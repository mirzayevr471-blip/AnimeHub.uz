# Project Rules & Design Guidelines

## App Identity
- **Name:** AniHub
- **Description:** A modern, high-performance anime streaming platform tailored for Uzbek fans.
- **Theme:** Strict **Blue Template**. 
  - Primary Color: Blue (`#2563EB`)
  - Accent Colors: Sky Blue, Emerald (for Ongoing status)
  - Background: Deep Dark (`#070708`)

## UI Conventions
- **Header:** Sticky, glassmorphism background (`bg-black/60 backdrop-blur-md`).
- **Logo:** Italic font, black weight, with "Ani" highlighted in blue.
- **Components:** Use `motion` for layout transitions and hover effects.
- **Buttons:** Rounded-xl or Rounded-full depending on context. Primary buttons should have a subtle blue shadow/glow.
- **Anime Cards:** High-quality posters, rating badges in yellow, type/year badges in gray/blue.

## Functional Rules
- **Admin Panel:** Located at `/admin`. Supports both Table and Grid views.
- **Real-time:** Integrated with Socket.io (if implemented).
- **Navigation:** Standard navigation at top, mobile menu available.

## Coding Standards
- **TypeScript:** Strict types for all data models (Anime, Episode, User).
- **Tailwind CSS:** Only use utility classes. No custom CSS files except `index.css`.
- **Hooks:** Use custom context for `AnimeContext`, `UserContext`, etc.
