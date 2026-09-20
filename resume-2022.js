(() => {
  if (!window.SCORM?.isConnected?.() || window.SCORM?.isResultLocked?.()) return;

  function snapshot(screenOverride = null) {
    return {
      version: 1,
      module: "2022",
      screen: screenOverride || state.screen,
      index: state.index,
      answers: [...state.answers],
      midpointShown: Boolean(state.midpointShown)
    };
  }

  function save(screenOverride = null) {
    if (state.screen === "result" || window.SCORM?.isResultLocked?.()) return;
    SCORM.saveAttempt?.(snapshot(screenOverride));
  }

  const baseSetProgress = SCORM.setProgress;
  SCORM.setProgress = function setProgressWithResume(points, total) {
    const result = baseSetProgress(points, total);
    save("question");
    return result;
  };

  const baseRenderQuestion = renderQuestion;
  renderQuestion = function renderQuestionWithResume() {
    baseRenderQuestion();
    save("question");
  };

  const baseRenderMidpoint = renderMidpoint;
  renderMidpoint = function renderMidpointWithResume() {
    state.screen = "midpoint";
    baseRenderMidpoint();
    save("midpoint");
  };

  const saved = SCORM.loadAttempt?.();
  if (!saved || saved.module !== "2022" || !Array.isArray(saved.answers)) return;

  const restoredAnswers = Array(TASKS.length).fill(null);
  saved.answers.slice(0, TASKS.length).forEach((answer, index) => {
    restoredAnswers[index] = answer ?? null;
  });

  state.answers = restoredAnswers;
  state.index = Number.isInteger(saved.index)
    ? Math.max(0, Math.min(saved.index, TASKS.length - 1))
    : 0;
  state.midpointShown = Boolean(saved.midpointShown);

  const hasProgress = state.answers.some(answer => answer !== null && String(answer).trim() !== "");
  if (!hasProgress) return;

  if (saved.screen === "midpoint") renderMidpoint();
  else renderQuestion();
})();