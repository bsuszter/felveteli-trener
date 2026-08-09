(() => {
  const params = new URLSearchParams(window.location.search);
  const moduleId = params.get("module");

  const modules = {
    "2026": {
      year: 2026,
      title: "Helyesírás gyakorlás 2026",
      subtitle: "2026. januári felvételi feladatok",
      scripts: ["tasks.js", "practice.js", "scorm.js", "app.js", "rewards.js", "attempt-lock.js", "module-fixes.js"]
    },
    "2025": {
      year: 2025,
      title: "Helyesírás gyakorlás 2025",
      subtitle: "2025. januári felvételi feladatok",
      scripts: ["modules/2025/tasks.js", "practice.js", "scorm.js", "app-2025.js", "modules/2025/practice-2025.js", "rewards.js", "attempt-lock.js", "module-fixes.js"]
    }
  };

  function setScoreboard(total) {
    const progressText = document.getElementById("progressText");
    const scoreText = document.getElementById("scoreText");
    const totalText = document.getElementById("totalText");
    if (progressText) progressText.textContent = `0 / ${total}`;
    if (scoreText) scoreText.textContent = "0 / 0";
    if (totalText) totalText.textContent = String(total);
  }

  function renderLauncher() {
    const scoreboard = document.querySelector(".scoreboard");
    const progressTrack = document.querySelector(".progress-track");
    if (scoreboard) scoreboard.hidden = true;
    if (progressTrack) progressTrack.hidden = true;

    const app = document.getElementById("app");
    app.innerHTML = `
      <section class="module-launcher">
        <div class="module-launcher-head">
          <span class="badge">Felvételi tréner</span>
          <h2>Helyesírás</h2>
          <p class="lead">Válaszd ki, melyik év felvételi helyesírási feladataival szeretnél dolgozni.</p>
        </div>
        <div class="module-grid">
          ${Object.entries(modules).sort((a, b) => b[0] - a[0]).map(([id, item]) => `
            <a class="module-card" href="?module=${id}">
              <span class="module-year">${item.year}</span>
              <span class="module-copy"><strong>${item.title}</strong><small>${item.subtitle}</small></span>
              <span class="module-arrow" aria-hidden="true">→</span>
            </a>`).join("")}
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

  if (!moduleId) {
    renderLauncher();
    return;
  }

  const selected = modules[moduleId];
  if (!selected) {
    renderLauncher();
    return;
  }

  document.documentElement.dataset.module = moduleId;
  document.title = `Felvételi tréner – Helyesírás ${selected.year}`;
  const h1 = document.querySelector(".topbar h1");
  if (h1) h1.textContent = `Helyesírás ${selected.year}`;

  const scoreboard = document.querySelector(".scoreboard");
  const progressTrack = document.querySelector(".progress-track");
  if (scoreboard) scoreboard.hidden = false;
  if (progressTrack) progressTrack.hidden = false;
  setScoreboard(12);

  loadSequentially(selected.scripts).catch(error => {
    console.error(error);
    document.getElementById("app").innerHTML = `<section class="hero"><div class="hero-inner"><h2>Betöltési hiba</h2><p class="lead">A kiválasztott modul nem tölthető be.</p><a class="primary module-back-link" href="index.html">Vissza a modulválasztóhoz</a></div></section>`;
  });
})();
