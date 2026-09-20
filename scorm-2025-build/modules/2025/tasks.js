const MODULE_2025_TASKS = [
  {
    id: "2025-toto-a",
    group: "toto",
    type: "choice-pair",
    source: "2025. január • helyesírási totó • a)",
    first: "follyon",
    second: "folyjon",
    correct: "second",
    points: 1,
    tags: ["felszólító mód", "j", "igealak"],
    explanation: "A folyik ige felszólító módú alakja: folyjon."
  },
  {
    id: "2025-toto-b",
    group: "toto",
    type: "choice-pair",
    source: "2025. január • helyesírási totó • b)",
    first: "gomblyuk",
    second: "gombjuk",
    correct: "both",
    points: 1,
    tags: ["j és ly", "jelentés"],
    explanation: "Mindkettő helyes, de mást jelent: a gomblyuk a gomb számára készített nyílás, a gombjuk pedig azt jelenti, hogy az ő gombjuk."
  },
  {
    id: "2025-toto-c",
    group: "toto",
    type: "choice-pair",
    source: "2025. január • helyesírási totó • c)",
    first: "Lánc-híd (híd Budapesten)",
    second: "Lánc híd (híd Budapesten)",
    correct: "neither",
    points: 1,
    tags: ["tulajdonnév", "egybe- és különírás", "földrajzi név"],
    explanation: "A budapesti híd neve egybeírandó: Lánchíd, ezért a két megadott alak közül egyik sem helyes."
  },
  {
    id: "2025-toto-d",
    group: "toto",
    type: "choice-pair",
    source: "2025. január • helyesírási totó • d)",
    first: "dicsér",
    second: "dícsér",
    correct: "first",
    points: 1,
    tags: ["magánhangzó-hosszúság"],
    explanation: "A dicsér szó első magánhangzója rövid i: dicsér."
  },
  {
    id: "2025-toto-e",
    group: "toto",
    type: "choice-pair",
    source: "2025. január • helyesírási totó • e)",
    first: "Fizikai Szemle (újságcím)",
    second: "Fizikai szemle (újságcím)",
    correct: "first",
    points: 1,
    tags: ["kis- és nagybetű", "cím", "tulajdonnév"],
    explanation: "Az újságcím minden lényeges szavát nagy kezdőbetűvel írjuk: Fizikai Szemle."
  },
  {
    id: "2025-toto-f",
    group: "toto",
    type: "choice-pair",
    source: "2025. január • helyesírási totó • f)",
    first: "bőrpénztárca",
    second: "bőr pénztárca",
    correct: "second",
    points: 1,
    tags: ["egybe- és különírás", "anyagjelölő jelző"],
    explanation: "A pénztárca összetett szó, ezért az anyagát jelölő bőr szót különírjuk tőle: bőr pénztárca."
  },

  {
    id: "2025-fill-a",
    group: "letter-fill",
    type: "fill",
    source: "2025. január • betűpótlás • a)",
    before: "Lassan a tes",
    after: "el!",
    answer: "tt",
    completed: "Lassan a testtel!",
    points: 1,
    tags: ["toldalékolás", "mássalhangzó-kettőzés"],
    explanation: "A test szóhoz a -val/-vel rag hasonult alakja kapcsolódik: test + tel → testtel."
  },
  {
    id: "2025-fill-b",
    group: "letter-fill",
    type: "fill",
    source: "2025. január • betűpótlás • b)",
    before: "El",
    after: "l tűz, hátul víz.",
    answer: "ö",
    completed: "Elöl tűz, hátul víz.",
    points: 1,
    tags: ["magánhangzó", "jelentés"],
    explanation: "A szólásban az elöl szó áll szemben a hátul szóval: Elöl tűz, hátul víz."
  },
  {
    id: "2025-fill-c",
    group: "letter-fill",
    type: "fill",
    source: "2025. január • betűpótlás • c)",
    before: "Az egyik tizenkilenc, a másik egy hí",
    after: "án húsz.",
    answer: "j",
    completed: "Az egyik tizenkilenc, a másik egy híján húsz.",
    points: 1,
    tags: ["j és ly", "szólás"],
    explanation: "A híján szó j-vel írandó."
  },
  {
    id: "2025-fill-d",
    group: "letter-fill",
    type: "fill",
    source: "2025. január • betűpótlás • d)",
    before: "Az ",
    after: "géret szép szó, ha megtartják, úgy jó.",
    answer: "í",
    completed: "Az ígéret szép szó, ha megtartják, úgy jó.",
    points: 1,
    tags: ["magánhangzó-hosszúság"],
    explanation: "Az ígéret szó hosszú í-vel kezdődik."
  },
  {
    id: "2025-fill-e",
    group: "letter-fill",
    type: "fill",
    source: "2025. január • betűpótlás • e)",
    before: "Szü",
    after: "ség törvényt bont.",
    answer: "k",
    completed: "Szükség törvényt bont.",
    points: 1,
    tags: ["szóalak", "mássalhangzó"],
    explanation: "A szükség szóban k áll a szü és a ség rész között: szükség."
  },
  {
    id: "2025-fill-f",
    group: "letter-fill",
    type: "fill",
    source: "2025. január • betűpótlás • f)",
    before: "Ját",
    after: "a az eszét.",
    answer: "ssz",
    completed: "Játssza az eszét.",
    points: 1,
    tags: ["igealak", "mássalhangzó-kettőzés"],
    explanation: "A hivatalos megoldókulcs szerinti helyes alak: Játssza az eszét."
  }
];

const MODULE_2025_GROUPS = [
  {
    id: "toto",
    title: "Helyesírási totó",
    instruction: "Írd a megfelelő jelet a szavak után!",
    scoring: { first: "1", second: "2", both: "X", neither: "0" }
  },
  {
    id: "letter-fill",
    title: "Betűpótlás szólásokban és közmondásokban",
    instruction: "Pótold a hiányzó betűt vagy betűket! Ügyelj a helyesírásra!"
  }
];
