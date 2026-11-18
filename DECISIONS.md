# Decisions

Choices made where the PRD was ambiguous. Simplest option that meets the acceptance criteria.

## Phase 1

- **Astro 7, TypeScript 6.** Astro 7.4 is the latest stable. TypeScript is pinned to `^6` because `@astrojs/check` doesn't support TypeScript 7 yet.
- **Theme tokens.** `BaseLayout` writes `--brand-primary` / `--brand-accent` from `site.theme` onto `:root`. `global.css` maps them to Tailwind tokens with `@theme inline` and derives dark/light shades with `color-mix()`, so a re-skin only changes the config.
- **Accent buttons use dark text.** White text on the default accent (`#E07A1F`) is about 3.5:1, below WCAG AA. Accent buttons use `text-ink` (about 6:1) instead.
- **Desktop services dropdown is CSS-only** (`:hover` / `:focus-within`), so it adds no JS and stays keyboard reachable. Its trigger links to `/#services`, so it still works without the menu.
- **`BaseLayout` lives in `src/components/layout/`**, as listed in PRD §6, not in `src/layouts/`.
- **Basic `<title>`, description, and canonical tags in `BaseLayout` for now.** OG/Twitter tags and JSON-LD come with `SEO.astro` in Phase 5.
- **`site` in `astro.config.mjs` comes from `PUBLIC_SITE_URL`**, with `https://example.com` as the fallback, so canonical URLs and the sitemap need no code edit per client.

## Phase 2

- **`{city}`-style tokens in content.** Service Markdown writes `{city}`, `{region}`, `{business}`, and `{phone}` instead of literal business data, so cloning for a new client needs no content edits for location. Frontmatter is filled inside the Zod schema (`text()` in `content.config.ts`) _before_ length checks, so `metaTitle` ≤ 60 and `metaDescription` 140–160 are validated against the real rendered text. Bodies are filled by a small remark plugin (`src/lib/tokens.ts`).
- **Markdown processor: `unified()` instead of Astro 7's default Sätteri.** Remark plugins require `@astrojs/markdown-remark`'s `unified()` processor in Astro 7. Sätteri's own plugin API is new; unified is documented and stable, and with 8 pages the speed difference doesn't matter.
- **Added `heroImageAlt` to the services schema.** PRD §8 requires meaningful alt text on every image, and `heroImage` had no alt field.
- **Schema is `.strict()`, icons and `related` are validated.** Unknown frontmatter keys, non-Lucide icon names, and `related` slugs that don't exist all fail the build.
- **`related` uses `reference("services")`** rather than plain strings, so links can't point at missing pages.
- **Testimonials have a `placeholder` flag.** The three seeded testimonials are marked `placeholder: true` so Phase 5 will never emit `Review`/`AggregateRating` schema for them (PRD §8: only real reviews).
- **Placeholder images are generated, not downloaded.** `scripts/placeholder-images.mjs` renders labeled gradient JPGs into `src/assets/services/` with sharp, so nothing is hotlinked or unlicensed. Replace them with real project photos.
- **Projects collection deferred.** It's optional in the PRD and nothing consumes it yet; it can be added with the Gallery section in Phase 3 if needed.
- **The header services dropdown and footer read the services collection in `BaseLayout`**, so pages don't need to pass navigation data.
- **FAQ questions aren't headings.** `<summary>` has a button role, which removes heading semantics for assistive tech, so questions are plain text inside it.

## Phase 3

- **Homepage copy lives in `src/content/home.yaml`** (a single-entry `home` data collection with a strict schema), and About, Service Area, Contact, and Privacy Policy copy lives in `src/content/pages/*.md`. That keeps every page clone-able as a content swap, and validated like the services.
- **More content tokens:** `{email}`, `{legalName}`, `{license}`, and `{serviceAreas}` (comma-separated list), all from `site.config.ts`.
- **Meta tags avoid `{business}` where they can.** Title and description limits are checked after tokens are filled, so a long business or city name can fail the build. Inner pages now leave the business name out of meta descriptions to keep headroom. The homepage title still includes it on purpose.
- **No "insured" claim anywhere.** Trust bar, why-us, and the service sidebar only claim what's verifiable from config (the CSLB license) or describe process. Add insurance, years in business, or review counts only once the client confirms them.
- **Homepage gallery uses the first gallery image of each service**, captioned with a link to that service. A `projects` collection can replace this later without changing the `Gallery` section.
- **Contact page map is a lazy-loaded Google Maps `<iframe>`** of the city/ZIP (no API key, no JS) plus an "Open in Google Maps" link. The quote form slot shows a call/email fallback until Phase 4.
- **Privacy policy is a starting template** covering form data, UTM/gclid capture, Turnstile, the CRM, SMS consent (STOP/HELP), and California privacy rights. It's flagged for attorney review in its frontmatter.
- **Service pages now reuse the `ProcessSteps`, `Gallery`, and `FAQ` sections**, so they stay consistent with the homepage.
- **`formatCityLine()` builds "City, CA 90000" as one string.** Prettier wraps adjacent `{expr}` lines, and Astro drops the whitespace between them.
