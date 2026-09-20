# Felvételi tréner

Interaktív, SCORM-kompatibilis tanulóalkalmazás magyar középiskolai felvételi feladatok feldolgozásához.

## Alapkoncepció

A GitHub-repó a teljes, Moodle-tól független **Felvételi tréner** forrása és webes változata. A Moodle-ban ezzel szemben a tananyag kisebb, önálló SCORM 1.2 egységekre bontva jelenik meg.

A webes felület témakörökből indul:

```text
Felvételi tréner
├── Helyesírás
│   ├── 2026
│   ├── 2025
│   ├── 2024
│   ├── 2023
│   ├── 2022
│   └── Gyakorlóbank
└── Szólások és közmondások
    ├── évenkénti modulok
    └── Gyakorlóbank
```

A Helyesírás jelenleg működő kategória. A Szólások és közmondások kategória szerkezeti helye elkészült, tartalma fokozatosan kerül bele.

## Moodle-logika

A Moodle-ban nem egyetlen nagy SCORM készül. Minden témakör és év külön csomag:

```text
Helyesírás – 2022
Helyesírás – 2023
...
Szólások és közmondások – 2022
Szólások és közmondások – 2023
...
```

Így minden egységnek saját próbálkozása, pontszáma és folytatható állapota lehet.

## Kompatibilitás

A korábbi közvetlen linkek továbbra is működnek, például:

```text
?module=2022
```

Az új webes navigáció ugyanennek a teljesebb alakját használja:

```text
?category=helyesiras&module=2022
```

## Könyvtárszerkezet

A már működő helyesírási SCORM-források egyelőre kompatibilitási okból a jelenlegi helyükön maradnak. Az új témakörök a `categories/` könyvtárban kapnak saját névteret.

A részletes architektúra: `docs/architecture.md`.

## Futtatás

A GitHub Pages változat:

```text
https://bsuszter.github.io/felveteli-trener/
```

A böngészős változat SCORM API nélkül is használható tesztelésre. A Moodle-specifikus mentést, próbálkozászárolást és pontozást mindig a tényleges SCORM-csomagban kell ellenőrizni.
