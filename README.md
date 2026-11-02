# GALXBOY Website

The official website for **GALXBOY**, a South African streetwear brand founded by Thatiso “Vuittots” Dube. The brand began in Mamelodi, Pretoria, and the website lists its store in Berea, East London.

- **Live website:** [galxboyz.netlify.app](https://galxboyz.netlify.app/)
- **Project author:** W Ngqandu

## Website pages

| Page | File | What it contains |
| --- | --- | --- |
| Home | `index.html` | GALXBOY's history and links to the main sections |
| About | `about.html` | The brand story, mission, vision and store photo gallery |
| Shop | `service.html` | Product catalogue with search, category filtering, sorting and enlarged product photos |
| Enquiry | `enquiry.html` | Product, size and delivery selection with an estimated total and availability |
| Support | `support.html` | Frequently asked questions about orders, sizing, delivery and contacting the team |
| Contact | `contact.html` | Contact details, a message form and a map of the East London store |

## Project files

- `styles.css` — shared responsive styles for all pages.
- `script.js` — shared JavaScript for navigation, product listings, forms, tabs, the FAQ accordion, photo lightboxes and the map.
- `images/` — GALXBOY product and store photographs, plus the site favicon.
- `robots.txt` and `sitemap.xml` — crawler instructions and the list of public website pages.

## Built with

- Semantic HTML5
- CSS3, including responsive layouts and reduced-motion support
- Vanilla JavaScript (ES2020); no build tools or framework are required
- [Leaflet](https://leafletjs.com/) 1.9.4 and OpenStreetMap for the store map
- [FormSubmit](https://formsubmit.co/) for enquiry form delivery

## Features

- Responsive navigation and layouts for desktop, tablet and mobile screens.
- Accessible tabs, FAQ accordion, keyboard-operable photo lightboxes and form validation.
- Product search, category filter and sorting on the Shop page.
- Enquiry form that calculates an estimated product and delivery total and reports catalogue availability.
- Contact form that prepares an email for the visitor to review and send.
- Reduced-motion support and keyboard focus styles.

Product prices, availability, delivery charges and lead times are configured in `script.js`. They are catalogue estimates maintained by the site and are not connected to a live inventory or order-management system. Confirm current details with GALXBOY before relying on them.

## Contact details shown on the website

- **Email:** [wamachumangqandu@gmail.com](mailto:wamachumangqandu@gmail.com)
- **Phone:** [0738898423](tel:+27738898423)
- **Store:** 28 Stewart Drive, Berea, East London, South Africa

## Run locally

Open `index.html` in a web browser. There is no build or installation step. An internet connection is needed for the map tiles and online enquiry form delivery.

## References

- Leaflet: [leafletjs.com](https://leafletjs.com/)
- FormSubmit: [formsubmit.co](https://formsubmit.co/)
- OpenStreetMap: [openstreetmap.org](https://www.openstreetmap.org/)
