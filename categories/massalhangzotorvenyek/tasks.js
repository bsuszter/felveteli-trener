window.MASSALHANGZO_TASKS = {
  laws: [
    { id: "zongesseg", title: "Zöngésség szerinti részleges hasonulás" },
    { id: "kepzes-helye", title: "Képzés helye szerinti részleges hasonulás" },
    { id: "teljes-jelolt", title: "Írásban jelölt teljes hasonulás" },
    { id: "teljes-jeloletlen", title: "Írásban jelöletlen teljes hasonulás" },
    { id: "osszeolvadas", title: "Összeolvadás" },
    { id: "rovidules", title: "Rövidülés" }
  ],

  questions: [
    {
      id: "2026-neveztek",
      block: "2025/2026-1",
      source: "2025/2026",
      law: "zongesseg",
      type: "choice",
      prompt: "Melyik szóban van zöngésség szerinti részleges hasonulás?",
      context: "Apám, akit Gergelynek neveztek, még élt abban az időben.",
      options: ["Apám", "Gergelynek", "neveztek", "időben"],
      answers: ["neveztek"]
    },
    {
      id: "2026-hallgat",
      block: "2025/2026-2",
      source: "2025/2026",
      law: "rovidules",
      type: "choice",
      prompt: "Melyik szóban érvényesül ugyanaz a mássalhangzótörvény, mint a HALLGAT szóban?",
      options: ["mossa", "küldte", "lombban"],
      answers: ["lombban"]
    },

    {
      id: "2025-angyal",
      block: "2024/2025-1",
      source: "2024/2025",
      law: "kepzes-helye",
      type: "choice",
      prompt: "Melyik szóban érvényesül ugyanaz a mássalhangzótörvény, mint az ANGYAL szóban?",
      options: ["meggyel", "hagyja", "azonban"],
      answers: ["azonban"]
    },
    {
      id: "2025-haragudjanak",
      block: "2024/2025-2",
      source: "2024/2025",
      law: "osszeolvadas",
      type: "choice",
      prompt: "Melyik szóban található összeolvadás?",
      context: "Kérem a gyerekeket, ne haragudjanak, amiért ezt a könyvet egy fölnőttnek ajánlom.",
      options: ["gyerekeket", "haragudjanak", "könyvet", "ajánlom"],
      answers: ["haragudjanak"]
    },
    {
      id: "2025-folnottnek",
      block: "2024/2025-2",
      source: "2024/2025",
      law: "rovidules",
      type: "choice",
      prompt: "Melyik szóban található rövidülés?",
      context: "Kérem a gyerekeket, ne haragudjanak, amiért ezt a könyvet egy fölnőttnek ajánlom.",
      options: ["kérem", "amiért", "fölnőttnek", "ajánlom"],
      answers: ["fölnőttnek"]
    },
    {
      id: "2025-ezt",
      block: "2024/2025-2",
      source: "2024/2025",
      law: "zongesseg",
      type: "choice",
      prompt: "Melyik szóban található zöngésség szerinti részleges hasonulás?",
      context: "Kérem a gyerekeket, ne haragudjanak, amiért ezt a könyvet egy fölnőttnek ajánlom.",
      options: ["ezt", "könyvet", "kérem", "ajánlom"],
      answers: ["ezt"]
    },

    {
      id: "2024-abba",
      block: "2023/2024-1",
      source: "2023/2024",
      law: "teljes-jelolt",
      type: "choice",
      prompt: "Melyik szóban van írásban jelölt teljes hasonulás?",
      context: "Már tátotta a száját, már mondta volna... de ekkor... furcsa... megdöndült, megzördült, megdobbant valami. S nem is hagyta abba.",
      options: ["abba", "ekkor", "furcsa", "mondta"],
      answers: ["abba", "ekkor"]
    },
    {
      id: "2024-hagyta",
      block: "2023/2024-1",
      source: "2023/2024",
      law: "zongesseg",
      type: "choice",
      prompt: "Melyik szóban van zöngésség szerinti részleges hasonulás?",
      context: "Kora reggel elment a városba. Ott volt valami sürgős elintéznivalója. Meg különben is, ad is valamit Vacskamati Mikkamakkára! S nem is hagyta abba.",
      options: ["hagyta", "városba", "otthon", "reggel"],
      answers: ["hagyta", "városba"]
    },
    {
      id: "2024-kulonben",
      block: "2023/2024-1",
      source: "2023/2024",
      law: "kepzes-helye",
      type: "choice",
      prompt: "Melyik szóban van képzés helye szerinti részleges hasonulás?",
      options: ["különben", "városba", "otthon", "ekkor"],
      answers: ["különben"]
    },
    {
      id: "2024-otthon",
      block: "2023/2024-1",
      source: "2023/2024",
      law: "rovidules",
      type: "choice",
      prompt: "Melyik szóban van rövidülés?",
      options: ["otthon", "különben", "hagyta", "városba"],
      answers: ["otthon"]
    },
    {
      id: "2024-tuzzel",
      block: "2023/2024-2",
      source: "2023/2024",
      law: "teljes-jelolt",
      type: "choice",
      prompt: "Ugyanolyan mássalhangzó-hasonulást tartalmaz, mint a SZÍNESSEL szó. Melyik ez?",
      options: ["frissen", "szível", "tűzzel"],
      answers: ["tűzzel"]
    },

    {
      id: "2023-kakukk",
      block: "2022/2023-1",
      source: "2022/2023",
      law: "mixed",
      type: "choice",
      prompt: "Melyik a kakukktojás, ha azt vizsgálod, hogy hasonulás történik-e?",
      options: ["biztos", "könyvtár", "dobtuk", "osztja", "fogta"],
      answers: ["osztja"],
      explanation: "Az osztja szóban összeolvadás történik."
    },

    {
      id: "2022-jatszani",
      block: "2021/2022-1",
      source: "2021/2022",
      law: "osszeolvadas",
      type: "choice",
      prompt: "Melyik verscímben találsz összeolvadást?",
      options: ["Vér és arany", "Családi kör", "Két nyárfa", "Akarsz-e játszani?", "Anna örök", "Anyám tyúkja"],
      answers: ["Akarsz-e játszani?"]
    },
    {
      id: "2022-rosszal",
      block: "2021/2022-2",
      source: "2021/2022",
      law: "teljes-jelolt",
      type: "choice",
      prompt: "Melyik szóban található írásban jelölt teljes hasonulás?",
      options: ["szálunk", "rosszal", "tanult", "nézet", "karóra", "írtatok", "értek", "gally"],
      answers: ["rosszal"]
    },
    {
      id: "2022-osszeolvadas",
      block: "2021/2022-3",
      source: "2021/2022",
      law: "osszeolvadas",
      type: "choice",
      prompt: "Melyik kiegészített szóban található összeolvadás?",
      options: ["pótoljuk", "siratjuk", "játssz"],
      answers: ["siratjuk", "játssz"]
    },
    {
      id: "2022-potoljuk",
      block: "2021/2022-3",
      source: "2021/2022",
      law: "teljes-jeloletlen",
      type: "choice",
      prompt: "Melyik kiegészített szóban található írásban jelöletlen teljes hasonulás?",
      options: ["pótoljuk", "siratjuk", "játssz"],
      answers: ["pótoljuk"]
    },

    {
      id: "2020-reszleges-1",
      block: "2019/2020-1",
      source: "2019/2020",
      law: "zongesseg",
      type: "choice",
      prompt: "Melyik szó ad példát részleges hasonulásra?",
      context: "„Asztán el ne fogaggyál semmit István bácsitúl...”",
      options: ["asztán", "fogaggyál", "hasznájj", "hazulról"],
      answers: ["asztán"],
      explanation: "A forrásmegoldás az asztán / aztán alakot fogadja el."
    },
    {
      id: "2020-teljes-1",
      block: "2019/2020-1",
      source: "2019/2020",
      law: "teljes-jeloletlen",
      type: "choice",
      prompt: "Melyik szó ad példát teljes hasonulásra?",
      context: "„Asztán el ne fogaggyál semmit István bácsitúl... ne hasznájj az övébül!”",
      options: ["asztán", "fogaggyál", "hasznájj", "semmit"],
      answers: ["hasznájj"]
    },
    {
      id: "2020-osszeolvadas-1",
      block: "2019/2020-1",
      source: "2019/2020",
      law: "osszeolvadas",
      type: "choice",
      prompt: "Melyik szó ad példát összeolvadásra?",
      context: "„Asztán el ne fogaggyál semmit István bácsitúl...”",
      options: ["asztán", "fogaggyál", "hasznájj", "semmit"],
      answers: ["fogaggyál"]
    },
    {
      id: "2020-reszleges-2",
      block: "2019/2020-2",
      source: "2019/2020",
      law: "zongesseg",
      type: "choice",
      prompt: "Melyik szó ad példát részleges hasonulásra?",
      context: "„Mámmeg minek ált meg? ... oszt ojan lett, mintha ráfoktak vóna egy puskát.”",
      options: ["ráfoktak", "fordíttya", "ált", "ojan"],
      answers: ["ráfoktak"]
    },
    {
      id: "2020-osszeolvadas-2",
      block: "2019/2020-2",
      source: "2019/2020",
      law: "osszeolvadas",
      type: "choice",
      prompt: "Melyik szó ad példát összeolvadásra?",
      context: "„Mámmeg minek ált meg? Beleskel azon a nyitott ajtón, fordíttya vissza a képit...”",
      options: ["ráfoktak", "fordíttya", "ált", "ojan"],
      answers: ["fordíttya"]
    },
    {
      id: "2020-rovidules-2",
      block: "2019/2020-2",
      source: "2019/2020",
      law: "rovidules",
      type: "choice",
      prompt: "Melyik szó ad példát rövidülésre?",
      context: "„Mámmeg minek ált meg? ...”",
      options: ["ráfoktak", "fordíttya", "ált", "ojan"],
      answers: ["ált"]
    },

    {
      id: "2014-szalljon",
      block: "2013/2014-1",
      source: "2013/2014",
      law: "teljes-jeloletlen",
      type: "choice",
      prompt: "Milyen mássalhangzótörvény van a SZÁLLJON szóban?",
      options: ["írásban jelölt teljes hasonulás", "összeolvadás", "zöngésség szerinti részleges hasonulás", "írásban jelöletlen teljes hasonulás"],
      answers: ["írásban jelöletlen teljes hasonulás"]
    },
    {
      id: "2014-vagtok",
      block: "2013/2014-2",
      source: "2013/2014",
      law: "zongesseg",
      type: "choice",
      prompt: "Milyen mássalhangzótörvény van a VÁGTOK szóban?",
      options: ["írásban jelöletlen teljes hasonulás", "képzés helye szerinti részleges hasonulás", "zöngésség szerinti részleges hasonulás", "összeolvadás"],
      answers: ["zöngésség szerinti részleges hasonulás"]
    },

    {
      id: "2013-fonj",
      block: "2012/2013-1",
      source: "2012/2013",
      law: "osszeolvadas",
      type: "choice",
      prompt: "A vers melyik szavában található összeolvadás?",
      context: "sírj • hogy • könnyed • duzzadó árja • lelked bánatát el sodorja • sok kicsi cseppje hulljon • fénylő nyakéket fonj belőle",
      options: ["sírj", "könnyed", "sodorja", "fonj"],
      answers: ["fonj"]
    }
  ]
};
