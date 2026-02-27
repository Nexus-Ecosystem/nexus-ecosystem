// Path: js/layout.js

/* =========================================================
   NEXUS — LAYOUT LOADER (FIX SCROLL + NAV PILL + LANG)
   Evita “anclaje” al cargar parciales con fetch
   ========================================================= */

(() => {
  "use strict";

  /* =========================
     0) SCROLL CONTROL (anti-jump)
     ========================= */
  const hadHash = !!(location.hash && location.hash.length > 1);

  function lockScroll() {
    // Congela el scroll durante carga (evita saltos)
    document.documentElement.style.scrollBehavior = "auto";
    document.body.style.overflowAnchor = "none"; // 🔑 evita el “anclaje” al crecer el DOM
  }

  function unlockScroll() {
    document.body.style.overflowAnchor = "";
  }

  function forceTopIfNoHash() {
    if (!hadHash) {
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
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

    // Si más adelante haces about.html con secciones:
    // if (file === "about.html") return "index";

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
    forceTopIfNoHash(); // top desde el inicio si no hay #anchor

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

      // i18n: aplicar DESPUÉS de existir header + secciones
      if (window.NXI18N && typeof window.NXI18N.apply === "function") {
        window.NXI18N.apply();
      }

      // Recalc pill luego de i18n
      requestAnimationFrame(() => {
        if (typeof window.__nxRecalcNavPill === "function") window.__nxRecalcNavPill();

        // 🔥 ahora sí: libera scroll y ajusta a top o hash
        unlockScroll();

        // Si hay hash, deja que el navegador vaya a ese anchor
        if (hadHash) {
          const el = document.querySelector(location.hash);
          if (el) el.scrollIntoView({ behavior: "auto", block: "start" });
        } else {
          window.scrollTo({ top: 0, left: 0, behavior: "auto" });
        }
      });
    });
  })();
})();

/* =========================
   NAV PILL
   ========================= */
function initNavPill() {
  const nav = document.getElementById("nxNav");
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
      pill.offsetHeight;
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

  links.forEach(link => {
    link.addEventListener("click", (e) => {
      const href = (link.getAttribute("href") || "").trim();
      if (!href) return;

      const isHtmlNav = href.toLowerCase().endsWith(".html");

      if (isHtmlNav) {
        e.preventDefault();
        movePill(link, true);

        // evitar “saltos” en navegación
        setTimeout(() => {
          window.location.href = href;
        }, 180);
      } else {
        movePill(link, true);
      }
    });
  });

  const recalc = () => {
    const active = nav.querySelector("a.active") || initial;
    movePill(active, false);
  };

  window.__nxRecalcNavPill = recalc;

  window.addEventListener("resize", recalc);

  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(recalc).catch(() => {});
  }

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
        code.textContent = lang.toUpperCase();
      } else {
        code.textContent = lang.toUpperCase();
      }

      close();

      requestAnimationFrame(() => {
        if (typeof window.__nxRecalcNavPill === "function") window.__nxRecalcNavPill();
      });
    });
  });

  if (window.NXI18N && typeof window.NXI18N.getLang === "function") {
    code.textContent = window.NXI18N.getLang().toUpperCase();
  } else {
    code.textContent = "ES";
  }
}

function initMobileMenu() {
  const burger = document.getElementById("nxBurger");
  const menu = document.getElementById("nxMobileMenu");
  if (!burger || !menu) return;

  const open = () => {
    menu.classList.add("is-open");
    menu.setAttribute("aria-hidden", "false");
    burger.setAttribute("aria-expanded", "true");
    document.body.style.overflow = "hidden";
  };

  const close = () => {
    menu.classList.remove("is-open");
    menu.setAttribute("aria-hidden", "true");
    burger.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
  };

  burger.addEventListener("click", (e) => {
    e.preventDefault();
    menu.classList.contains("is-open") ? close() : open();
  });

  menu.addEventListener("click", (e) => {
    if (e.target?.dataset?.close) close();
  });

  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && menu.classList.contains("is-open")) close();
  });

  // ✅ si das click en un link, cierra el menú
  menu.querySelectorAll("a[href]").forEach(a => {
    a.addEventListener("click", () => close());
  });
}