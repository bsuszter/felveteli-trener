const SCORM = (() => {
  let api = null;
  let initialized = false;

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
      }
      return initialized;
    } catch (error) {
      console.warn("SCORM inicializálási hiba:", error);
      return false;
    }
  }

  function setResult(points, total) {
    if (!initialized || !api) return false;
    try {
      api.LMSSetValue("cmi.core.score.min", "0");
      api.LMSSetValue("cmi.core.score.max", String(total));
      api.LMSSetValue("cmi.core.score.raw", String(points));
      api.LMSSetValue("cmi.core.lesson_status", "completed");
      return api.LMSCommit("") === "true";
    } catch (error) {
      console.warn("SCORM eredményküldési hiba:", error);
      return false;
    }
  }

  function finish() {
    if (!initialized || !api) return;
    try {
      api.LMSCommit("");
      api.LMSFinish("");
      initialized = false;
    } catch (error) {
      console.warn("SCORM lezárási hiba:", error);
    }
  }

  return { init, setResult, finish, isConnected: () => initialized };
})();

window.addEventListener("beforeunload", () => SCORM.finish());
