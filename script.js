/* =========================
   MENU
========================= */

const btn = document.querySelector(".menu-btn");
const nav = document.querySelector(".nav");

if (btn && nav) {
  btn.addEventListener("click", () => {
    const open = nav.classList.toggle("open");
    btn.setAttribute("aria-expanded", String(open));
  });

  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      nav.classList.remove("open");
      btn.setAttribute("aria-expanded", "false");
    });
  });
}


/* =========================
   ÅRSTAL
========================= */

document.querySelectorAll("[data-year]").forEach((element) => {
  element.textContent = new Date().getFullYear();
});


/* =========================
   CMS-FILER
========================= */

const cmsFiles = {
  home: "/content/forside.json",
  about: "/content/om-mig.json",
  journalistik: "/content/journalistik.json",
  presse: "/content/presse.json",
  langaaen: "/content/langaaen.json",
  foredrag: "/content/foredrag.json",
  contact: "/content/kontakt.json",
  site: "/content/site.json"
};


/* =========================
   HENT JSON
========================= */

async function fetchJson(path) {
  try {
    const separator = path.includes("?") ? "&" : "?";

    const response = await fetch(
      `${path}${separator}v=${Date.now()}`,
      {
        cache: "no-store"
      }
    );

    if (!response.ok) {
      throw new Error(
        `Kunne ikke hente ${path}. Status: ${response.status}`
      );
    }

    return await response.json();

  } catch (error) {
    console.warn("CMS-fil kunne ikke indlæses:", path, error);
    return null;
  }
}


/* =========================
   HJÆLPEFUNKTIONER
========================= */

function escapeHtml(value) {
  return String(value).replace(
    /[&<>"']/g,
    (character) => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#039;"
    })[character]
  );
}


function getValue(data, path) {
  const [group, ...keys] = path.split(".");

  let value = data[group];

  for (const key of keys) {
    value = value?.[key];
  }

  return value;
}


/* =========================
   ALMINDELIGE CMS-FELTER
========================= */

function renderTextFields(data) {

  document.querySelectorAll("[data-cms]").forEach((element) => {

    const value = getValue(
      data,
      element.dataset.cms
    );

    if (value === undefined || value === null) {
      return;
    }

    /*
      Hvis feltet er en liste, fx afsnit på Om mig
    */
    if (Array.isArray(value)) {

      const paragraphs = value.map((item) => {

        if (typeof item === "string") {
          return `<p>${escapeHtml(item)}</p>`;
        }

        if (item && typeof item === "object") {

          if (item.paragraph !== undefined) {
            return `<p>${escapeHtml(item.paragraph)}</p>`;
          }

          if (item.text !== undefined) {
            return `<p>${escapeHtml(item.text)}</p>`;
          }
        }

        return "";

      }).join("");

      element.innerHTML = paragraphs;

    } else {

      element.textContent = value;

    }

  });
}


/* =========================
   BILLEDER
========================= */

function renderImages(data) {

  document.querySelectorAll("[data-cms-image]").forEach((element) => {

    const value = getValue(
      data,
      element.dataset.cmsImage
    );

    if (value) {
      element.src = value;
    }

  });


  document.querySelectorAll("[data-cms-alt]").forEach((element) => {

    const value = getValue(
      data,
      element.dataset.cmsAlt
    );

    if (value) {
      element.alt = value;
    }

  });
}


/* =========================
   KORT
========================= */

function renderCards(selector, items) {

  const host = document.querySelector(selector);

  if (!host || !Array.isArray(items)) {
    return;
  }

  host.innerHTML = items.map((item) => {

    const title = item?.title || "";
    const text = item?.text || "";

    return `
      <div class="card">
        <h3>${escapeHtml(title)}</h3>
        <p>${escapeHtml(text)}</p>
      </div>
    `;

  }).join("");
}


/* =========================
   JOURNALISTIK-LISTE
========================= */

function renderJournalistikServices(data) {

  const list = document.querySelector(
    '[data-cms-list="journalistik.services"]'
  );

  if (
    !list ||
    !Array.isArray(data.journalistik?.services)
  ) {
    return;
  }

  list.innerHTML = data.journalistik.services
    .map((item) => {

      const text =
        typeof item === "string"
          ? item
          : item?.service || "";

      return `<li>${escapeHtml(text)}</li>`;

    })
    .join("");
}


/* =========================
   KONTAKTOPLYSNINGER
========================= */

function renderSiteSettings(site) {

  if (!site) {
    return;
  }


  /* E-mail */

  document
    .querySelectorAll(
      "[data-site-email], [data-cms-email]"
    )
    .forEach((element) => {

      if (!site.email) {
        return;
      }

      element.textContent = site.email;

      if (element.tagName === "A") {
        element.href = `mailto:${site.email}`;
      }

    });


  /* Telefon */

  document
    .querySelectorAll("[data-site-phone]")
    .forEach((element) => {

      if (!site.phone) {
        return;
      }

      element.textContent = site.phone;

      if (element.tagName === "A") {

        const phoneLink =
          site.phone_link ||
          site.phone.replace(/\s+/g, "");

        element.href = `tel:${phoneLink}`;
      }

    });


  /* Sted */

  document
    .querySelectorAll("[data-site-location]")
    .forEach((element) => {

      if (site.location) {
        element.textContent = site.location;
      }

    });
}


/* =========================
   INDLÆS CMS
========================= */

async function loadCms() {

  const data = {};

  /*
    Hver fil indlæses separat.
    En fejl i én fil stopper derfor
    ikke hele hjemmesiden.
  */

  await Promise.all(
    Object.entries(cmsFiles).map(
      async ([key, path]) => {

        data[key] = await fetchJson(path);

      }
    )
  );


  /* Almindelige tekster */

  renderTextFields(data);


  /* Billeder */

  renderImages(data);


  /* Kort */

  renderCards(
    '[data-cms-cards="presse.services"]',
    data.presse?.services
  );

  renderCards(
    '[data-cms-cards="langaaen.principles"]',
    data.langaaen?.principles
  );

  renderCards(
    '[data-cms-cards="foredrag.audiences"]',
    data.foredrag?.audiences
  );


  /* Journalistik */

  renderJournalistikServices(data);


  /* Kontaktoplysninger */

  renderSiteSettings(data.site);
}


/* =========================
   START
========================= */

loadCms();
