(() => {
  const DATA = window.MASSALHANGZO_TASKS;
  const app = document.getElementById("app");
  const lawMap = Object.fromEntries(DATA.laws.map(item => [item.id, item]));

  const state = {
    mode: null,
    law: null,
    questions: [],
    index: 0,
    answers: [],
    checked: []
  };

  function shuffle(items) {
    const copy = items.slice();
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  }

  function setChrome(show, total = 0) {
    const scoreboard = document.querySelector(".scoreboard");
    const track = document.querySelector(".progress-track");
    if (scoreboard) scoreboard.hidden = !show;
    if (track) track.hidden = !show;
    if (!show) return;
    const progressText = document.getElementById("progressText");
    const scoreText = document.getElementById("scoreText");
    const totalText = document.getElementById("totalText");
    if (progressText) progressText.textContent = `0 / ${total}`;
    if (scoreText) scoreText.textContent = `0 / ${total}`;
    if (totalText) totalText.textContent = String(total);
  }

  function score() {
    return state.questions.reduce((sum, q, i) => {
      const answer = state.answers[i];
      return sum + (answer && q.answers.includes(answer) ? 1 : 0);
    }, 0);
  }

  function updateChrome() {
    const total = state.questions.length;
    const answered = state.answers.filter(Boolean).length;
    const progressText = document.getElementById("progressText");
    const scoreText = document.getElementById("scoreText");
    const totalText = document.getElementById("totalText");
    const bar = document.getElementById("progressBar");
    if (progressText) progressText.textContent = `${answered} / ${total}`;
    if (scoreText) scoreText.textContent = `${score()} / ${total}`;
    if (totalText) totalText.textContent = String(total);
    if (bar) bar.style.width = total ? `${Math.round(answered / total * 100)}%` : "0%";
  }

  function renderHome() {
    state.mode = null;
    setChrome(false);
    const counts = Object.fromEntries(DATA.laws.map(law => [
      law.id,
      DATA.questions.filter(q => q.law === law.id).length
    ]));

    app.innerHTML = `
      <section class="module-launcher consonant-launcher">
        <a class="category-back" href="index.html">← Témakörök</a>
        <div class="module-launcher-head">
          <span class="badge">Felvételi tréner</span>
          <h2>Mássalhangzótörvények</h2>
          <p class="lead">Ne év szerint gyakorolj: válassz egy törvényt, vagy kérj vegyes felvételi feladatokat.</p>
        </div>

        <div class="consonant-mode-grid">
          <button class="consonant-mode-card" id="lawModeBtn">
            <span class="consonant-mode-icon">◎</span>
            <strong>Egy törvényt gyakorlok</strong>
            <small>Válassz egy mássalhangzótörvényt, és többféle feladattípusban gyakorold.</small>
          </button>
          <button class="consonant-mode-card mixed" id="mixedModeBtn">
            <span class="consonant-mode-icon">↻</span>
            <strong>Vegyes felvételi gyakorlás</strong>
            <small>10 véletlen kérdés a teljes feladatbankból, különböző évekből és feladattípusokból.</small>
          </button>
        </div>

        <div class="consonant-law-panel" id="lawPanel" hidden>
          <h3>Melyik törvényt gyakorolnád?</h3>
          <div class="consonant-law-grid">
            ${DATA.laws.map(law => `
              <button class="consonant-law-card" data-law="${law.id}">
                <strong>${law.title}</strong>
                <small>${counts[law.id]} feladat a jelenlegi bankban</small>
              </button>`).join("")}
          </div>
        </div>

        <p class="consonant-source-note">A jelenlegi bank 15 korábbi felvételi feladatblokk 25 részfeladatából épül fel. Az évszám csak forrásjelzésként jelenik meg.</p>
      </section>`;

    document.getElementById("lawModeBtn").addEventListener("click", () => {
      document.getElementById("lawPanel").hidden = false;
      document.getElementById("lawPanel").scrollIntoView({ behavior: "smooth", block: "start" });
    });
    document.getElementById("mixedModeBtn").addEventListener("click", () => startMixed());
    app.querySelectorAll("[data-law]").forEach(btn => {
      btn.addEventListener("click", () => startLaw(btn.dataset.law));
    });
  }

  function startLaw(lawId) {
    const pool = DATA.questions.filter(q => q.law === lawId);
    state.mode = "law";
    state.law = lawId;
    state.questions = shuffle(pool);
    state.index = 0;
    state.answers = Array(state.questions.length).fill(null);
    state.checked = Array(state.questions.length).fill(false);
    setChrome(true, state.questions.length);
    renderQuestion();
  }

  function startMixed() {
    state.mode = "mixed";
    state.law = null;
    state.questions = shuffle(DATA.questions).slice(0, 10);
    state.index = 0;
    state.answers = Array(state.questions.length).fill(null);
    state.checked = Array(state.questions.length).fill(false);
    setChrome(true, state.questions.length);
    renderQuestion();
  }

  function optionHtml(q, option, selected, checked) {
    const isCorrect = q.answers.includes(option);
    const className = [
      "consonant-option",
      selected === option ? "selected" : "",
      checked && isCorrect ? "correct" : "",
      checked && selected === option && !isCorrect ? "wrong" : ""
    ].filter(Boolean).join(" ");
    return `<button class="${className}" data-option="${option}" ${checked ? "disabled" : ""}>${option}</button>`;
  }

  function renderQuestion() {
    updateChrome();
    const q = state.questions[state.index];
    const selected = state.answers[state.index];
    const checked = state.checked[state.index];
    const correct = selected && q.answers.includes(selected);
    const lawTitle = q.law === "mixed" ? "Vegyes felismerés" : (lawMap[q.law]?.title || "Mássalhangzótörvény");

    app.innerHTML = `
      <section class="question consonant-question">
        <div class="question-head">
          <span>${state.mode === "mixed" ? "Vegyes gyakorlás" : lawTitle}</span>
          <span>${state.index + 1} / ${state.questions.length}</span>
        </div>
        <div class="consonant-meta">
          <span class="badge">${q.source}</span>
          <small>korábbi központi felvételi</small>
        </div>
        <h2>${q.prompt}</h2>
        ${q.context ? `<div class="consonant-context">${q.context}</div>` : ""}
        <div class="consonant-options">
          ${q.options.map(option => optionHtml(q, option, selected, checked)).join("")}
        </div>
        ${checked ? `
          <div class="consonant-feedback ${correct ? "correct" : "wrong"}">
            <strong>${correct ? "Helyes." : "Nem ez a helyes megoldás."}</strong>
            <span>Elfogadott megoldás: ${q.answers.join(" / ")}</span>
            ${q.explanation ? `<small>${q.explanation}</small>` : ""}
          </div>` : ""}
        <div class="navigation">
          <button class="nav-btn" id="homeBtn">← Gyakorlásválasztó</button>
          <button class="nav-btn next" id="actionBtn" ${selected ? "" : "disabled"}>
            ${!checked ? "Ellenőrzöm" : (state.index === state.questions.length - 1 ? "Eredmény" : "Következő →")}
          </button>
        </div>
      </section>`;

    app.querySelectorAll("[data-option]").forEach(button => {
      button.addEventListener("click", () => {
        state.answers[state.index] = button.dataset.option;
        renderQuestion();
      });
    });

    document.getElementById("homeBtn").addEventListener("click", renderHome);
    document.getElementById("actionBtn").addEventListener("click", () => {
      if (!state.answers[state.index]) return;
      if (!state.checked[state.index]) {
        state.checked[state.index] = true;
        renderQuestion();
        return;
      }
      if (state.index === state.questions.length - 1) renderResult();
      else {
        state.index++;
        renderQuestion();
      }
    });
  }

  function renderResult() {
    updateChrome();
    const total = state.questions.length;
    const points = score();
    app.innerHTML = `
      <section class="result">
        <span class="badge">Mássalhangzótörvények</span>
        <h2>${points === total ? "Hibátlan gyakorlás!" : "Kész a gyakorlókör."}</h2>
        <div class="result-score"><div><strong>${points}/${total}</strong><span>pont</span></div></div>
        <p class="lead">${state.mode === "mixed"
          ? "10 véletlen felvételi részfeladatból álló vegyes kör."
          : `${lawMap[state.law]?.title || ""} – ${total} feladat.`}</p>
        <div class="result-actions">
          <button class="secondary" id="againBtn">Új kör</button>
          <button class="secondary" id="homeBtn">Másik gyakorlás</button>
        </div>
      </section>`;

    document.getElementById("againBtn").addEventListener("click", () => {
      if (state.mode === "mixed") startMixed();
      else startLaw(state.law);
    });
    document.getElementById("homeBtn").addEventListener("click", renderHome);
  }

  renderHome();
})();