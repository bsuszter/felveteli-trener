(() => {
  function applyAttemptLock() {
    if (!window.SCORM?.isConnected?.() || !window.SCORM?.isResultLocked?.()) return;

    const restartButton = document.getElementById("restartBtn");
    if (!restartButton) return;

    const actions = restartButton.parentElement;
    restartButton.remove();

    if (!document.getElementById("scormAttemptNotice")) {
      const notice = document.createElement("div");
      notice.id = "scormAttemptNotice";
      notice.className = "scorm-attempt-notice";
      notice.innerHTML = `
        <strong>Az eredményedet rögzítettük.</strong>
        <span>Új hivatalos eredményhez lépj vissza a Moodle-ba, és indíts új próbálkozást. A válaszok áttekintése és a gyakorlás továbbra is használható.</span>
      `;
      actions.insertAdjacentElement("afterend", notice);
    }
  }

  const observer = new MutationObserver(applyAttemptLock);
  observer.observe(document.body, { childList: true, subtree: true });

  document.addEventListener("DOMContentLoaded", applyAttemptLock);
  window.setTimeout(applyAttemptLock, 0);
})();
