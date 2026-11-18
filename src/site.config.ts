/**
 * Single source of truth for all business data.
 * No component may hardcode a business name, phone, city, or license number.
 * Every {{PLACEHOLDER}} is listed in TODO.md.
 */
export const site = {
  name: "{{BUSINESS_NAME}}",
  legalName: "{{LEGAL_NAME}}",
  tagline: "{{TAGLINE}}", // e.g. "Licensed General Contractor"
  url: "https://{{DOMAIN}}",
  phone: "{{PHONE}}", // display format
  phoneE164: "+1{{PHONE_DIGITS}}",
  email: "{{EMAIL}}",
  address: { locality: "{{CITY}}", region: "CA", postalCode: "{{ZIP}}", country: "US" },
  geo: { lat: 0, lng: 0 },
  license: {
    board: "California Contractors State License Board",
    number: "{{CSLB_NUMBER}}",
    verifyUrl:
      "https://www.cslb.ca.gov/OnlineServices/CheckLicenseII/LicenseDetail.aspx?LicNum={{CSLB_NUMBER}}",
  },
  hours: [{ days: "Mo-Fr", open: "07:00", close: "17:00" }],
  serviceAreas: ["{{CITY}}", "{{NEARBY_CITY_1}}", "{{NEARBY_CITY_2}}"],
  social: { google: "", facebook: "", instagram: "", yelp: "" },
  theme: { primary: "#1F3A5F", accent: "#E07A1F" }, // fed into Tailwind @theme tokens
  ghl: { webhookEnv: "GHL_WEBHOOK_URL" },
} as const;

export type Site = typeof site;

/** Main navigation. Service links are added from the services collection in Phase 2. */
export const nav = [
  { label: "About", href: "/about" },
  { label: "Service Area", href: "/service-area" },
  { label: "Contact", href: "/contact" },
] as const;
