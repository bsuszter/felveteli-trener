window.SZOLASOK_2026 = {
  year: 2026,
  maxScore: 8,
  pictureTask: {
    title: "Melyik képhez illik a jelentés?",
    instruction: "Válaszd ki azt a betűt, amelyik kép a megadott jelentéshez tartozó szólást vagy közmondást ábrázolja. Egy kép kimarad.",
    figures: [
      { id: "A", symbol: "💣 → 🐦", label: "A" },
      { id: "B", symbol: "👁️ 👑 👥", label: "B" },
      { id: "C", symbol: "🐷 💭 🌰", label: "C" },
      { id: "D", symbol: "👥 🍒 🥣", label: "D" },
      { id: "E", symbol: "🫳 🪏 👤", label: "E" },
      { id: "F", symbol: "🪲 → 🐘", label: "F" }
    ],
    items: [
      {
        prompt: "Aránytalanul nagy erőfeszítést tesz egy egyszerű feladat elvégzése érdekében.",
        answer: "A",
        expression: "Ágyúval lő verébre."
      },
      {
        prompt: "Mindig azzal foglalkozik, amire vágyik, és amit nem tud elérni.",
        answer: "C",
        expression: "Éhes disznó makkal álmodik."
      },
      {
        prompt: "Elküld, elbocsát egy munkahelyről.",
        answer: "E",
        expression: "Lapátra tesz."
      },
      {
        prompt: "Apróságot felnagyít, nagy horderejűnek tüntet fel.",
        answer: "F",
        expression: "A bolhából elefántot csinál."
      },
      {
        prompt: "Azok között, akik nem értenek valamihez, már az is érvényesül, aki keveset tud a témáról.",
        answer: "B",
        expression: "A vakok között a félszemű is király."
      }
    ],
    scoreMap: { "0":0, "1":0, "2":1, "3":2, "4":3, "5":4 }
  },
  meaningTask: {
    title: "Melyik szókapcsolat fejezi ki a jelentést?",
    instruction: "Válaszd ki a megfelelő állandósult szókapcsolat számát. Egy kifejezés kimarad.",
    expressions: [
      { id: "1", text: "felhúzza az orrát" },
      { id: "2", text: "ajkába harap" },
      { id: "3", text: "leesik az álla" },
      { id: "4", text: "a szeme sem áll jól" },
      { id: "5", text: "tartja a három lépés távolságot" }
    ],
    items: [
      { prompt: "nagyon meglepődik", answer: "3" },
      { prompt: "elfojtja az indulatát", answer: "2" },
      { prompt: "megsértődik", answer: "1" },
      { prompt: "kerüli a bizalmaskodást", answer: "5" }
    ]
  }
};
