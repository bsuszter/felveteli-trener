const TASKS = [
  {
    id: 1,
    source: "2026. január • központi felvételi • 5. feladat • a)",
    first: "mond",
    second: "mondd",
    correct: "both",
    tags: ["igeragozás", "felszólító mód"],
    explanation: "Mindkettő helyes: a mond kijelentő módú alak, a mondd felszólító módú, határozott ragozású alak.",
    learn: {
      title: "Mikor írjuk azt, hogy mond, és mikor azt, hogy mondd?",
      comparison: [
        {
          word: "mond",
          subtitle: "Kijelentő mód",
          examples: [
            { correct: true, text: "Péter igazat mond." },
            { correct: false, text: "Péter igazat mondd." }
          ]
        },
        {
          word: "mondd",
          subtitle: "Felszólító mód, határozott ragozás",
          examples: [
            { correct: true, text: "Mondd el az igazat!" },
            { correct: false, text: "Mond el az igazat!" }
          ]
        }
      ],
      ruleTitle: "Miért két d?",
      rule: "A mond ige töve d-re végződik. Ehhez kapcsolódik a felszólító mód -d jele:",
      formula: "mond + d = mondd",
      counterTitle: "Nem minden felszólító alakban van két d",
      counterText: "Az írd, kérd, hagyd alakokban csak egy d van, mert az igető nem d-re végződik.",
      irregularTitle: "Rendhagyó alakok",
      irregulars: ["vidd", "idd", "edd", "tedd", "vedd"],
      image: "magyarazat01.png",
      imageAlt: "Infografika a mond és mondd alak használatáról"
    }
  },
  {
    id: 2,
    source: "2026. január • központi felvételi • 5. feladat • b)",
    first: "muszáj",
    second: "muszály",
    correct: "first",
    tags: ["j–ly"],
    explanation: "A muszáj szó végén j-t írunk.",
    learn: {
      title: "Ezt érdemes megjegyezni",
      body: "A muszáj szó helyes alakjában j szerepel. Ez hagyományos írásmód, ezért leginkább gyakorlással rögzíthető.",
      rule: "Helyes alak: muszáj."
    }
  },
  {
    id: 3,
    source: "2026. január • központi felvételi • 5. feladat • c)",
    first: "megakarta beszélni",
    second: "meg akarta beszélni",
    correct: "second",
    tags: ["igekötő", "egybe- és különírás"],
    explanation: "Ha az igekötő és az ige közé más szó kerül, az igekötőt különírjuk: meg akarta beszélni.",
    learn: {
      title: "Az igekötő helye dönt",
      body: "A meg a beszélni igéhez tartozik, de az akarta közéjük ékelődik, ezért különírjuk.",
      rule: "Ha az igekötő és az ige közé más szó kerül, az igekötőt különírjuk."
    }
  },
  {
    id: 4,
    source: "2026. január • központi felvételi • 5. feladat • d)",
    first: "két hetes",
    second: "kéthetes",
    correct: "both",
    tags: ["egybe- és különírás", "jelentés"],
    explanation: "Mindkét alak lehet helyes a jelentéstől függően: két hetes kirándulás, illetve kéthetes tanfolyam.",
    learn: {
      title: "A jelentés is számít",
      body: "A két hetes szerkezetben a két a hetes szót mennyiségjelzőként bővíti. A kéthetes egyetlen összetett melléknév.",
      rule: "Ugyanazok a szavak külön- és egybeírva más szerkezetet vagy jelentést alkothatnak."
    }
  },
  {
    id: 5,
    source: "2026. január • központi felvételi • 5. feladat • e)",
    first: "igér",
    second: "ígér",
    correct: "second",
    tags: ["magánhangzó-hosszúság"],
    explanation: "Az ígér szó hosszú í-vel írandó."
  },
  {
    id: 6,
    source: "2026. január • központi felvételi • 5. feladat • f)",
    first: "mohácsi vész",
    second: "Mohácsi Vész",
    correct: "first",
    tags: ["kis- és nagybetű", "történelmi esemény"],
    explanation: "A történelmi események nevét általában kis kezdőbetűvel írjuk: mohácsi vész.",
    learn: {
      title: "Történelmi események neve",
      body: "A történelmi események és korszakok elnevezéseit általában kis kezdőbetűvel írjuk.",
      rule: "Helyes alak: mohácsi vész."
    }
  },
  {
    id: 7,
    source: "2026. január • pótfelvételi • 4. feladat • a)",
    first: "Batthyányi",
    second: "Batthyány",
    correct: "second",
    tags: ["tulajdonnév", "szóalak"],
    explanation: "A családnév helyes alakja: Batthyány."
  },
  {
    id: 8,
    source: "2026. január • pótfelvételi • 4. feladat • b)",
    first: "sajog",
    second: "salyog",
    correct: "first",
    tags: ["j–ly"],
    explanation: "A sajog szóban j-t írunk."
  },
  {
    id: 9,
    source: "2026. január • pótfelvételi • 4. feladat • c)",
    first: "higyj",
    second: "higgy",
    correct: "second",
    tags: ["felszólító mód", "mássalhangzó"],
    explanation: "A hisz ige felszólító módú alakja: higgy.",
    learn: {
      title: "Rendhagyó alak",
      body: "A hisz ige felszólító módú alakja nem higyj, hanem higgy.",
      rule: "Helyes alak: higgy!"
    }
  },
  {
    id: 10,
    source: "2026. január • pótfelvételi • 4. feladat • d)",
    first: "cm-el",
    second: "cm-rel",
    correct: "second",
    tags: ["toldalékolás", "rövidítés"],
    explanation: "A rövidítésekhez a toldalékot kötőjellel kapcsoljuk, és a kiejtés szerinti alakot írjuk: cm-rel.",
    learn: {
      title: "A kiejtés segít",
      body: "A cm rövidítést centiméternek ejtjük, ezért a -val/-vel toldalék hasonult alakja -rel lesz.",
      rule: "Rövidítés + toldalék: kötőjel, a toldalék alakját pedig a kiejtés határozza meg."
    }
  },
  {
    id: 11,
    source: "2026. január • pótfelvételi • 4. feladat • e)",
    first: "fojt",
    second: "folyt",
    correct: "both",
    tags: ["j–ly", "jelentés"],
    explanation: "Mindkettő helyes, de mást jelent: fojt = fullaszt, folyt = folyik vagy folytat.",
    learn: {
      title: "Azonos hangzás, eltérő jelentés",
      body: "A fojt jelentése: fullaszt. A folyt a folyik vagy a folytat igéhez kapcsolódik.",
      rule: "A jelentés alapján dönthető el, melyik alak illik a mondatba."
    }
  },
  {
    id: 12,
    source: "2026. január • pótfelvételi • 4. feladat • f)",
    first: "dél-európai",
    second: "Dél-európai",
    correct: ["first", "both"],
    tags: ["kis- és nagybetű", "földrajzi név"],
    explanation: "Mondat közben a dél-európai alak helyes; mondatkezdő helyzetben a Dél-európai is elfogadható.",
    learn: {
      title: "A mondat helye is számít",
      body: "Mondat közben kis kezdőbetűs a dél-európai alak. Mondat elején természetesen nagy kezdőbetűvel indulhat.",
      rule: "A feladat mondatkezdő helyzetben a nagybetűs alakot is elfogadja."
    }
  }
];
