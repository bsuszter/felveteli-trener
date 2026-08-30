const MODULE_2023_TASKS = [
  {
    id: "2023-lotto-1",
    type: "lotto",
    source: "2023. január • lottó 1",
    instruction: "Találd meg a 15 szó közül az 5 hibásan írt szót! Jelöld ki őket!",
    words: [
      "fürj", "szakáll", "oxigén", "Széchenyi", "lessz",
      "hagyja", "ujjabb", "nyilik", "tavaly", "higyjél",
      "muszáj", "segítsd", "folyjon", "játszuk", "Déli pályaudvar"
    ],
    wrong: [5, 7, 8, 10, 14],
    corrections: {
      5: { correct: "lesz", topic: "mássalhangzók és toldalékolás", explanation: "A lesz alakban csak egy sz-t írunk." },
      7: { correct: "újabb", topic: "mássalhangzók és toldalékolás", explanation: "Az új középfokú alakja: újabb; nem kettőzzük a j-t." },
      8: { correct: "nyílik", topic: "magánhangzó-hosszúság", explanation: "A nyílik szó első magánhangzója hosszú í." },
      10: { correct: "higgyél", topic: "felszólító mód", explanation: "A hisz ige felszólító módú alakja: higgyél." },
      14: { correct: "játsszuk", topic: "mássalhangzók és toldalékolás", explanation: "A játszik megfelelő ragozott alakja: játsszuk." }
    }
  },
  {
    id: "2023-lotto-2",
    type: "lotto",
    source: "2023. január • lottó 2",
    instruction: "Találd meg a 15 szó közül az 5 hibásan írt szót! Jelöld ki őket!",
    words: [
      "papagály", "játsszuk", "hírlap", "Kazinczy", "tanú",
      "sejt", "kúltúra", "Hárs-hegy", "szallag", "vízilabda",
      "kissebb", "gyűrű", "kilogramm", "együtt", "Kosuth"
    ],
    wrong: [1, 7, 9, 11, 15],
    corrections: {
      1: { correct: "papagáj", topic: "j és ly", explanation: "A papagáj szó végén j-t írunk." },
      7: { correct: "kultúra", topic: "magánhangzó-hosszúság", explanation: "A kultúra első magánhangzója rövid u." },
      9: { correct: "szalag", topic: "mássalhangzók és toldalékolás", explanation: "A szalag szóban egy l-t írunk." },
      11: { correct: "kisebb", topic: "mássalhangzók és toldalékolás", explanation: "A kis középfokú alakja: kisebb; egy s-sel írjuk." },
      15: { correct: "Kossuth", topic: "tulajdonnevek", explanation: "A családnév helyes alakja: Kossuth." }
    }
  }
];
