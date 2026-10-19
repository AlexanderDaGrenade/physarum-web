# Physarum — website

Next.js (App Router) + TypeScript + Tailwind v4. Dark/light via `next-themes`. Case studies in MDX.

```bash
npm install
npm run dev     # http://localhost:3000
npm run build
```

## Deploying to physarum.org (Namecheap cPanel)

The site is exported as static files plus one PHP script for the contact form.

```bash
npm run build:cpanel   # builds .next-export/ and physarum-site.zip
```

1. In cPanel → **File Manager** → `public_html`, delete the old site files (keep `cgi-bin` and `.well-known`).
2. **Upload** `physarum-site.zip` and **Extract** it into `public_html`. Enable "Show hidden files" to confirm `.htaccess` is there.
3. In cPanel → **Email Accounts**, make sure `business@physarum.org` exists (the form sends from and to it).
4. In cPanel → **SSL/TLS Status**, run AutoSSL so `https://physarum.org` works (the `.htaccess` forces HTTPS).
5. Test: submit the form on `/contact` and check the inbox (and spam folder the first time).

How the form works: `components/site/ContactForm.tsx` posts to `/api/contact.php` (`public/api/contact.php`), which validates the brief,
rate-limits to 5 per IP per hour, ignores bots via a hidden field, and emails `business@physarum.org` with the client as Reply-To.
If sending fails, the visitor gets a pre-filled email to the same address instead.

## Where things live

- **Services, families, headline words, budgets:** `lib/services.ts` (nav, footer, hero carousel and service pages all read from it)
- **Case studies:** metadata in `lib/work.ts`, body in `content/work/<slug>.mdx`
- **Logo:** `components/brand/logo-paths.ts` (traced from `brand/source/physarum-1.jpeg`), SVG files in `public/brand/`
- **Hero:** `components/hero/MazeMold.tsx` (mold solving a faded maze, looping), `ServiceHero.tsx` (headline + revolving carousel + tendril), `components/brand/GrowingMark.tsx`
- **Opening intro:** `components/intro/IntroSequence.tsx` + routes in `lib/intro-route.ts`. Plays on every homepage load (skippable; skipped for reduced motion). Default variant is `DEFAULT_INTRO` in `lib/intro-route.ts`: `"follow"` (camera tracks the line, then pulls back) or `"classic"` (original bird's-eye). Force either with `?intro=follow` / `?intro=classic`.
- **Scroll trail:** `components/trail/MoldTrail.tsx` — any page with a `[data-trail-start]` element and `<Section>`s gets the trail; sections fade in when it reaches their node

## Before launch

- [ ] Add an SEO & Digital Marketing case study (the category currently has none). Any future placeholder can use `draft: true` in `lib/work.ts` — drafts show a badge, are `noindex`, and are left out of the sitemap.
- [ ] Register the legal entity, then finish `/privacy` and `/terms` (currently marked Draft).
- [ ] Upload to cPanel (above) and send a test brief from the live form.
- [ ] If the designer has the original logo vector or wordmark font, swap it into `logo-paths.ts`.
