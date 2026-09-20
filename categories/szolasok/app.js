(() => {
  const DATA = window.SZOLASOK_2026;
  const app = document.getElementById("app");
  const pictureItems = DATA.pictureTask.items;
  const meaningItems = DATA.meaningTask.items;
  const totalSteps = pictureItems.length + meaningItems.length;

  const state = {
    screen: "intro",
    step: 0,
    pictureAnswers: Array(pictureItems.length).fill(null),
    meaningAnswers: Array(meaningItems.length).fill(null)
  };

  function pictureCorrectCount() {
    return pictureItems.reduce((n, item, i) => n + (state.pictureAnswers[i] === item.answer ? 1 : 0), 0);
  }

  function pictureScore() {
    return DATA.pictureTask.scoreMap[String(pictureCorrectCount())] || 0;
  }

  function meaningScore() {
    return meaningItems.reduce((n, item, i) => n + (state.meaningAnswers[i] === item.answer ? 1 : 0), 0);
  }

  function score() { return pictureScore() + meaningScore(); }
  function answeredCount() {
    return state.pictureAnswers.filter(Boolean).length + state.meaningAnswers.filter(Boolean).length;
  }

  function updateStatus() {
    const progressText = document.getElementById("progressText");
    const scoreText = document.getElementById("scoreText");
    const totalText = document.getElementById("totalText");
    const bar = document.getElementById("progressBar");
    if (progressText) progressText.textContent = `${answeredCount()} / ${totalSteps}`;
    if (scoreText) scoreText.textContent = `${score()} / ${DATA.maxScore}`;
    if (totalText) totalText.textContent = String(DATA.maxScore);
    if (bar) bar.style.width = `${Math.round(answeredCount() / totalSteps * 100)}%`;
    if (window.SCORM) SCORM.setProgress(score(), DATA.maxScore);
  }

  function renderIntro() {
    state.screen = "intro";
    updateStatus();
    app.innerHTML = `
      <section class="hero">
        <div class="hero-inner">
          <a class="module-return" href="index.html?category=szolasok">← Évválasztó</a>
          <span class="badge">Szólások és közmondások • 2026</span>
          <h2>Kétféle feladat, egy éves gyakorlás.</h2>
          <p class="lead">Először képi ábrázolásokhoz rendelsz jelentéseket, utána állandósult szókapcsolatokat párosítasz a jelentésükkel.</p>
          <p class="source-note">Az eredeti pontozás szerint az első blokk 4, a második 4 pontot ér.</p>
          <button class="primary" id="startBtn">Kezdem</button>
        </div>
      </section>`;
    document.getElementById("startBtn").addEventListener("click", () => {
      state.step = 0;
      renderStep();
    });
  }

  function figuresHtml(selected) {
    return `<div class="saying-figure-grid">${DATA.pictureTask.figures.map(fig => `
      <button class="saying-figure ${selected === fig.id ? "selected" : ""}" data-value="${fig.id}" aria-label="${fig.label} jelű kép">
        <span class="saying-figure-letter" aria-hidden="true">${fig.label}</span>
        <span class="saying-figure-media">
          <img class="saying-figure-image" src="${fig.image}" alt="" loading="eager" decoding="async">
        </span>
      </button>`).join("")}</div>`;
  }

  function expressionsHtml(selected) {
    return `<div class="saying-expression-list">${DATA.meaningTask.expressions.map(exp => `
      <button class="saying-expression ${selected === exp.id ? "selected" : ""}" data-value="${exp.id}">
        <span>${exp.id}</span><strong>${exp.text}</strong>
      </button>`).join("")}</div>`;
  }

  function renderStep() {
    state.screen = "question";
    updateStatus();
    const inPictureBlock = state.step < pictureItems.length;
    const localIndex = inPictureBlock ? state.step : state.step - pictureItems.length;
    const task = inPictureBlock ? pictureItems[localIndex] : meaningItems[localIndex];
    const answer = inPictureBlock ? state.pictureAnswers[localIndex] : state.meaningAnswers[localIndex];
    const block = inPictureBlock ? DATA.pictureTask : DATA.meaningTask;

    app.innerHTML = `
      <section class="question sayings-question">
        <div class="question-head">
          <span>2026 • ${inPictureBlock ? "1. feladatblokk" : "2. feladatblokk"}</span>
          <span>${state.step + 1} / ${totalSteps}</span>
        </div>
        <span class="badge saying-block-badge">${block.title}</span>
        <h2>${task.prompt}</h2>
        <p class="fill-hint">${block.instruction}</p>
        ${inPictureBlock ? figuresHtml(answer) : expressionsHtml(answer)}
        <div class="navigation">
          <button class="nav-btn" id="backBtn" ${state.step === 0 ? "disabled" : ""}>← Előző</button>
          <button class="nav-btn next" id="nextBtn" ${answer ? "" : "disabled"}>${state.step === totalSteps - 1 ? "Eredmény" : "Következő →"}</button>
        </div>
      </section>`;

    app.querySelectorAll("[data-value]").forEach(button => {
      button.addEventListener("click", () => {
        const value = button.dataset.value;
        if (inPictureBlock) state.pictureAnswers[localIndex] = value;
        else state.meaningAnswers[localIndex] = value;
        renderStep();
      });
    });

    document.getElementById("backBtn").addEventListener("click", () => {
      if (state.step > 0) { state.step--; renderStep(); }
    });
    document.getElementById("nextBtn").addEventListener("click", () => {
      if (!answer) return;
      if (state.step === totalSteps - 1) renderResult();
      else { state.step++; renderStep(); }
    });
  }

  function renderResult() {
    state.screen = "result";
    updateStatus();
    const total = score();
    const picCorrect = pictureCorrectCount();
    const picPoints = pictureScore();
    const meanPoints = meaningScore();
    if (window.SCORM) SCORM.setResult(total, DATA.maxScore);

    app.innerHTML = `
      <section class="result">
        <span class="badge">Kész a 2026-os feladatsor</span>
        <h2>${total === DATA.maxScore ? "Hibátlan munka!" : "Nézzük az eredményt!"}</h2>
        <div class="result-score"><div><strong>${total}/${DATA.maxScore}</strong><span>pont</span></div></div>
        <div class="saying-score-breakdown">
          <div><strong>${picPoints}/4</strong><span>Képi szólások</span><small>${picCorrect}/5 helyes választás</small></div>
          <div><strong>${meanPoints}/4</strong><span>Jelentéspárosítás</span><small>${meanPoints}/4 helyes válasz</small></div>
        </div>
        <div class="result-actions">
          <button class="secondary" id="reviewBtn">Megoldások áttekintése</button>
          <button class="secondary" id="restartBtn">Újrakezdem</button>
          <a class="secondary module-back-link" href="index.html?category=szolasok">Másik év választása</a>
        </div>
      </section>`;

    document.getElementById("reviewBtn").addEventListener("click", renderReview);
    document.getElementById("restartBtn").addEventListener("click", () => {
      state.step = 0;
      state.pictureAnswers.fill(null);
      state.meaningAnswers.fill(null);
      renderIntro();
    });
  }

  function renderReview() {
    const pictureRows = pictureItems.map((item, i) => {
      const user = state.pictureAnswers[i];
      const ok = user === item.answer;
      return `<div class="saying-review-row ${ok ? "correct" : "wrong"}">
        <div><strong>${item.prompt}</strong><small>${item.expression}</small></div>
        <span>Te: ${user || "–"} • Helyes: ${item.answer}</span>
      </div>`;
    }).join("");

    const meaningRows = meaningItems.map((item, i) => {
      const user = state.meaningAnswers[i];
      const ok = user === item.answer;
      const expression = DATA.meaningTask.expressions.find(x => x.id === item.answer)?.text || "";
      return `<div class="saying-review-row ${ok ? "correct" : "wrong"}">
        <div><strong>${item.prompt}</strong><small>${expression}</small></div>
        <span>Te: ${user || "–"} • Helyes: ${item.answer}</span>
      </div>`;
    }).join("");

    app.innerHTML = `
      <section class="review-screen">
        <div class="review-toolbar"><button class="nav-btn" id="backResult">← Eredmény</button><span>2026</span></div>
        <h2>Megoldások</h2>
        <h3>Képi szólások</h3>
        <div class="saying-review-list">${pictureRows}</div>
        <h3>Jelentéspárosítás</h3>
        <div class="saying-review-list">${meaningRows}</div>
      </section>`;
    document.getElementById("backResult").addEventListener("click", renderResult);
  }

  if (window.SCORM) SCORM.init();
  renderIntro();
})();