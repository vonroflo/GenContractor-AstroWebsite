import { defineCollection, reference } from "astro:content";
import { file, glob } from "astro/loaders";
import { z } from "astro/zod";
import lucide from "@iconify-json/lucide/icons.json";
import { fillTokens } from "@/lib/tokens";

/** A string that may contain {city}-style tokens, filled before length checks run. */
const text = (min = 1, max = Infinity) =>
  z.string().transform(fillTokens).pipe(z.string().min(min).max(max));

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
        icon: z.string().refine((name) => name in lucide.icons || name in lucide.aliases, {
          message: "not a Lucide icon name (see https://lucide.dev/icons), e.g. 'hammer'",
        }),
        summary: text(1, 160),
        offerings: z.array(text()).min(1),
        process: z.array(z.object({ step: text(), detail: text() })).min(1),
        faqs: z
          .array(z.object({ q: text(), a: text() }))
          .min(4)
          .max(8),
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

export const collections = { services, testimonials };
