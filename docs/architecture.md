# Felvételi tréner – architektúra

## Cél

A projekt két, egymást kiegészítő felhasználási módot támogat:

1. **GitHub / GitHub Pages:** a teljes Felvételi tréner egy helyen, Moodle-tól függetlenül.
2. **Moodle / SCORM 1.2:** témakörönként és évenként külön, kis tanulási egységek.

A GitHub tehát az elsődleges forrás és hosszú távú gyűjtemény; a SCORM ennek célzott, csomagolt kiadása.

## Navigációs hierarchia

```text
Felvételi tréner
│
├── Helyesírás
│   ├── 2026
│   ├── 2025
│   ├── 2024
│   ├── 2023
│   ├── 2022
│   └── Gyakorlóbank
│
└── Szólások és közmondások
    ├── évenkénti felvételi modulok
    └── Gyakorlóbank
```

A későbbi témakörök ugyanezen a szinten vehetők fel.

## Könyvtárstratégia

Az új témakörök kanonikus helye:

```text
categories/
├── helyesiras/
│   └── category.json
└── szolasok/
    └── category.json
```

A már működő helyesírási évmodulok fájljait egyelőre nem mozgatjuk el. Ennek oka a meglévő SCORM-csomagok és manifestek útvonal-kompatibilitása.

A következő fejlesztési szakaszban az új tartalmak már témakör-névtérben készülnek, és a SCORM-build csak a szükséges fájlokat gyűjti össze egy ideiglenes staging könyvtárba.

## URL-logika

A webes változat új címei:

```text
?category=helyesiras
?category=helyesiras&module=2022
?category=szolasok
```

A régi URL-ek kompatibilitási okból tovább élnek:

```text
?module=2022
?module=practice
```

Ezek automatikusan a Helyesírás kategóriát jelentik.

## Közös motor

Közösen használható elemek:

- alapfelület és navigáció;
- pontozás és haladás;
- SCORM 1.2 kommunikáció;
- folytatható próbálkozás;
- próbálkozászárolás;
- Aranytallér Protocol 1.0;
- gyakorlófeladat-motor;
- közös vizuális komponensek.

A témakör-specifikus elemek elsősorban:

- feladatadatok;
- feladattípusok;
- magyarázatok;
- gyakorlóbank-témák;
- évmodulok.

## Moodle-struktúra

A Moodle-ban minden év külön SCORM marad:

```text
Felvételi tréner
├── Helyesírás
│   ├── 2022 [SCORM]
│   ├── 2023 [SCORM]
│   └── ...
└── Szólások és közmondások
    ├── 2022 [SCORM]
    ├── 2023 [SCORM]
    └── ...
```

Ez biztosítja, hogy az egyes modulok eredményei, próbálkozásai és folytatható állapotai ne írják felül egymást.

## SCORM-build elv

A repó teljes tartalmát nem tesszük bele minden ZIP-be. Egy adott SCORM csak az adott modulhoz szükséges állományokat tartalmazza, az `imsmanifest.xml` pedig mindig a ZIP gyökerében van.

Példa:

```text
Helyesiras_gyakorlas_2022_SCORM12.zip
├── imsmanifest.xml
├── index.html
├── ...
└── modules/
    └── 2022/
        └── tasks.js
```

A jövőbeli Szólások és közmondások SCORM-ok ugyanezt az elvet követik saját forrásazonosítóval és saját feladatállománnyal.

## Következő fejlesztési lépés

A következő új tartalom már a `Szólások és közmondások` kategóriában készül. Az első év feldolgozásakor meghatározzuk a szükséges közös feladattípusokat, például:

- jelentés kiválasztása;
- hiányzó elem pótlása;
- párosítás;
- szólás vagy közmondás felismerése;
- helyzethez illő kifejezés kiválasztása;
- hibás alak javítása.
