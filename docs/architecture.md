# Felvételi tréner – moduláris szerkezet

## Alapelv

A repó egyetlen közös helyesírási tanulómotort tartalmaz, amelyből több, egymástól független Moodle/SCORM modul készülhet.

A Moodle-ban az egyes évek külön SCORM-tevékenységek maradnak, hogy külön próbálkozás- és pontszámelőzményük legyen. A fejlesztés viszont közös repóban történik, így a felületet, a gyakorlóbankot, a jutalmazást és a SCORM-kezelést nem kell évenként lemásolni és külön karbantartani.

## Jelenlegi stabil build

A repó gyökerében lévő fájlok jelenleg a működő **Helyesírás gyakorlás 2026** SCORM-build forrásai és futtatási fájljai:

- `index.html`
- `app.js`
- `tasks.js`
- `practice.js`
- `rewards.js`
- `scorm.js`
- `styles.css`
- `practice.css`
- `learning.css`
- `imsmanifest.xml`
- `magyarazat01.png` … `magyarazat06.png`

Ezeket addig nem mozgatjuk el, amíg az új modulrendszerből ugyanaz a csomag ellenőrzötten elő nem állítható. Így a Moodle-ban már kipróbált 2026-os változat végig biztonságban marad.

## Modulok

Az évhez kötött adatok a `modules/` könyvtárban kapnak helyet.

```text
modules/
├── 2026/
│   └── module.json
└── 2025/
    ├── module.json
    └── tasks.js       # a következő fejlesztési lépésben
```

A `module.json` a modul azonosítóit, címét, maximális pontszámát, forrását és buildbeállításait tartalmazza.

### 2026

A 2026-os modul `stable` állapotú. A feladatai egyelőre a gyökér `tasks.js` fájljában maradnak, mert ez a jelenleg Moodle-ban tesztelt változat.

### 2025

A 2025-ös modul `draft` állapotú. A forrás a korábban feltöltött `helyesírás korábbi évek.pdf` 3. oldala. Először a feladatokat és a javítókulcsot dolgozzuk fel, utána készül el a `modules/2025/tasks.js`.

## Közös elemek

Az alábbi funkciók minden év moduljában közösek maradnak:

- kártyás felület és navigáció;
- pontozás és haladás;
- feladatonkénti áttekintés;
- magyarázókártyák;
- témacímkék és személyre szabott gyakorlás;
- közös gyakorlóbank;
- aranytallér-rendszer;
- SCORM 1.2 kommunikáció;
- félbehagyott próbálkozás részpontszámának mentése;
- lezárt Moodle-próbálkozás pontszámának zárolása.

## Moodle-struktúra

Javasolt megjelenés:

```text
Felvételi feladatok témák szerint
├── Helyesírás gyakorlás 2026   [külön SCORM]
├── Helyesírás gyakorlás 2025   [külön SCORM]
├── Helyesírás gyakorlás 2024   [később]
└── ...
```

Ez azért fontos, mert az egyes évek eredményei és próbálkozásai így nem írják felül egymást a Moodle-ban.

## Fejlesztési sorrend

1. A 2026-os gyökérbuild változatlanul működőképes marad.
2. A 2025-ös PDF feladatainak pedagógiai feldolgozása.
3. A 2025-ös modul adatfájljának elkészítése.
4. Az új feladattípusokhoz szükséges motorbővítés.
5. A közös gyakorlóbank bővítése az új témákkal.
6. Külön 2025-ös SCORM-build és Moodle-teszt.
7. Csak ezután érdemes a gyökérben maradt 2026-os adatfájlt is véglegesen a modul könyvtárába költöztetni.

## Munkamegosztás

- **Pedagógiai kontroll:** feladatok, megoldások, magyarázatok, példák, témabesorolás ellenőrzése.
- **Technikai megvalósítás:** repószerkezet, JavaScript/CSS, adatmodell, SCORM, build és Moodle-kompatibilitás.

A cél, hogy az új évek hozzáadása már ne új alkalmazás fejlesztését jelentse, hanem új moduladatok és szükség esetén új feladattípusok hozzáadását.
