// Path: js/layout.js

/* =========================================================
   NEXUS — LAYOUT LOADER (FIX SCROLL + NAV PILL + LANG + MOBILE)
   Evita “anclaje” al cargar parciales con fetch
   ========================================================= */

(() => {
  "use strict";

  /* =========================
     0) SCROLL CONTROL (anti-jump)
     ========================= */
  const hadHash = !!(location.hash && location.hash.length > 1);

  // Guardamos estado previo (para restaurar)
  const prevScrollBehavior = document.documentElement.style.scrollBehavior;

  function lockScroll() {
    // Congela el scroll durante carga (evita saltos)
    document.documentElement.style.scrollBehavior = "auto";

    // 🔑 overflow-anchor funciona mejor en <html> y contenedores
    document.documentElement.style.overflowAnchor = "none";

    // Opcional: evita que el browser intente “mantener” posición
    document.body.style.overflowAnchor = "none";
  }

  function unlockScroll() {
    document.documentElement.style.overflowAnchor = "";
    document.body.style.overflowAnchor = "";
    document.documentElement.style.scrollBehavior = prevScrollBehavior || "";
  }

  function forceTopIfNoHash() {
    if (!hadHash) {
      window.scrollTo(0, 0);
    }
  }

  try {
    if ("scrollRestoration" in history) history.scrollRestoration = "manual";
  } catch (_) {}

  /* =========================
     1) LOAD PARTIALS
     ========================= */
  async function loadPartial(id, file) {
    const el = document.getElementById(id);
    if (!el) return false;

    // 🔑 evita anclaje específicamente donde se inyecta contenido
    el.style.overflowAnchor = "none";

    try {
      const res = await fetch(file, { cache: "no-store" });
      if (!res.ok) {
        el.innerHTML = `<!-- Missing: ${file} (${res.status}) -->`;
        return false;
      }
      el.innerHTML = await res.text();
      return true;
    } catch (_) {
      el.innerHTML = `<!-- Error loading: ${file} -->`;
      return false;
    } finally {
      el.style.overflowAnchor = "";
    }
  }

  function normalizeFileName(pathname) {
    const raw = (pathname || "").split("?")[0].split("#")[0];
    const parts = raw.split("/").filter(Boolean);
    const file = (parts[parts.length - 1] || "index.html").toLowerCase();
    return file === "" ? "index.html" : file;
  }

  function getPageKey() {
    const file = normalizeFileName(location.pathname);

    if (file === "index.html") return "index";
    if (file === "medi.html") return "medi";
    if (file === "aura-zen.html") return "aura";
    if (file === "beast.html") return "beast";
    if (file === "support.html") return "support";

    return "index";
  }

  async function loadPageSections(page) {
    const hasHero = !!document.getElementById("section-hero");
    const hasAbout = !!document.getElementById("section-about");
    const hasApps = !!document.getElementById("section-apps");
    const hasSocials = !!document.getElementById("section-socials");

    if (hasHero) await loadPartial("section-hero", `sections/${page}/hero.html`);
    if (hasAbout) await loadPartial("section-about", `sections/${page}/about.html`);
    if (hasApps) await loadPartial("section-apps", `sections/${page}/apps.html`);
    if (hasSocials) await loadPartial("section-socials", `sections/${page}/socials.html`);
  }

  /* =========================
     2) BOOT
     ========================= */
  (async () => {
    lockScroll();
    forceTopIfNoHash();

    // Header/Footer siempre
    await loadPartial("app-header", "header.html");
    await loadPartial("app-footer", "footer.html");

    // Año footer
    const year = document.getElementById("nxYear");
    if (year) year.textContent = new Date().getFullYear();

    // Secciones según la página
    const page = getPageKey();
    await loadPageSections(page);

    // UI init (cuando ya existe TODO)
requestAnimationFrame(() => {
  if (typeof initNavPill === "function") initNavPill();
  if (typeof initLangDropdown === "function") initLangDropdown();
  if (typeof initMobileMenu === "function") initMobileMenu();
  if (typeof initAppsCarousel === "function") initAppsCarousel();

  if (window.NXI18N && typeof window.NXI18N.apply === "function") {
    window.NXI18N.apply();
  }

  requestAnimationFrame(() => {
    if (typeof window.__nxRecalcNavPill === "function") window.__nxRecalcNavPill();
    if (typeof initAppsCarousel === "function") initAppsCarousel();

    unlockScroll();

    if (hadHash) {
      const target = document.querySelector(location.hash);
      if (target) target.scrollIntoView({ behavior: "auto", block: "start" });
    } else {
      window.scrollTo(0, 0);
    }
  });
});
  })();
})();

/* =========================
   NAV PILL (DESKTOP NAV)
   ========================= */
function initNavPill() {
  const nav = document.getElementById("nxNav");   // ✅ este debe ser el nav desktop
  const pill = document.getElementById("nxPill");
  if (!nav || !pill) return;

  const links = Array.from(nav.querySelectorAll("a"));
  if (!links.length) return;

  const themes = {
    nexus: {
      bg: "linear-gradient(90deg, rgba(20,90,220,.28), rgba(60,140,255,.34))",
      border: "rgba(20,90,220,.45)"
    },
    medi: {
      bg: "linear-gradient(90deg, rgba(60,150,255,.22), rgba(160,210,255,.30))",
      border: "rgba(60,150,255,.38)"
    },
    aura: {
      bg: "linear-gradient(90deg, rgba(150,90,255,.22), rgba(210,170,255,.32))",
      border: "rgba(150,90,255,.40)"
    },
    beast: {
      bg: "linear-gradient(90deg, rgba(255,190,30,.24), rgba(255,230,140,.34))",
      border: "rgba(255,190,30,.42)"
    },
    support: {
      bg: "linear-gradient(90deg, rgba(180,180,180,.22), rgba(220,220,220,.32))",
      border: "rgba(190,190,190,.38)"
    }
  };

  const navPad = parseFloat(getComputedStyle(nav).paddingLeft) || 0;

  function movePill(el, animate = true) {
    if (!el) return;

    const x = el.offsetLeft - navPad;
    const w = el.offsetWidth;
    const t = themes[el.dataset.color] || themes.nexus;

    if (!animate) {
      const prev = pill.style.transition;
      pill.style.transition = "none";
      pill.style.transform = `translateX(${x}px)`;
      pill.style.width = `${w}px`;
      pill.style.background = t.bg;
      pill.style.borderColor = t.border;
      pill.offsetHeight; // flush
      pill.style.transition = prev;
    } else {
      pill.style.transform = `translateX(${x}px)`;
      pill.style.width = `${w}px`;
      pill.style.background = t.bg;
      pill.style.borderColor = t.border;
    }

    links.forEach(l => l.classList.remove("active"));
    el.classList.add("active");
  }

  const current = (location.pathname.split("/").pop() || "index.html").toLowerCase();
  const currentResolved = current === "" ? "index.html" : current;

  const initial =
    links.find(a => (a.getAttribute("href") || "").toLowerCase() === currentResolved) ||
    links.find(a => (a.getAttribute("href") || "").toLowerCase() === "index.html") ||
    links[0];

  movePill(initial, false);

  // ✅ evita duplicar listeners
  if (!nav.dataset.bound) {
    nav.dataset.bound = "1";

    links.forEach(link => {
      link.addEventListener("click", (e) => {
        const href = (link.getAttribute("href") || "").trim();
        if (!href) return;

        const isHtmlNav = href.toLowerCase().endsWith(".html");

        if (isHtmlNav) {
          e.preventDefault();
          movePill(link, true);
          setTimeout(() => { window.location.href = href; }, 180);
        } else {
          movePill(link, true);
        }
      });
    });

    window.addEventListener("resize", () => {
      const active = nav.querySelector("a.active") || initial;
      movePill(active, false);
    });

    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => {
        const active = nav.querySelector("a.active") || initial;
        movePill(active, false);
      }).catch(() => {});
    }
  }

  const recalc = () => {
    const active = nav.querySelector("a.active") || initial;
    movePill(active, false);
  };

  window.__nxRecalcNavPill = recalc;
  requestAnimationFrame(recalc);
}

/* =========================
   LANG DROPDOWN
   ========================= */
function initLangDropdown() {
  const wrap = document.getElementById("nxLang");
  const btn  = document.getElementById("nxLangBtn");
  const menu = document.getElementById("nxLangMenu");
  const code = document.getElementById("nxLangCode");

  if (!wrap || !btn || !menu || !code) return;

  // ✅ evita duplicar listeners
  if (wrap.dataset.bound) {
    // solo repintar código actual
    if (window.NXI18N && typeof window.NXI18N.getLang === "function") {
      code.textContent = window.NXI18N.getLang().toUpperCase();
    } else {
      code.textContent = code.textContent || "ES";
    }
    return;
  }
  wrap.dataset.bound = "1";

  const open = () => {
    wrap.classList.add("is-open");
    btn.setAttribute("aria-expanded", "true");
  };

  const close = () => {
    wrap.classList.remove("is-open");
    btn.setAttribute("aria-expanded", "false");
  };

  const toggle = () => {
    wrap.classList.contains("is-open") ? close() : open();
  };

  btn.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggle();
  });

  menu.addEventListener("click", (e) => e.stopPropagation());

  document.addEventListener("click", (e) => {
    if (!wrap.contains(e.target)) close();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") close();
  });

  menu.querySelectorAll(".nx-lang__item").forEach(item => {
    item.addEventListener("click", () => {
      const lang = item.dataset.lang;
      if (!lang) return;

      if (window.NXI18N && typeof window.NXI18N.setLang === "function") {
        window.NXI18N.setLang(lang);
      }
      code.textContent = lang.toUpperCase();
      close();

      requestAnimationFrame(() => {
        if (typeof window.__nxRecalcNavPill === "function") window.__nxRecalcNavPill();
      });
    });
  });

  if (window.NXI18N && typeof window.NXI18N.getLang === "function") {
    code.textContent = window.NXI18N.getLang().toUpperCase();
  } else {
    code.textContent = code.textContent || "ES";
  }
}

/* =========================
   MOBILE MENU
   ========================= */
function initMobileMenu() {
  const burger = document.getElementById("nxBurger");
  const menu   = document.getElementById("nxMobileMenu");
  if (!burger || !menu) return;

  // ✅ evita duplicar listeners
  if (menu.dataset.bound) return;
  menu.dataset.bound = "1";

  const open = () => {
    menu.classList.add("is-open");
    menu.setAttribute("aria-hidden", "false");
    burger.classList.add("is-open");
    burger.setAttribute("aria-expanded", "true");
    document.body.style.overflow = "hidden";
  };

  const close = () => {
    menu.classList.remove("is-open");
    menu.setAttribute("aria-hidden", "true");
    burger.classList.remove("is-open");
    burger.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
  };

  burger.addEventListener("click", (e) => {
    e.preventDefault();
    menu.classList.contains("is-open") ? close() : open();
  });

  // click backdrop / close buttons
  menu.addEventListener("click", (e) => {
    if (e.target && e.target.dataset && e.target.dataset.close) close();
  });

  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && menu.classList.contains("is-open")) close();
  });

  // ✅ cerrar al navegar dentro del drawer
  menu.querySelectorAll("a[href]").forEach(a => {
    a.addEventListener("click", () => close());
  });
}

/* =========================
   APPS CAROUSEL
   ========================= */
function initAppsCarousel() {
  const viewport = document.getElementById("nxAppsViewport");
  const track = document.getElementById("nxAppsTrack");
  const cards = Array.from(document.querySelectorAll(".nx-appCard"));
  const prevBtn = document.querySelector(".nx-appsCarousel__nav--prev");
  const nextBtn = document.querySelector(".nx-appsCarousel__nav--next");

  if (!viewport || !track || !cards.length || !prevBtn || !nextBtn) return;

  if (viewport.dataset.carouselBound === "true") {
    updateCurrentFromScroll();
    updateButtons();
    return;
  }

  viewport.dataset.carouselBound = "true";

  let currentIndex = 0;
  let scrollTimeout = null;

  function getGap() {
    if (cards.length < 2) return 0;
    return cards[1].offsetLeft - cards[0].offsetLeft - cards[0].offsetWidth;
  }

  function getStep() {
    if (!cards.length) return 0;
    return cards[0].offsetWidth + getGap();
  }

  function getVisibleCardsCount() {
    const step = getStep();
    if (!step) return 1;
    return Math.max(1, Math.floor((viewport.clientWidth + getGap()) / step));
  }

  function getLastStartIndex() {
    return Math.max(0, cards.length - getVisibleCardsCount());
  }

  function getMaxScrollLeft() {
    return Math.max(0, viewport.scrollWidth - viewport.clientWidth);
  }

  function getCardLeft(index) {
    const safeIndex = Math.max(0, Math.min(index, getLastStartIndex()));
    const rawLeft = cards[safeIndex].offsetLeft - viewport.offsetLeft;
    return Math.min(rawLeft, getMaxScrollLeft());
  }

  function updateButtons() {
    prevBtn.disabled = currentIndex <= 0;
    nextBtn.disabled = currentIndex >= getLastStartIndex();
  }

  function updateCurrentFromScroll() {
    const scrollLeft = viewport.scrollLeft;
    let closestIndex = 0;
    let closestDistance = Infinity;

    for (let i = 0; i <= getLastStartIndex(); i++) {
      const targetLeft = getCardLeft(i);
      const distance = Math.abs(targetLeft - scrollLeft);

      if (distance < closestDistance) {
        closestDistance = distance;
        closestIndex = i;
      }
    }

    currentIndex = closestIndex;
    updateButtons();
  }

  function goToCard(index) {
    currentIndex = Math.max(0, Math.min(index, getLastStartIndex()));

    viewport.scrollTo({
      left: getCardLeft(currentIndex),
      behavior: "smooth"
    });

    updateButtons();
  }

  prevBtn.addEventListener("click", function (e) {
    e.preventDefault();
    e.stopPropagation();
    goToCard(currentIndex - 1);
  });

  nextBtn.addEventListener("click", function (e) {
    e.preventDefault();
    e.stopPropagation();
    goToCard(currentIndex + 1);
  });

  viewport.addEventListener("scroll", function () {
    if (scrollTimeout) clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(updateCurrentFromScroll, 80);
  });

  window.addEventListener("resize", function () {
    currentIndex = Math.min(currentIndex, getLastStartIndex());
    goToCard(currentIndex);
  });

  updateCurrentFromScroll();
  updateButtons();
}