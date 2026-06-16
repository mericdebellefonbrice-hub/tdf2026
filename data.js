// ════════════════════════════════════════════════════════════════
//  TOUR DE FRANCE 2026 — DATA
//  Barcelone → Paris · 4–26 juillet
// ════════════════════════════════════════════════════════════════

export const STAGES = [
  { n:1,  date:"Sam 4 juil",  km:19,  from:"Barcelone",        to:"Barcelone",            type:"ttt",      note:"CLM par équipes · Montjuïc" },
  { n:2,  date:"Dim 5 juil",  km:182, from:"Tarragone",         to:"Barcelone",            type:"sprint" },
  { n:3,  date:"Lun 6 juil",  km:196, from:"Granollers",        to:"Les Angles",           type:"mountain", note:"Pyrénées catalanes" },
  { n:4,  date:"Mar 7 juil",  km:182, from:"Carcassonne",       to:"Foix",                 type:"mountain" },
  { n:5,  date:"Mer 8 juil",  km:158, from:"Lannemezan",        to:"Pau",                  type:"flat" },
  { n:6,  date:"Jeu 9 juil",  km:186, from:"Pau",               to:"Gavarnie-Gèdre",       type:"mountain", note:"Tourmalet · Pyrénées françaises" },
  { n:7,  date:"Ven 10 juil", km:175, from:"Hagetmau",          to:"Bordeaux",             type:"sprint" },
  { n:8,  date:"Sam 11 juil", km:182, from:"Périgueux",         to:"Bergerac",             type:"sprint" },
  { n:9,  date:"Dim 12 juil", km:185, from:"Malemort",          to:"Ussel",                type:"hilly" },
  { n:10, date:"Mar 14 juil", km:167, from:"Aurillac",          to:"Le Lioran",            type:"mountain", note:"🎉 14 juillet · Massif Central", restBefore:true },
  { n:11, date:"Mer 15 juil", km:161, from:"Vichy",             to:"Nevers",               type:"sprint" },
  { n:12, date:"Jeu 16 juil", km:181, from:"Magny-Cours",       to:"Chalon-sur-Saône",     type:"flat" },
  { n:13, date:"Ven 17 juil", km:205, from:"Dole",              to:"Belfort",              type:"flat" },
  { n:14, date:"Sam 18 juil", km:155, from:"Mulhouse",          to:"Le Markstein",         type:"mountain", note:"Ballon d'Alsace · Vosges" },
  { n:15, date:"Dim 19 juil", km:184, from:"Champagnole",       to:"Pla. de Solaison",     type:"mountain", note:"Salève · 11 km à 9% · Jura" },
  { n:16, date:"Lun 21 juil", km:35,  from:"Évian",             to:"Évian",                type:"itt",      note:"CLM individuel · Lac Léman", restBefore:true },
  { n:17, date:"Mar 22 juil", km:152, from:"Chambéry",          to:"Voiron",               type:"hilly" },
  { n:18, date:"Mer 23 juil", km:128, from:"St-Martin-d'Hères", to:"Col de la Loze",       type:"mountain" },
  { n:19, date:"Jeu 24 juil", km:130, from:"Bourg-d'Oisans",    to:"Orcières-Merlette",    type:"mountain" },
  { n:20, date:"Ven 25 juil", km:135, from:"Embrun",            to:"Alpe d'Huez",          type:"queen",    note:"👑 Étape Reine · Col de Sarenne" },
  { n:21, date:"Sam 26 juil", km:130, from:"Thoiry",            to:"Paris Champs-Élysées", type:"sprint",   note:"Côte de Montmartre à 15 km" },
]

export const RIDERS = [
  // GC / Grimpeurs
  { id:"pogacar",     name:"Tadej Pogačar",    team:"UAE Emirates-XRG",      flag:"🇸🇮", cat:["gc","mountain","hilly","itt"] },
  { id:"vingegaard",  name:"Jonas Vingegaard",  team:"Visma|Lease a Bike",    flag:"🇩🇰", cat:["gc","mountain","itt"] },
  { id:"evenepoel",   name:"Remco Evenepoel",   team:"Red Bull-BORA",         flag:"🇧🇪", cat:["gc","mountain","hilly","itt"] },
  { id:"seixas",      name:"Paul Seixas",       team:"Decathlon CMA CGM",     flag:"🇫🇷", cat:["gc","mountain"] },
  { id:"lipowitz",    name:"Florian Lipowitz",  team:"Red Bull-BORA",         flag:"🇩🇪", cat:["gc","mountain"] },
  { id:"deltoro",     name:"Isaac Del Toro",    team:"UAE Emirates-XRG",      flag:"🇲🇽", cat:["gc","mountain"] },
  { id:"ayuso",       name:"Juan Ayuso",        team:"UAE Emirates-XRG",      flag:"🇪🇸", cat:["gc","mountain","hilly"] },
  { id:"rodriguez",   name:"Carlos Rodriguez",  team:"INEOS Grenadiers",      flag:"🇪🇸", cat:["gc","mountain"] },
  // Sprinteurs / Classiques
  { id:"vanaert",     name:"Wout van Aert",     team:"Visma|Lease a Bike",    flag:"🇧🇪", cat:["sprint","hilly","gc"] },
  { id:"vanderpoel",  name:"M. van der Poel",   team:"Alpecin-Premier Tech",  flag:"🇳🇱", cat:["sprint","hilly"] },
  { id:"philipsen",   name:"Jasper Philipsen",  team:"Alpecin-Premier Tech",  flag:"🇧🇪", cat:["sprint"] },
  { id:"kooij",       name:"Olav Kooij",        team:"Visma|Lease a Bike",    flag:"🇳🇱", cat:["sprint"] },
  { id:"milan",       name:"Jonathan Milan",    team:"Lidl-Trek",             flag:"🇮🇹", cat:["sprint"] },
  { id:"groenewegen", name:"D. Groenewegen",    team:"Jayco AlUla",           flag:"🇳🇱", cat:["sprint"] },
  { id:"jakobsen",    name:"Fabio Jakobsen",    team:"dsm-firmenich",         flag:"🇳🇱", cat:["sprint"] },
  // CLM / Spécialistes
  { id:"ganna",       name:"Filippo Ganna",     team:"INEOS Grenadiers",      flag:"🇮🇹", cat:["sprint","itt"] },
  { id:"pidcock",     name:"Tom Pidcock",       team:"Q36.5",                 flag:"🇬🇧", cat:["mountain","hilly"] },
  // Grimpeurs
  { id:"gaudu",       name:"David Gaudu",       team:"Groupama-FDJ",          flag:"🇫🇷", cat:["mountain","hilly"] },
  { id:"ciccone",     name:"Giulio Ciccone",    team:"Lidl-Trek",             flag:"🇮🇹", cat:["mountain"] },
  { id:"bardet",      name:"Romain Bardet",     team:"dsm-firmenich",         flag:"🇫🇷", cat:["mountain"] },
  { id:"barguil",     name:"Warren Barguil",    team:"Arkéa-B&B Hotels",      flag:"🇫🇷", cat:["mountain"] },
]

export const YOUNG = ["seixas","deltoro","ayuso","lipowitz"]

export const TYPE_CFG = {
  sprint:   { icon:"⚡", label:"Sprint",         bg:"#1D4ED8", text:"#fff" },
  mountain: { icon:"⛰️",  label:"Montagne",       bg:"#DC2626", text:"#fff" },
  hilly:    { icon:"〰️", label:"Vallonné",       bg:"#D97706", text:"#fff" },
  flat:     { icon:"🛣️", label:"Plaine",         bg:"#059669", text:"#fff" },
  ttt:      { icon:"🚴", label:"CLM Équipes",    bg:"#7C3AED", text:"#fff" },
  itt:      { icon:"⏱️", label:"CLM Individuel", bg:"#0891B2", text:"#fff" },
  queen:    { icon:"👑", label:"Étape Reine",    bg:"#92400E", text:"#fff" },
}

export const JERSEYS = [
  { id:"jaune", name:"Maillot Jaune", sub:"Classement général",   bg:"#F7C500", txt:"#000", pts:20, cats:["gc","mountain"] },
  { id:"vert",  name:"Maillot Vert",  sub:"Classement par points",bg:"#00A651", txt:"#fff", pts:10, cats:["sprint","hilly"] },
  { id:"pois",  name:"Maillot à Pois",sub:"Classement montagne",  bg:"#C8102E", txt:"#fff", pts:10, cats:["mountain","gc"] },
  { id:"blanc", name:"Maillot Blanc", sub:"Meilleur jeune",       bg:"#E5E7EB", txt:"#111", pts:10, cats:["gc","mountain"], youngOnly:true },
]

// ── Helpers ──────────────────────────────────────────────────────

function deduped(arr) {
  const seen = new Set()
  return arr.filter(r => { if (seen.has(r.id)) return false; seen.add(r.id); return true })
}

const TYPE_CATS = {
  sprint:["sprint"], flat:["sprint"],
  mountain:["gc","mountain"], queen:["gc","mountain"],
  hilly:["hilly","gc","sprint"], ttt:["gc","mountain"], itt:["itt","gc"],
}

export function stageRiders(type) {
  const cats = TYPE_CATS[type] || []
  const primary = RIDERS.filter(r => r.cat.some(c => cats.includes(c)))
  const rest = RIDERS.filter(r => !r.cat.some(c => cats.includes(c)))
  return deduped([...primary, ...rest])
}

export function jerseyRiders(j) {
  if (j.youngOnly) return RIDERS.filter(r => YOUNG.includes(r.id))
  const primary = RIDERS.filter(r => r.cat.some(c => j.cats.includes(c)))
  const rest = RIDERS.filter(r => !r.cat.some(c => j.cats.includes(c)))
  return deduped([...primary, ...rest])
}

export const byId = id => RIDERS.find(r => r.id === id)

export function calcScore(pred, res) {
  let s = 0
  for (const [n, id] of Object.entries(pred.stages || {}))
    if (res.stages?.[String(n)] === id) s += 5
  for (const j of JERSEYS)
    if (pred.jerseys?.[j.id] && res.jerseys?.[j.id] === pred.jerseys[j.id]) s += j.pts
  return s
}
