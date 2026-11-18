# Project Conventions

Contractor lead-gen site template (Astro). The spec is `GeneralContractorAstro-PRD.md`; build in its §9 phases and stop for review after each one.

- Use TypeScript everywhere; no `any`.
- Use Tailwind utilities; extract a component instead of `@apply`-ing large class blocks.
- Write components as `.astro` files. Add a framework island only with written justification in `DECISIONS.md`.
- Commit at the end of each phase with a descriptive message; work on a feature branch per phase.
- Don't invent business facts (license numbers, years in business, review counts). Use `{{PLACEHOLDER}}` and list every placeholder in `TODO.md`.
- All business data lives in `src/site.config.ts`. No component may hardcode a business name, phone, city, or license number.
- Zero client-side JS by default. Only the mobile nav toggle, the form submission, and Turnstile may ship JS, as small vanilla `<script>` blocks.
- No external image URLs; all images live in `src/assets/` and render through `astro:assets`.

## Commands

pnpm isn't installed globally on this machine; `corepack pnpm <cmd>` works.

- `pnpm dev` / `pnpm build` (runs `astro check` first) / `pnpm lint` / `pnpm format`
