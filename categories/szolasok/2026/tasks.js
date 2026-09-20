window.SZOLASOK_2026 = {
  year: 2026,
  maxScore: 14,
  pictureTask: {
    title: "Melyik képhez illik a jelentés?",
    instruction: "Válaszd ki azt a betűt, amelyik kép a megadott jelentéshez tartozó szólást vagy közmondást ábrázolja. Egy kép kimarad.",
    figures: [
      { id: "A", image: "categories/szolasok/2026/img/a-agyuval-lo-verebre.png", label: "A" },
      { id: "B", image: "categories/szolasok/2026/img/b-vakok-kozott-felszemu-kiraly.png", label: "B" },
      { id: "C", image: "categories/szolasok/2026/img/c-ehes-diszno-makkal-almodik.png", label: "C" },
      { id: "D", image: "categories/szolasok/2026/img/d-egy-talbol-cseresznyeznek.png", label: "D" },
      { id: "E", image: "categories/szolasok/2026/img/e-lapatra-tesz.png", label: "E" },
      { id: "F", image: "categories/szolasok/2026/img/f-bolhabol-elefantot-csinal.png", label: "F" }
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
  },
  recallTask: {
    title: "Rögzítsük a pontos kifejezéseket!",
    instruction: "Nézd meg a képet, és válaszd ki, melyik szólást vagy közmondást ábrázolja. Minden jó párosítás 1 pontot ér.",
    options: [
      { id: "A", text: "Ágyúval lő verébre." },
      { id: "B", text: "A vakok között a félszemű is király." },
      { id: "C", text: "Éhes disznó makkal álmodik." },
      { id: "D", text: "Egy tálból cseresznyéznek." },
      { id: "E", text: "Lapátra tesz." },
      { id: "F", text: "A bolhából elefántot csinál." }
    ],
    items: [
      { figure: "A", answer: "A" },
      { figure: "B", answer: "B" },
      { figure: "C", answer: "C" },
      { figure: "D", answer: "D" },
      { figure: "E", answer: "E" },
      { figure: "F", answer: "F" }
    ]
  }
};
