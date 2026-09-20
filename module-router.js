(() => {
  const params = new URLSearchParams(window.location.search);
  const categoryId = params.get("category");
  const moduleId = params.get("module");

  const categories = {
    helyesiras: {
      title: "Helyesírás",
      icon: "Á",
      description: "Felvételi feladatok évek szerint, célzott magyarázatokkal és gyakorlóbankkal."
    },
    szolasok: {
      title: "Szólások és közmondások",
      icon: "„”",
      description: "Jelentés, kiegészítés, felismerés és alkalmazás felvételi feladatokból."
    }
  };

  const modules = {
    "2026": {
      year: 2026,
      maxScore: 12,
      title: "Helyesírás gyakorlás 2026",
      subtitle: "2026. januári felvételi feladatok",
      scripts: ["tasks.js", "practice.js", "practice-numbers.js", "scorm.js", "app.js", "resume-2026.js", "rewards.js", "attempt-lock.js", "module-fixes.js"]
    },
    "2025": {
      year: 2025,
      maxScore: 12,
      title: "Helyesírás gyakorlás 2025",
      subtitle: "2025. januári felvételi feladatok",
      scripts: ["modules/2025/tasks.js", "practice.js", "practice-numbers.js", "scorm.js", "app-2025.js", "resume-2025.js", "rewards.js", "attempt-lock.js", "module-fixes.js"]
    },
    "2024": {
      year: 2024,
      maxScore: 12,
      title: "Helyesírás gyakorlás 2024",
      subtitle: "2024. januári felvételi feladatok",
      scripts: ["modules/2024/tasks.js", "practice.js", "practice-numbers.js", "scorm.js", "app-2024.js", "rewards.js", "attempt-lock.js", "module-fixes.js"]
    },
    "2023": {
      year: 2023,
      maxScore: 10,
      title: "Helyesírás gyakorlás 2023",
      subtitle: "2023. januári helyesírási lottó",
      scripts: ["modules/2023/tasks.js", "practice.js", "practice-numbers.js", "scorm.js", "app-2023.js", "rewards.js", "attempt-lock.js", "module-fixes.js"]
    },
    "2022": {
      year: 2022,
      maxScore: 10,
      title: "Helyesírás gyakorlás 2022",
      subtitle: "2022. januári felvételi feladatok",
      scripts: ["modules/2022/tasks.js", "practice.js", "practice-numbers.js", "scorm.js", "app-2022.js", "resume-2022.js", "rewards.js", "attempt-lock.js", "module-fixes.js"]
    }
  };

  const practiceModule = {
    title: "Gyakorlóbank",
    subtitle: "11 téma • 55 feladat • aranytallér",
    scripts: ["practice.js", "practice-numbers.js", "scorm.js", "app-practice.js", "rewards.js"]
  };

  function hideProgress() {
    const scoreboard = document.querySelector(".scoreboard");
    const progressTrack = document.querySelector(".progress-track");
    if (scoreboard) scoreboard.hidden = true;
    if (progressTrack) progressTrack.hidden = true;
  }

  function setHeader(title) {
    const h1 = document.querySelector(".topbar h1");
    if (h1) h1.textContent = title;
  }

  function setScoreboard(total) {
    const progressText = document.getElementById("progressText");
    const scoreText = document.getElementById("scoreText");
    const totalText = document.getElementById("totalText");
    if (progressText) progressText.textContent = `0 / ${total}`;
    if (scoreText) scoreText.textContent = "0 / 0";
    if (totalText) totalText.textContent = String(total);
  }

  function renderCategoryLauncher() {
    hideProgress();
    document.documentElement.dataset.category = "";
    document.documentElement.dataset.module = "";
    document.title = "Felvételi tréner";
    setHeader("Felvételi tréner");

    const app = document.getElementById("app");
    app.innerHTML = `
      <section class="module-launcher category-launcher">
        <div class="module-launcher-head">
          <span class="badge">Magyar felvételi</span>
          <h2>Mit gyakorolnál?</h2>
          <p class="lead">Válassz témakört. A feladatok évek szerint és célzott gyakorlással is elérhetők.</p>
        </div>
        <div class="category-grid">
          ${Object.entries(categories).map(([id, item]) => `
            <a class="category-card" href="?category=${id}">
              <span class="category-icon" aria-hidden="true">${item.icon}</span>
              <span class="category-copy">
                <strong>${item.title}</strong>
                <small>${item.description}</small>
              </span>
              <span class="module-arrow" aria-hidden="true">→</span>
            </a>`).join("")}
        </div>
      </section>`;
  }

  function renderHelyesirasLauncher() {
    hideProgress();
    document.documentElement.dataset.category = "helyesiras";
    document.title = "Felvételi tréner – Helyesírás";
    setHeader("Helyesírás");

    const app = document.getElementById("app");
    app.innerHTML = `
      <section class="module-launcher">
        <a class="category-back" href="index.html">← Témakörök</a>
        <div class="module-launcher-head">
          <span class="badge">Felvételi tréner</span>
          <h2>Helyesírás</h2>
          <p class="lead">Válassz egy felvételi évet, vagy nyisd meg közvetlenül a teljes gyakorlóbankot.</p>
        </div>
        <div class="module-grid">
          ${Object.entries(modules).sort((a, b) => b[0] - a[0]).map(([id, item]) => `
            <a class="module-card" href="?category=helyesiras&module=${id}">
              <span class="module-year">${item.year}</span>
              <span class="module-copy"><strong>${item.title}</strong><small>${item.subtitle}</small></span>
              <span class="module-arrow" aria-hidden="true">→</span>
            </a>`).join("")}
          <a class="module-card practice-bank-card" href="?category=helyesiras&module=practice">
            <span class="module-year practice-bank-icon">✦</span>
            <span class="module-copy"><strong>${practiceModule.title}</strong><small>${practiceModule.subtitle}</small></span>
            <span class="module-arrow" aria-hidden="true">→</span>
          </a>
        </div>
      </section>`;
  }

  function renderSzolasokLauncher() {
    hideProgress();
    document.documentElement.dataset.category = "szolasok";
    document.documentElement.dataset.module = "";
    document.title = "Felvételi tréner – Szólások és közmondások";
    setHeader("Szólások és közmondások");

    const app = document.getElementById("app");
    app.innerHTML = `
      <section class="module-launcher">
        <a class="category-back" href="index.html">← Témakörök</a>
        <div class="module-launcher-head">
          <span class="badge">Új témakör</span>
          <h2>Szólások és közmondások</h2>
          <p class="lead">A kategória helye elkészült. Ide kerülnek majd az évenkénti felvételi feladatok és a saját gyakorlóbank.</p>
        </div>
        <div class="category-empty-state">
          <strong>A szerkezet kész.</strong>
          <span>Az első feldolgozott év hozzáadásakor itt ugyanaz az évválasztó logika jelenik meg, mint a helyesírásnál.</span>
        </div>
      </section>`;
  }

  function loadSequentially(paths) {
    return paths.reduce((promise, src) => promise.then(() => new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = src;
      script.onload = resolve;
      script.onerror = () => reject(new Error(`Nem sikerült betölteni: ${src}`));
      document.body.appendChild(script);
    })), Promise.resolve());
  }

  // Régi közvetlen linkek (pl. ?module=2022) továbbra is a helyesírási modulokra mutatnak.
  if (!moduleId) {
    if (!categoryId) renderCategoryLauncher();
    else if (categoryId === "helyesiras") renderHelyesirasLauncher();
    else if (categoryId === "szolasok") renderSzolasokLauncher();
    else renderCategoryLauncher();
    return;
  }

  document.documentElement.dataset.category = "helyesiras";

  if (moduleId === "practice") {
    document.documentElement.dataset.module = "practice";
    document.title = "Felvételi tréner – Helyesírás – Gyakorlóbank";
    setHeader("Helyesírás – Gyakorlóbank");

    const scoreboard = document.querySelector(".scoreboard");
    const progressTrack = document.querySelector(".progress-track");
    if (scoreboard) scoreboard.hidden = false;
    if (progressTrack) progressTrack.hidden = true;

    loadSequentially(practiceModule.scripts).catch(error => {
      console.error(error);
      document.getElementById("app").innerHTML = `<section class="hero"><div class="hero-inner"><h2>Betöltési hiba</h2><p class="lead">A gyakorlóbank nem tölthető be.</p><a class="primary module-back-link" href="index.html?category=helyesiras">Vissza a helyesíráshoz</a></div></section>`;
    });
    return;
  }

  const selected = modules[moduleId];
  if (!selected) {
    renderHelyesirasLauncher();
    return;
  }

  document.documentElement.dataset.module = moduleId;
  document.title = `Felvételi tréner – Helyesírás ${selected.year}`;
  setHeader(`Helyesírás ${selected.year}`);

  const scoreboard = document.querySelector(".scoreboard");
  const progressTrack = document.querySelector(".progress-track");
  if (scoreboard) scoreboard.hidden = false;
  if (progressTrack) progressTrack.hidden = false;
  setScoreboard(selected.maxScore);

  loadSequentially(selected.scripts).catch(error => {
    console.error(error);
    document.getElementById("app").innerHTML = `<section class="hero"><div class="hero-inner"><h2>Betöltési hiba</h2><p class="lead">A kiválasztott modul nem tölthető be.</p><a class="primary module-back-link" href="index.html?category=helyesiras">Vissza a helyesíráshoz</a></div></section>`;
  });
})();