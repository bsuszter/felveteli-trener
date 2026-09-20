window.FELVETELI_CATEGORIES = {
  helyesiras: {
    id: "helyesiras",
    title: "Helyesírás",
    icon: "Á",
    description: "Felvételi feladatok évek szerint, célzott magyarázatokkal és gyakorlóbankkal.",
    status: "stable",
    routeType: "helyesiras"
  },
  szolasok: {
    id: "szolasok",
    title: "Szólások és közmondások",
    icon: "„”",
    description: "Jelentés, kiegészítés, felismerés és alkalmazás felvételi feladatokból.",
    status: "active",
    routeType: "generic",
    modules: {
      "2026": {
        year: 2026,
        maxScore: 8,
        title: "Szólások és közmondások 2026",
        subtitle: "2 feladatblokk • 9 döntés • 8 pont",
        scripts: ["scorm.js", "categories/szolasok/2026/tasks.js", "categories/szolasok/app.js"]
      }
    }
  }
};
