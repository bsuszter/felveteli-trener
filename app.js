const app = document.getElementById("app");
const progressText = document.getElementById("progressText");
const scoreText = document.getElementById("scoreText");
const progressBar = document.getElementById("progressBar");

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

const labels = { first: "Az első alak helyes", second: "A második alak helyes", both: "Mindkettő helyes", neither: "Egyik sem helyes" };
const symbols = { first: "1", second: "2", both: "X", neither: "0" };

function isCorrect(task, answer) { return Array.isArray(task.correct) ? task.correct.includes(answer) : task.correct === answer; }
function primaryCorrect(task) { return Array.isArray(task.correct) ? task.correct[0] : task.correct; }
function answeredCount() { return state.answers.filter(Boolean).length; }
function score() { return state.answers.reduce((sum, answer, index) => sum + (answer && isCorrect(TASKS[index], answer) ? 1 : 0), 0); }

function updateStatus() {
  const answered = answeredCount();
  progressText.textContent = `${answered} / ${TASKS.length}`;
  scoreText.textContent = `${score()} / ${answered}`;
  progressBar.style.width = `${(answered / TASKS.length) * 100}%`;
}

function renderIntro() {
  state.screen = "intro";
  updateStatus();
  app.innerHTML = `<section class="hero"><div class="hero-inner"><span class="badge">✦ 2026. januári feladatok</span><h2>Melyik alak helyes?</h2><p class="source-note">Központi írásbeli felvételi: 5. feladat és pótfelvételi: 4. feladat</p><p class="lead">Néha csak az egyik, néha mindkettő. Olykor pedig egyik sem. Tizenkét rövid döntés vár rád, közben végig látod a haladásodat és az eddig megszerzett pontjaidat.</p><button class="primary" id="startBtn">Kezdhetjük</button></div></section>`;
  document.getElementById("startBtn").addEventListener("click", renderQuestion);
}

function renderQuestion() {
  state.screen = "question";
  const task = TASKS[state.index];
  const selected = state.answers[state.index];
  updateStatus();
  app.innerHTML = `<section class="question"><div class="question-head"><span>${state.index + 1}. feladat</span><span>1 pont</span></div><p class="task-source">${task.source}</p><h2>Melyik alak helyes?</h2><div class="word-pair"><div class="word"><span>${task.first}</span></div><div class="word"><span>${task.second}</span></div></div><div class="answers" role="group" aria-label="Válaszlehetőségek">${Object.entries(labels).map(([value, label]) => `<button class="answer ${selected === value ? "selected" : ""}" data-answer="${value}" aria-pressed="${selected === value}"><span class="answer-symbol">${symbols[value]}</span>${label}</button>`).join("")}</div><div class="navigation"><button class="nav-btn" id="backBtn" ${state.index === 0 ? "disabled" : ""}>← Vissza</button><button class="nav-btn next" id="nextBtn" ${selected ? "" : "disabled"}>${state.index === TASKS.length - 1 ? "Befejezem" : "Következő →"}</button></div></section>`;
  app.querySelectorAll(".answer").forEach(button => button.addEventListener("click", () => {
    state.answers[state.index] = button.dataset.answer;
    SCORM.setProgress(score(), TASKS.length);
    renderQuestion();
  }));
  document.getElementById("backBtn").addEventListener("click", () => { if (state.index > 0) { state.index--; renderQuestion(); } });
  document.getElementById("nextBtn").addEventListener("click", () => {
    if (!state.answers[state.index]) return;
    if (state.index === TASKS.length - 1) { renderResult(); return; }
    if (state.index === 5 && !state.midpointShown) { state.midpointShown = true; renderMidpoint(); return; }
    state.index++;
    renderQuestion();
  });
}

function renderMidpoint() {
  updateStatus();
  app.innerHTML = `<section class="midpoint"><div class="hero-inner"><span class="badge">Félidő</span><h2>Az első hat megvan.</h2><p class="lead">Eddig ${score()} pontot szereztél a megszerezhető 6-ból. A következő körben is hat döntés vár rád.</p><button class="primary" id="continueBtn">Jöhet a következő hat</button></div></section>`;
  document.getElementById("continueBtn").addEventListener("click", () => { state.index = 6; renderQuestion(); });
}

function practiceTopicForTask(task) {
  if (task.tags.includes("felszólító mód") || task.tags.includes("rendhagyó ige") || task.tags.includes("gy + j")) return "felszólító mód";
  if (task.tags.includes("igekötő") || task.tags.includes("közbeékelődés")) return "igekötők";
  if (task.tags.includes("egybe- és különírás") || task.tags.includes("időtartam") || task.tags.includes("számnév")) return "egybe- és különírás";
  if (task.tags.includes("j–ly")) return "j és ly";
  if (task.tags.includes("magánhangzó-hosszúság")) return "magánhangzó-hosszúság";
  if (task.tags.includes("tulajdonnév") || task.tags.includes("szóalak")) return "tulajdonnevek";
  if (task.tags.includes("kis- és nagybetű") || task.tags.includes("történelmi esemény") || task.tags.includes("földrajzi név") || task.tags.includes("ünnep") || task.tags.includes("nevezetes nap")) return "kis- és nagybetű";
  if (task.tags.includes("rövidítés") || task.tags.includes("toldalékolás")) return "rövidítések";
  if (task.tags.includes("jelentés")) return "jelentés";
  return null;
}

function getRecommendedTopics() {
  const counts = {};
  TASKS.forEach((task, index) => {
    if (!isCorrect(task, state.answers[index])) {
      const topic = practiceTopicForTask(task);
      if (topic) counts[topic] = (counts[topic] || 0) + 1;
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
  SCORM.setResult(total, TASKS.length);
  app.innerHTML = `<section class="result"><span class="badge">Kész a feladatsor</span><h2>${resultTitle(total)}</h2><div class="result-score"><div><strong>${total}/12</strong><span>pont</span></div></div>${recommended.length ? `<div class="focus-block"><p>Érdemes még gyakorolnod:</p><div class="tag-list">${recommended.map(topic => `<span class="topic-tag">${topicTitle(topic)}</span>`).join("")}</div></div>` : `<p class="lead">Minden területen biztosan teljesítettél. A gyakorlóbankból bónusztémát is választhatsz.</p>`}<div class="practice-offer"><span class="practice-icon">✦</span><div><h3>${recommended.length ? "Személyre szabott gyakorlás" : "Bónusz gyakorlás"}</h3><p>${recommended.length ? "Minden felsorolt fejlesztendő területhez külön öt feladatból álló gyakorlóblokk készült." : "Válassz a teljes gyakorlóbank témái közül!"}</p></div></div><div class="result-actions"><button class="primary" id="practiceBtn">Gyakorló témák megnyitása</button><button class="secondary" id="reviewBtn">Válaszaim áttekintése</button><button class="secondary" id="restartBtn">Újrakezdem</button></div></section>`;
  document.getElementById("practiceBtn").addEventListener("click", renderPracticeHub);
  document.getElementById("reviewBtn").addEventListener("click", () => { state.reviewIndex = firstWrongIndex(); renderReview(); });
  document.getElementById("restartBtn").addEventListener("click", restart);
}

function renderPracticeHub() {
  state.screen = "practice-hub";
  const recommended = getRecommendedTopics();
  const topics = recommended.length ? recommended : allPracticeTopics();
  app.innerHTML = `<section class="practice-hub"><div class="review-toolbar"><button class="nav-btn" id="backToResult">← Eredmény</button><span>${recommended.length ? "Személyre szabott útvonal" : "Teljes gyakorlóbank"}</span></div><div class="practice-hub-head"><span class="badge">${recommended.length ? `${topics.length} ajánlott terület` : `${topics.length} választható terület`}</span><h2>Mit gyakoroljunk?</h2><p class="lead">Minden blokk 5 feladatból áll. A blokkok eredménye külön jelenik meg, és nem módosítja a 12 pontos felvételi eredményedet.</p></div><div class="practice-topic-grid">${topics.map((topic, index) => { const data = PRACTICE_TOPICS[topic]; const completed = state.completedPractice[topic]; return `<button class="practice-topic-card ${completed ? "completed" : ""}" data-topic="${topic}"><span class="topic-order">${completed ? "✓" : index + 1}</span><span class="topic-card-copy"><strong>${data.title}</strong><small>${data.description}</small></span><span class="topic-card-score">${completed ? `${completed.score}/${completed.total}` : "5 feladat"}</span></button>`; }).join("")}</div>${recommended.length ? `<details class="all-topics"><summary>Más témát is gyakorolnék</summary><div class="tag-list topic-shortcuts">${allPracticeTopics().filter(topic => !topics.includes(topic)).map(topic => `<button class="topic-tag topic-shortcut" data-topic="${topic}">${topicTitle(topic)}</button>`).join("")}</div></details>` : ""}</section>`;
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
  app.innerHTML = `<section class="practice-screen"><div class="question-head"><span>${topicTitle(task.topic)}</span><span>${state.practiceIndex + 1} / ${state.practiceTasks.length}</span></div><span class="topic-tag practice-topic">${topicTitle(task.topic)}</span><h2>${task.prompt}</h2><div class="practice-options">${task.options.map((option, index) => `<button class="practice-option ${answered ? (index === task.correct ? "correct" : index === answer ? "wrong" : "") : ""}" data-index="${index}" ${answered ? "disabled" : ""}>${option}</button>`).join("")}</div>${answered ? `<div class="practice-feedback ${correct ? "correct" : "wrong"}"><span class="practice-feedback-icon" aria-hidden="true">${correct ? "✓" : "✕"}</span><div><strong>${correct ? "Helyes döntés" : "Ezt most nézzük meg"}</strong><p>${task.explanation}</p></div></div>` : ""}<div class="navigation"><button class="nav-btn" id="quitPractice">← Témák</button><button class="nav-btn next" id="nextPractice" ${answered ? "" : "disabled"}>${state.practiceIndex === state.practiceTasks.length - 1 ? "Gyakorlás befejezése" : "Következő →"}</button></div></section>`;
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
    else { state.practiceIndex++; renderPractice(); }
  });
}

function renderPracticeResult() {
  state.completedPractice[state.practiceTopic] = { score: state.practiceScore, total: state.practiceTasks.length };
  const recommended = getRecommendedTopics();
  const remaining = recommended.filter(topic => !state.completedPractice[topic]);
  app.innerHTML = `<section class="result practice-result"><span class="badge">${topicTitle(state.practiceTopic)} – kész</span><h2>${state.practiceScore === state.practiceTasks.length ? "Nagyon biztosan ment!" : "Máris erősebb lett a tudásod."}</h2><div class="result-score small"><div><strong>${state.practiceScore}/${state.practiceTasks.length}</strong><span>gyakorlópont</span></div></div><p class="lead">A gyakorlópont nem változtatja meg az eredeti felvételi pontszámodat: az továbbra is <strong>${score()}/12</strong>.</p><div class="result-actions">${remaining.length ? `<button class="primary" id="nextTopic">Következő ajánlott téma</button>` : ""}<button class="secondary" id="backTopics">Vissza a témákhoz</button><button class="secondary" id="againPractice">Ezt újra gyakorlom</button></div></section>`;
  if (remaining.length) document.getElementById("nextTopic").addEventListener("click", () => startPractice(remaining[0]));
  document.getElementById("backTopics").addEventListener("click", renderPracticeHub);
  document.getElementById("againPractice").addEventListener("click", () => startPractice(state.practiceTopic));
}

function renderLearningContent(learn) {
  if (learn.comparison) return `<h3>${learn.title}</h3><div class="learning-comparison">${learn.comparison.map(item => `<section class="learning-side"><div class="learning-word">${item.word}</div><div class="learning-subtitle">${item.subtitle}</div><div class="learning-examples">${item.examples.map(example => `<p class="learning-example ${example.correct ? "good" : "bad"}"><span aria-hidden="true">${example.correct ? "✓" : "✕"}</span>${example.text}</p>`).join("")}</div></section>`).join("")}</div><div class="rule-panel"><h4>${learn.ruleTitle}</h4><p>${learn.rule}</p><div class="formula">${learn.formula}</div></div><div class="counter-panel"><h4>${learn.counterTitle}</h4><p>${learn.counterText}</p></div><div class="irregular-panel"><h4>${learn.irregularTitle}</h4><div class="irregular-list">${learn.irregulars.map(word => `<span>${word}</span>`).join("")}</div></div>${learn.image ? `<details class="visual-summary"><summary>Vizuális összefoglaló megnyitása</summary><img src="${learn.image}" alt="${learn.imageAlt || "Vizuális magyarázat"}"></details>` : ""}`;
  return `<h3>${learn.title}</h3><p>${learn.body}</p><div class="remember-box"><strong>Jegyezd meg!</strong><span>${learn.rule}</span></div>`;
}

function renderReview() {
  state.screen = "review";
  const task = TASKS[state.reviewIndex];
  const answer = state.answers[state.reviewIndex];
  const correct = isCorrect(task, answer);
  const correctKey = primaryCorrect(task);
  const hasAlternative = Array.isArray(task.correct) && task.correct.length > 1;
  app.innerHTML = `<section class="review-screen"><div class="review-toolbar"><button class="nav-btn" id="resultBtn">← Eredmény</button><span>${state.reviewIndex + 1} / ${TASKS.length}</span></div><p class="task-source">${task.source}</p><div class="review-status ${correct ? "correct" : "wrong"}"><span class="status-icon">${correct ? "✓" : "✕"}</span><div><strong>${correct ? "Helyes döntés" : "Ezt most érdemes átnézni"}</strong><span>${correct ? "1 pont" : "0 pont"}</span></div></div><div class="review-words"><div class="review-word"><small>Első alak</small><strong>${task.first}</strong></div><div class="review-word"><small>Második alak</small><strong>${task.second}</strong></div></div><div class="answer-comparison"><div><small>A te válaszod</small><strong><span class="answer-code">${symbols[answer]}</span>${labels[answer]}</strong></div><div class="correct-answer-box"><small>Helyes megoldás</small><strong><span class="answer-code">${symbols[correctKey]}</span>${labels[correctKey]}</strong>${hasAlternative ? `<em>A feladat egy másik választ is elfogad.</em>` : ""}</div></div><div class="short-explanation"><h3>Röviden</h3><p>${task.explanation}</p></div>${task.learn ? `<details class="learning-card" ${!correct || task.id === 1 ? "open" : ""}><summary>Nézzük meg részletesebben</summary><div class="learning-content">${renderLearningContent(task.learn)}</div></details>` : ""}<div class="review-navigation"><button class="nav-btn" id="prevReviewBtn" ${state.reviewIndex === 0 ? "disabled" : ""}>← Előző</button><div class="review-dots">${TASKS.map((item, index) => `<button class="review-dot ${index === state.reviewIndex ? "active" : ""} ${isCorrect(item, state.answers[index]) ? "correct" : "wrong"}" data-index="${index}" aria-label="${index + 1}. feladat"></button>`).join("")}</div><button class="nav-btn next" id="nextReviewBtn">${state.reviewIndex === TASKS.length - 1 ? "Vissza az eredményhez" : "Következő →"}</button></div></section>`;
  document.getElementById("resultBtn").addEventListener("click", renderResult);
  document.getElementById("prevReviewBtn").addEventListener("click", () => { if (state.reviewIndex > 0) { state.reviewIndex--; renderReview(); } });
  document.getElementById("nextReviewBtn").addEventListener("click", () => { if (state.reviewIndex === TASKS.length - 1) renderResult(); else { state.reviewIndex++; renderReview(); } });
  app.querySelectorAll(".review-dot").forEach(dot => dot.addEventListener("click", () => { state.reviewIndex = Number(dot.dataset.index); renderReview(); }));
}

function firstWrongIndex() { const index = TASKS.findIndex((task, taskIndex) => !isCorrect(task, state.answers[taskIndex])); return index === -1 ? 0 : index; }
function resultTitle(points) { if (points === 12) return "Hibátlan munka!"; if (points >= 9) return "Nagyon szép eredmény!"; if (points >= 6) return "Jó alapokra építhetsz."; return "Most már tudjuk, mit érdemes gyakorolni."; }

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