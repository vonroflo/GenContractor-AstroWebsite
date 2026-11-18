# PRD: Contractor Lead-Gen Website (Astro)

> **For Claude Code.** Read this whole document before writing code. Build in the phases listed in §9, and stop for review at the end of each phase. When something is ambiguous, pick the simplest option that meets the acceptance criteria and note it in `DECISIONS.md`.

---

## 1. Overview

Build a fast, static-first marketing website for a licensed general contractor. The site's single job is to **turn local search traffic into estimate requests**. It is a reusable template: all business-specific data lives in one config file plus Markdown content, so the same codebase can be redeployed for other contractor clients.

**Reference site (structure only, do not copy text or images):** https://gcstetson.com/

### Goals
1. Rank for "[service] + [city]" searches and get cited by AI answer engines (SEO + AEO).
2. Capture leads through a quote form and send them straight into GoHighLevel (GHL).
3. Score 95+ on all four Lighthouse categories on mobile.
4. Make cloning for a new client a config + content swap, with no code changes.

### Non-goals
- No CMS in v1 (content is Markdown in the repo; an optional Keystatic phase comes later).
- No user accounts, e-commerce, or booking engine.
- No React. Don't add a UI framework unless a component truly needs one.

---

## 2. Tech Stack

| Concern | Choice |
|---|---|
| Framework | **Astro** (latest stable), TypeScript strict |
| Styling | **Tailwind CSS v4** via `@tailwindcss/vite` |
| Icons | `astro-icon` with Lucide (`@iconify-json/lucide`) |
| Fonts | Self-hosted via Fontsource (e.g. Plus Jakarta Sans for headings, DM Sans for body) |
| Content | Astro Content Collections (`src/content.config.ts`, `glob` loader, Zod schemas) |
| Images | `astro:assets` `<Image>` / `<Picture>`; all images stored locally in `src/assets/` |
| Hosting | **Vercel** via `@astrojs/vercel` (static output + the one on-demand API route) |
| Forms → CRM | Astro API endpoint → GHL inbound webhook |
| Spam protection | Cloudflare Turnstile + honeypot field |
| Sitemap | `@astrojs/sitemap` |
| Lint/format | ESLint + Prettier (with `prettier-plugin-astro`, `prettier-plugin-tailwindcss`) |
| Package manager | pnpm |

**Rules:** zero client-side JS by default. Only the mobile nav toggle, the form submission, and Turnstile may ship JS, as small vanilla `<script>` blocks.

---

## 3. Single Source of Truth: `src/site.config.ts`

All business data lives here. No component may hardcode a business name, phone, city, or license number.

```ts
export const site = {
  name: "{{BUSINESS_NAME}}",
  legalName: "{{LEGAL_NAME}}",
  tagline: "{{TAGLINE}}",               // e.g. "Licensed General Contractor"
  url: "https://{{DOMAIN}}",
  phone: "{{PHONE}}",                   // display format
  phoneE164: "+1{{PHONE_DIGITS}}",
  email: "{{EMAIL}}",
  address: { locality: "{{CITY}}", region: "CA", postalCode: "{{ZIP}}", country: "US" },
  geo: { lat: 0, lng: 0 },
  license: {
    board: "California Contractors State License Board",
    number: "{{CSLB_NUMBER}}",
    verifyUrl: "https://www.cslb.ca.gov/OnlineServices/CheckLicenseII/LicenseDetail.aspx?LicNum={{CSLB_NUMBER}}",
  },
  hours: [{ days: "Mo-Fr", open: "07:00", close: "17:00" }],
  serviceAreas: ["{{CITY}}", "{{NEARBY_CITY_1}}", "{{NEARBY_CITY_2}}"],
  social: { google: "", facebook: "", instagram: "", yelp: "" },
  theme: { primary: "#1F3A5F", accent: "#E07A1F" }, // fed into Tailwind @theme tokens
  ghl: { webhookEnv: "GHL_WEBHOOK_URL" },
} as const;
```

Theme colors must flow into Tailwind v4 `@theme` CSS variables (`--color-primary`, `--color-accent`, etc.) so a re-skin is a config change.

---

## 4. Information Architecture

| Route | Source | Purpose |
|---|---|---|
| `/` | `pages/index.astro` | Hero + CTA, trust bar, services grid, why-us, process steps, project gallery, testimonials, service areas, FAQ, final CTA |
| `/[service]` | `content/services/*.md` | One page per service (see list below) |
| `/service-area` | `pages/service-area.astro` | Cities served; links to optional city pages |
| `/service-area/[city]` | `content/areas/*.md` (optional, Phase 6) | Local landing pages, only where there is genuinely unique content |
| `/about` | `pages/about.astro` | Story, license, credentials, team |
| `/contact` | `pages/contact.astro` | Full quote form, phone, email, hours, map embed (lazy-loaded) |
| `/privacy-policy` | `pages/privacy-policy.astro` | Privacy policy covering form data and SMS consent |
| `/thank-you` | `pages/thank-you.astro` | Post-submit confirmation (noindex) |
| `/404` | `pages/404.astro` | Helpful 404 with service links |

**Initial services (one Markdown file each):** concrete-contractor, stucco-contractor, drywall-contractor, waterproofing, home-remodeling, adu-construction, room-additions, home-repairs.

---

## 5. Content Model (`src/content.config.ts`)

### `services` collection
```ts
{
  title: string,              // "Concrete Contractor"
  slug: string,               // "concrete-contractor"
  metaTitle: string,          // ≤ 60 chars
  metaDescription: string,    // 140–160 chars
  heroHeading: string,
  heroSubheading: string,
  heroImage: image(),
  icon: string,               // lucide icon name
  summary: string,            // card text on homepage, ≤ 160 chars
  offerings: string[],        // bullet list of sub-services
  process: { step: string; detail: string }[],
  faqs: { q: string; a: string }[],   // 4–8 per page; powers FAQPage schema
  gallery: { src: image(); alt: string }[],
  related: string[],          // slugs of related services
  order: number,
  draft: boolean,
}
```
The Markdown body holds the long-form copy (600–1,200 words, with H2/H3 structure).

### `testimonials` collection (JSON or YAML)
`{ name, location, service, rating (1–5), quote, date }`

### `projects` collection (optional)
`{ title, service, city, images[], summary }`

All schemas use Zod and the build must fail on invalid content.

---

## 6. Components

```
src/components/
  layout/   BaseLayout.astro, Header.astro (sticky, blurred bg, mobile drawer), Footer.astro, MobileCallBar.astro
  seo/      SEO.astro (title, meta, canonical, OG/Twitter), Schema.astro (JSON-LD helpers)
  ui/       Button.astro, Section.astro, Container.astro, Card.astro, Badge.astro, Accordion.astro (<details>-based, no JS)
  sections/ Hero, TrustBar, ServicesGrid, WhyUs, ProcessSteps, Gallery, Testimonials, ServiceAreas, FAQ, CTABanner
  forms/    QuoteForm.astro
```

- **Header:** logo/wordmark, service dropdown, About, Service Area, Contact, and a "Call Now" + "Free Estimate" CTA.
- **MobileCallBar:** a fixed bottom bar on mobile with Call and Get Estimate buttons.
- **Accordion/FAQ:** native `<details>/<summary>`, accessible, no JS.
- **Layout:** max content width 1200px; spacing on a consistent 4/8px scale.

---

## 7. Lead Form & GHL Integration

### Fields
Name*, Phone*, Email*, Service (select, populated from the services collection)*, ZIP*, Project details (textarea), Preferred contact method (radio), SMS consent checkbox (unchecked by default, with TCPA-compliant wording), hidden fields: `source_page`, `utm_source`, `utm_medium`, `utm_campaign`, `gclid`, honeypot `company_website`.

### Behavior
1. Progressive enhancement: a standard `<form method="POST" action="/api/leads">` that works without JS, enhanced with `fetch` for inline success/error states.
2. On JS load, read UTM/gclid params from the URL (persist them in `sessionStorage`) into hidden fields.
3. Client-side validation using native HTML attributes plus clear inline error messages.

### `src/pages/api/leads.ts` (`export const prerender = false`)
1. Parse form data and validate it with Zod.
2. Reject the request if the honeypot is filled (still return 200 to bots).
3. Verify the Turnstile token server-side (`TURNSTILE_SECRET_KEY`).
4. POST JSON to `GHL_WEBHOOK_URL` with the payload `{ firstName, lastName, phone, email, service, zip, message, smsConsent, source: "website", sourcePage, utm_*, gclid, submittedAt }`.
5. On success, return `303` → `/thank-you` (no-JS) or `{ ok: true }` (JS).
6. On failure, log the error and return a friendly error with the phone number as a fallback. Never expose the webhook URL.

### Environment variables (`.env.example`)
```
GHL_WEBHOOK_URL=
TURNSTILE_SITE_KEY=
TURNSTILE_SECRET_KEY=
PUBLIC_SITE_URL=
```

---

## 8. SEO / AEO Requirements

- **Per page:** unique `<title>` and meta description, canonical URL, OG/Twitter tags, and an auto-generated OG image or a default `og-image.png`.
- **JSON-LD (generated from `site.config.ts`):**
  - Sitewide: `["LocalBusiness","GeneralContractor"]` with name, url, telephone, email, address, geo, openingHours, areaServed, `hasCredential` (CSLB license), and `sameAs` (social links).
  - Service pages: `Service` (provider → the business, areaServed) + `FAQPage` + `BreadcrumbList`.
  - Homepage: `WebSite` + the business.
  - Testimonials: `Review`/`AggregateRating` only if the reviews are real and shown on the page.
- **AEO patterns:** each service page opens with a 2–3 sentence direct answer ("What does a concrete contractor in {{CITY}} do?"), uses question-style H2s, and has an FAQ block. Add `llms.txt` at the root summarizing the business and linking to the key pages.
- `@astrojs/sitemap` and `robots.txt` (exclude `/thank-you` and `/api/`).
- Semantic HTML: one H1 per page, a logical heading order, and descriptive internal links between related services.
- Every image has meaningful `alt` text, explicit dimensions, AVIF/WebP output, and lazy loading below the fold. The hero image is preloaded.
- **No hotlinked images.** Every image must be owned or licensed and stored in `src/assets/`.

---

## 9. Build Phases (stop for review after each)

1. **Scaffold:** Astro + TypeScript strict + Tailwind v4 + Vercel adapter + ESLint/Prettier + `site.config.ts` + theme tokens + BaseLayout/Header/Footer/MobileCallBar. Placeholder home page. `pnpm build` passes.
2. **Content system:** content collections and schemas, the dynamic `[service].astro` template, and 8 service Markdown files with realistic placeholder copy (clearly marked `TODO: client copy`), plus the testimonials collection.
3. **Pages & sections:** homepage sections, About, Service Area, Contact, Privacy, Thank-you, 404.
4. **Lead pipeline:** QuoteForm, `/api/leads`, Turnstile, UTM capture, and GHL webhook forwarding. Add a mock mode (`GHL_WEBHOOK_URL` unset → log the payload to the console) for local development.
5. **SEO/AEO:** SEO component, all JSON-LD, sitemap, robots, llms.txt, OG images, and breadcrumbs.
6. **Polish & QA:** accessibility pass, Lighthouse, responsive check at 360/768/1280px, optional city pages, `README.md` with a "clone for a new client" checklist.
7. *(Optional)* **Keystatic:** add Keystatic (GitHub mode) so a client can edit services, testimonials, and site settings without touching code.

---

## 10. Acceptance Criteria

- [ ] `pnpm build` succeeds with zero type errors; invalid content fails the build.
- [ ] Lighthouse mobile ≥ 95 in Performance, Accessibility, Best Practices, and SEO on `/` and one service page.
- [ ] Total JS shipped on the homepage < 20 KB (excluding Turnstile).
- [ ] All JSON-LD validates in Google's Rich Results Test and the Schema.org validator.
- [ ] The form works with JS disabled, rejects bots via honeypot and Turnstile, and delivers a correctly shaped payload to GHL (verified against a webhook.site URL).
- [ ] No hardcoded business data outside `site.config.ts` and `src/content/` (a grep for the phone number finds only the config).
- [ ] WCAG 2.2 AA: keyboard-navigable nav and form, visible focus states, contrast ≥ 4.5:1, labeled inputs.
- [ ] No external image URLs anywhere in the build output.
- [ ] README explains local setup, environment variables, Vercel deploy, and how to clone the site for a new client.

---

## 11. Project Conventions (copy into `CLAUDE.md`)

- Use TypeScript everywhere; no `any`.
- Use Tailwind utilities; extract a component instead of `@apply`-ing large class blocks.
- Write components as `.astro` files. Add a framework island only with written justification in `DECISIONS.md`.
- Commit at the end of each phase with a descriptive message; work on a feature branch per phase.
- Don't invent business facts (license numbers, years in business, review counts). Use `{{PLACEHOLDER}}` and list every placeholder in `TODO.md`.
