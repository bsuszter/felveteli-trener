# 2025. januári helyesírás – feldolgozás

Forrás: `helyesírás korábbi évek.pdf`, 3. oldal.

## 1. Helyesírási totó

A forrásban szereplő megoldókulcs:

1. follyon / **folyjon** → 2
2. **gomblyuk** / **gombjuk** → X
3. Lánc-híd / Lánc híd → 0; helyes alak: **Lánchíd**
4. **dicsér** / dícsér → 1
5. **Fizikai Szemle** / Fizikai szemle → 1
6. bőrpénztárca / **bőr pénztárca** → 2

### Témakapcsolatok

- folyjon → felszólító mód, igealak
- gomblyuk / gombjuk → j és ly, jelentés
- Lánchíd → tulajdonnév, földrajzi név, egybeírás
- dicsér → magánhangzó-hosszúság
- Fizikai Szemle → címek, kis- és nagybetű
- bőr pénztárca → anyagjelölő jelző, egybe- és különírás

## 2. Betűpótlás szólásokban és közmondásokban

A PDF ezen részén nem látható külön megoldókulcs, ezért az alábbi kiegészítések a feladat szövegéből rekonstruált helyes alakok. Beépítés előtt pedagógiai ellenőrzésre kerülnek.

1. Lassan a tes…el! → **Lassan a testtel!** → hiányzó rész: `tt`
2. El…l tűz, hátul víz. → **Elöl tűz, hátul víz.** → hiányzó rész: `ö`
3. Az egyik tizenkilenc, a másik egy hí…án húsz. → **Az egyik tizenkilenc, a másik egy híján húsz.** → hiányzó rész: `j`
4. Az …géret szép szó, ha megtartják, úgy jó. → **Az ígéret szép szó, ha megtartják, úgy jó.** → hiányzó rész: `í`
5. Szü…ség törvényt bont. → **Szükség törvényt bont.** → hiányzó rész: `k`
6. Ját…a az eszét. → **Játssza az eszét.** → hiányzó rész: `ssz`

### Forrásbeli megjegyzés

A feladat utasítása szerint „a hiányzó egy vagy két betűt” kell pótolni. Az f) tételben a látható `Ját…a` alakból a **játssza** szóhoz `ssz`, azaz három betű pótlása szükséges. Ezt a forrás és a rekonstruált helyes alak közötti eltérésként kezeljük; nem módosítjuk észrevétlenül a forrás megfogalmazását.

## Technikai terv

- A totó a már működő `choice-pair` interakciót használja.
- A betűpótlás új, közös `fill` interakciót kap.
- Mindkét feladattípus ugyanabból a központi `index.html`-ből indul majd.
- A 2025-ös és 2026-os Moodle-tevékenység továbbra is külön SCORM-build lesz, külön pontszámmal és próbálkozásokkal.
- A közös gyakorlóbank és az aranytallér-rendszer mindkét modulból elérhető lesz.
