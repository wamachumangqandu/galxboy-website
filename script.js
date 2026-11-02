/* ==========================================================================
   GALXBOY — script.js
   One JavaScript file for every page. Each feature starts only if the
   elements it needs exist on the current page.

   Contents
   0.  Settings you may want to edit (contact details, products, prices)
   1.  Helpers
   2.  Navigation (hamburger menu)
   3.  Scroll reveal animation
   4.  Lightbox (shop grid and About gallery)
   5.  Shop: dynamic product list, search, filter, sort
   6.  About: tabs
   7.  Support: accordion
   8.  Form validation helpers
   9.  Enquiry form: validation, price and availability, AJAX submit
   10. Contact form: validation and email compile
   11. Contact page: interactive map (Leaflet)
   ========================================================================== */

(function () {
  "use strict";

  document.documentElement.classList.add("js");

  /* 0. Settings ----------------------------------------------------------- */

  const SITE = {
    recipient: "wamachumangqandu@gmail.com", // where compiled emails are addressed
    address: "28 Stewart Drive, Berea, East London, South Africa",
    // Approximate pin for Berea, East London. Check it against the exact address.
    mapCenter: [-33.0036, 27.8962],
    mapZoom: 15,
  };

  const SIZES = ["S", "M", "L", "XL", "XXL"];

  // SAMPLE DATA: stock counts, lead times and delivery fees below are
  // placeholders. Replace them with the real figures before going live.
  const PRODUCTS = [
    {
      id: "bafana-active-tshirt",
      name: "Bafana Active T-Shirt",
      category: "T-shirts",
      colour: "Green and gold",
      price: 700,
      img: "images/bafana-active-tshirt.jpg",
      w: 597,
      h: 444,
      alt: "GALXBOY Bafana Active T-shirt in black with green and gold stripes and the number 10",
      stock: { S: 2, M: 5, L: 4, XL: 0, XXL: 1 },
    },
    {
      id: "mini-coin-tshirt",
      name: "Mini Coin T-Shirt",
      category: "T-shirts",
      colour: "Black",
      price: 700,
      img: "images/mini-coin-tshirt-black.jpg",
      w: 483,
      h: 444,
      alt: "Black GALXBOY Mini Coin T-shirt with the GXB circle logo on the chest",
      stock: { S: 6, M: 8, L: 8, XL: 3, XXL: 0 },
    },
    {
      id: "galxboy-hoodie",
      name: "GALXBOY Hoodie",
      category: "Hoodies",
      colour: "South African flag",
      price: 700,
      img: "images/galxboy-flag-hoodie.jpg",
      w: 486,
      h: 444,
      alt: "GALXBOY hoodie in blue, red, green and white flag colours with the brand name across the chest",
      stock: { S: 1, M: 2, L: 3, XL: 2, XXL: 0 },
    },
    {
      id: "vintage-tshirt-white",
      name: "Vintage T-Shirt (White)",
      category: "T-shirts",
      colour: "White",
      price: 700,
      img: "images/vintage-tshirt-white.jpg",
      w: 510,
      h: 444,
      alt: "White GALXBOY vintage T-shirt with a red, green and yellow crest print",
      stock: { S: 4, M: 6, L: 6, XL: 5, XXL: 2 },
    },
    {
      id: "vintage-tshirt-black",
      name: "Vintage T-Shirt (Black)",
      category: "T-shirts",
      colour: "Black",
      price: 700,
      img: "images/vintage-tshirt-black.jpg",
      w: 525,
      h: 444,
      alt: "Black GALXBOY vintage T-shirt with a red, green and yellow crest print",
      stock: { S: 3, M: 7, L: 5, XL: 0, XXL: 2 },
    },
  ];

  const COLLECT = "Collect in store";
  const DELIVERY_FEES = {
    [COLLECT]: 0,
    "Eastern Cape": 60,
    "Western Cape": 95,
    "Gauteng": 95,
    "KwaZulu-Natal": 95,
    "Free State": 95,
    "Mpumalanga": 110,
    "Limpopo": 110,
    "North West": 110,
    "Northern Cape": 120,
  };

  const LEAD_TIME = {
    inStock: "Ready to ship in 2 to 3 working days",
    partial: "In-stock items ship in 2 to 3 working days; the rest is a pre-order of 10 to 14 days",
    out: "Pre-order only: allow 10 to 14 days if we restock this size",
  };

  /* 1. Helpers ------------------------------------------------------------ */

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  const prefersReducedMotion = () =>
    window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Builds DOM nodes with textContent only, so user-supplied text is never parsed as HTML.
  function el(tag, attrs, ...children) {
    const node = document.createElement(tag);
    Object.entries(attrs || {}).forEach(([key, value]) => {
      if (value === false || value === null || value === undefined) return;
      if (key === "class") node.className = value;
      else if (key === "text") node.textContent = value;
      else node.setAttribute(key, value === true ? "" : value);
    });
    children.flat().forEach((child) => {
      if (child !== null && child !== undefined) node.append(child);
    });
    return node;
  }

  const rand = (n) => "R" + Number(n).toLocaleString("en-ZA", { maximumFractionDigits: 0 }).replace(/ /g, " ");

  function todayISO(offsetDays = 0) {
    const d = new Date();
    d.setDate(d.getDate() + offsetDays);
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return d.getFullYear() + "-" + mm + "-" + dd;
  }

  function mailtoLink(subject, body) {
    return (
      "mailto:" + SITE.recipient + "?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(body)
    );
  }

  /* 2. Navigation --------------------------------------------------------- */

  function initNav() {
    const toggle = $(".nav-toggle");
    const nav = $("#site-nav");
    if (!toggle || !nav) return;

    const setOpen = (open) => {
      nav.classList.toggle("is-open", open);
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    };

    toggle.addEventListener("click", () => setOpen(!nav.classList.contains("is-open")));

    nav.addEventListener("click", (event) => {
      if (event.target.closest("a")) setOpen(false);
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && nav.classList.contains("is-open")) {
        setOpen(false);
        toggle.focus();
      }
    });

    document.addEventListener("click", (event) => {
      if (nav.classList.contains("is-open") && !event.target.closest(".site-header")) setOpen(false);
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth > 768) setOpen(false);
    });
  }

  /* 3. Scroll reveal animation -------------------------------------------- */

  let revealObserver = null;

  function observeReveals(root = document) {
    const items = $$(".reveal:not(.is-visible)", root);
    if (!items.length) return;

    if (!("IntersectionObserver" in window) || prefersReducedMotion()) {
      items.forEach((item) => item.classList.add("is-visible"));
      return;
    }

    if (!revealObserver) {
      revealObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("is-visible");
              revealObserver.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
      );
    }
    items.forEach((item) => revealObserver.observe(item));
  }

  /* 4. Lightbox ----------------------------------------------------------- */

  const lightbox = {
    root: null,
    img: null,
    caption: null,
    count: null,
    prev: null,
    next: null,
    close: null,
    items: [],
    index: 0,
    opener: null,

    build() {
      if (this.root) return;
      this.img = el("img", { class: "lightbox__img", alt: "" });
      this.caption = el("span", { class: "lightbox__text" });
      this.count = el("span", { class: "lightbox__count" });
      this.prev = el("button", { class: "lightbox__btn lightbox__btn--prev", type: "button", "aria-label": "Previous image", text: "‹" });
      this.next = el("button", { class: "lightbox__btn lightbox__btn--next", type: "button", "aria-label": "Next image", text: "›" });
      this.close = el("button", { class: "lightbox__btn lightbox__btn--close", type: "button", "aria-label": "Close image viewer", text: "×" });
      const figure = el("figure", { class: "lightbox__figure" }, this.img, el("figcaption", { class: "lightbox__caption" }, this.caption, this.count));
      this.root = el("div", { class: "lightbox", role: "dialog", "aria-modal": "true", "aria-label": "Image viewer" }, this.close, this.prev, figure, this.next);
      document.body.append(this.root);

      this.close.addEventListener("click", () => this.hide());
      this.prev.addEventListener("click", () => this.show(this.index - 1));
      this.next.addEventListener("click", () => this.show(this.index + 1));
      this.root.addEventListener("click", (event) => {
        if (event.target === this.root) this.hide();
      });
      document.addEventListener("keydown", (event) => this.onKey(event));
    },

    open(items, index, opener) {
      this.build();
      this.items = items;
      this.opener = opener || null;
      this.show(index);
      this.root.classList.add("is-open");
      document.body.style.overflow = "hidden";
      this.close.focus();
    },

    show(index) {
      const total = this.items.length;
      this.index = (index + total) % total;
      const item = this.items[this.index];
      this.img.src = item.src;
      this.img.alt = item.alt;
      this.caption.textContent = item.caption;
      this.count.textContent = total > 1 ? "Image " + (this.index + 1) + " of " + total : "";
      this.prev.hidden = this.next.hidden = total < 2;
    },

    hide() {
      if (!this.root || !this.root.classList.contains("is-open")) return;
      this.root.classList.remove("is-open");
      document.body.style.overflow = "";
      if (this.opener && document.contains(this.opener)) this.opener.focus();
    },

    onKey(event) {
      if (!this.root || !this.root.classList.contains("is-open")) return;
      if (event.key === "Escape") this.hide();
      else if (event.key === "ArrowLeft") this.show(this.index - 1);
      else if (event.key === "ArrowRight") this.show(this.index + 1);
      else if (event.key === "Tab") {
        // Keep keyboard focus inside the dialog while it is open
        const focusable = [this.close, this.prev, this.next].filter((b) => !b.hidden);
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    },
  };

  function initLightbox() {
    document.addEventListener("click", (event) => {
      const trigger = event.target.closest("[data-lightbox]");
      if (!trigger) return;
      const group = $$('[data-lightbox="' + trigger.dataset.lightbox + '"]');
      const items = group.map((btn) => {
        const image = $("img", btn);
        return {
          src: btn.dataset.full || image.currentSrc || image.src,
          alt: image.alt,
          caption: btn.dataset.caption || image.alt,
        };
      });
      lightbox.open(items, group.indexOf(trigger), trigger);
    });
  }

  /* 5. Shop --------------------------------------------------------------- */

  function initShop() {
    const grid = $("#product-grid");
    if (!grid) return;

    const search = $("#shop-search");
    const category = $("#shop-category");
    const sort = $("#shop-sort");
    const status = $("#shop-status");
    const empty = $("#shop-empty");

    // Category options come from the data so they never go out of date
    [...new Set(PRODUCTS.map((p) => p.category))].sort().forEach((name) => {
      category.append(el("option", { value: name, text: name }));
    });

    function productCard(product, index) {
      return el(
        "li",
        { class: "product-card reveal", style: "--i:" + Math.min(index, 8) },
        el(
          "button",
          {
            class: "product-card__media",
            type: "button",
            "data-lightbox": "shop",
            "data-full": product.img,
            "data-caption": product.name + " (" + rand(product.price) + ")",
            "aria-label": "View larger photo of " + product.name,
          },
          el("img", { src: product.img, alt: product.alt, width: product.w, height: product.h, loading: "lazy", decoding: "async" })
        ),
        el("h3", { text: product.name }),
        el("p", { class: "product-card__meta", text: product.category }),
        el("p", { class: "product-card__price", text: rand(product.price) }),
        el("a", { class: "btn btn--ghost", href: "enquiry.html?product=" + encodeURIComponent(product.id), text: "Enquire" })
      );
    }

    function filtered() {
      const query = search.value.trim().toLowerCase();
      let list = PRODUCTS.filter((p) => {
        const haystack = (p.name + " " + p.category + " " + p.colour).toLowerCase();
        const matchesQuery = !query || query.split(/\s+/).every((word) => haystack.includes(word));
        const matchesCategory = !category.value || p.category === category.value;
        return matchesQuery && matchesCategory;
      });

      const order = sort.value;
      if (order === "name-asc") list = list.slice().sort((a, b) => a.name.localeCompare(b.name));
      if (order === "name-desc") list = list.slice().sort((a, b) => b.name.localeCompare(a.name));
      if (order === "price-asc") list = list.slice().sort((a, b) => a.price - b.price);
      if (order === "price-desc") list = list.slice().sort((a, b) => b.price - a.price);
      return list;
    }

    function render() {
      const list = filtered();
      grid.replaceChildren(...list.map(productCard));
      observeReveals(grid);

      const query = search.value.trim();
      status.textContent =
        "Showing " + list.length + " of " + PRODUCTS.length + " products" + (query ? ' for "' + query + '"' : "") + ".";

      empty.replaceChildren();
      if (!list.length) {
        empty.append(
          el("p", { text: "No products match your search." }),
          el("button", { class: "btn btn--ghost", type: "button", text: "Clear search and filters" })
        );
        $("button", empty).addEventListener("click", () => {
          search.value = "";
          category.value = "";
          sort.value = "featured";
          render();
          search.focus();
        });
      }
    }

    [search, category, sort].forEach((control) => control.addEventListener("input", render));
    $("#shop-tools").addEventListener("submit", (event) => event.preventDefault());
    render();
  }

  /* 6. About: tabs -------------------------------------------------------- */

  function initTabs() {
    $$(".tabs").forEach((tabs) => {
      const buttons = $$('[role="tab"]', tabs);
      const panels = $$('[role="tabpanel"]', tabs);
      if (!buttons.length) return;

      function select(index, focus) {
        buttons.forEach((button, i) => {
          const active = i === index;
          button.setAttribute("aria-selected", String(active));
          button.tabIndex = active ? 0 : -1;
          panels[i].hidden = !active;
          if (active) {
            panels[i].classList.remove("is-entering");
            void panels[i].offsetWidth; // restart the CSS animation
            panels[i].classList.add("is-entering");
          }
        });
        if (focus) buttons[index].focus();
      }

      buttons.forEach((button, i) => {
        button.addEventListener("click", () => select(i, false));
        button.addEventListener("keydown", (event) => {
          const last = buttons.length - 1;
          const keys = {
            ArrowRight: i === last ? 0 : i + 1,
            ArrowLeft: i === 0 ? last : i - 1,
            Home: 0,
            End: last,
          };
          if (event.key in keys) {
            event.preventDefault();
            select(keys[event.key], true);
          }
        });
      });

      select(0, false);
    });
  }

  /* 7. Support: accordion ------------------------------------------------- */

  function initAccordion() {
    $$(".accordion").forEach((accordion) => {
      $$(".accordion__button", accordion).forEach((button) => {
        const panel = document.getElementById(button.getAttribute("aria-controls"));
        if (!panel) return;
        const inner = panel.firstElementChild;

        const setOpen = (open) => {
          button.setAttribute("aria-expanded", String(open));
          panel.dataset.collapsed = String(!open);
          inner.inert = !open; // hides collapsed answers from keyboard and screen readers
        };

        setOpen(false);
        button.addEventListener("click", () => setOpen(button.getAttribute("aria-expanded") !== "true"));
      });
    });
  }

  /* 8. Form validation helpers -------------------------------------------- */

  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  const NAME_RE = /^[\p{L}][\p{L}\p{M}'’\-. ]*$/u;
  // South African numbers: 0738898423, +27738898423, 0027738898423
  const PHONE_RE = /^(?:\+27|0027|0)[1-9]\d{8}$/;

  const check = {
    name(value) {
      if (!value) return "Enter your full name.";
      if (value.length < 2) return "Your name must be at least 2 characters.";
      if (value.length > 60) return "Your name must be 60 characters or fewer.";
      if (!NAME_RE.test(value)) return "Use letters only. Spaces, hyphens and apostrophes are fine.";
      return "";
    },
    email(value) {
      if (!value) return "Enter your email address.";
      if (value.length > 254 || !EMAIL_RE.test(value)) return "Enter a valid email address, like name@example.com.";
      return "";
    },
    phone(value, required) {
      if (!value) return required ? "Enter your phone number." : "";
      const digits = value.replace(/[\s\-()]/g, "");
      if (!PHONE_RE.test(digits)) return "Enter a South African number, like 0738898423 or +27738898423.";
      return "";
    },
    select(value, label) {
      return value ? "" : "Choose " + label + ".";
    },
  };

  /**
   * Wires one form to a set of rules.
   * rules: { fieldName: (value, element) => "error message" or "" }
   */
  function setupValidation(form, rules) {
    const fields = $$("input, select, textarea", form).filter((field) => rules[field.name]);

    function showError(field, message) {
      const target = document.getElementById(field.id + "-error");
      if (target) target.textContent = message;
      if (message) field.setAttribute("aria-invalid", "true");
      else field.removeAttribute("aria-invalid");
    }

    function validateField(field) {
      const message = rules[field.name](field.value.trim(), field);
      showError(field, message);
      return !message;
    }

    fields.forEach((field) => {
      const wrapper = field.closest(".field");
      field.addEventListener("blur", () => {
        if (wrapper) wrapper.classList.add("is-touched");
        validateField(field);
      });
      const live = () => {
        if (field.getAttribute("aria-invalid") === "true") validateField(field);
      };
      field.addEventListener("input", live);
      field.addEventListener("change", live);
    });

    return {
      validateAll() {
        form.classList.add("was-validated");
        let firstInvalid = null;
        fields.forEach((field) => {
          if (!validateField(field) && !firstInvalid) firstInvalid = field;
        });
        if (firstInvalid) firstInvalid.focus();
        return !firstInvalid;
      },
      reset() {
        form.reset();
        form.classList.remove("was-validated");
        fields.forEach((field) => {
          showError(field, "");
          const wrapper = field.closest(".field");
          if (wrapper) wrapper.classList.remove("is-touched");
        });
      },
    };
  }

  function setStatus(node, message, kind) {
    node.className = "form-status" + (kind ? " is-" + kind : "");
    node.replaceChildren(...(Array.isArray(message) ? message : [message]));
  }

  /* 9. Enquiry form ------------------------------------------------------- */

  function buildQuote(data) {
    const product = PRODUCTS.find((p) => p.id === data.product);
    const quantity = Number(data.quantity);
    const inStock = product.stock[data.size];
    const subtotal = product.price * quantity;
    const delivery = DELIVERY_FEES[data.delivery];

    let level = "in";
    let label = "In stock";
    let note = LEAD_TIME.inStock;

    if (inStock === 0) {
      level = "out";
      label = "Sold out in this size";
      note = LEAD_TIME.out;
    } else if (quantity > inStock) {
      level = "low";
      label = "Only " + inStock + " in stock";
      note = LEAD_TIME.partial;
    } else if (inStock <= 3) {
      level = "low";
      label = "Low stock: " + inStock + " left";
    }

    return { product, quantity, subtotal, delivery, total: subtotal + delivery, level, label, note };
  }

  function animateNumber(node, target) {
    if (prefersReducedMotion()) {
      node.textContent = rand(target);
      return;
    }
    const start = performance.now();
    const duration = 650;
    function frame(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      node.textContent = rand(Math.round(target * eased));
      if (progress < 1) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }

  function renderQuote(panel, data, quote) {
    const animated = el("span", { "aria-hidden": "true", text: rand(0) });
    const finalTotal = el("span", { class: "visually-hidden", text: rand(quote.total) });

    panel.replaceChildren(
      el("h2", { text: "Your estimate", tabindex: "-1", id: "quote-heading" }),
      el("p", {
        text: quote.quantity + " × " + quote.product.name + ", size " + data.size + ".",
      }),
      el("ul", { class: "quote__lines" },
        el("li", {}, el("span", { text: "Items (" + quote.quantity + " × " + rand(quote.product.price) + ")" }), el("span", { text: rand(quote.subtotal) })),
        el("li", {}, el("span", { text: data.delivery === COLLECT ? "Collect in store" : "Delivery to " + data.delivery }), el("span", { text: quote.delivery ? rand(quote.delivery) : "Free" })),
        el("li", {}, el("span", { text: "Estimated total" }), el("span", {}, animated, finalTotal))
      ),
      el("p", { class: "badge badge--" + quote.level, text: quote.label }),
      el("p", { text: quote.note + ". You asked for " + data.date + "." }),
      el("p", { class: "small", text: "This is an estimate, not an invoice. We confirm price and stock with you before anything is made or sent." })
    );
    panel.hidden = false;
    panel.classList.remove("is-updated");
    void panel.offsetWidth;
    panel.classList.add("is-updated");
    animateNumber(animated, quote.total);
    $("#quote-heading", panel).focus({ preventScroll: false });
  }

  async function postJSON(url, payload) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 10000);
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });
      if (!response.ok) return false;
      const result = await response.json().catch(() => ({}));
      return result.success === true || result.success === "true";
    } catch (error) {
      return false;
    } finally {
      clearTimeout(timer);
    }
  }

  function initEnquiry() {
    const form = $("#enquiry-form");
    if (!form) return;

    const productSelect = $("#product");
    const sizeSelect = $("#size");
    const deliverySelect = $("#delivery");
    const dateInput = $("#date");
    const status = $("#enquiry-status");
    const panel = $("#quote");

    PRODUCTS.forEach((p) => productSelect.append(el("option", { value: p.id, text: p.name + " – " + rand(p.price) })));
    SIZES.forEach((s) => sizeSelect.append(el("option", { value: s, text: s })));
    Object.keys(DELIVERY_FEES).forEach((name) => deliverySelect.append(el("option", { value: name, text: name })));

    dateInput.min = todayISO(0);
    dateInput.max = todayISO(90);

    // Arriving from a product card on the Shop page: ?product=<id>
    const wanted = new URLSearchParams(window.location.search).get("product");
    if (wanted && PRODUCTS.some((p) => p.id === wanted)) productSelect.value = wanted;

    const validation = setupValidation(form, {
      name: (v) => check.name(v),
      email: (v) => check.email(v),
      phone: (v) => check.phone(v, true),
      product: (v) => check.select(v, "a product"),
      size: (v) => check.select(v, "a size"),
      quantity: (v) => {
        if (!v) return "Enter how many you want.";
        const n = Number(v);
        if (!Number.isInteger(n) || n < 1 || n > 10) return "Enter a whole number from 1 to 10.";
        return "";
      },
      delivery: (v) => check.select(v, "a delivery option"),
      date: (v) => {
        if (!v) return "Choose the date you would like your order by.";
        if (v < dateInput.min) return "That date has passed. Choose today or a later date.";
        if (v > dateInput.max) return "Choose a date within the next 90 days.";
        return "";
      },
      notes: (v) => (v.length > 300 ? "Notes must be 300 characters or fewer." : ""),
    });

    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      setStatus(status, "", "");

      if (!validation.validateAll()) {
        setStatus(status, "Please fix the highlighted fields and try again.", "error");
        return;
      }

      const data = Object.fromEntries(new FormData(form).entries());
      if (data._honey) return; // spam trap: real visitors never fill this field

      const quote = buildQuote(data);
      renderQuote(panel, data, quote);

      // AJAX: send the enquiry in the background without reloading the page
      const button = $('button[type="submit"]', form);
      button.disabled = true;
      setStatus(status, "Sending your enquiry…", "");

      const payload = {
        _subject: "GALXBOY website enquiry: " + quote.product.name,
        name: data.name,
        email: data.email,
        phone: data.phone,
        product: quote.product.name,
        size: data.size,
        quantity: data.quantity,
        delivery: data.delivery,
        "needed by": data.date,
        "estimated total": rand(quote.total),
        availability: quote.label,
        notes: data.notes || "(none)",
      };

      const sent = await postJSON(form.action, payload);
      button.disabled = false;

      if (sent) {
        setStatus(status, "Enquiry sent. We will reply to " + data.email + ".", "ok");
      } else {
        const body = Object.entries(payload).filter(([k]) => k !== "_subject").map(([k, v]) => k + ": " + v).join("\n");
        setStatus(
          status,
          [
            "Your estimate is above, but we could not send the enquiry automatically. ",
            el("a", { href: mailtoLink(payload._subject, body), text: "Send it from your email app instead" }),
            ".",
          ],
          "error"
        );
      }
    });

    form.addEventListener("reset", () => {
      panel.hidden = true;
      setStatus(status, "", "");
    });
  }

  /* 10. Contact form ------------------------------------------------------ */

  function initContact() {
    const form = $("#contact-form");
    if (!form) return;

    const messageBox = $("#message");
    const counter = $("#message-count");
    const preview = $("#email-preview");
    const status = $("#contact-status");
    const max = Number(messageBox.getAttribute("maxlength"));

    const updateCount = () => {
      counter.textContent = messageBox.value.length + " of " + max + " characters";
    };
    messageBox.addEventListener("input", updateCount);
    updateCount();

    const validation = setupValidation(form, {
      name: (v) => check.name(v),
      email: (v) => check.email(v),
      phone: (v) => check.phone(v, false),
      topic: (v) => check.select(v, "a message type"),
      message: (v) => {
        if (!v) return "Write your message.";
        if (v.length < 20) return "Your message must be at least 20 characters so we can help properly.";
        if (v.length > max) return "Your message must be " + max + " characters or fewer.";
        return "";
      },
    });

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      setStatus(status, "", "");

      if (!validation.validateAll()) {
        setStatus(status, "Please fix the highlighted fields and try again.", "error");
        return;
      }

      const data = Object.fromEntries(new FormData(form).entries());
      if (data._honey) return;

      // Compile the validated fields into one email addressed to the recipient set in SITE
      const subject = "GALXBOY website: " + data.topic + " from " + data.name;
      const body = [
        "Message type: " + data.topic,
        "Name: " + data.name,
        "Email: " + data.email,
        "Phone: " + (data.phone || "not given"),
        "",
        data.message,
      ].join("\n");

      const copyButton = el("button", { class: "btn btn--ghost", type: "button", text: "Copy email text" });
      copyButton.addEventListener("click", async () => {
        const text = "To: " + SITE.recipient + "\nSubject: " + subject + "\n\n" + body;
        try {
          await navigator.clipboard.writeText(text);
          copyButton.textContent = "Copied";
        } catch (error) {
          copyButton.textContent = "Select the text above to copy it";
        }
      });

      preview.replaceChildren(
        el("h2", { text: "Your email is ready", id: "preview-heading", tabindex: "-1" }),
        el("p", { text: "Check the details, then send it from your email app." }),
        el("pre", { text: "To: " + SITE.recipient + "\nSubject: " + subject + "\n\n" + body }),
        el("div", { class: "btn-row" }, el("a", { class: "btn", href: mailtoLink(subject, body), text: "Open in your email app" }), copyButton)
      );
      preview.hidden = false;
      $("#preview-heading", preview).focus();
      setStatus(status, "Message checked. Your email is ready below.", "ok");
    });

    form.addEventListener("reset", () => {
      preview.hidden = true;
      setStatus(status, "", "");
      setTimeout(updateCount, 0);
    });
  }

  /* 11. Contact page: interactive map ------------------------------------- */

  function initMap() {
    const container = $("#map");
    if (!container) return;

    const showFallback = () => {
      container.replaceChildren(
        el("p", { class: "map-fallback", text: "The map could not load. Use the links below to find us." })
      );
    };

    // Leaflet is loaded from a CDN. If that is blocked or offline, fall back to plain links.
    if (typeof window.L === "undefined") {
      showFallback();
      return;
    }

    try {
      const map = window.L.map(container, { scrollWheelZoom: false }).setView(SITE.mapCenter, SITE.mapZoom);
      window.L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" rel="noopener noreferrer">OpenStreetMap</a> contributors',
      }).addTo(map);

      const popup = el("div", {}, el("strong", { text: "GALXBOY" }), el("br"), document.createTextNode(SITE.address));
      window.L.marker(SITE.mapCenter).addTo(map).bindPopup(popup);

      // Let visitors scroll the page past the map; wheel zoom switches on after a click
      map.on("click", () => map.scrollWheelZoom.enable());
      map.on("mouseout", () => map.scrollWheelZoom.disable());
    } catch (error) {
      showFallback();
    }
  }

  /* Start ----------------------------------------------------------------- */

  initNav();
  initLightbox();
  initShop();
  initTabs();
  initAccordion();
  initEnquiry();
  initContact();
  initMap();
  observeReveals();
})();
