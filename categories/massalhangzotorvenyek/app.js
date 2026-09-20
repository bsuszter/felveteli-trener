(() => {
  const DATA = window.MASSALHANGZO_TASKS;
  const app = document.getElementById("app");
  const standaloneScorm = Boolean(window.MASSALHANGZO_SCORM_STANDALONE);
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

  function snapshotAttempt() {
    return {
      version: 1,
      module: "massalhangzotorvenyek",
      mode: state.mode,
      law: state.law,
      questionIds: state.questions.map(q => q.id),
      index: state.index,
      answers: [...state.answers],
      checked: [...state.checked]
    };
  }

  function saveAttempt() {
    if (!window.SCORM?.isConnected?.() || window.SCORM?.isResultLocked?.() || !state.mode) return;
    SCORM.saveAttempt?.(snapshotAttempt());
  }

  function restoreAttempt() {
    if (!window.SCORM?.isConnected?.() || window.SCORM?.isResultLocked?.()) return false;
    const saved = SCORM.loadAttempt?.();
    if (!saved || saved.module !== "massalhangzotorvenyek" || !Array.isArray(saved.questionIds)) return false;

    const restoredQuestions = saved.questionIds
      .map(id => DATA.questions.find(q => q.id === id))
      .filter(Boolean);
    if (!restoredQuestions.length || restoredQuestions.length !== saved.questionIds.length) return false;

    state.mode = saved.mode === "law" ? "law" : "mixed";
    state.law = saved.law || null;
    state.questions = restoredQuestions;
    state.index = Number.isInteger(saved.index)
      ? Math.max(0, Math.min(saved.index, restoredQuestions.length - 1))
      : 0;

    state.answers = Array(restoredQuestions.length).fill(null);
    if (Array.isArray(saved.answers)) {
      saved.answers.slice(0, restoredQuestions.length).forEach((value, i) => {
        state.answers[i] = value ?? null;
      });
    }

    state.checked = Array(restoredQuestions.length).fill(false);
    if (Array.isArray(saved.checked)) {
      saved.checked.slice(0, restoredQuestions.length).forEach((value, i) => {
        state.checked[i] = Boolean(value);
      });
    }
    return true;
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
    if (window.SCORM && state.mode) SCORM.setProgress(score(), total);
    saveAttempt();
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
        ${standaloneScorm ? "" : '<a class="category-back" href="index.html">← Témakörök</a>'}
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
        ${q.answers.length > 1 ? `<p class="consonant-multi-hint">Több helyes megoldás is elfogadható; elég egyet megjelölnöd.</p>` : ""}
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

    document.getElementById("homeBtn").addEventListener("click", () => {
      if (standaloneScorm && window.SCORM?.isConnected?.()) saveAttempt();
      renderHome();
    });
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
    if (window.SCORM) SCORM.setResult(points, total);
    app.innerHTML = `
      <section class="result">
        <span class="badge">Mássalhangzótörvények</span>
        <h2>${points === total ? "Hibátlan gyakorlás!" : "Kész a gyakorlókör."}</h2>
        <div class="result-score"><div><strong>${points}/${total}</strong><span>pont</span></div></div>
        <p class="lead">${state.mode === "mixed"
          ? "10 véletlen felvételi részfeladatból álló vegyes kör."
          : `${lawMap[state.law]?.title || ""} – ${total} feladat.`}</p>
        <div class="result-actions">
          ${standaloneScorm ? "" : '<button class="secondary" id="againBtn">Új kör</button><button class="secondary" id="homeBtn">Másik gyakorlás</button>'}
        </div>
        ${standaloneScorm ? '<div class="scorm-attempt-notice"><strong>Az eredményedet rögzítettük.</strong><span>Új hivatalos eredményhez lépj vissza a Moodle-ba, és indíts új próbálkozást.</span></div>' : ""}
      </section>`;

    if (!standaloneScorm) {
      document.getElementById("againBtn").addEventListener("click", () => {
        if (state.mode === "mixed") startMixed();
        else startLaw(state.law);
      });
      document.getElementById("homeBtn").addEventListener("click", renderHome);
    }
  }

  function renderLockedAttempt() {
    setChrome(false);
    app.innerHTML = `
      <section class="hero">
        <div class="hero-inner">
          <span class="badge">A próbálkozás lezárult</span>
          <h2>Az eredményedet a Moodle már rögzítette.</h2>
          <p class="lead">Új hivatalos eredményhez lépj vissza a Moodle-ba, és indíts új próbálkozást.</p>
        </div>
      </section>`;
  }

  if (window.SCORM) SCORM.init();
  if (window.SCORM?.isConnected?.() && window.SCORM?.isResultLocked?.()) {
    renderLockedAttempt();
  } else if (restoreAttempt()) {
    setChrome(true, state.questions.length);
    renderQuestion();
  } else {
    renderHome();
  }
})();