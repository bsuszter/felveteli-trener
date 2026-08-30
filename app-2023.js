const app = document.getElementById("app");
const progressText = document.getElementById("progressText");
const scoreText = document.getElementById("scoreText");
const progressBar = document.getElementById("progressBar");

const TASKS = MODULE_2023_TASKS;
const TOTAL_POINTS = 10;
const state = {
  screen: "intro",
  index: 0,
  answers: [null, null],
  reviewIndex: 0,
  practiceTopic: null,
  practiceTasks: [],
  practiceIndex: 0,
  practiceAnswers: [],
  practiceScore: 0,
  completedPractice: {}
};

function blockScore(task, answer) {
  if (!Array.isArray(answer)) return 0;
  return task.wrong.filter(n => answer.includes(n)).length;
}
function score() {
  return TASKS.reduce((sum, task, i) => sum + blockScore(task, state.answers[i]), 0);
}
function completedPoints() {
  return state.answers.filter(Array.isArray).length * 5;
}
function updateStatus() {
  const done = completedPoints();
  progressText.textContent = `${done} / ${TOTAL_POINTS}`;
  scoreText.textContent = `${score()} / ${done}`;
  document.getElementById("totalText").textContent = TOTAL_POINTS;
  progressBar.style.width = `${done / TOTAL_POINTS * 100}%`;
}

function renderIntro() {
  state.screen = "intro";
  updateStatus();
  app.innerHTML = `<section class="hero"><div class="hero-inner">
    <a class="module-return" href="index.html">← Évválasztó</a>
    <span class="badge">✦ 2023. januári feladatok</span>
    <h2>Helyesírási lottó</h2>
    <p class="source-note">Két lottószelvény • 5 + 5 pont</p>
    <p class="lead">Mindkét táblán 15 szó közül pontosan 5 hibásan írt alakot kell megtalálnod. Jelöld ki az öt hibás szót, majd add fel a szelvényt!</p>
    <button class="primary" id="startBtn">Jöhet az első szelvény</button>
  </div></section>`;
  document.getElementById("startBtn").onclick = renderLotto;
}

function renderLotto() {
  state.screen = "lotto";
  const task = TASKS[state.index];
  const submitted = Array.isArray(state.answers[state.index]);
  const selected = new Set(submitted ? state.answers[state.index] : []);
  updateStatus();

  app.innerHTML = `<section class="lotto-screen">
    <div class="question-head"><span>${state.index + 1}. lottószelvény</span><span>5 pont</span></div>
    <p class="task-source">${task.source}</p>
    <h2>Találd meg az 5 hibás szót!</h2>
    <p class="lead lotto-lead">Kattints arra az öt mezőre, amely szerinted hibásan van írva.</p>
    <div class="lotto-grid">
      ${task.words.map((word, i) => `<button class="lotto-cell ${selected.has(i + 1) ? "selected" : ""}" data-number="${i + 1}" ${submitted ? "disabled" : ""}><span class="lotto-number">${i + 1}.</span><strong>${word}</strong></button>`).join("")}
    </div>
    <div class="lotto-submit-row">
      <span id="lottoCount">Kiválasztva: ${selected.size} / 5</span>
      ${submitted ? "" : `<button class="primary" id="submitLotto" ${selected.size === 5 ? "" : "disabled"}>Lottószelvény beküldése</button>`}
    </div>
    <div class="navigation">
      <button class="nav-btn" id="backBtn" ${state.index === 0 ? "disabled" : ""}>← Vissza</button>
      <button class="nav-btn next" id="nextBtn" ${submitted ? "" : "disabled"}>${state.index === TASKS.length - 1 ? "Befejezem" : "Következő szelvény →"}</button>
    </div>
  </section>`;

  if (!submitted) {
    const submit = document.getElementById("submitLotto");
    const count = document.getElementById("lottoCount");
    app.querySelectorAll(".lotto-cell").forEach(cell => cell.onclick = () => {
      const n = Number(cell.dataset.number);
      if (selected.has(n)) selected.delete(n);
      else if (selected.size < 5) selected.add(n);
      cell.classList.toggle("selected", selected.has(n));
      count.textContent = `Kiválasztva: ${selected.size} / 5`;
      submit.disabled = selected.size !== 5;
    });
    submit.onclick = () => {
      if (selected.size !== 5) return;
      state.answers[state.index] = [...selected].sort((a, b) => a - b);
      SCORM.setProgress(score(), TOTAL_POINTS);
      renderLotto();
    };
  }

  document.getElementById("backBtn").onclick = () => {
    if (state.index > 0) { state.index--; renderLotto(); }
  };
  document.getElementById("nextBtn").onclick = () => {
    if (!Array.isArray(state.answers[state.index])) return;
    if (state.index === TASKS.length - 1) renderResult();
    else { state.index++; renderLotto(); }
  };
}

function practiceTopicForMiss(task, number) {
  return task.corrections[number]?.topic || null;
}
function getRecommendedTopics() {
  const counts = {};
  TASKS.forEach((task, i) => {
    const answer = state.answers[i] || [];
    task.wrong.forEach(number => {
      if (!answer.includes(number)) {
        const topic = practiceTopicForMiss(task, number);
        if (topic && PRACTICE_TOPICS[topic]) counts[topic] = (counts[topic] || 0) + 1;
      }
    });
  });
  return Object.entries(counts).sort((a,b)=>b[1]-a[1]).map(([topic])=>topic);
}
function allPracticeTopics(){ return Object.keys(PRACTICE_TOPICS); }
function topicTitle(topic){ return PRACTICE_TOPICS[topic]?.title || topic; }
function resultTitle(points){ if(points===10)return "Telitalálat!"; if(points>=8)return "Nagyon szép találati arány!"; if(points>=5)return "Jó nyomon jársz."; return "Most már tudjuk, mit érdemes gyakorolni."; }

function renderResult() {
  state.screen = "result";
  updateStatus();
  const total = score();
  const rec = getRecommendedTopics();
  SCORM.setResult(total, TOTAL_POINTS);
  app.innerHTML = `<section class="result">
    <span class="badge">Mindkét lottószelvény feladva</span>
    <h2>${resultTitle(total)}</h2>
    <div class="result-score"><div><strong>${total}/10</strong><span>pont</span></div></div>
    ${rec.length ? `<div class="focus-block"><p>Érdemes még gyakorolnod:</p><div class="tag-list">${rec.map(t=>`<span class="topic-tag">${topicTitle(t)}</span>`).join("")}</div></div>` : ""}
    <div class="result-actions">
      <button class="primary" id="practiceBtn">Gyakorló témák megnyitása</button>
      <button class="secondary" id="reviewBtn">Szelvények áttekintése</button>
      <button class="secondary" id="restartBtn">Újrakezdem</button>
      <a class="secondary module-back-link" href="index.html">Másik év választása</a>
    </div>
  </section>`;
  document.getElementById("practiceBtn").onclick = renderPracticeHub;
  document.getElementById("reviewBtn").onclick = () => { state.reviewIndex = 0; renderReview(); };
  document.getElementById("restartBtn").onclick = restart;
}

function renderReview() {
  const task = TASKS[state.reviewIndex];
  const answer = state.answers[state.reviewIndex] || [];
  const points = blockScore(task, answer);
  app.innerHTML = `<section class="review-screen lotto-review">
    <div class="review-toolbar"><button class="nav-btn" id="resultBtn">← Eredmény</button><span>${state.reviewIndex + 1} / 2 szelvény</span></div>
    <h2>${points}/5 találat</h2>
    <div class="lotto-legend"><span class="hit">✓ Talált</span><span class="false-hit">× Téves jelölés</span><span class="missed">! Kihagyott hiba</span></div>
    <div class="lotto-grid review-lotto-grid">
      ${task.words.map((word, i) => {
        const n=i+1, isWrong=task.wrong.includes(n), chosen=answer.includes(n);
        const cls = isWrong && chosen ? "hit" : !isWrong && chosen ? "false-hit" : isWrong ? "missed" : "";
        const correction = isWrong ? task.corrections[n] : null;
        return `<div class="lotto-cell review-cell ${cls}"><span class="lotto-number">${n}.</span><strong>${word}</strong>${correction ? `<small>→ ${correction.correct}</small>` : ""}</div>`;
      }).join("")}
    </div>
    <div class="review-navigation"><button class="nav-btn" id="prevReview" ${state.reviewIndex===0?"disabled":""}>← Előző</button><span></span><button class="nav-btn next" id="nextReview">${state.reviewIndex===1?"Vissza az eredményhez":"Következő →"}</button></div>
  </section>`;
  document.getElementById("resultBtn").onclick = renderResult;
  document.getElementById("prevReview").onclick = () => { if(state.reviewIndex>0){state.reviewIndex--;renderReview();} };
  document.getElementById("nextReview").onclick = () => { if(state.reviewIndex===1)renderResult(); else {state.reviewIndex++;renderReview();} };
}

function renderPracticeHub(){
  state.screen="practice-hub";
  const rec=getRecommendedTopics(), topics=rec.length?rec:allPracticeTopics();
  app.innerHTML=`<section class="practice-hub"><div class="review-toolbar"><button class="nav-btn" id="backToResult">← Eredmény</button><span>${rec.length?"Személyre szabott útvonal":"Teljes gyakorlóbank"}</span></div><div class="practice-hub-head"><span class="badge">${topics.length} ${rec.length?"ajánlott":"választható"} terület</span><h2>Mit gyakoroljunk?</h2></div><div class="practice-topic-grid">${topics.map((t,i)=>{const d=PRACTICE_TOPICS[t],done=state.completedPractice[t];return`<button class="practice-topic-card ${done?"completed":""}" data-topic="${t}"><span class="topic-order">${done?"✓":i+1}</span><span class="topic-card-copy"><strong>${d.title}</strong><small>${d.description}</small></span><span class="topic-card-score">${done?`${done.score}/${done.total}`:"5 feladat"}</span></button>`;}).join("")}</div>${rec.length?`<details class="all-topics"><summary>Más témát is gyakorolnék</summary><div class="tag-list topic-shortcuts">${allPracticeTopics().filter(t=>!topics.includes(t)).map(t=>`<button class="topic-tag topic-shortcut" data-topic="${t}">${topicTitle(t)}</button>`).join("")}</div></details>`:""}</section>`;
  document.getElementById("backToResult").onclick=renderResult;
  app.querySelectorAll("[data-topic]").forEach(b=>b.onclick=()=>startPractice(b.dataset.topic));
}
function startPractice(topic){ state.practiceTopic=topic;state.practiceTasks=PRACTICE_TASKS.filter(x=>x.topic===topic);state.practiceIndex=0;state.practiceAnswers=Array(state.practiceTasks.length).fill(null);state.practiceScore=0;renderPractice(); }
function renderPractice(){ state.screen="practice";const task=state.practiceTasks[state.practiceIndex],answer=state.practiceAnswers[state.practiceIndex],answered=answer!==null,correct=answered&&answer===task.correct;app.innerHTML=`<section class="practice-screen"><div class="question-head"><span>${topicTitle(task.topic)}</span><span>${state.practiceIndex+1} / ${state.practiceTasks.length}</span></div><span class="topic-tag practice-topic">${topicTitle(task.topic)}</span><h2>${task.prompt}</h2><div class="practice-options">${task.options.map((o,i)=>`<button class="practice-option ${answered?(i===task.correct?"correct":i===answer?"wrong":""):""}" data-index="${i}" ${answered?"disabled":""}>${o}</button>`).join("")}</div>${answered?`<div class="practice-feedback ${correct?"correct":"wrong"}"><span class="practice-feedback-icon"></span><div><strong>${correct?"Helyes döntés":"Ezt most nézzük meg"}</strong><p>${task.explanation}</p></div></div>`:""}<div class="navigation"><button class="nav-btn" id="quitPractice">← Témák</button><button class="nav-btn next" id="nextPractice" ${answered?"":"disabled"}>${state.practiceIndex===state.practiceTasks.length-1?"Gyakorlás befejezése":"Következő →"}</button></div></section>`;app.querySelectorAll(".practice-option").forEach(b=>b.onclick=()=>{const s=Number(b.dataset.index);state.practiceAnswers[state.practiceIndex]=s;if(s===task.correct)state.practiceScore++;renderPractice();});document.getElementById("quitPractice").onclick=renderPracticeHub;document.getElementById("nextPractice").onclick=()=>{if(!answered)return;if(state.practiceIndex===state.practiceTasks.length-1)renderPracticeResult();else{state.practiceIndex++;renderPractice();}}; }
function renderPracticeResult(){state.completedPractice[state.practiceTopic]={score:state.practiceScore,total:state.practiceTasks.length};const remaining=getRecommendedTopics().filter(t=>!state.completedPractice[t]);app.innerHTML=`<section class="result practice-result"><span class="badge">${topicTitle(state.practiceTopic)} – kész</span><h2>${state.practiceScore===state.practiceTasks.length?"Nagyon biztosan ment!":"Máris erősebb lett a tudásod."}</h2><div class="result-score small"><div><strong>${state.practiceScore}/${state.practiceTasks.length}</strong><span>gyakorlópont</span></div></div><p class="lead">A lottóeredményed továbbra is <strong>${score()}/10</strong>.</p><div class="result-actions">${remaining.length?`<button class="primary" id="nextTopic">Következő ajánlott téma</button>`:""}<button class="secondary" id="backTopics">Vissza a témákhoz</button><button class="secondary" id="againPractice">Ezt újra gyakorlom</button></div></section>`;if(remaining.length)document.getElementById("nextTopic").onclick=()=>startPractice(remaining[0]);document.getElementById("backTopics").onclick=renderPracticeHub;document.getElementById("againPractice").onclick=()=>startPractice(state.practiceTopic);}

function restart(){ state.index=0;state.answers=[null,null];state.reviewIndex=0;state.completedPractice={};renderIntro(); }

SCORM.init();
renderIntro();
