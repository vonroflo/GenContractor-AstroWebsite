import { getCollection, type CollectionEntry } from "astro:content";

export type Service = CollectionEntry<"services">;

/** Published services, in display order. */
export async function getServices(): Promise<Service[]> {
  const entries = await getCollection("services", ({ data }) => !data.draft);
  return entries.sort((a, b) => a.data.order - b.data.order);
}

export const serviceHref = (service: Service) => `/${service.data.slug}`;
