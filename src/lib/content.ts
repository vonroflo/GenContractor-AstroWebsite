import { getCollection, getEntry, type CollectionEntry } from "astro:content";

export async function getHome(): Promise<CollectionEntry<"home">["data"]> {
  const entry = await getEntry("home", "home");
  if (!entry) throw new Error("Missing homepage content: src/content/home.yaml");
  return entry.data;
}

export async function getPage(id: string): Promise<CollectionEntry<"pages">> {
  const entry = await getEntry("pages", id);
  if (!entry) throw new Error(`Missing page content: src/content/pages/${id}.md`);
  return entry;
}

/** Testimonials, newest first. */
export async function getTestimonials(): Promise<CollectionEntry<"testimonials">[]> {
  const entries = await getCollection("testimonials");
  return entries.sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
}
