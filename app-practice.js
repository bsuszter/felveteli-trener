window.PRACTICE_STANDALONE = true;

const app = document.getElementById("app");
const state = {
  screen: "practice-hub",
  practiceTopic: null,
  practiceTasks: [],
  practiceIndex: 0,
  practiceAnswers: [],
  practiceScore: 0,
  completedPractice: {}
};

function allPracticeTopics() {
  return Object.keys(PRACTICE_TOPICS);
}

function topicTitle(topic) {
  return PRACTICE_TOPICS[topic]?.title || topic;
}

function getRecommendedTopics() {
  return [];
}

// A rewards.js kompatibilitása miatt létezik; önálló gyakorlásnál nincs felvételi pontszám.
function score() {
  return 0;
}

function renderPracticeHub() {
  state.screen = "practice-hub";
  const topics = allPracticeTopics();

  app.innerHTML = `
    <section class="practice-hub standalone-practice-hub">
      <div class="review-toolbar">
        <a class="module-return" href="index.html">← Évválasztó</a>
        <span>Önálló gyakorlás</span>
      </div>
      <div class="practice-hub-head">
        <span class="badge">${topics.length} téma • ${PRACTICE_TASKS.length} feladat</span>
        <h2>Gyakorlóbank</h2>
        <p class="lead">Válassz egy helyesírási témát! Minden blokk 5 feladatból áll, és az elsőre helyes válaszokért aranytallér jár.</p>
      </div>
      <div class="practice-topic-grid">
        ${topics.map((topic, index) => {
          const data = PRACTICE_TOPICS[topic];
          const completed = state.completedPractice[topic];
          return `<button class="practice-topic-card ${completed ? "completed" : ""}" data-topic="${topic}">
            <span class="topic-order">${completed ? "✓" : index + 1}</span>
            <span class="topic-card-copy"><strong>${data.title}</strong><small>${data.description}</small></span>
            <span class="topic-card-score">${completed ? `${completed.score}/${completed.total}` : "5 feladat"}</span>
          </button>`;
        }).join("")}
      </div>
    </section>`;

  app.querySelectorAll("[data-topic]").forEach(button => {
    button.addEventListener("click", () => startPractice(button.dataset.topic));
  });
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

  app.innerHTML = `<section class="practice-screen">
    <div class="question-head"><span>${topicTitle(task.topic)}</span><span>${state.practiceIndex + 1} / ${state.practiceTasks.length}</span></div>
    <span class="topic-tag practice-topic">${topicTitle(task.topic)}</span>
    <h2>${task.prompt}</h2>
    <div class="practice-options">${task.options.map((option, index) => `<button class="practice-option ${answered ? (index === task.correct ? "correct" : index === answer ? "wrong" : "") : ""}" data-index="${index}" ${answered ? "disabled" : ""}>${option}</button>`).join("")}</div>
    ${answered ? `<div class="practice-feedback ${correct ? "correct" : "wrong"}"><span class="practice-feedback-icon" aria-hidden="true"></span><div><strong>${correct ? "Helyes döntés" : "Ezt most nézzük meg"}</strong><p>${task.explanation}</p></div></div>` : ""}
    <div class="navigation"><button class="nav-btn" id="quitPractice">← Témák</button><button class="nav-btn next" id="nextPractice" ${answered ? "" : "disabled"}>${state.practiceIndex === state.practiceTasks.length - 1 ? "Gyakorlás befejezése" : "Következő →"}</button></div>
  </section>`;

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
  app.innerHTML = `<section class="result practice-result">
    <span class="badge">${topicTitle(state.practiceTopic)} – kész</span>
    <h2>${state.practiceScore === state.practiceTasks.length ? "Nagyon biztosan ment!" : "Máris erősebb lett a tudásod."}</h2>
    <div class="result-score small"><div><strong>${state.practiceScore}/${state.practiceTasks.length}</strong><span>gyakorlópont</span></div></div>
    <div class="result-actions"><button class="primary" id="backTopics">Másik témát választok</button><button class="secondary" id="againPractice">Ezt újra gyakorlom</button></div>
  </section>`;
  document.getElementById("backTopics").addEventListener("click", renderPracticeHub);
  document.getElementById("againPractice").addEventListener("click", () => startPractice(state.practiceTopic));
}

const scoreboard = document.querySelector(".scoreboard");
if (scoreboard) {
  scoreboard.hidden = false;
  [...scoreboard.children].forEach(child => child.hidden = true);
}
const progressTrack = document.querySelector(".progress-track");
if (progressTrack) progressTrack.hidden = true;

SCORM.init();
renderPracticeHub();
