const SCORM = (() => {
  let api = null;
  let initialized = false;
  let lastSaved = null;
  let observerTimer = null;

  function findAPI(win) {
    let current = win;
    let attempts = 0;
    while (current && attempts < 20) {
      if (current.API) return current.API;
      if (current.parent === current) break;
      current = current.parent;
      attempts++;
    }
    if (win.opener) return findAPI(win.opener);
    return null;
  }

  function commitScore(points, total, completed) {
    if (!initialized || !api) return false;
    try {
      api.LMSSetValue("cmi.core.score.min", "0");
      api.LMSSetValue("cmi.core.score.max", String(total));
      api.LMSSetValue("cmi.core.score.raw", String(points));
      api.LMSSetValue("cmi.core.lesson_status", completed ? "completed" : "incomplete");
      return api.LMSCommit("") === "true";
    } catch (error) {
      console.warn("SCORM pontmentési hiba:", error);
      return false;
    }
  }

  function readVisibleProgress() {
    const scoreElement = document.getElementById("scoreText");
    const progressElement = document.getElementById("progressText");
    if (!scoreElement || !progressElement) return null;

    const scoreMatch = scoreElement.textContent.match(/(\d+)\s*\/\s*(\d+)/);
    const progressMatch = progressElement.textContent.match(/(\d+)\s*\/\s*(\d+)/);
    if (!scoreMatch || !progressMatch) return null;

    return {
      points: Number(scoreMatch[1]),
      answered: Number(progressMatch[1]),
      total: Number(progressMatch[2])
    };
  }

  function saveVisibleProgress() {
    const progress = readVisibleProgress();
    if (!progress || progress.answered === 0) return;

    const key = `${progress.points}:${progress.answered}:${progress.total}`;
    if (key === lastSaved) return;

    const completed = progress.answered >= progress.total;
    if (commitScore(progress.points, progress.total, completed)) {
      lastSaved = key;
    }
  }

  function startProgressObserver() {
    if (observerTimer) return;
    observerTimer = window.setInterval(saveVisibleProgress, 500);
  }

  function init() {
    try {
      api = findAPI(window);
      if (!api) return false;
      initialized = api.LMSInitialize("") === "true";
      if (initialized) {
        const status = api.LMSGetValue("cmi.core.lesson_status");
        if (!status || status === "not attempted") {
          api.LMSSetValue("cmi.core.lesson_status", "incomplete");
          api.LMSCommit("");
        }
        startProgressObserver();
      }
      return initialized;
    } catch (error) {
      console.warn("SCORM inicializálási hiba:", error);
      return false;
    }
  }

  function setProgress(points, total) {
    return commitScore(points, total, false);
  }

  function setResult(points, total) {
    const success = commitScore(points, total, true);
    if (success) lastSaved = `${points}:${total}:${total}`;
    return success;
  }

  function finish() {
    if (!initialized || !api) return;
    try {
      saveVisibleProgress();
      api.LMSCommit("");
      api.LMSFinish("");
      initialized = false;
      if (observerTimer) {
        window.clearInterval(observerTimer);
        observerTimer = null;
      }
    } catch (error) {
      console.warn("SCORM lezárási hiba:", error);
    }
  }

  return {
    init,
    setProgress,
    setResult,
    finish,
    isConnected: () => initialized
  };
})();

window.addEventListener("beforeunload", () => SCORM.finish());