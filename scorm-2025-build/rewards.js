const rewardState = {
  coins: 0,
  rewardedTasks: new Set(),
  rewardedPerfectTopics: new Set(),
  lastAwardedTaskId: null
};

function aranytallerSource() {
  const moduleId = document.documentElement.dataset.module || "";
  if (/^\d{4}$/.test(moduleId) || moduleId === "practice") {
    return "helyesiras-gyakorlobank";
  }
  return null;
}

function isYearModule() {
  return /^\d{4}$/.test(document.documentElement.dataset.module || "");
}

function buildAranytallerProtocol() {
  const source = aranytallerSource();
  if (!source) return null;

  return {
    version: 1,
    source,
    rewards: [
      ...[...rewardState.rewardedTasks].map(id => ({
        id: `task:${id}`,
        type: "task"
      })),
      ...[...rewardState.rewardedPerfectTopics].map(topic => ({
        id: `perfect:${topic}`,
        type: "perfect"
      }))
    ]
  };
}

function loadRewardState() {
  const saved = SCORM.loadRewards?.();
  if (!saved) return;
  rewardState.coins = Number(saved.coins) || 0;
  rewardState.rewardedTasks = new Set(Array.isArray(saved.rewardedTasks) ? saved.rewardedTasks : []);
  rewardState.rewardedPerfectTopics = new Set(Array.isArray(saved.rewardedPerfectTopics) ? saved.rewardedPerfectTopics : []);
}

function saveRewardState() {
  SCORM.saveRewards?.({
    coins: rewardState.coins,
    rewardedTasks: [...rewardState.rewardedTasks],
    rewardedPerfectTopics: [...rewardState.rewardedPerfectTopics]
  });

  const protocol = buildAranytallerProtocol();
  if (protocol) SCORM.saveAranytaller?.(protocol);
}

function ensureCoinCounter() {
  const scoreboard = document.querySelector('.scoreboard');
  if (!scoreboard) return;

  let coinBox = document.getElementById('coinBox');
  if (!coinBox) {
    coinBox = document.createElement('div');
    coinBox.id = 'coinBox';
    coinBox.className = 'coin-box';
    const label = isYearModule() ? '🪙 tallér ebben a próbálkozásban' : '🪙 aranytallér';
    coinBox.innerHTML = `<span id="coinText">0</span><small>${label}</small>`;
    scoreboard.appendChild(coinBox);
  }
  coinBox.hidden = false;

  const coinText = document.getElementById('coinText');
  const nextValue = String(rewardState.coins);
  if (coinText.textContent !== nextValue) coinText.textContent = nextValue;
}

function awardTaskCoin(task) {
  if (rewardState.rewardedTasks.has(task.id)) return 0;
  rewardState.rewardedTasks.add(task.id);
  rewardState.coins += 1;
  rewardState.lastAwardedTaskId = task.id;
  saveRewardState();
  ensureCoinCounter();
  return 1;
}

function awardPerfectTopic(topic) {
  if (rewardState.rewardedPerfectTopics.has(topic)) return 0;
  rewardState.rewardedPerfectTopics.add(topic);
  rewardState.coins += 2;
  saveRewardState();
  ensureCoinCounter();
  return 2;
}

renderPractice = function renderPracticeWithRewards() {
  state.screen = 'practice';
  const task = state.practiceTasks[state.practiceIndex];
  const answer = state.practiceAnswers[state.practiceIndex];
  const answered = answer !== null;
  const correct = answered && answer === task.correct;
  const earnedNow = correct && rewardState.lastAwardedTaskId === task.id;

  app.innerHTML = `<section class="practice-screen">
    <div class="question-head"><span>${topicTitle(task.topic)}</span><span>${state.practiceIndex + 1} / ${state.practiceTasks.length}</span></div>
    <span class="topic-tag practice-topic">${topicTitle(task.topic)}</span>
    <h2>${task.prompt}</h2>
    <div class="practice-options">${task.options.map((option, index) => `<button class="practice-option ${answered ? (index === task.correct ? 'correct' : index === answer ? 'wrong' : '') : ''}" data-index="${index}" ${answered ? 'disabled' : ''}>${option}</button>`).join('')}</div>
    ${answered ? `<div class="practice-feedback ${correct ? 'correct' : 'wrong'}"><span class="practice-feedback-icon" aria-hidden="true"></span><div><strong>${correct ? 'Helyes döntés' : 'Ezt most nézzük meg'}</strong><p>${task.explanation}</p>${earnedNow ? '<p class="coin-earned">🪙 +1 aranytallér</p>' : ''}</div></div>` : ''}
    <div class="navigation"><button class="nav-btn" id="quitPractice">← Témák</button><button class="nav-btn next" id="nextPractice" ${answered ? '' : 'disabled'}>${state.practiceIndex === state.practiceTasks.length - 1 ? 'Gyakorlás befejezése' : 'Következő →'}</button></div>
  </section>`;

  app.querySelectorAll('.practice-option').forEach(button => button.addEventListener('click', () => {
    rewardState.lastAwardedTaskId = null;
    const selected = Number(button.dataset.index);
    state.practiceAnswers[state.practiceIndex] = selected;
    if (selected === task.correct) {
      state.practiceScore++;
      awardTaskCoin(task);
    }
    renderPractice();
  }));

  document.getElementById('quitPractice').addEventListener('click', () => {
    rewardState.lastAwardedTaskId = null;
    renderPracticeHub();
  });
  document.getElementById('nextPractice').addEventListener('click', () => {
    if (!answered) return;
    rewardState.lastAwardedTaskId = null;
    if (state.practiceIndex === state.practiceTasks.length - 1) renderPracticeResult();
    else {
      state.practiceIndex++;
      renderPractice();
    }
  });

  ensureCoinCounter();
};

renderPracticeResult = function renderPracticeResultWithRewards() {
  state.completedPractice[state.practiceTopic] = { score: state.practiceScore, total: state.practiceTasks.length };
  const recommended = getRecommendedTopics();
  const remaining = recommended.filter(topic => !state.completedPractice[topic]);
  const perfect = state.practiceScore === state.practiceTasks.length;
  const bonus = perfect ? awardPerfectTopic(state.practiceTopic) : 0;
  const standalone = Boolean(window.PRACTICE_STANDALONE);
  const coinSummaryLabel = isYearModule()
    ? `${rewardState.coins} tallér ebben a próbálkozásban`
    : `${rewardState.coins} aranytallér`;

  app.innerHTML = `<section class="result practice-result">
    <span class="badge">${topicTitle(state.practiceTopic)} – kész</span>
    <h2>${perfect ? 'Nagyon biztosan ment!' : 'Máris erősebb lett a tudásod.'}</h2>
    <div class="result-score small"><div><strong>${state.practiceScore}/${state.practiceTasks.length}</strong><span>gyakorlópont</span></div></div>
    <div class="coin-summary"><span class="coin-summary-icon">🪙</span><div><strong>${coinSummaryLabel}</strong><span>${bonus ? `Hibátlan blokk: +${bonus} bónusztallér` : 'Az elsőre helyes válaszokért jár tallér.'}</span></div></div>
    <p class="lead">${standalone ? 'Ez önálló gyakorlás: a megszerzett tallérok a gyakorlóbankban gyűlnek tovább.' : `A tallérok és a gyakorlópontok nem változtatják meg az eredeti felvételi pontszámodat: az továbbra is <strong>${score()}/12</strong>.`}</p>
    <div class="result-actions">${!standalone && remaining.length ? '<button class="primary" id="nextTopic">Következő ajánlott téma</button>' : ''}<button class="secondary" id="backTopics">Vissza a témákhoz</button><button class="secondary" id="againPractice">Ezt újra gyakorlom</button></div>
  </section>`;

  if (!standalone && remaining.length) document.getElementById('nextTopic').addEventListener('click', () => startPractice(remaining[0]));
  document.getElementById('backTopics').addEventListener('click', renderPracticeHub);
  document.getElementById('againPractice').addEventListener('click', () => startPractice(state.practiceTopic));
  ensureCoinCounter();
};

loadRewardState();
ensureCoinCounter();
