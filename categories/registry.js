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
        maxScore: 14,
        title: "Szólások és közmondások 2026",
        subtitle: "3 feladatblokk • 15 döntés • 14 pont",
        scripts: ["scorm.js", "categories/szolasok/2026/tasks.js", "categories/szolasok/app.js"]
      }
    }
  },
  massalhangzotorvenyek: {
    id: "massalhangzotorvenyek",
    title: "Mássalhangzótörvények",
    icon: "MG",
    description: "Felismerés, összehasonlítás és szövegbeli példakeresés korábbi felvételi feladatokból.",
    status: "active",
    routeType: "direct",
    scripts: ["categories/massalhangzotorvenyek/tasks.js", "categories/massalhangzotorvenyek/app.js"]
  }
};
