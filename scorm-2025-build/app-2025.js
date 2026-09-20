const app = document.getElementById("app");
const progressText = document.getElementById("progressText");
const scoreText = document.getElementById("scoreText");
const progressBar = document.getElementById("progressBar");

const TASKS = MODULE_2025_TASKS;
const TOTAL_POINTS = TASKS.reduce((sum, task) => sum + (task.points || 1), 0);

const state = {
  screen: "intro",
  index: 0,
  answers: Array(TASKS.length).fill(null),
  midpointShown: false,
  reviewIndex: 0,
  practiceTopic: null,
  practiceTasks: [],
  practiceIndex: 0,
  practiceAnswers: [],
  practiceScore: 0,
  completedPractice: {}
};

const labels = {
  first: "Az első alak helyes",
  second: "A második alak helyes",
  both: "Mindkettő helyes",
  neither: "Egyik sem helyes"
};
const symbols = { first: "1", second: "2", both: "X", neither: "0" };

function normalizeFill(value) {
  return String(value ?? "").trim().toLocaleLowerCase("hu-HU");
}

function isCorrect(task, answer) {
  if (answer === null || answer === undefined || answer === "") return false;
  if (task.type === "fill") return normalizeFill(answer) === normalizeFill(task.answer);
  return Array.isArray(task.correct) ? task.correct.includes(answer) : task.correct === answer;
}

function answeredCount() {
  return state.answers.filter(answer => answer !== null && answer !== "").length;
}

function score() {
  return state.answers.reduce((sum, answer, index) => sum + (isCorrect(TASKS[index], answer) ? (TASKS[index].points || 1) : 0), 0);
}

function updateStatus() {
  const answered = answeredCount();
  progressText.textContent = `${answered} / ${TASKS.length}`;
  scoreText.textContent = `${score()} / ${answered}`;
  const totalText = document.getElementById("totalText");
  if (totalText) totalText.textContent = String(TOTAL_POINTS);
  progressBar.style.width = `${(answered / TASKS.length) * 100}%`;
}

function renderIntro() {
  state.screen = "intro";
  updateStatus();
  app.innerHTML = `
    <section class="hero">
      <div class="hero-inner">
        <a class="module-return" href="index.html">← Évválasztó</a>
        <span class="badge">✦ 2025. januári feladatok</span>
        <h2>Helyesírási kihívás</h2>
        <p class="source-note">Helyesírási totó és betűpótlás szólásokban, közmondásokban</p>
        <p class="lead">Először hat helyesírási totó vár rád, majd hat rövid betűpótlás. Minden feladat 1 pontot ér.</p>
        <button class="primary" id="startBtn">Kezdhetjük</button>
      </div>
    </section>`;
  document.getElementById("startBtn").addEventListener("click", renderQuestion);
}

function renderChoiceQuestion(task, selected) {
  return `
    <h2>Melyik alak helyes?</h2>
    <div class="word-pair">
      <div class="word"><span>${task.first}</span></div>
      <div class="word"><span>${task.second}</span></div>
    </div>
    <div class="answers" role="group" aria-label="Válaszlehetőségek">
      ${Object.entries(labels).map(([value, label]) => `<button class="answer ${selected === value ? "selected" : ""}" data-answer="${value}" aria-pressed="${selected === value}"><span class="answer-symbol">${symbols[value]}</span>${label}</button>`).join("")}
    </div>`;
}

function renderFillQuestion(task, selected) {
  const value = selected ?? "";
  return `
    <h2>Pótold a hiányzó betűt vagy betűket!</h2>
    <p class="fill-instruction">Ügyelj a helyesírásra!</p>
    <div class="fill-sentence">
      <span>${task.before}</span><input id="fillInput" class="fill-input" type="text" value="${value}" autocomplete="off" autocapitalize="off" spellcheck="false" aria-label="Hiányzó betű vagy betűk"><span>${task.after}</span>
    </div>
    <p class="fill-hint">Csak a hiányzó betűt vagy betűket írd be.</p>`;
}

function renderQuestion() {
  state.screen = "question";
  const task = TASKS[state.index];
  const selected = state.answers[state.index];
  updateStatus();

  app.innerHTML = `
    <section class="question ${task.type === "fill" ? "fill-question" : ""}">
      <div class="question-head"><span>${state.index + 1}. feladat</span><span>${task.points || 1} pont</span></div>
      <p class="task-source">${task.source}</p>
      ${task.type === "fill" ? renderFillQuestion(task, selected) : renderChoiceQuestion(task, selected)}
      <div class="navigation">
        <button class="nav-btn" id="backBtn" ${state.index === 0 ? "disabled" : ""}>← Vissza</button>
        <button class="nav-btn next" id="nextBtn" ${selected ? "" : "disabled"}>${state.index === TASKS.length - 1 ? "Befejezem" : "Következő →"}</button>
      </div>
    </section>`;

  if (task.type === "fill") {
    const input = document.getElementById("fillInput");
    const nextBtn = document.getElementById("nextBtn");
    input.focus();
    input.addEventListener("input", () => {
      state.answers[state.index] = input.value;
      nextBtn.disabled = !input.value.trim();
      updateStatus();
      SCORM.setProgress(score(), TOTAL_POINTS);
    });
    input.addEventListener("keydown", event => {
      if (event.key === "Enter" && input.value.trim()) nextBtn.click();
    });
  } else {
    app.querySelectorAll(".answer").forEach(button => button.addEventListener("click", () => {
      state.answers[state.index] = button.dataset.answer;
      SCORM.setProgress(score(), TOTAL_POINTS);
      renderQuestion();
    }));
  }

  document.getElementById("backBtn").addEventListener("click", () => {
    if (state.index > 0) {
      state.index--;
      renderQuestion();
    }
  });

  document.getElementById("nextBtn").addEventListener("click", () => {
    const current = state.answers[state.index];
    if (current === null || String(current).trim() === "") return;
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
        <span class="badge">A totó kész</span>
        <h2>Jöhet a betűpótlás.</h2>
        <p class="lead">Az első hat feladatból ${score()} pontot szereztél. Most szólások és közmondások hiányzó betűit kell pótolnod.</p>
        <button class="primary" id="continueBtn">Jöhet a következő hat</button>
      </div>
    </section>`;
  document.getElementById("continueBtn").addEventListener("click", () => {
    state.index = 6;
    renderQuestion();
  });
}

function practiceTopicForTask(task) {
  const tags = task.tags || [];
  if (tags.includes("felszólító mód") || tags.includes("igealak")) return "felszólító mód";
  if (tags.includes("igekötő")) return "igekötők";
  if (tags.includes("egybe- és különírás") || tags.includes("anyagjelölő jelző")) return "egybe- és különírás";
  if (tags.includes("j és ly") || tags.includes("j")) return "j és ly";
  if (tags.includes("magánhangzó-hosszúság") || tags.includes("magánhangzó")) return "magánhangzó-hosszúság";
  if (tags.includes("tulajdonnév") && !tags.includes("cím")) return "tulajdonnevek";
  if (tags.includes("kis- és nagybetű") || tags.includes("cím") || tags.includes("földrajzi név")) return "kis- és nagybetű";
  if (tags.includes("jelentés")) return "jelentés";
  return null;
}

function getRecommendedTopics() {
  const counts = {};
  TASKS.forEach((task, index) => {
    if (!isCorrect(task, state.answers[index])) {
      const topic = practiceTopicForTask(task);
      if (topic && PRACTICE_TOPICS[topic]) counts[topic] = (counts[topic] || 0) + 1;
    }
  });
  return Object.entries(counts).sort((a, b) => b[1] - a[1]).map(([topic]) => topic);
}

function allPracticeTopics() { return Object.keys(PRACTICE_TOPICS); }
function topicTitle(topic) { return PRACTICE_TOPICS[topic]?.title || topic; }

function renderResult() {
  state.screen = "result";
  updateStatus();
  const total = score();
  const recommended = getRecommendedTopics();
  SCORM.setResult(total, TOTAL_POINTS);

  app.innerHTML = `
    <section class="result">
      <span class="badge">Kész a 2025-ös feladatsor</span>
      <h2>${resultTitle(total)}</h2>
      <div class="result-score"><div><strong>${total}/${TOTAL_POINTS}</strong><span>pont</span></div></div>
      ${recommended.length ? `<div class="focus-block"><p>Érdemes még gyakorolnod:</p><div class="tag-list">${recommended.map(topic => `<span class="topic-tag">${topicTitle(topic)}</span>`).join("")}</div></div>` : `<p class="lead">A meglévő gyakorlóbankhoz kapcsolható területeken biztosan teljesítettél.</p>`}
      <div class="practice-offer"><span class="practice-icon">✦</span><div><h3>Személyre szabott gyakorlás</h3><p>A hibáidhoz kapcsolódó, már elkészült gyakorlóblokkokat innen nyithatod meg.</p></div></div>
      <div class="result-actions">
        <button class="primary" id="practiceBtn">Gyakorló témák megnyitása</button>
        <button class="secondary" id="reviewBtn">Válaszaim áttekintése</button>
        <button class="secondary" id="restartBtn">Újrakezdem</button>
        <a class="secondary module-back-link" href="index.html">Másik év választása</a>
      </div>
    </section>`;

  document.getElementById("practiceBtn").addEventListener("click", renderPracticeHub);
  document.getElementById("reviewBtn").addEventListener("click", () => {
    state.reviewIndex = firstWrongIndex();
    renderReview();
  });
  document.getElementById("restartBtn").addEventListener("click", restart);
}

function renderPracticeHub() {
  state.screen = "practice-hub";
  const recommended = getRecommendedTopics();
  const topics = recommended.length ? recommended : allPracticeTopics();
  app.innerHTML = `<section class="practice-hub"><div class="review-toolbar"><button class="nav-btn" id="backToResult">← Eredmény</button><span>${recommended.length ? "Személyre szabott útvonal" : "Teljes gyakorlóbank"}</span></div><div class="practice-hub-head"><span class="badge">${recommended.length ? `${topics.length} ajánlott terület` : `${topics.length} választható terület`}</span><h2>Mit gyakoroljunk?</h2><p class="lead">Minden blokk 5 feladatból áll. A gyakorlópontok nem módosítják a ${TOTAL_POINTS} pontos felvételi eredményt.</p></div><div class="practice-topic-grid">${topics.map((topic, index) => { const data = PRACTICE_TOPICS[topic]; const completed = state.completedPractice[topic]; return `<button class="practice-topic-card ${completed ? "completed" : ""}" data-topic="${topic}"><span class="topic-order">${completed ? "✓" : index + 1}</span><span class="topic-card-copy"><strong>${data.title}</strong><small>${data.description}</small></span><span class="topic-card-score">${completed ? `${completed.score}/${completed.total}` : "5 feladat"}</span></button>`; }).join("")}</div>${recommended.length ? `<details class="all-topics"><summary>Más témát is gyakorolnék</summary><div class="tag-list topic-shortcuts">${allPracticeTopics().filter(topic => !topics.includes(topic)).map(topic => `<button class="topic-tag topic-shortcut" data-topic="${topic}">${topicTitle(topic)}</button>`).join("")}</div></details>` : ""}</section>`;
  document.getElementById("backToResult").addEventListener("click", renderResult);
  app.querySelectorAll("[data-topic]").forEach(button => button.addEventListener("click", () => startPractice(button.dataset.topic)));
}

function startPractice(topic) {
  state.practiceTopic = topic;
  state.practiceTasks = PRACTICE_TASKS.filter(item => item.topic === topic);
  state.practiceIndex = 0;
  state.practiceAnswers = Array(state.practiceTasks.length).fill(null);
  state.practiceScore = 0;
  renderPractice();
}

function renderPractice() {
  state.screen = "practice";
  const task = state.practiceTasks[state.practiceIndex];
  const answer = state.practiceAnswers[state.practiceIndex];
  const answered = answer !== null;
  const correct = answered && answer === task.correct;
  app.innerHTML = `<section class="practice-screen"><div class="question-head"><span>${topicTitle(task.topic)}</span><span>${state.practiceIndex + 1} / ${state.practiceTasks.length}</span></div><span class="topic-tag practice-topic">${topicTitle(task.topic)}</span><h2>${task.prompt}</h2><div class="practice-options">${task.options.map((option, index) => `<button class="practice-option ${answered ? (index === task.correct ? "correct" : index === answer ? "wrong" : "") : ""}" data-index="${index}" ${answered ? "disabled" : ""}>${option}</button>`).join("")}</div>${answered ? `<div class="practice-feedback ${correct ? "correct" : "wrong"}"><span class="practice-feedback-icon" aria-hidden="true"></span><div><strong>${correct ? "Helyes döntés" : "Ezt most nézzük meg"}</strong><p>${task.explanation}</p></div></div>` : ""}<div class="navigation"><button class="nav-btn" id="quitPractice">← Témák</button><button class="nav-btn next" id="nextPractice" ${answered ? "" : "disabled"}>${state.practiceIndex === state.practiceTasks.length - 1 ? "Gyakorlás befejezése" : "Következő →"}</button></div></section>`;
  app.querySelectorAll(".practice-option").forEach(button => button.addEventListener("click", () => {
    const selected = Number(button.dataset.index);
    state.practiceAnswers[state.practiceIndex] = selected;
    if (selected === task.correct) state.practiceScore++;
    renderPractice();
  }));
  document.getElementById("quitPractice").addEventListener("click", renderPracticeHub);
  document.getElementById("nextPractice").addEventListener("click", () => {
    if (!answered) return;
    if (state.practiceIndex === state.practiceTasks.length - 1) renderPracticeResult();
    else {
      state.practiceIndex++;
      renderPractice();
    }
  });
}

function renderPracticeResult() {
  state.completedPractice[state.practiceTopic] = { score: state.practiceScore, total: state.practiceTasks.length };
  const recommended = getRecommendedTopics();
  const remaining = recommended.filter(topic => !state.completedPractice[topic]);
  app.innerHTML = `<section class="result practice-result"><span class="badge">${topicTitle(state.practiceTopic)} – kész</span><h2>${state.practiceScore === state.practiceTasks.length ? "Nagyon biztosan ment!" : "Máris erősebb lett a tudásod."}</h2><div class="result-score small"><div><strong>${state.practiceScore}/${state.practiceTasks.length}</strong><span>gyakorlópont</span></div></div><p class="lead">A gyakorlópont nem változtatja meg az eredeti felvételi pontszámodat: az továbbra is <strong>${score()}/${TOTAL_POINTS}</strong>.</p><div class="result-actions">${remaining.length ? `<button class="primary" id="nextTopic">Következő ajánlott téma</button>` : ""}<button class="secondary" id="backTopics">Vissza a témákhoz</button><button class="secondary" id="againPractice">Ezt újra gyakorlom</button></div></section>`;
  if (remaining.length) document.getElementById("nextTopic").addEventListener("click", () => startPractice(remaining[0]));
  document.getElementById("backTopics").addEventListener("click", renderPracticeHub);
  document.getElementById("againPractice").addEventListener("click", () => startPractice(state.practiceTopic));
}

function renderReview() {
  state.screen = "review";
  const task = TASKS[state.reviewIndex];
  const answer = state.answers[state.reviewIndex];
  const correct = isCorrect(task, answer);

  const taskBlock = task.type === "fill"
    ? `<div class="fill-review-word"><small>Teljes mondat</small><strong>${task.completed}</strong></div><div class="answer-comparison"><div><small>A te válaszod</small><strong>${answer || "—"}</strong></div><div class="correct-answer-box"><small>Hiányzó rész</small><strong>${task.answer}</strong></div></div>`
    : `<div class="review-words"><div class="review-word"><small>Első alak</small><strong>${task.first}</strong></div><div class="review-word"><small>Második alak</small><strong>${task.second}</strong></div></div><div class="answer-comparison"><div><small>A te válaszod</small><strong><span class="answer-code">${symbols[answer] || "—"}</span>${labels[answer] || "Nincs válasz"}</strong></div><div class="correct-answer-box"><small>Helyes megoldás</small><strong><span class="answer-code">${symbols[task.correct]}</span>${labels[task.correct]}</strong></div></div>`;

  app.innerHTML = `<section class="review-screen"><div class="review-toolbar"><button class="nav-btn" id="resultBtn">← Eredmény</button><span>${state.reviewIndex + 1} / ${TASKS.length}</span></div><p class="task-source">${task.source}</p><div class="review-status ${correct ? "correct" : "wrong"}"><span class="status-icon"></span><div><strong>${correct ? "Helyes döntés" : "Ezt most érdemes átnézni"}</strong><span>${correct ? "1 pont" : "0 pont"}</span></div></div>${taskBlock}<div class="short-explanation"><h3>Röviden</h3><p>${task.explanation}</p></div><div class="review-navigation"><button class="nav-btn" id="prevReviewBtn" ${state.reviewIndex === 0 ? "disabled" : ""}>← Előző</button><div class="review-dots">${TASKS.map((item, index) => `<button class="review-dot ${index === state.reviewIndex ? "active" : ""} ${isCorrect(item, state.answers[index]) ? "correct" : "wrong"}" data-index="${index}" aria-label="${index + 1}. feladat"></button>`).join("")}</div><button class="nav-btn next" id="nextReviewBtn">${state.reviewIndex === TASKS.length - 1 ? "Vissza az eredményhez" : "Következő →"}</button></div></section>`;

  document.getElementById("resultBtn").addEventListener("click", renderResult);
  document.getElementById("prevReviewBtn").addEventListener("click", () => {
    if (state.reviewIndex > 0) {
      state.reviewIndex--;
      renderReview();
    }
  });
  document.getElementById("nextReviewBtn").addEventListener("click", () => {
    if (state.reviewIndex === TASKS.length - 1) renderResult();
    else {
      state.reviewIndex++;
      renderReview();
    }
  });
  app.querySelectorAll(".review-dot").forEach(dot => dot.addEventListener("click", () => {
    state.reviewIndex = Number(dot.dataset.index);
    renderReview();
  }));
}

function firstWrongIndex() {
  const index = TASKS.findIndex((task, taskIndex) => !isCorrect(task, state.answers[taskIndex]));
  return index === -1 ? 0 : index;
}

function resultTitle(points) {
  if (points === TOTAL_POINTS) return "Hibátlan munka!";
  if (points >= 9) return "Nagyon szép eredmény!";
  if (points >= 6) return "Jó alapokra építhetsz.";
  return "Most már tudjuk, mit érdemes gyakorolni.";
}

function restart() {
  state.index = 0;
  state.answers = Array(TASKS.length).fill(null);
  state.midpointShown = false;
  state.reviewIndex = 0;
  state.practiceTopic = null;
  state.practiceTasks = [];
  state.practiceAnswers = [];
  state.practiceScore = 0;
  state.completedPractice = {};
  renderIntro();
}

SCORM.init();
renderIntro();
