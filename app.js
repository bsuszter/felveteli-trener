const app = document.getElementById("app");
const progressText = document.getElementById("progressText");
const scoreText = document.getElementById("scoreText");
const progressBar = document.getElementById("progressBar");

const state = {
  screen: "intro",
  index: 0,
  answers: Array(TASKS.length).fill(null),
  midpointShown: false,
  reviewIndex: 0
};

const labels = {
  first: "Az első alak helyes",
  second: "A második alak helyes",
  both: "Mindkettő helyes",
  neither: "Egyik sem helyes"
};

const symbols = {
  first: "1",
  second: "2",
  both: "X",
  neither: "0"
};

function isCorrect(task, answer) {
  return Array.isArray(task.correct) ? task.correct.includes(answer) : task.correct === answer;
}

function primaryCorrect(task) {
  return Array.isArray(task.correct) ? task.correct[0] : task.correct;
}

function answeredCount() {
  return state.answers.filter(Boolean).length;
}

function score() {
  return state.answers.reduce((sum, answer, index) =>
    sum + (answer && isCorrect(TASKS[index], answer) ? 1 : 0), 0);
}

function updateStatus() {
  const answered = answeredCount();
  progressText.textContent = `${answered} / ${TASKS.length}`;
  scoreText.textContent = `${score()} / ${answered}`;
  progressBar.style.width = `${(answered / TASKS.length) * 100}%`;
}

function renderIntro() {
  state.screen = "intro";
  updateStatus();
  app.innerHTML = `
    <section class="hero">
      <div class="hero-inner">
        <span class="badge">✦ 2026. januári feladatok</span>
        <h2>Melyik alak helyes?</h2>
        <p class="source-note">Központi írásbeli felvételi: 5. feladat és pótfelvételi: 4. feladat</p>
        <p class="lead">Néha csak az egyik, néha mindkettő. Olykor pedig egyik sem. Tizenkét rövid döntés vár rád, közben végig látod a haladásodat és az eddig megszerzett pontjaidat.</p>
        <button class="primary" id="startBtn">Kezdhetjük</button>
      </div>
    </section>`;
  document.getElementById("startBtn").addEventListener("click", () => {
    state.screen = "question";
    renderQuestion();
  });
}

function renderQuestion() {
  state.screen = "question";
  const task = TASKS[state.index];
  const selected = state.answers[state.index];
  updateStatus();

  app.innerHTML = `
    <section class="question">
      <div class="question-head">
        <span>${state.index + 1}. feladat</span>
        <span>1 pont</span>
      </div>
      <p class="task-source">${task.source}</p>
      <h2>Melyik alak helyes?</h2>
      <div class="word-pair">
        <div class="word"><span>${task.first}</span></div>
        <div class="word"><span>${task.second}</span></div>
      </div>
      <div class="answers" role="group" aria-label="Válaszlehetőségek">
        ${Object.entries(labels).map(([value, label]) => `
          <button class="answer ${selected === value ? "selected" : ""}" data-answer="${value}" aria-pressed="${selected === value}">
            <span class="answer-symbol">${symbols[value]}</span>${label}
          </button>
        `).join("")}
      </div>
      <div class="navigation">
        <button class="nav-btn" id="backBtn" ${state.index === 0 ? "disabled" : ""}>← Vissza</button>
        <button class="nav-btn next" id="nextBtn" ${selected ? "" : "disabled"}>${state.index === TASKS.length - 1 ? "Befejezem" : "Következő →"}</button>
      </div>
    </section>`;

  app.querySelectorAll(".answer").forEach(button => {
    button.addEventListener("click", () => {
      state.answers[state.index] = button.dataset.answer;
      renderQuestion();
    });
  });

  document.getElementById("backBtn").addEventListener("click", () => {
    if (state.index > 0) {
      state.index--;
      renderQuestion();
    }
  });

  document.getElementById("nextBtn").addEventListener("click", () => {
    if (!state.answers[state.index]) return;
    if (state.index === TASKS.length - 1) {
      renderResult();
      return;
    }
    if (state.index === 5 && !state.midpointShown) {
      state.midpointShown = true;
      renderMidpoint();
      return;
    }
    state.index++;
    renderQuestion();
  });
}

function renderMidpoint() {
  updateStatus();
  app.innerHTML = `
    <section class="midpoint">
      <div class="hero-inner">
        <span class="badge">Félidő</span>
        <h2>Az első hat megvan.</h2>
        <p class="lead">Eddig ${score()} pontot szereztél a megszerezhető 6-ból. A következő körben is hat döntés vár rád.</p>
        <button class="primary" id="continueBtn">Jöhet a következő hat</button>
      </div>
    </section>`;
  document.getElementById("continueBtn").addEventListener("click", () => {
    state.index = 6;
    renderQuestion();
  });
}

function renderResult() {
  state.screen = "result";
  updateStatus();
  const total = score();
  const weakTags = getWeakTags();

  app.innerHTML = `
    <section class="result">
      <span class="badge">Kész a feladatsor</span>
      <h2>${resultTitle(total)}</h2>
      <div class="result-score"><div><strong>${total}/12</strong><span>pont</span></div></div>
      ${weakTags.length ? `
        <div class="focus-block">
          <p>Érdemes még gyakorolnod:</p>
          <div class="tag-list">${weakTags.map(tag => `<span class="topic-tag">${tag}</span>`).join("")}</div>
        </div>` : `<p class="lead">Minden területen biztosan teljesítettél.</p>`}
      <div class="result-actions">
        <button class="primary" id="reviewBtn">Válaszaim áttekintése</button>
        <button class="secondary" id="restartBtn">Újrakezdem</button>
      </div>
    </section>`;

  document.getElementById("reviewBtn").addEventListener("click", () => {
    state.reviewIndex = firstWrongIndex();
    renderReview();
  });
  document.getElementById("restartBtn").addEventListener("click", restart);
}

function renderLearningContent(learn) {
  if (learn.comparison) {
    return `
      <h3>${learn.title}</h3>
      <div class="learning-comparison">
        ${learn.comparison.map(item => `
          <section class="learning-side">
            <div class="learning-word">${item.word}</div>
            <div class="learning-subtitle">${item.subtitle}</div>
            <div class="learning-examples">
              ${item.examples.map(example => `
                <p class="learning-example ${example.correct ? "good" : "bad"}">
                  <span aria-hidden="true">${example.correct ? "✓" : "✕"}</span>${example.text}
                </p>`).join("")}
            </div>
          </section>`).join("")}
      </div>
      <div class="rule-panel">
        <h4>${learn.ruleTitle}</h4>
        <p>${learn.rule}</p>
        <div class="formula">${learn.formula}</div>
      </div>
      <div class="counter-panel">
        <h4>${learn.counterTitle}</h4>
        <p>${learn.counterText}</p>
      </div>
      <div class="irregular-panel">
        <h4>${learn.irregularTitle}</h4>
        <div class="irregular-list">${learn.irregulars.map(word => `<span>${word}</span>`).join("")}</div>
      </div>
      ${learn.image ? `
        <details class="visual-summary">
          <summary>Vizuális összefoglaló megnyitása</summary>
          <img src="${learn.image}" alt="${learn.imageAlt || "Vizuális magyarázat"}">
        </details>` : ""}
    `;
  }

  return `
    <h3>${learn.title}</h3>
    <p>${learn.body}</p>
    <div class="remember-box"><strong>Jegyezd meg!</strong><span>${learn.rule}</span></div>
  `;
}

function renderReview() {
  state.screen = "review";
  const task = TASKS[state.reviewIndex];
  const answer = state.answers[state.reviewIndex];
  const correct = isCorrect(task, answer);
  const correctKey = primaryCorrect(task);
  const hasAlternative = Array.isArray(task.correct) && task.correct.length > 1;

  app.innerHTML = `
    <section class="review-screen">
      <div class="review-toolbar">
        <button class="nav-btn" id="resultBtn">← Eredmény</button>
        <span>${state.reviewIndex + 1} / ${TASKS.length}</span>
      </div>
      <p class="task-source">${task.source}</p>
      <div class="review-status ${correct ? "correct" : "wrong"}">
        <span class="status-icon">${correct ? "✓" : "!"}</span>
        <div>
          <strong>${correct ? "Helyes döntés" : "Ezt most érdemes átnézni"}</strong>
          <span>${correct ? "1 pont" : "0 pont"}</span>
        </div>
      </div>

      <div class="review-words">
        <div class="review-word"><small>Első alak</small><strong>${task.first}</strong></div>
        <div class="review-word"><small>Második alak</small><strong>${task.second}</strong></div>
      </div>

      <div class="answer-comparison">
        <div>
          <small>A te válaszod</small>
          <strong><span class="answer-code">${symbols[answer]}</span>${labels[answer]}</strong>
        </div>
        <div class="correct-answer-box">
          <small>Helyes megoldás</small>
          <strong><span class="answer-code">${symbols[correctKey]}</span>${labels[correctKey]}</strong>
          ${hasAlternative ? `<em>A feladat egy másik választ is elfogad.</em>` : ""}
        </div>
      </div>

      <div class="short-explanation">
        <h3>Röviden</h3>
        <p>${task.explanation}</p>
      </div>

      ${task.learn ? `
        <details class="learning-card" ${!correct || task.id === 1 ? "open" : ""}>
          <summary>Nézzük meg részletesebben</summary>
          <div class="learning-content">${renderLearningContent(task.learn)}</div>
        </details>` : ""}

      <div class="review-navigation">
        <button class="nav-btn" id="prevReviewBtn" ${state.reviewIndex === 0 ? "disabled" : ""}>← Előző</button>
        <div class="review-dots" aria-label="Feladatok">
          ${TASKS.map((item, index) => `<button class="review-dot ${index === state.reviewIndex ? "active" : ""} ${isCorrect(item, state.answers[index]) ? "correct" : "wrong"}" data-index="${index}" aria-label="${index + 1}. feladat"></button>`).join("")}
        </div>
        <button class="nav-btn next" id="nextReviewBtn">${state.reviewIndex === TASKS.length - 1 ? "Vissza az eredményhez" : "Következő →"}</button>
      </div>
    </section>`;

  document.getElementById("resultBtn").addEventListener("click", renderResult);
  document.getElementById("prevReviewBtn").addEventListener("click", () => {
    if (state.reviewIndex > 0) {
      state.reviewIndex--;
      renderReview();
    }
  });
  document.getElementById("nextReviewBtn").addEventListener("click", () => {
    if (state.reviewIndex === TASKS.length - 1) {
      renderResult();
    } else {
      state.reviewIndex++;
      renderReview();
    }
  });
  app.querySelectorAll(".review-dot").forEach(dot => {
    dot.addEventListener("click", () => {
      state.reviewIndex = Number(dot.dataset.index);
      renderReview();
    });
  });
}

function firstWrongIndex() {
  const index = TASKS.findIndex((task, taskIndex) => !isCorrect(task, state.answers[taskIndex]));
  return index === -1 ? 0 : index;
}

function getWeakTags() {
  const counts = {};
  TASKS.forEach((task, index) => {
    if (!isCorrect(task, state.answers[index])) {
      task.tags.forEach(tag => counts[tag] = (counts[tag] || 0) + 1);
    }
  });
  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4)
    .map(([tag]) => tag);
}

function resultTitle(points) {
  if (points === 12) return "Hibátlan munka!";
  if (points >= 9) return "Nagyon szép eredmény!";
  if (points >= 6) return "Jó alapokra építhetsz.";
  return "Most már tudjuk, mit érdemes gyakorolni.";
}

function restart() {
  state.index = 0;
  state.answers = Array(TASKS.length).fill(null);
  state.midpointShown = false;
  state.reviewIndex = 0;
  renderIntro();
}

renderIntro();
