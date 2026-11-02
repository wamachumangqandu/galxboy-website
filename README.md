# GALXBOY Website

The official website for **GALXBOY**, a South African streetwear brand founded by Thatiso “Vuittots” Dube. The brand began in Mamelodi, Pretoria, and the website lists its store in Berea, East London.

- **Live website:** [galxboyz.netlify.app](https://galxboyz.netlify.app/)
- **GitHub repository:** [wamachumangqandu/galxboy-website](https://github.com/wamachumangqandu/galxboy-website)
- **Project author:** W Ngqandu

## Website pages

| Page | File | What it contains |
| --- | --- | --- |
| Home | `index.html` | GALXBOY's history and links to the main sections |
| About | `about.html` | The brand story, mission, vision and store photo gallery |
| Shop | `service.html` | Product catalogue with search, category filtering, sorting and enlarged product photos |
| Enquiry | `enquiry.html` | Product, size and delivery request with an estimated items subtotal |
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
- Enquiry form that calculates an estimated items subtotal and lets the team confirm availability, delivery charges and fulfilment timing.
- Enquiry form uses AJAX to send submissions to FormSubmit.
- Contact form validates and submits messages to FormSubmit with AJAX, with standard form and email-app fallbacks if sending fails.
- Reduced-motion support and keyboard focus styles.

The enquiry form does not contain stock counts, delivery fees or lead-time estimates. It shows the configured product-price subtotal only; availability, delivery charges and fulfilment timing are confirmed by the GALXBOY team. Product prices should also be confirmed with the team before placing an order.

FormSubmit requires the recipient to activate the email address after its first form submission. Check the recipient inbox and spam folder for the activation email and follow its link; the website cannot activate the address on the recipient's behalf.

## Contact details shown on the website

- **Email:** [wamachumangqandu@gmail.com](mailto:wamachumangqandu@gmail.com)
- **Phone:** [0738898423](tel:+27738898423)
- **Store:** 28 Stewart Drive, Berea, East London, South Africa

## Run locally

Open `index.html` in a web browser. There is no build or installation step. An internet connection is needed for the map tiles and online form delivery.

## Changelog

### 2 November 2026

- Updated the enquiry flow to remove unverified sample stock counts, delivery charges and fulfilment times. The form now shows an estimated items subtotal and asks the GALXBOY team to confirm availability, delivery and timing.
- Updated the related copy on the Home, Shop, Support and Enquiry pages to describe the confirmation process accurately.
- Both Enquiry and Contact forms submit with AJAX and provide an email fallback if automatic sending fails.
- Corrected `robots.txt` to reference the sitemap and updated every sitemap URL to the live `galxboyz.netlify.app` domain.
- Added the GitHub repository link and current contact details to this README.

## References

- FormSubmit. Form submission service: [formsubmit.co](https://formsubmit.co/).
- Leaflet. Interactive map library: [leafletjs.com](https://leafletjs.com/).
- MDN Web Docs. HTML forms guide: [developer.mozilla.org](https://developer.mozilla.org/en-US/docs/Learn_web_development/Extensions/Forms).
- MDN Web Docs. Fetch API: [developer.mozilla.org](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API).
- OpenStreetMap contributors. Map data and copyright: [openstreetmap.org](https://www.openstreetmap.org/copyright).
- W3C Web Accessibility Initiative. ARIA Authoring Practices Guide: [w3.org/WAI/ARIA/apg](https://www.w3.org/WAI/ARIA/apg/).
