import { defineCollection, reference } from "astro:content";
import { file, glob } from "astro/loaders";
import { z } from "astro/zod";
import lucide from "@iconify-json/lucide/icons.json";
import { fillTokens } from "@/lib/tokens";

/** A string that may contain {city}-style tokens, filled before length checks run. */
const text = (min = 1, max = Infinity) =>
  z.string().transform(fillTokens).pipe(z.string().min(min).max(max));

const lucideIcon = z.string().refine((name) => name in lucide.icons || name in lucide.aliases, {
  message: "not a Lucide icon name (see https://lucide.dev/icons)",
});

const faq = z.object({ q: text(), a: text() });

const services = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/services" }),
  schema: ({ image }) =>
    z
      .object({
        title: z.string(),
        slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "slug must be kebab-case"),
        metaTitle: text(10, 60),
        metaDescription: text(140, 160),
        heroHeading: text(),
        heroSubheading: text(),
        heroImage: image(),
        heroImageAlt: text(),
        icon: lucideIcon,
        summary: text(1, 160),
        offerings: z.array(text()).min(1),
        process: z.array(z.object({ step: text(), detail: text() })).min(1),
        faqs: z.array(faq).min(4).max(8),
        gallery: z.array(z.object({ src: image(), alt: text() })).default([]),
        related: z.array(reference("services")).default([]),
        order: z.number().int(),
        draft: z.boolean().default(false),
      })
      .strict(),
});

const testimonials = defineCollection({
  loader: file("./src/content/testimonials.json"),
  schema: z
    .object({
      id: z.string(),
      name: z.string(),
      location: text(),
      service: reference("services"),
      rating: z.number().int().min(1).max(5),
      quote: text(),
      date: z.coerce.date(),
      // Placeholder reviews render on the page but never emit Review/AggregateRating schema.
      placeholder: z.boolean().default(false),
    })
    .strict(),
});

/** Homepage copy. A single entry ("home") so the homepage is content, not code. */
const home = defineCollection({
  loader: file("./src/content/home.yaml"),
  schema: ({ image }) =>
    z
      .object({
        metaTitle: text(10, 60),
        metaDescription: text(140, 160),
        hero: z.object({
          eyebrow: text(),
          heading: text(),
          subheading: text(),
          image: image(),
          imageAlt: text(),
          points: z.array(text()).max(4),
        }),
        trust: z
          .array(z.object({ icon: lucideIcon, label: text() }))
          .min(2)
          .max(5),
        services: z.object({ heading: text(), intro: text() }),
        whyUs: z.object({
          heading: text(),
          intro: text(),
          items: z.array(z.object({ icon: lucideIcon, title: text(), text: text() })).min(3),
        }),
        process: z.object({
          heading: text(),
          steps: z
            .array(z.object({ step: text(), detail: text() }))
            .min(3)
            .max(6),
        }),
        gallery: z.object({ heading: text(), intro: text() }),
        testimonials: z.object({ heading: text(), intro: text() }),
        serviceAreas: z.object({ heading: text(), intro: text() }),
        faq: z.object({ heading: text(), items: z.array(faq).min(4).max(8) }),
        cta: z.object({ heading: text(), text: text() }),
      })
      .strict(),
});

/** Long-form standalone pages (about, service area, contact, privacy policy). */
const pages = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/pages" }),
  schema: ({ image }) =>
    z
      .object({
        metaTitle: text(10, 60),
        metaDescription: text(140, 160),
        heading: text(),
        intro: text().optional(),
        image: image().optional(),
        imageAlt: text().optional(),
        updated: z.coerce.date().optional(),
      })
      .strict()
      .refine((d) => !d.image || d.imageAlt, {
        message: "imageAlt is required when image is set",
        path: ["imageAlt"],
      }),
});

export const collections = { services, testimonials, home, pages };
