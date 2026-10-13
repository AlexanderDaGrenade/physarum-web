# Physarum — website

Next.js (App Router) + TypeScript + Tailwind v4. Dark/light via `next-themes`. Case studies in MDX.

```bash
npm install
npm run dev     # http://localhost:3000
npm run build
```

## Environment

Copy `.env.example` to `.env.local` (and set the same vars in Vercel):

| Variable | Purpose |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | Canonical domain, e.g. `https://yourdomain.com` (sitemap, OG, canonical URLs) |
| `HUBSPOT_PORTAL_ID`, `HUBSPOT_FORM_ID` | Contact form → HubSpot. In production the form refuses to submit if these are missing; in dev it logs the submission. |
| `NEXT_PUBLIC_CAL_LINK` | Cal.com link (e.g. `physarum/intro`) embedded on `/contact/thanks` |
| `NEXT_PUBLIC_CONTACT_EMAIL` | Optional email shown on the contact page |

## Where things live

- **Services, families, headline words, budgets:** `lib/services.ts` (nav, footer, hero carousel and service pages all read from it)
- **Case studies:** metadata in `lib/work.ts`, body in `content/work/<slug>.mdx`
- **Logo:** `components/brand/logo-paths.ts` (traced from `brand/source/physarum-1.jpeg`), SVG files in `public/brand/`
- **Hero:** `components/hero/MazeMold.tsx` (mold solving a faded maze, looping), `ServiceHero.tsx` (headline + revolving carousel + tendril), `components/brand/GrowingMark.tsx`
- **Opening intro:** `components/intro/IntroSequence.tsx` + routes in `lib/intro-route.ts`. Plays on every homepage load (skippable; skipped for reduced motion). Default variant is `DEFAULT_INTRO` in `lib/intro-route.ts`: `"follow"` (camera tracks the line, then pulls back) or `"classic"` (original bird's-eye). Force either with `?intro=follow` / `?intro=classic`.
- **Scroll trail:** `components/trail/MoldTrail.tsx` — any page with a `[data-trail-start]` element and `<Section>`s gets the trail; sections fade in when it reaches their node

## Before launch

- [ ] Replace the 6 **draft** case studies (`draft: true` in `lib/work.ts`) with real ones. Drafts show a "Draft" badge, are `noindex`, and are left out of the sitemap.
- [ ] Register the legal entity, then finish `/privacy` and `/terms` (currently marked Draft).
- [ ] Set the env vars above and send a test brief through HubSpot.
- [ ] If the designer has the original logo vector or wordmark font, swap it into `logo-paths.ts`.
