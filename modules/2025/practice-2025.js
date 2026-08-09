// A 2025-ös feladatsorhoz szükséges gyakorlóbank-bővítés.
// A közös practice.js bankot egészíti ki, nem másolja le.

PRACTICE_TOPICS["mássalhangzók és toldalékolás"] = {
  title: "Mássalhangzók és toldalékolás",
  description: "Hasonulás, kettőzés és nehezebb mássalhangzó-kapcsolatok toldalékos és ragozott szóalakokban."
};

PRACTICE_TASKS.push(
  {
    id: "2025-mh-1",
    topic: "mássalhangzók és toldalékolás",
    prompt: "Melyik mondat helyes?",
    options: ["Lassan a testtel!", "Lassan a testel!"],
    correct: 0,
    explanation: "A -val/-vel rag v-je teljesen hasonul a szó végi t-hez: test + vel → testtel."
  },
  {
    id: "2025-mh-2",
    topic: "mássalhangzók és toldalékolás",
    prompt: "Melyik mondat helyes?",
    options: ["Játssza az eszét.", "Játsza az eszét."],
    correct: 0,
    explanation: "A játszik ige helyes alakja ebben a mondatban: játssza."
  },
  {
    id: "2025-mh-3",
    topic: "mássalhangzók és toldalékolás",
    prompt: "Melyik alak helyes?",
    options: ["szükség", "szügség"],
    correct: 0,
    explanation: "A szükség szóban k-t írunk: szükség."
  },
  {
    id: "2025-mh-4",
    topic: "mássalhangzók és toldalékolás",
    prompt: "Melyik alak helyes?",
    options: ["kézzel", "kézel"],
    correct: 0,
    explanation: "A kéz szóhoz kapcsolódó -val/-vel rag v-je teljesen hasonul: kéz + vel → kézzel."
  },
  {
    id: "2025-mh-5",
    topic: "mássalhangzók és toldalékolás",
    prompt: "Melyik alak helyes?",
    options: ["azzal", "azal"],
    correct: 0,
    explanation: "Az az névmáshoz kapcsolódó -val/-vel rag v-je teljesen hasonul: az + val → azzal."
  }
);

// A 2025-ös feladatok tématérképe: előbb a 2025-specifikus
// mássalhangzós eseteket kezeljük, utána a közös térkép következik.
const sharedPracticeTopicForTask2025 = practiceTopicForTask;
practiceTopicForTask = function practiceTopicForTask2025(task) {
  const tags = task.tags || [];

  if (
    tags.includes("mássalhangzó-kettőzés") ||
    tags.includes("mássalhangzó") ||
    tags.includes("toldalékolás")
  ) {
    return "mássalhangzók és toldalékolás";
  }

  return sharedPracticeTopicForTask2025(task);
};
