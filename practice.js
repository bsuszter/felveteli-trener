const PRACTICE_TASKS = [
  { id: "felsz-1", topic: "felszólító mód", prompt: "Melyik mondat helyes?", options: ["Küld el a levelet!", "Küldd el a levelet!"], correct: 1, explanation: "A küld ige d-re végződik, ehhez kapcsolódik a -d jel: küldd." },
  { id: "felsz-2", topic: "felszólító mód", prompt: "Melyik alak helyes?", options: ["Mondd meg az igazat!", "Mond meg az igazat!"], correct: 0, explanation: "A mond felszólító módú, határozott ragozású alakja: mondd." },
  { id: "felsz-3", topic: "felszólító mód", prompt: "Melyik mondat helyes?", options: ["Hagyj egy kis időt!", "Haggy egy kis időt!"], correct: 0, explanation: "A hagy igéhez a -j jel kapcsolódik: hagyj." },
  { id: "felsz-4", topic: "felszólító mód", prompt: "Melyik alak helyes?", options: ["Higyj nekem!", "Higgy nekem!"], correct: 1, explanation: "A hisz rendhagyó felszólító módú alakja: higgy." },

  { id: "igekoto-1", topic: "igekötők", prompt: "Melyik mondat helyes?", options: ["Meg fogom nézni.", "Megfogom nézni."], correct: 0, explanation: "A fogom az igekötő és az ige közé ékelődik, ezért különírjuk." },
  { id: "igekoto-2", topic: "igekötők", prompt: "Melyik mondat helyes?", options: ["El szeretném olvasni.", "Elszeretném olvasni."], correct: 0, explanation: "A szeretném közbeékelődik, ezért az igekötőt különírjuk." },
  { id: "igekoto-3", topic: "igekötők", prompt: "Melyik mondat helyes?", options: ["Becsukja az ablakot.", "Be csukja az ablakot."], correct: 0, explanation: "Nincs közbeékelődés, ezért az igekötős igét egybeírjuk." },
  { id: "igekoto-4", topic: "igekötők", prompt: "Melyik mondat helyes?", options: ["Ki kell nyitni az ajtót.", "Kikell nyitni az ajtót."], correct: 0, explanation: "A kell az igekötő és az ige közé kerül, ezért különírjuk." },

  { id: "nagybetu-1", topic: "kis- és nagybetű", prompt: "Melyik alak helyes mondat közben?", options: ["a francia forradalom", "a Francia Forradalom"], correct: 0, explanation: "A történelmi események nevét kis kezdőbetűvel írjuk." },
  { id: "nagybetu-2", topic: "kis- és nagybetű", prompt: "Melyik alak helyes mondat közben?", options: ["karácsony", "Karácsony"], correct: 0, explanation: "Az ünnepek nevét általában kis kezdőbetűvel írjuk." },
  { id: "nagybetu-3", topic: "kis- és nagybetű", prompt: "Melyik alak helyes?", options: ["dél-kínai táj", "Dél-kínai táj"], correct: 0, explanation: "Az -i képzős melléknévi alak kis kezdőbetűs, a kötőjelet megtartjuk." },
  { id: "nagybetu-4", topic: "kis- és nagybetű", prompt: "Melyik mondat helyes?", options: ["Mohácsi vészről tanultunk.", "mohácsi vészről tanultunk."], correct: 0, explanation: "Mondat elején a nagybetű a mondatkezdés miatt szükséges." }
];
