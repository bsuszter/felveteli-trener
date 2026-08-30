// Közös gyakorlóbank-bővítés: számnevek írása.
// Minden évmodul betölti, így a téma a teljes gyakorlóbank része.

PRACTICE_TOPICS["számnevek írása"] = {
  title: "Számnevek írása",
  description: "A betűvel írt számnevek egybeírása és kötőjelezése kétezerig és kétezren felül."
};

PRACTICE_TASKS.push(
  {
    id: "szam-1",
    topic: "számnevek írása",
    prompt: "Melyik alak helyes?",
    options: ["ezerkilencszázötvennyolc", "ezerkilencszáz-ötvennyolc"],
    correct: 0,
    explanation: "A kétezerig terjedő számneveket betűvel egybeírjuk: ezerkilencszázötvennyolc."
  },
  {
    id: "szam-2",
    topic: "számnevek írása",
    prompt: "Hogyan írjuk betűvel a 2026-ot?",
    options: ["kétezerhuszonhat", "kétezer-huszonhat"],
    correct: 1,
    explanation: "Kétezren felül a nem kerek számokat a nagyobb egységek határán kötőjellel tagoljuk: kétezer-huszonhat."
  },
  {
    id: "szam-3",
    topic: "számnevek írása",
    prompt: "Melyik alak helyes?",
    options: ["ötmillióhat", "ötmillió-hat"],
    correct: 1,
    explanation: "Kétezren felül a nem kerek számot kötőjellel tagoljuk: ötmillió-hat."
  },
  {
    id: "szam-4",
    topic: "számnevek írása",
    prompt: "Hogyan írjuk betűvel a 12 345-öt?",
    options: ["tizenkétezer-háromszáznegyvenöt", "tizenkétezerháromszáznegyvenöt"],
    correct: 0,
    explanation: "Kétezren felül a számnevet a nagyobb egységek határán kötőjellel tagoljuk: tizenkétezer-háromszáznegyvenöt."
  },
  {
    id: "szam-5",
    topic: "számnevek írása",
    prompt: "Melyik alak helyes?",
    options: ["hárommillió", "három-millió"],
    correct: 0,
    explanation: "A kerek ezreseket és milliós számokat egybeírjuk: hárommillió."
  }
);
