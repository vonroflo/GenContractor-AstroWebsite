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
