const app = document.getElementById("app");
const progressText = document.getElementById("progressText");
const scoreText = document.getElementById("scoreText");
const progressBar = document.getElementById("progressBar");

const state = {
  screen: "intro",
  index: 0,
  answers: Array(TASKS.length).fill(null),
  midpointShown: false
};

const labels = {
  first: "Az első alak helyes",
  second: "A második alak helyes",
  both: "Mindkettő helyes",
  neither: "Egyik sem helyes"
};

function isCorrect(task, answer) {
  return Array.isArray(task.correct) ? task.correct.includes(answer) : task.correct === answer;
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
      <h2>Melyik alak helyes?</h2>
      <div class="word-pair">
        <div class="word"><span>${task.first}</span></div>
        <div class="word"><span>${task.second}</span></div>
      </div>
      <div class="answers" role="group" aria-label="Válaszlehetőségek">
        ${Object.entries(labels).map(([value, label]) => `
          <button class="answer ${selected === value ? "selected" : ""}" data-answer="${value}" aria-pressed="${selected === value}">${label}</button>
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
      <p class="lead">${weakTags.length ? `A további gyakorláshoz ezeket a területeket érdemes figyelnünk: <strong>${weakTags.join(", ")}</strong>.` : "Minden területen biztosan teljesítettél."}</p>
      <div class="review">
        ${TASKS.map((task, index) => {
          const correct = isCorrect(task, state.answers[index]);
          return `
            <div class="review-item ${correct ? "correct" : "wrong"}">
              <span class="mark">${correct ? "✓" : "•"}</span>
              <div>
                <strong>${task.first} – ${task.second}</strong>
                ${!correct && task.explanation ? `<div class="explanation">${task.explanation}</div>` : ""}
              </div>
              <small>${correct ? "1 pont" : "0 pont"}</small>
            </div>`;
        }).join("")}
      </div>
      <button class="primary" id="restartBtn">Újrakezdem</button>
    </section>`;

  document.getElementById("restartBtn").addEventListener("click", restart);
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
    .slice(0, 3)
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
  renderIntro();
}

renderIntro();
