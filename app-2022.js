const app = document.getElementById("app");
const progressText = document.getElementById("progressText");
const scoreText = document.getElementById("scoreText");
const progressBar = document.getElementById("progressBar");

const TASKS = MODULE_2022_TASKS;
const TOTAL_POINTS = TASKS.reduce((sum, task) => sum + (task.points || 1), 0);

const state = {
  screen:"intro", index:0, answers:Array(TASKS.length).fill(null), midpointShown:false,
  reviewIndex:0, practiceTopic:null, practiceTasks:[], practiceIndex:0,
  practiceAnswers:[], practiceScore:0, completedPractice:{}
};

function normalize(value) {
  return String(value ?? "").trim().toLocaleLowerCase("hu-HU").replace(/\s+/g, " ");
}

function isCorrect(task, answer) {
  if (answer === null || answer === undefined || String(answer).trim() === "") return false;
  if (task.type === "fill") return normalize(answer) === normalize(task.answer);
  if (task.type === "sentence-check") {
    if (task.answer === "ok") return answer === "ok";
    return normalize(answer) === normalize(task.answer);
  }
  return false;
}

function answeredCount() {
  return state.answers.filter(answer => answer !== null && String(answer).trim() !== "").length;
}

function score() {
  return TASKS.reduce((sum, task, index) => sum + (isCorrect(task, state.answers[index]) ? (task.points || 1) : 0), 0);
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
        <span class="badge">✦ 2022. januári feladatok</span>
        <h2>Helyesírási kihívás</h2>
        <p class="source-note">Közmondások betűpótlása és mondatok helyesírásának ellenőrzése</p>
        <p class="lead">Először öt közmondás hiányzó betűit pótolod, utána öt mondatról döntöd el, hibátlan-e. Minden részfeladat 1 pontot ér.</p>
        <button class="primary" id="startBtn">Kezdhetjük</button>
      </div>
    </section>`;
  document.getElementById("startBtn").addEventListener("click", renderQuestion);
}

function renderFill(task, selected) {
  const submitted = selected !== null && selected !== undefined && String(selected).trim() !== "";
  const expectedLength = Math.max(1, String(task.answer).length);
  return `
    <h2>Pótold a hiányzó betűt vagy betűket!</h2>
    <p class="fill-instruction">Csak a hiányzó részt írd be.</p>
    <div class="fill-sentence locked-fill-sentence">
      <span>${task.before}</span><input id="fillInput" class="fill-input" type="text" value="${submitted ? selected : ""}" data-chars="${expectedLength}" autocomplete="off" autocapitalize="off" spellcheck="false" aria-label="Hiányzó betű vagy betűk" ${submitted ? "disabled" : ""}><span>${task.after}</span>
    </div>
    ${submitted ? "" : '<div class="fill-submit-row"><button class="primary fill-submit" id="submitFillBtn" disabled>Válasz beküldése</button></div>'}`;
}

function renderSentenceCheck(task, selected) {
  const submitted = selected !== null && selected !== undefined && String(selected).trim() !== "";
  return `
    <h2>Ellenőrizd a mondat helyesírását!</h2>
    <p class="fill-instruction">Ha hibátlan, jelöld meg. Ha hibás, írd be az egyetlen hibás szó helyes alakját.</p>
    <div class="short-explanation"><p><strong>${task.sentence}</strong></p></div>
    ${submitted ? `
      <div class="answer-comparison">
        <div><small>A válaszod</small><strong>${selected === "ok" ? "✓ Hibátlan" : selected}</strong></div>
      </div>`
      : `
      <div class="result-actions">
        <button class="secondary" id="sentenceOkBtn">✓ Hibátlan</button>
      </div>
      <div class="fill-submit-row">
        <input id="sentenceFixInput" class="fill-input" type="text" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="A helyes szóalak">
        <button class="primary fill-submit" id="submitSentenceFixBtn" disabled>Javítás beküldése</button>
      </div>`}`;
}

function renderQuestion() {
  state.screen = "question";
  const task = TASKS[state.index];
  const selected = state.answers[state.index];
  const submitted = selected !== null && selected !== undefined && String(selected).trim() !== "";
  updateStatus();

  app.innerHTML = `
    <section class="question ${task.type === "fill" ? "fill-question" : ""}">
      <div class="question-head"><span>${state.index + 1}. részfeladat</span><span>${task.points || 1} pont</span></div>
      <p class="task-source">${task.source}</p>
      ${task.type === "fill" ? renderFill(task, selected) : renderSentenceCheck(task, selected)}
      <div class="navigation">
        <button class="nav-btn" id="backBtn" ${state.index === 0 ? "disabled" : ""}>← Vissza</button>
        <button class="nav-btn next" id="nextBtn" ${submitted ? "" : "disabled"}>${state.index === TASKS.length - 1 ? "Befejezem" : "Következő →"}</button>
      </div>
    </section>`;

  if (!submitted && task.type === "fill") {
    const input = document.getElementById("fillInput");
    const submit = document.getElementById("submitFillBtn");
    input.focus();
    input.addEventListener("input", () => { submit.disabled = !input.value.trim(); });
    input.addEventListener("keydown", event => {
      if (event.key === "Enter" && input.value.trim()) submit.click();
    });
    submit.addEventListener("click", () => {
      const value = input.value.trim();
      if (!value) return;
      state.answers[state.index] = value;
      SCORM.setProgress(score(), TOTAL_POINTS);
      renderQuestion();
    });
  }

  if (!submitted && task.type === "sentence-check") {
    const okButton = document.getElementById("sentenceOkBtn");
    const input = document.getElementById("sentenceFixInput");
    const submit = document.getElementById("submitSentenceFixBtn");
    okButton.addEventListener("click", () => {
      state.answers[state.index] = "ok";
      SCORM.setProgress(score(), TOTAL_POINTS);
      renderQuestion();
    });
    input.addEventListener("input", () => { submit.disabled = !input.value.trim(); });
    input.addEventListener("keydown", event => {
      if (event.key === "Enter" && input.value.trim()) submit.click();
    });
    submit.addEventListener("click", () => {
      const value = input.value.trim();
      if (!value) return;
      state.answers[state.index] = value;
      SCORM.setProgress(score(), TOTAL_POINTS);
      renderQuestion();
    });
  }

  document.getElementById("backBtn").addEventListener("click", () => {
    if (state.index > 0) { state.index--; renderQuestion(); }
  });

  document.getElementById("nextBtn").addEventListener("click", () => {
    const current = state.answers[state.index];
    if (current === null || current === undefined || String(current).trim() === "") return;
    if (state.index === TASKS.length - 1) { renderResult(); return; }
    if (state.index === 4 && !state.midpointShown) {
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
        <span class="badge">A betűpótlás kész</span>
        <h2>Most mondatokat ellenőrzünk.</h2>
        <p class="lead">Az első öt részfeladatból ${score()} pontot szereztél. A következő mondatok között hibátlanok és egyetlen hibát tartalmazók is vannak.</p>
        <button class="primary" id="continueBtn">Jöhet a következő öt</button>
      </div>
    </section>`;
  document.getElementById("continueBtn").addEventListener("click", () => {
    state.index = 5;
    renderQuestion();
  });
}

function practiceTopicForTask(task) {
  const tags = task.tags || [];
  if (tags.includes("felszólító mód")) return "felszólító mód";
  if (tags.includes("igekötők")) return "igekötők";
  if (tags.includes("j és ly")) return "j és ly";
  if (tags.includes("magánhangzó-hosszúság")) return "magánhangzó-hosszúság";
  if (tags.includes("mássalhangzók és toldalékolás")) return "mássalhangzók és toldalékolás";
  if (tags.includes("egybe- és különírás")) return "egybe- és különírás";
  if (tags.includes("kis- és nagybetű") || tags.includes("földrajzi név")) return "kis- és nagybetű";
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
  return Object.entries(counts).sort((a,b) => b[1] - a[1]).map(([topic]) => topic);
}

function allPracticeTopics(){ return Object.keys(PRACTICE_TOPICS); }
function topicTitle(topic){ return PRACTICE_TOPICS[topic]?.title || topic; }

function resultTitle(points) {
  if (points === TOTAL_POINTS) return "Hibátlan munka!";
  if (points >= 8) return "Nagyon szép eredmény!";
  if (points >= 5) return "Jó alapokra építhetsz.";
  return "Most már tudjuk, mit érdemes gyakorolni.";
}

function renderResult() {
  state.screen = "result";
  updateStatus();
  const total = score();
  const recommended = getRecommendedTopics();
  SCORM.setResult(total, TOTAL_POINTS);

  app.innerHTML = `
    <section class="result">
      <span class="badge">Kész a 2022-es feladatsor</span>
      <h2>${resultTitle(total)}</h2>
      <div class="result-score"><div><strong>${total}/${TOTAL_POINTS}</strong><span>pont</span></div></div>
      ${recommended.length ? `<div class="focus-block"><p>Érdemes még gyakorolnod:</p><div class="tag-list">${recommended.map(topic => `<span class="topic-tag">${topicTitle(topic)}</span>`).join("")}</div></div>` : '<p class="lead">A meglévő gyakorlóbankhoz kapcsolható területeken biztosan teljesítettél.</p>'}
      <div class="practice-offer"><span class="practice-icon">✦</span><div><h3>Személyre szabott gyakorlás</h3><p>A hibáidhoz kapcsolódó gyakorlóblokkokból tudsz tovább gyakorolni és tallérokat gyűjteni.</p></div></div>
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
  app.innerHTML = `<section class="practice-hub">
    <div class="review-toolbar"><button class="nav-btn" id="backToResult">← Eredmény</button><span>${recommended.length ? "Személyre szabott útvonal" : "Teljes gyakorlóbank"}</span></div>
    <div class="practice-hub-head"><span class="badge">${topics.length} ${recommended.length ? "ajánlott" : "választható"} terület</span><h2>Mit gyakoroljunk?</h2><p class="lead">Minden blokk 5 feladatból áll. A gyakorlópontok nem módosítják a ${TOTAL_POINTS} pontos felvételi eredményt.</p></div>
    <div class="practice-topic-grid">${topics.map((topic,index) => {
      const data=PRACTICE_TOPICS[topic], done=state.completedPractice[topic];
      return `<button class="practice-topic-card ${done ? "completed" : ""}" data-topic="${topic}"><span class="topic-order">${done ? "✓" : index+1}</span><span class="topic-card-copy"><strong>${data.title}</strong><small>${data.description}</small></span><span class="topic-card-score">${done ? `${done.score}/${done.total}` : "5 feladat"}</span></button>`;
    }).join("")}</div>
    ${recommended.length ? `<details class="all-topics"><summary>Más témát is gyakorolnék</summary><div class="tag-list topic-shortcuts">${allPracticeTopics().filter(topic => !topics.includes(topic)).map(topic => `<button class="topic-tag topic-shortcut" data-topic="${topic}">${topicTitle(topic)}</button>`).join("")}</div></details>` : ""}
  </section>`;
  document.getElementById("backToResult").addEventListener("click", renderResult);
  app.querySelectorAll("[data-topic]").forEach(button => button.addEventListener("click", () => startPractice(button.dataset.topic)));
}

function startPractice(topic) {
  state.practiceTopic=topic;
  state.practiceTasks=PRACTICE_TASKS.filter(item => item.topic===topic);
  state.practiceIndex=0;
  state.practiceAnswers=Array(state.practiceTasks.length).fill(null);
  state.practiceScore=0;
  renderPractice();
}

function renderPractice() {
  state.screen="practice";
  const task=state.practiceTasks[state.practiceIndex], answer=state.practiceAnswers[state.practiceIndex];
  const answered=answer!==null, correct=answered&&answer===task.correct;
  app.innerHTML=`<section class="practice-screen"><div class="question-head"><span>${topicTitle(task.topic)}</span><span>${state.practiceIndex+1} / ${state.practiceTasks.length}</span></div><span class="topic-tag practice-topic">${topicTitle(task.topic)}</span><h2>${task.prompt}</h2><div class="practice-options">${task.options.map((option,index)=>`<button class="practice-option ${answered?(index===task.correct?"correct":index===answer?"wrong":""):""}" data-index="${index}" ${answered?"disabled":""}>${option}</button>`).join("")}</div>${answered?`<div class="practice-feedback ${correct?"correct":"wrong"}"><span class="practice-feedback-icon"></span><div><strong>${correct?"Helyes döntés":"Ezt most nézzük meg"}</strong><p>${task.explanation}</p></div></div>`:""}<div class="navigation"><button class="nav-btn" id="quitPractice">← Témák</button><button class="nav-btn next" id="nextPractice" ${answered?"":"disabled"}>${state.practiceIndex===state.practiceTasks.length-1?"Gyakorlás befejezése":"Következő →"}</button></div></section>`;
  app.querySelectorAll(".practice-option").forEach(button=>button.addEventListener("click",()=>{const selected=Number(button.dataset.index);state.practiceAnswers[state.practiceIndex]=selected;if(selected===task.correct)state.practiceScore++;renderPractice();}));
  document.getElementById("quitPractice").addEventListener("click",renderPracticeHub);
  document.getElementById("nextPractice").addEventListener("click",()=>{if(!answered)return;if(state.practiceIndex===state.practiceTasks.length-1)renderPracticeResult();else{state.practiceIndex++;renderPractice();}});
}

function renderPracticeResult() {
  state.completedPractice[state.practiceTopic]={score:state.practiceScore,total:state.practiceTasks.length};
  const remaining=getRecommendedTopics().filter(topic=>!state.completedPractice[topic]);
  app.innerHTML=`<section class="result practice-result"><span class="badge">${topicTitle(state.practiceTopic)} – kész</span><h2>${state.practiceScore===state.practiceTasks.length?"Nagyon biztosan ment!":"Máris erősebb lett a tudásod."}</h2><div class="result-score small"><div><strong>${state.practiceScore}/${state.practiceTasks.length}</strong><span>gyakorlópont</span></div></div><p class="lead">A felvételi eredményed továbbra is <strong>${score()}/${TOTAL_POINTS}</strong>.</p><div class="result-actions">${remaining.length?'<button class="primary" id="nextTopic">Következő ajánlott téma</button>':""}<button class="secondary" id="backTopics">Vissza a témákhoz</button><button class="secondary" id="againPractice">Ezt újra gyakorlom</button></div></section>`;
  if(remaining.length) document.getElementById("nextTopic").addEventListener("click",()=>startPractice(remaining[0]));
  document.getElementById("backTopics").addEventListener("click",renderPracticeHub);
  document.getElementById("againPractice").addEventListener("click",()=>startPractice(state.practiceTopic));
}

function answerText(task, answer) {
  if (answer === null || answer === undefined || String(answer).trim() === "") return "Nincs válasz";
  if (task.type === "sentence-check") return answer === "ok" ? "✓ Hibátlan" : answer;
  return String(answer);
}

function correctText(task) {
  if (task.type === "sentence-check") return task.answer === "ok" ? "✓ Hibátlan" : task.answer;
  return task.answer;
}

function renderReview() {
  state.screen="review";
  const task=TASKS[state.reviewIndex], answer=state.answers[state.reviewIndex], correct=isCorrect(task,answer);
  const taskBlock = task.type === "fill"
    ? `<div class="fill-review-word"><small>Teljes mondat</small><strong>${task.completed}</strong></div>`
    : `<div class="fill-review-word"><small>Eredeti mondat</small><strong>${task.sentence}</strong></div><div class="fill-review-word"><small>Helyes mondat</small><strong>${task.completed}</strong></div>`;

  app.innerHTML=`<section class="review-screen">
    <div class="review-toolbar"><button class="nav-btn" id="resultBtn">← Eredmény</button><span>${state.reviewIndex+1} / ${TASKS.length}</span></div>
    <p class="task-source">${task.source}</p>
    <div class="review-status ${correct?"correct":"wrong"}"><span class="status-icon"></span><div><strong>${correct?"Helyes döntés":"Ezt most érdemes átnézni"}</strong><span>${correct?"1 pont":"0 pont"}</span></div></div>
    ${taskBlock}
    <div class="answer-comparison"><div><small>A te válaszod</small><strong>${answerText(task,answer)}</strong></div><div class="correct-answer-box"><small>Helyes megoldás</small><strong>${correctText(task)}</strong></div></div>
    <div class="short-explanation"><h3>Röviden</h3><p>${task.explanation}</p></div>
    <div class="review-navigation"><button class="nav-btn" id="prevReviewBtn" ${state.reviewIndex===0?"disabled":""}>← Előző</button><div class="review-dots">${TASKS.map((item,index)=>`<button class="review-dot ${index===state.reviewIndex?"active":""} ${isCorrect(item,state.answers[index])?"correct":"wrong"}" data-index="${index}"></button>`).join("")}</div><button class="nav-btn next" id="nextReviewBtn">${state.reviewIndex===TASKS.length-1?"Vissza az eredményhez":"Következő →"}</button></div>
  </section>`;

  document.getElementById("resultBtn").addEventListener("click",renderResult);
  document.getElementById("prevReviewBtn").addEventListener("click",()=>{if(state.reviewIndex>0){state.reviewIndex--;renderReview();}});
  document.getElementById("nextReviewBtn").addEventListener("click",()=>{if(state.reviewIndex===TASKS.length-1)renderResult();else{state.reviewIndex++;renderReview();}});
  app.querySelectorAll(".review-dot").forEach(dot=>dot.addEventListener("click",()=>{state.reviewIndex=Number(dot.dataset.index);renderReview();}));
}

function firstWrongIndex(){const index=TASKS.findIndex((task,i)=>!isCorrect(task,state.answers[i]));return index===-1?0:index;}

function restart(){
  state.index=0;state.answers=Array(TASKS.length).fill(null);state.midpointShown=false;state.reviewIndex=0;
  state.practiceTopic=null;state.practiceTasks=[];state.practiceAnswers=[];state.practiceScore=0;state.completedPractice={};
  renderIntro();
}

SCORM.init();
renderIntro();
