(() => {
  const moduleId = document.documentElement.dataset.module;

  function addYearBackLink() {
    if (!moduleId) return;
    const appRoot = document.getElementById("app");
    if (!appRoot) return;
    const section = appRoot.querySelector("section");
    if (!section || section.querySelector(".module-return, .global-year-back")) return;

    const link = document.createElement("a");
    link.className = "global-year-back";
    link.href = "index.html";
    link.textContent = "← Évválasztó";
    section.prepend(link);
  }

  const observer = new MutationObserver(addYearBackLink);
  observer.observe(document.getElementById("app"), { childList: true, subtree: false });
  addYearBackLink();

  if (moduleId !== "2025" || typeof renderQuestion !== "function") return;

  // A 2025-ös feladatsor mássalhangzós és toldalékolási hibái
  // a közös gyakorlóbank megfelelő témájához kerülnek.
  if (typeof practiceTopicForTask === "function") {
    const sharedPracticeTopicForTask = practiceTopicForTask;
    practiceTopicForTask = function practiceTopicForTask2025(task) {
      const tags = task.tags || [];
      if (
        tags.includes("mássalhangzó-kettőzés") ||
        tags.includes("mássalhangzó") ||
        tags.includes("toldalékolás")
      ) {
        return "mássalhangzók és toldalékolás";
      }
      return sharedPracticeTopicForTask(task);
    };
  }

  function splitFillSentence(task) {
    const before = String(task.before || "");
    const after = String(task.after || "");

    const beforeBreak = before.lastIndexOf(" ");
    const prefix = beforeBreak >= 0 ? before.slice(0, beforeBreak + 1) : "";
    const wordStart = beforeBreak >= 0 ? before.slice(beforeBreak + 1) : before;

    const afterBreak = after.indexOf(" ");
    const wordEnd = afterBreak >= 0 ? after.slice(0, afterBreak) : after;
    const suffix = afterBreak >= 0 ? after.slice(afterBreak) : "";

    return { prefix, wordStart, wordEnd, suffix };
  }

  function renderLockedFill(task, selected) {
    const parts = splitFillSentence(task);
    const submitted = selected !== null && selected !== undefined && String(selected).trim() !== "";
    const value = submitted ? String(selected) : "";
    const expectedLength = Math.max(1, String(task.answer || "").length);

    return `
      <h2>Pótold a hiányzó betűt vagy betűket!</h2>
      <p class="fill-instruction">Ügyelj a helyesírásra!</p>
      <div class="fill-sentence locked-fill-sentence">
        <span class="fill-prefix">${parts.prefix}</span><span class="fill-word"><span>${parts.wordStart}</span><input id="fillInput" class="fill-input" type="text" value="${value}" data-chars="${expectedLength}" autocomplete="off" autocapitalize="off" spellcheck="false" aria-label="Hiányzó betű vagy betűk" ${submitted ? "disabled" : ""}><span>${parts.wordEnd}</span></span><span class="fill-suffix">${parts.suffix}</span>
      </div>
      <p class="fill-hint">Csak a hiányzó betűt vagy betűket írd be.</p>
      ${submitted ? "" : `<div class="fill-submit-row"><button class="primary fill-submit" id="submitFillBtn" disabled>Válasz beküldése</button></div>`}`;
  }

  renderQuestion = function renderQuestionLockedFill() {
    state.screen = "question";
    const task = TASKS[state.index];
    const selected = state.answers[state.index];
    const submitted = selected !== null && selected !== undefined && String(selected).trim() !== "";
    updateStatus();

    app.innerHTML = `
      <section class="question ${task.type === "fill" ? "fill-question" : ""}">
        <div class="question-head"><span>${state.index + 1}. feladat</span><span>${task.points || 1} pont</span></div>
        <p class="task-source">${task.source}</p>
        ${task.type === "fill" ? renderLockedFill(task, selected) : renderChoiceQuestion(task, selected)}
        <div class="navigation">
          <button class="nav-btn" id="backBtn" ${state.index === 0 ? "disabled" : ""}>← Vissza</button>
          <button class="nav-btn next" id="nextBtn" ${submitted ? "" : (task.type === "fill" ? "disabled" : selected ? "" : "disabled")}>${state.index === TASKS.length - 1 ? "Befejezem" : "Következő →"}</button>
        </div>
      </section>`;

    if (task.type === "fill") {
      const input = document.getElementById("fillInput");
      const submitBtn = document.getElementById("submitFillBtn");

      if (!submitted) {
        input.focus();
        input.addEventListener("input", () => {
          submitBtn.disabled = !input.value.trim();
        });
        input.addEventListener("keydown", event => {
          if (event.key === "Enter" && input.value.trim()) submitBtn.click();
        });
        submitBtn.addEventListener("click", () => {
          const value = input.value.trim();
          if (!value) return;
          state.answers[state.index] = value;
          SCORM.setProgress(score(), TOTAL_POINTS);
          renderQuestion();
        });
      }
    } else {
      app.querySelectorAll(".answer").forEach(button => button.addEventListener("click", () => {
        state.answers[state.index] = button.dataset.answer;
        SCORM.setProgress(score(), TOTAL_POINTS);
        renderQuestion();
      }));
    }

    document.getElementById("backBtn").addEventListener("click", () => {
      if (state.index > 0) {
        state.index--;
        renderQuestion();
      }
    });

    document.getElementById("nextBtn").addEventListener("click", () => {
      const current = state.answers[state.index];
      if (current === null || current === undefined || String(current).trim() === "") return;
      if (state.index === TASKS.length - 1) {
        renderResult();
        return;
      }
      if (state.index === 5 && !state.midpointShown) {
        state.midpointShown = true;
        renderMidpoint();
        return;
      }
      state.index++;
      renderQuestion();
    });

    addYearBackLink();
  };
})();