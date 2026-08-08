# Felvételi tréner

Interaktív, SCORM-kompatibilis tanulóalkalmazás magyar középiskolai felvételi feladatok feldolgozásához.

## Jelenlegi állapot

A stabil, Moodle-ban használható első modul:

**Helyesírás gyakorlás 2026**

Fő funkciók:

- 12 eredeti 2026. januári helyesírási feladat;
- folyamatos haladás- és pontkijelzés;
- eredmény és feladatonkénti áttekintés;
- részletes tanulókártyák és vizuális magyarázatok;
- 9 témás, 45 feladatos saját gyakorlóbank;
- személyre szabott gyakorlási útvonal;
- aranytallér-jutalmazás;
- SCORM 1.2 integráció;
- félbehagyott próbálkozás részpontszámának mentése;
- lezárt Moodle-próbálkozás pontszámának védelme.

## Többéves modulrendszer

A projektet nem külön repókra bontjuk. Egy közös motor szolgálja ki az évenként külön Moodle/SCORM tevékenységként megjelenő helyesírási modulokat.

```text
modules/
├── 2026/   # stabil modul metaadatai
└── 2025/   # következő fejlesztés alatt álló modul
```

A repó gyökere jelenleg szándékosan a működő 2026-os SCORM-build fájljait tartalmazza. Ezeket addig nem mozgatjuk el, amíg a moduláris buildfolyamatból ugyanaz a csomag ellenőrzötten elő nem állítható.

A részletes architektúra: `docs/architecture.md`.

## Következő modul – 2025

A 2025. januári feladatok forrása a korábban feldolgozásra átadott `helyesírás korábbi évek.pdf` 3. oldala. A következő lépés a feladatok, javítókulcsok és témacímkék pontos feldolgozása, majd a `modules/2025/tasks.js` elkészítése.

## Futtatás

A jelenlegi 2026-os változat nem igényel telepítést vagy webszervert. Az `index.html` közvetlenül megnyitható böngészőben, illetve a gyökérfájlok SCORM 1.2 ZIP-ként csomagolhatók.

## Forrás és felhasználás

Az eredeti diagnosztikai feladatok a központi írásbeli felvételi feladatsoraiból származnak. A magyarázatok, vizuális tanulási elemek és a kiegészítő gyakorlóbank saját fejlesztésű oktatási tartalmak. A projekt jelenleg zárt Moodle-környezetben történő oktatási használatra készül.
