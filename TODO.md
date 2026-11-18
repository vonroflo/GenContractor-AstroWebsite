# TODO

## Placeholders to replace (all in `src/site.config.ts`)

| Placeholder                              | What it is                                                                |
| ---------------------------------------- | ------------------------------------------------------------------------- |
| `{{BUSINESS_NAME}}`                      | Public business name                                                      |
| `{{LEGAL_NAME}}`                         | Legal entity name (footer copyright)                                      |
| `{{TAGLINE}}`                            | Short descriptor, e.g. "Licensed General Contractor"                      |
| `{{DOMAIN}}`                             | Production domain                                                         |
| `{{PHONE}}`                              | Phone in display format                                                   |
| `{{PHONE_DIGITS}}`                       | 10-digit phone for `tel:` links / E.164                                   |
| `{{EMAIL}}`                              | Contact email                                                             |
| `{{CITY}}`                               | Primary city                                                              |
| `{{ZIP}}`                                | Business ZIP code                                                         |
| `{{CSLB_NUMBER}}`                        | CSLB license number (appears in `license.number` and `license.verifyUrl`) |
| `{{NEARBY_CITY_1}}`, `{{NEARBY_CITY_2}}` | Additional service-area cities                                            |

Also set: `geo.lat` / `geo.lng`, `hours`, `social` URLs, `theme` colors.

## Content

- Anything marked `TODO: client copy` needs real copy from the client.
- Replace `public/favicon.svg` with the client's mark.
- Service pages (`src/content/services/*.md`): all copy is placeholder (`# TODO: client copy` in each frontmatter). Review for accuracy against what the client actually offers.
- `src/assets/services/*.jpg` are generated placeholders. Replace with real, owned project photos (keep the filenames or update the frontmatter paths) and update `heroImageAlt` / gallery `alt` text.
- `src/content/testimonials.json`: replace the three placeholders (`{{REVIEWER_NAME_1..3}}`) with real reviews and set `placeholder: false`.
