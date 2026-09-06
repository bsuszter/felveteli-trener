const SCORM = (() => {
  let api = null;
  let initialized = false;
  let resultLocked = false;
  let lastSaved = null;
  let observerTimer = null;
  const LOCAL_REWARD_KEY = "felveteli-trener-rewards";
  const LOCAL_ARANYTALLER_KEY = "felveteli-trener-aranytaller";

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
    if (resultLocked && !completed) return false;
    try {
      api.LMSSetValue("cmi.core.score.min", "0");
      api.LMSSetValue("cmi.core.score.max", String(total));
      api.LMSSetValue("cmi.core.score.raw", String(points));
      api.LMSSetValue("cmi.core.lesson_status", completed ? "completed" : "incomplete");
      api.LMSSetValue("cmi.core.exit", completed ? "" : "suspend");
      const success = api.LMSCommit("") === "true";
      if (success && completed) resultLocked = true;
      return success;
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
    if (resultLocked) return;
    const progress = readVisibleProgress();
    if (!progress || progress.answered === 0) return;

    const completed = Boolean(document.querySelector(".result:not(.practice-result)"))
      && progress.answered >= progress.total;
    const key = `${progress.points}:${progress.answered}:${progress.total}:${completed}`;
    if (key === lastSaved) return;

    if (commitScore(progress.points, progress.total, completed)) {
      lastSaved = key;
    }
  }

  function startProgressObserver() {
    if (observerTimer) return;
    observerTimer = window.setInterval(saveVisibleProgress, 500);
  }

  function readSuspendData() {
    if (!initialized || !api) return {};
    try {
      const raw = api.LMSGetValue("cmi.suspend_data");
      return raw ? JSON.parse(raw) : {};
    } catch (error) {
      console.warn("SCORM állapotolvasási hiba:", error);
      return {};
    }
  }

  function writeSuspendData(data) {
    if (!initialized || !api) return false;
    try {
      api.LMSSetValue("cmi.suspend_data", JSON.stringify(data));
      return api.LMSCommit("") === "true";
    } catch (error) {
      console.warn("SCORM állapotmentési hiba:", error);
      return false;
    }
  }

  function loadRewards() {
    if (initialized && api) return readSuspendData().rewards || null;
    try {
      const raw = localStorage.getItem(LOCAL_REWARD_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (error) {
      console.warn("Helyi jutalomadat-olvasási hiba:", error);
      return null;
    }
  }

  function saveRewards(rewards) {
    try {
      localStorage.setItem(LOCAL_REWARD_KEY, JSON.stringify(rewards));
    } catch (error) {
      console.warn("Helyi jutalomadat-mentési hiba:", error);
    }

    if (!initialized || !api) return true;
    const data = readSuspendData();
    data.rewards = rewards;
    return writeSuspendData(data);
  }

  function loadAranytaller() {
    if (initialized && api) return readSuspendData().aranytaller || null;
    try {
      const raw = localStorage.getItem(LOCAL_ARANYTALLER_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (error) {
      console.warn("Helyi Aranytallér-adat olvasási hiba:", error);
      return null;
    }
  }

  function saveAranytaller(aranytaller) {
    try {
      localStorage.setItem(LOCAL_ARANYTALLER_KEY, JSON.stringify(aranytaller));
    } catch (error) {
      console.warn("Helyi Aranytallér-adat mentési hiba:", error);
    }

    if (!initialized || !api) return true;
    const data = readSuspendData();
    data.aranytaller = aranytaller;
    return writeSuspendData(data);
  }

  function loadAttempt() {
    if (!initialized || !api || resultLocked) return null;
    const attempt = readSuspendData().attempt;
    return attempt && typeof attempt === "object" ? attempt : null;
  }

  function saveAttempt(attempt) {
    if (!initialized || !api || resultLocked) return false;
    const data = readSuspendData();
    data.attempt = attempt;
    try {
      api.LMSSetValue("cmi.core.exit", "suspend");
    } catch (error) {
      console.warn("SCORM suspend állapot beállítási hiba:", error);
    }
    return writeSuspendData(data);
  }

  function clearAttempt() {
    if (!initialized || !api) return false;
    const data = readSuspendData();
    delete data.attempt;
    return writeSuspendData(data);
  }

  function init() {
    try {
      api = findAPI(window);
      if (!api) return false;
      initialized = api.LMSInitialize("") === "true";
      if (initialized) {
        const status = api.LMSGetValue("cmi.core.lesson_status");
        resultLocked = status === "completed" || status === "passed" || status === "failed";
        if (!status || status === "not attempted") {
          api.LMSSetValue("cmi.core.lesson_status", "incomplete");
          api.LMSSetValue("cmi.core.exit", "suspend");
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
    if (resultLocked) return false;
    return commitScore(points, total, false);
  }

  function setResult(points, total) {
    if (resultLocked) return true;
    clearAttempt();
    const success = commitScore(points, total, true);
    if (success) lastSaved = `${points}:${total}:${total}:true`;
    return success;
  }

  function finish() {
    if (!initialized || !api) return;
    try {
      saveVisibleProgress();
      api.LMSSetValue("cmi.core.exit", resultLocked ? "" : "suspend");
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
    loadRewards,
    saveRewards,
    loadAranytaller,
    saveAranytaller,
    loadAttempt,
    saveAttempt,
    clearAttempt,
    finish,
    isConnected: () => initialized,
    isResultLocked: () => resultLocked
  };
})();

window.SCORM = SCORM;
window.addEventListener("beforeunload", () => SCORM.finish());
