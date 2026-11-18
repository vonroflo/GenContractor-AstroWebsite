// Relative import: astro.config.mjs loads this file before the "@/" alias exists.
import { site } from "../site.config";

/**
 * Content files write {city}, {region}, {business}, {phone}, etc. instead of literal
 * business data, so cloning for a new client stays a config change.
 * Frontmatter is filled by the content schemas; Markdown bodies by remarkSiteTokens.
 */
const tokens: Record<string, string> = {
  city: site.address.locality,
  region: site.address.region,
  business: site.name,
  phone: site.phone,
  email: site.email,
  legalName: site.legalName,
  license: site.license.number,
  serviceAreas: site.serviceAreas.join(", "),
};

const tokenPattern = new RegExp(`\\{(${Object.keys(tokens).join("|")})\\}`, "g");

export const fillTokens = (text: string): string =>
  text.replace(tokenPattern, (_, key: string) => tokens[key] ?? "");

interface MdastNode {
  type: string;
  value?: string;
  url?: string;
  children?: MdastNode[];
}

/** Remark plugin: fills site tokens in Markdown text, inline code, and link URLs. */
export function remarkSiteTokens() {
  const walk = (node: MdastNode) => {
    if (typeof node.value === "string") node.value = fillTokens(node.value);
    if (typeof node.url === "string") node.url = fillTokens(node.url);
    node.children?.forEach(walk);
  };
  return (tree: MdastNode) => walk(tree);
}
