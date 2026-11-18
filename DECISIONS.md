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
