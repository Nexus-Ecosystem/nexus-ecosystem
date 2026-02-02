// Path: js/i18n.js
(function () {
  const STORAGE_KEY = "NX_LANG";

  // ✅ Actívalo SOLO si quieres ver keys faltantes en pantalla
  const DEBUG_MISSING_KEYS = false;

  const STRINGS = {
    /* =========================================================
       ESPAÑOL (es)
       ========================================================= */
    es: {
      /* =========================
         header.html (NAV)
         ========================= */
      "nav.home": "Inicio",
      "nav.medi": "Medi",
      "nav.aura": "Aura Zen",
      "nav.beast": "Beast",
      "nav.support": "Soporte",

      /* =========================
         sections/index/hero.html (HERO)
         ========================= */
      "hero.badge": "Ecosistema de apps",
      "hero.title.line1": "Un solo lugar para tus",
      "hero.title.line2": "apps y proyectos",
      "hero.subtitle": "Nexus Ecosystem conecta apps modernas con diseño premium, rendimiento y soporte real.",
      "hero.cta.apps": "Ver apps",
      "hero.cta.support": "Soporte",

      /* =========================
         sections/index/about.html (ABOUT) [si lo usas]
         ========================= */
      "about.title": "¿Qué es Nexus Ecosystem?",
      "about.desc": "Un ecosistema de productos digitales enfocados en utilidad diaria, calidad y experiencia de usuario.",

      /* =========================
         sections/index/apps.html (APPS) [si lo usas]
         ========================= */
      "apps.title": "Apps",
      "apps.subtitle": "Explora el ecosistema",
      "apps.medi.title": "Medi",
      "apps.medi.desc": "Control de medicamentos, recordatorios y orden.",
      "apps.aura.title": "Aura Zen",
      "apps.aura.desc": "Bienestar, respiración y hábitos con estética calmada.",
      "apps.beast.title": "Beast",
      "apps.beast.desc": "Productividad y herramientas para construir más rápido.",

      /* =========================
         sections/index/socials.html (SOCIALS) [si lo usas]
         ========================= */
      "socials.title": "Redes",
      "socials.subtitle": "Síguenos y conoce novedades",

      /* =========================
         footer.html (FOOTER)
         ========================= */
      "footer.desc": "Un ecosistema de apps modernas, conectadas y hechas para mejorar tu vida.",
      "footer.apps": "Apps",
      "footer.company": "Nexus",
      "footer.legal": "Legal",
      "footer.about": "Acerca",
      "footer.support": "Soporte",
      "footer.contact": "Contacto",
      "footer.privacy": "Privacidad",
      "footer.terms": "Términos"
    },

    /* =========================================================
       ENGLISH (en)
       ========================================================= */
    en: {
      /* header.html (NAV) */
      "nav.home": "Home",
      "nav.medi": "Medi",
      "nav.aura": "Aura Zen",
      "nav.beast": "Beast",
      "nav.support": "Support",

      /* sections/index/hero.html (HERO) */
      "hero.badge": "App ecosystem",
      "hero.title.line1": "One place for your",
      "hero.title.line2": "apps and projects",
      "hero.subtitle": "Nexus Ecosystem connects modern apps with premium design, performance, and real support.",
      "hero.cta.apps": "Explore apps",
      "hero.cta.support": "Support",

      /* sections/index/about.html (ABOUT) */
      "about.title": "What is Nexus Ecosystem?",
      "about.desc": "A connected ecosystem of digital products built for daily usefulness, quality, and great UX.",

      /* sections/index/apps.html (APPS) */
      "apps.title": "Apps",
      "apps.subtitle": "Explore the ecosystem",
      "apps.medi.title": "Medi",
      "apps.medi.desc": "Medication tracking, reminders, and organization.",
      "apps.aura.title": "Aura Zen",
      "apps.aura.desc": "Wellness, breathing, and habits with a calm aesthetic.",
      "apps.beast.title": "Beast",
      "apps.beast.desc": "Productivity tools to build faster.",

      /* sections/index/socials.html (SOCIALS) */
      "socials.title": "Social",
      "socials.subtitle": "Follow us for updates",

      /* footer.html (FOOTER) */
      "footer.desc": "A modern connected ecosystem built to improve everyday life.",
      "footer.apps": "Apps",
      "footer.company": "Nexus",
      "footer.legal": "Legal",
      "footer.about": "About",
      "footer.support": "Support",
      "footer.contact": "Contact",
      "footer.privacy": "Privacy",
      "footer.terms": "Terms"
    },

    /* =========================================================
       PORTUGUÊS (pt)
       ========================================================= */
    pt: {
      /* header.html (NAV) */
      "nav.home": "Início",
      "nav.medi": "Medi",
      "nav.aura": "Aura Zen",
      "nav.beast": "Beast",
      "nav.support": "Suporte",

      /* sections/index/hero.html (HERO) */
      "hero.badge": "Ecossistema de apps",
      "hero.title.line1": "Um só lugar para seus",
      "hero.title.line2": "apps e projetos",
      "hero.subtitle": "Nexus Ecosystem conecta apps modernas com design premium, performance e suporte de verdade.",
      "hero.cta.apps": "Ver apps",
      "hero.cta.support": "Suporte",

      /* sections/index/about.html (ABOUT) */
      "about.title": "O que é o Nexus Ecosystem?",
      "about.desc": "Um ecossistema conectado de produtos digitais feito para utilidade diária, qualidade e ótima UX.",

      /* sections/index/apps.html (APPS) */
      "apps.title": "Apps",
      "apps.subtitle": "Explore o ecossistema",
      "apps.medi.title": "Medi",
      "apps.medi.desc": "Controle de remédios, lembretes e organização.",
      "apps.aura.title": "Aura Zen",
      "apps.aura.desc": "Bem-estar, respiração e hábitos com estética calma.",
      "apps.beast.title": "Beast",
      "apps.beast.desc": "Ferramentas de produtividade para construir mais rápido.",

      /* sections/index/socials.html (SOCIALS) */
      "socials.title": "Redes",
      "socials.subtitle": "Siga-nos para novidades",

      /* footer.html (FOOTER) */
      "footer.desc": "Um ecossistema de apps modernas, conectadas e feitas para melhorar sua vida.",
      "footer.apps": "Apps",
      "footer.company": "Nexus",
      "footer.legal": "Legal",
      "footer.about": "Sobre",
      "footer.support": "Suporte",
      "footer.contact": "Contato",
      "footer.privacy": "Privacidade",
      "footer.terms": "Termos"
    }
  };

  function normalizeLang(raw) {
    const v = (raw || "").toLowerCase();
    if (v.startsWith("pt")) return "pt";
    if (v.startsWith("en")) return "en";
    return "es";
  }

  function getLang() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return normalizeLang(saved);
    return normalizeLang(navigator.language);
  }

  function setLang(lang) {
    const l = normalizeLang(lang);
    localStorage.setItem(STORAGE_KEY, l);
    apply(l);
  }

  function apply(langParam) {
    const lang = normalizeLang(langParam || getLang());
    const dict = STRINGS[lang] || STRINGS.es;

    document.documentElement.lang = lang;

    document.querySelectorAll("[data-i18n]").forEach((el) => {
      const key = el.getAttribute("data-i18n");
      if (!key) return;

      const value = dict[key];

      if (typeof value === "string") {
        el.textContent = value;
      } else if (DEBUG_MISSING_KEYS) {
        // 🔎 Para debug visual
        el.textContent = `[[${key}]]`;
      }
      // si no existe y DEBUG_MISSING_KEYS=false => se queda vacío (producción)
    });

    // Actualiza código en botón si existe
    const code = document.getElementById("nxLangCode");
    if (code) code.textContent = lang.toUpperCase();
  }

  window.NXI18N = { getLang, setLang, apply };
})();