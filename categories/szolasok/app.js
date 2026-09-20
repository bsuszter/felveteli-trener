(() => {
  const DATA = window.SZOLASOK_2026;
  const app = document.getElementById("app");
  const pictureItems = DATA.pictureTask.items;
  const meaningItems = DATA.meaningTask.items;
  const recallItems = DATA.recallTask.items;
  const totalSteps = pictureItems.length + meaningItems.length + recallItems.length;

  const state = {
    screen: "intro",
    step: 0,
    pictureAnswers: Array(pictureItems.length).fill(null),
    meaningAnswers: Array(meaningItems.length).fill(null),
    recallAnswers: Array(recallItems.length).fill(null)
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

  function recallScore() {
    return recallItems.reduce((n, item, i) => n + (state.recallAnswers[i] === item.answer ? 1 : 0), 0);
  }

  function examScore() { return pictureScore() + meaningScore(); }
  function score() { return examScore() + recallScore(); }
  function answeredCount() {
    return state.pictureAnswers.filter(Boolean).length +
      state.meaningAnswers.filter(Boolean).length +
      state.recallAnswers.filter(Boolean).length;
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
          <h2>Három lépésben gyakoroljuk a 2026-os feladatokat.</h2>
          <p class="lead">Először képi ábrázolásokhoz rendelsz jelentéseket, utána állandósult szókapcsolatokat párosítasz a jelentésükkel, végül a képekhez a pontos szólást vagy közmondást is kiválasztod.</p>
          <p class="source-note">Az eredeti felvételi rész 8 pontot, a rögzítő kör további 6 pontot ér. Összesen 14 pont szerezhető.</p>
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

  function recallOptionsHtml(selected) {
    return `<div class="saying-expression-list">${DATA.recallTask.options.map(exp => `
      <button class="saying-expression ${selected === exp.id ? "selected" : ""}" data-value="${exp.id}">
        <span>${exp.id}</span><strong>${exp.text}</strong>
      </button>`).join("")}</div>`;
  }

  function recallFigureHtml(figureId) {
    const fig = DATA.pictureTask.figures.find(item => item.id === figureId);
    if (!fig) return "";
    return `<div class="saying-recall-figure">
      <span class="saying-figure-letter" aria-hidden="true">${fig.label}</span>
      <span class="saying-figure-media">
        <img class="saying-figure-image" src="${fig.image}" alt="" loading="eager" decoding="async">
      </span>
    </div>`;
  }

  function renderStep() {
    state.screen = "question";
    updateStatus();
    const pictureEnd = pictureItems.length;
    const meaningEnd = pictureEnd + meaningItems.length;
    const inPictureBlock = state.step < pictureEnd;
    const inMeaningBlock = state.step >= pictureEnd && state.step < meaningEnd;
    const inRecallBlock = state.step >= meaningEnd;

    let localIndex;
    let task;
    let answer;
    let block;
    let blockNumber;
    let contentHtml;
    let heading;

    if (inPictureBlock) {
      localIndex = state.step;
      task = pictureItems[localIndex];
      answer = state.pictureAnswers[localIndex];
      block = DATA.pictureTask;
      blockNumber = 1;
      heading = task.prompt;
      contentHtml = figuresHtml(answer);
    } else if (inMeaningBlock) {
      localIndex = state.step - pictureEnd;
      task = meaningItems[localIndex];
      answer = state.meaningAnswers[localIndex];
      block = DATA.meaningTask;
      blockNumber = 2;
      heading = task.prompt;
      contentHtml = expressionsHtml(answer);
    } else {
      localIndex = state.step - meaningEnd;
      task = recallItems[localIndex];
      answer = state.recallAnswers[localIndex];
      block = DATA.recallTask;
      blockNumber = 3;
      heading = "Melyik pontos kifejezést ábrázolja a kép?";
      contentHtml = recallFigureHtml(task.figure) + recallOptionsHtml(answer);
    }

    app.innerHTML = `
      <section class="question sayings-question">
        <div class="question-head">
          <span>2026 • ${blockNumber}. feladatblokk</span>
          <span>${state.step + 1} / ${totalSteps}</span>
        </div>
        <span class="badge saying-block-badge">${block.title}</span>
        <h2>${heading}</h2>
        <p class="fill-hint">${block.instruction}</p>
        ${contentHtml}
        <div class="navigation">
          <button class="nav-btn" id="backBtn" ${state.step === 0 ? "disabled" : ""}>← Előző</button>
          <button class="nav-btn next" id="nextBtn" ${answer ? "" : "disabled"}>${state.step === totalSteps - 1 ? "Eredmény" : "Következő →"}</button>
        </div>
      </section>`;

    app.querySelectorAll("[data-value]").forEach(button => {
      button.addEventListener("click", () => {
        const value = button.dataset.value;
        if (inPictureBlock) state.pictureAnswers[localIndex] = value;
        else if (inMeaningBlock) state.meaningAnswers[localIndex] = value;
        else state.recallAnswers[localIndex] = value;
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
    const recallPoints = recallScore();
    const originalPoints = examScore();
    if (window.SCORM) SCORM.setResult(total, DATA.maxScore);

    app.innerHTML = `
      <section class="result">
        <span class="badge">Kész a 2026-os feladatsor</span>
        <h2>${total === DATA.maxScore ? "Hibátlan munka!" : "Nézzük az eredményt!"}</h2>
        <div class="result-score"><div><strong>${total}/${DATA.maxScore}</strong><span>pont</span></div></div>
        <div class="saying-score-breakdown">
          <div><strong>${originalPoints}/8</strong><span>Eredeti felvételi rész</span><small>Képi felismerés + jelentéspárosítás</small></div>
          <div><strong>${recallPoints}/6</strong><span>Rögzítő kör</span><small>Pontos szólások és közmondások</small></div>
        </div>
        <div class="saying-score-details">
          <span>Képi szólások: <strong>${picPoints}/4</strong> (${picCorrect}/5 jó párosítás)</span>
          <span>Jelentéspárosítás: <strong>${meanPoints}/4</strong></span>
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
      state.recallAnswers.fill(null);
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

    const recallRows = recallItems.map((item, i) => {
      const user = state.recallAnswers[i];
      const ok = user === item.answer;
      const correctExpression = DATA.recallTask.options.find(x => x.id === item.answer)?.text || "";
      const userExpression = DATA.recallTask.options.find(x => x.id === user)?.text || "Nincs válasz";
      return `<div class="saying-review-row ${ok ? "correct" : "wrong"}">
        <div><strong>${item.figure} jelű kép</strong><small>${correctExpression}</small></div>
        <span>Te: ${userExpression}</span>
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
        <h3>Rögzítő kör – pontos kifejezések</h3>
        <div class="saying-review-list">${recallRows}</div>
      </section>`;
    document.getElementById("backResult").addEventListener("click", renderResult);
  }

  if (window.SCORM) SCORM.init();
  renderIntro();
})();