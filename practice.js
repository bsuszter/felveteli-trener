const PRACTICE_TOPICS = {
  "felszólító mód": { title: "Felszólító mód", description: "A felszólító mód jele, a d-re végződő igék és a rendhagyó alakok." },
  "igekötők": { title: "Igekötők", description: "Egybeírás, különírás és közbeékelődés az igekötős igéknél." },
  "egybe- és különírás": { title: "Egybe- és különírás", description: "A jelentés és a mondatbeli szerep alapján eldönthető írásmódok." },
  "j és ly": { title: "J és ly", description: "Gyakori j–ly-os szavak helyes alakjának felismerése." },
  "magánhangzó-hosszúság": { title: "Hosszú és rövid magánhangzók", description: "A szó jelentését és helyes alakját meghatározó magánhangzó-hosszúság." },
  "tulajdonnevek": { title: "Tulajdonnevek", description: "Személynevek és családnevek pontos írásmódja." },
  "kis- és nagybetű": { title: "Kis- és nagybetű", description: "Történelmi események, ünnepek és földrajzi nevek írása." },
  "rövidítések": { title: "Rövidítések toldalékolása", description: "A rövidítésekhez kapcsolódó toldalékok és a kötőjel használata." },
  "jelentés": { title: "Azonos hangzás, eltérő jelentés", description: "A jelentés alapján kiválasztandó, hasonló hangzású szóalakok." }
};

const PRACTICE_TASKS = [
  { id: "felsz-1", topic: "felszólító mód", prompt: "Melyik mondat helyes?", options: ["Küld el a levelet!", "Küldd el a levelet!"], correct: 1, explanation: "A küld ige d-re végződik, ehhez kapcsolódik a felszólító mód -d jele: küldd." },
  { id: "felsz-2", topic: "felszólító mód", prompt: "Melyik mondat helyes?", options: ["Mondd meg az igazat!", "Mond meg az igazat!"], correct: 0, explanation: "A mond felszólító módú, határozott ragozású alakja: mondd." },
  { id: "felsz-3", topic: "felszólító mód", prompt: "Melyik mondat helyes?", options: ["Hagyj egy kis időt!", "Haggy egy kis időt!"], correct: 0, explanation: "A hagy igéhez a felszólító mód -j jele kapcsolódik: hagyj." },
  { id: "felsz-4", topic: "felszólító mód", prompt: "Melyik mondat helyes?", options: ["Higyj nekem!", "Higgy nekem!"], correct: 1, explanation: "A hisz ige rendhagyó felszólító módú alakja: higgy." },
  { id: "felsz-5", topic: "felszólító mód", prompt: "Melyik alak illik a mondatba? „___ le a neved!”", options: ["Ír", "Írd"], correct: 1, explanation: "Az ír igéhez a -d jel kapcsolódik: írd. Csak egy d-t írunk, mert az igető nem d-re végződik." },

  { id: "igekoto-1", topic: "igekötők", prompt: "Melyik mondat helyes?", options: ["Meg fogom nézni.", "Megfogom nézni."], correct: 0, explanation: "A fogom az igekötő és az ige közé ékelődik, ezért különírjuk." },
  { id: "igekoto-2", topic: "igekötők", prompt: "Melyik mondat helyes?", options: ["El szeretném olvasni.", "Elszeretném olvasni."], correct: 0, explanation: "A szeretném közbeékelődik, ezért az igekötőt különírjuk." },
  { id: "igekoto-3", topic: "igekötők", prompt: "Melyik mondat helyes?", options: ["Becsukja az ablakot.", "Be csukja az ablakot."], correct: 0, explanation: "Nincs közbeékelődés, ezért az igekötős igét egybeírjuk." },
  { id: "igekoto-4", topic: "igekötők", prompt: "Melyik mondat helyes?", options: ["Ki kell nyitni az ajtót.", "Kikell nyitni az ajtót."], correct: 0, explanation: "A kell az igekötő és az ige közé kerül, ezért különírjuk." },
  { id: "igekoto-5", topic: "igekötők", prompt: "Melyik mondat helyes?", options: ["Nem vitte el a könyvet.", "Nem elvitte a könyvet."], correct: 0, explanation: "Tagadáskor az igekötő gyakran az ige mögé kerül: nem vitte el." },

  { id: "egybe-1", topic: "egybe- és különírás", prompt: "Melyik alak jelöl két hétig tartó tábort?", options: ["kéthetes tábor", "két hetes tábor"], correct: 0, explanation: "Az időtartamot kifejező kéthetes melléknevet egybeírjuk." },
  { id: "egybe-2", topic: "egybe- és különírás", prompt: "Melyik mondat helyes, ha két hetes tanulóról van szó?", options: ["Kéthetes áll a kapuban.", "Két hetes áll a kapuban."], correct: 1, explanation: "Itt a hetes önálló főnév, a két pedig a darabszámát jelöli, ezért különírjuk." },
  { id: "egybe-3", topic: "egybe- és különírás", prompt: "Melyik alak helyes?", options: ["háromnapos kirándulás", "három napos kirándulás"], correct: 0, explanation: "Az időtartamot kifejező összetett melléknevet egybeírjuk: háromnapos." },
  { id: "egybe-4", topic: "egybe- és különírás", prompt: "Melyik alak helyes?", options: ["ötéves gyermek", "öt éves gyermek"], correct: 0, explanation: "Az életkort kifejező ötéves melléknevet egybeírjuk." },
  { id: "egybe-5", topic: "egybe- és különírás", prompt: "Melyik mondat helyes?", options: ["Két ötösöm lett.", "Kétötösöm lett."], correct: 0, explanation: "A két számnév, az ötös önálló főnév, ezért különírjuk." },

  { id: "jly-1", topic: "j és ly", prompt: "Melyik alak helyes?", options: ["muszáj", "muszály"], correct: 0, explanation: "A muszáj szó végén j-t írunk." },
  { id: "jly-2", topic: "j és ly", prompt: "Melyik alak helyes?", options: ["sajog", "salyog"], correct: 0, explanation: "A sajog szóban j-t írunk." },
  { id: "jly-3", topic: "j és ly", prompt: "Melyik alak helyes?", options: ["folyosó", "fojosó"], correct: 0, explanation: "A folyosó szóban ly-t írunk." },
  { id: "jly-4", topic: "j és ly", prompt: "Melyik alak helyes?", options: ["akadály", "akadaj"], correct: 0, explanation: "Az akadály szó végén ly áll." },
  { id: "jly-5", topic: "j és ly", prompt: "Melyik alak helyes?", options: ["bója", "bólya"], correct: 0, explanation: "A bója szóban j-t írunk." },

  { id: "mh-1", topic: "magánhangzó-hosszúság", prompt: "Melyik alak helyes?", options: ["ígér", "igér"], correct: 0, explanation: "Az ígér szó hosszú í-vel írandó." },
  { id: "mh-2", topic: "magánhangzó-hosszúság", prompt: "Melyik alak helyes?", options: ["kíván", "kiván"], correct: 0, explanation: "A kíván szó első szótagjában hosszú í van." },
  { id: "mh-3", topic: "magánhangzó-hosszúság", prompt: "Melyik alak helyes?", options: ["szívesen", "szivesen"], correct: 0, explanation: "A szívesen szóban hosszú í-t írunk." },
  { id: "mh-4", topic: "magánhangzó-hosszúság", prompt: "Melyik alak helyes?", options: ["dicsér", "dícsér"], correct: 0, explanation: "A dicsér szó első magánhangzója rövid i." },
  { id: "mh-5", topic: "magánhangzó-hosszúság", prompt: "Melyik alak helyes?", options: ["hirdet", "hírdet"], correct: 0, explanation: "A hirdet szóban rövid i-t írunk." },

  { id: "nev-1", topic: "tulajdonnevek", prompt: "Melyik családnév helyes?", options: ["Batthyány", "Batthyányi"], correct: 0, explanation: "A történelmi családnév helyes alakja: Batthyány." },
  { id: "nev-2", topic: "tulajdonnevek", prompt: "Melyik név helyes?", options: ["Széchenyi István", "Szécsényi István"], correct: 0, explanation: "A név helyes alakja: Széchenyi István." },
  { id: "nev-3", topic: "tulajdonnevek", prompt: "Melyik név helyes?", options: ["Kölcsey Ferenc", "Kölcsei Ferenc"], correct: 0, explanation: "A családnév hagyományos írásmódja: Kölcsey." },
  { id: "nev-4", topic: "tulajdonnevek", prompt: "Melyik név helyes?", options: ["Vörösmarty Mihály", "Vörösmarthy Mihály"], correct: 0, explanation: "A költő neve: Vörösmarty Mihály." },
  { id: "nev-5", topic: "tulajdonnevek", prompt: "Melyik név helyes?", options: ["Móricz Zsigmond", "Móritz Zsigmond"], correct: 0, explanation: "Az író családnevének helyes alakja: Móricz." },

  { id: "nagybetu-1", topic: "kis- és nagybetű", prompt: "Melyik alak helyes mondat közben?", options: ["a francia forradalom", "a Francia Forradalom"], correct: 0, explanation: "A történelmi események nevét kis kezdőbetűvel írjuk." },
  { id: "nagybetu-2", topic: "kis- és nagybetű", prompt: "Melyik alak helyes mondat közben?", options: ["karácsony", "Karácsony"], correct: 0, explanation: "Az ünnepek nevét általában kis kezdőbetűvel írjuk." },
  { id: "nagybetu-3", topic: "kis- és nagybetű", prompt: "Melyik alak helyes mondat közben?", options: ["dél-kínai táj", "Dél-kínai táj"], correct: 0, explanation: "Az -i képzős melléknévi alak kis kezdőbetűs, a kötőjelet megtartjuk." },
  { id: "nagybetu-4", topic: "kis- és nagybetű", prompt: "Melyik mondat helyes?", options: ["Mohácsi vészről tanultunk.", "mohácsi vészről tanultunk."], correct: 0, explanation: "Mondat elején a nagybetű a mondatkezdés miatt szükséges." },
  { id: "nagybetu-5", topic: "kis- és nagybetű", prompt: "Melyik alak helyes mondat közben?", options: ["anyák napja", "Anyák Napja"], correct: 0, explanation: "A nevezetes napok nevét kis kezdőbetűvel írjuk." },

  { id: "rov-1", topic: "rövidítések", prompt: "Melyik alak helyes?", options: ["cm-rel", "cm-el"], correct: 0, explanation: "A cm-et centiméternek ejtjük, ezért a toldalék hasonult alakja -rel." },
  { id: "rov-2", topic: "rövidítések", prompt: "Melyik alak helyes?", options: ["kg-mal", "kg-al"], correct: 0, explanation: "A kg-ot kilogrammnak ejtjük, ezért a -val/-vel toldalék alakja -mal." },
  { id: "rov-3", topic: "rövidítések", prompt: "Melyik alak helyes?", options: ["m-rel", "m-el"], correct: 0, explanation: "Az m rövidítést méternek ejtjük, ezért: m-rel." },
  { id: "rov-4", topic: "rövidítések", prompt: "Melyik alak helyes?", options: ["Ft-tal", "Ft-al"], correct: 0, explanation: "A Ft rövidítést forintnak ejtjük, ezért a toldalék hasonult alakja -tal." },
  { id: "rov-5", topic: "rövidítések", prompt: "Melyik alak helyes?", options: ["2026-ban", "2026.-ban"], correct: 0, explanation: "Az évszámhoz a toldalékot pont nélkül, kötőjellel kapcsoljuk: 2026-ban." },

  { id: "jel-1", topic: "jelentés", prompt: "Melyik szó illik a mondatba? „A füst ___ bennünket.”", options: ["fojt", "folyt"], correct: 0, explanation: "A fojt jelentése: fullaszt." },
  { id: "jel-2", topic: "jelentés", prompt: "Melyik szó illik a mondatba? „A patak tovább ___.”", options: ["fojt", "folyt"], correct: 1, explanation: "A folyt itt a folyik ige múlt idejű alakja." },
  { id: "jel-3", topic: "jelentés", prompt: "Melyik szó illik a mondatba? „A gazda ___ a kutyát.”", options: ["hajtja", "hagyja"], correct: 0, explanation: "A hajtja jelentése: tereli, mozgatja." },
  { id: "jel-4", topic: "jelentés", prompt: "Melyik szó illik a mondatba? „A tanár ___ a diákot dolgozni.”", options: ["hadja", "hagyja"], correct: 1, explanation: "A hagyja szóban gy + j kapcsolatot írunk." },
  { id: "jel-5", topic: "jelentés", prompt: "Melyik szó illik a mondatba? „A szerelő ___ a csavart.”", options: ["meghúzza", "meg húzza"], correct: 0, explanation: "Itt az igekötő közvetlenül az igéhez kapcsolódik; a szó jelentése: szorosabbra húzza." }
];