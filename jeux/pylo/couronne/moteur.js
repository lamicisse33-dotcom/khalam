/* ── PYLO COURONNE v0.2.1 — LE MOTEUR UNIQUE ─────────────────────────────────
   Un seul fichier pour la page (window.PyloCouronne) et pour Node
   (require / import) : la page, les tests et la simulation jouent avec les
   mêmes règles. Aucune règle n'existe ailleurs.

   Plateau : case i = (8 − rangée) × 8 + colonne (A = 0). Rangée 8 en haut
   (i 0–7), rangée 1 en bas (i 56–63). Ivoire (camp 1) en bas, son « avant »
   monte (ligne −1) ; Ébène (camp 2) en haut, son avant descend (ligne +1).

   Royaumes : Ivoire = rangées 1–4, Ébène = rangées 5–8. Les quatre quartiers
   (Santé, Argent, Spiritualité, Amour) ne sont qu'un décor.
   Palais : Ivoire D1 E1 D2 E2 ; Ébène D7 E7 D8 E8.

   Une précision prise de Pylo 1.5 (règle d'honneur) : un coup qui achève une
   CONQUÊTE n'est jamais interdit, même s'il laisse le roi capturable — la
   partie s'arrête sur ce coup.

   v0.2 (14 nov. 2026) : 1) une couronne pèse — tout porteur avance d'un seul
   pas ; le Sauteur porteur fait un pas en diagonale, sans saut. 2) Le compteur
   de 40 demi-coups repart à zéro sur toute prise, progression, ramassage,
   dépôt au palais, corruption, et sur la première entrée de chaque pièce dans
   le royaume adverse (une fois par pièce).
   v0.2.1 : règle 8 précisée (voir dansPalais). */
(function (racine, fabrique) {
  const api = fabrique();
  if (typeof module === 'object' && module && module.exports) module.exports = api;
  else racine.PyloCouronne = api;
})(typeof self !== 'undefined' ? self : globalThis, function () {
'use strict';

const VERSION = '0.2.1';
const IVOIRE = 1, EBENE = 2;
const ROI = 0, REINE = 1, GARDE = 2, SENTINELLE = 3, SAUTEUR = 4, PRINCESSE = 5, PRINCE = 6, NT = 7;
const NOMS = ['Roi', 'Reine', 'Garde', 'Sentinelle', 'Sauteur', 'Princesse', 'Prince'];
const CAMPS = [null, 'Ivoire', 'Ébène'];
const LETTRES = ['R', 'Q', 'G', 'S', 'J', 'F', 'P']; // texte des positions : Ivoire en majuscules
const VALEUR = [0, 3, 1, 1, 2, 2, 2];                  // matériel (h) ; Héritier = 2

const jeton = (p, t) => (p - 1) * NT + t + 1;
const camp = (v) => (v ? (v <= NT ? 1 : 2) : 0);
const sorte = (v) => (v - 1) % NT;
const estHeritier = (t) => t === PRINCESSE || t === PRINCE;
const nomCase = (i) => 'ABCDEFGH'[i & 7] + (8 - (i >> 3));
const caseDe = (txt) => (8 - Number(txt.slice(1))) * 8 + txt.toUpperCase().charCodeAt(0) - 65;
const avant = (p) => (p === 1 ? -1 : 1);
const dansRoyaume = (i, p) => (p === 1 ? (i >> 3) >= 4 : (i >> 3) < 4);
const QUARTIERS = [
  { nom: 'Spiritualité', royaume: 2, couleur: '#9673b0' }, { nom: 'Amour', royaume: 2, couleur: '#b86876' },
  { nom: 'Santé', royaume: 1, couleur: '#76976b' }, { nom: 'Argent', royaume: 1, couleur: '#c6a050' },
];
const quartier = (i) => ((i >> 3) >= 4 ? 2 : 0) + ((i & 7) >= 4 ? 1 : 0);

const PALAIS = [null, ['D1', 'E1', 'D2', 'E2'].map(caseDe), ['D7', 'E7', 'D8', 'E8'].map(caseDe)];
const PALAIS_DE = new Int8Array(64);
for (const p of [1, 2]) for (const i of PALAIS[p]) PALAIS_DE[i] = p;
const palaisDe = (i) => (i >= 0 ? PALAIS_DE[i] : 0);

const D8 = [[-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1]];
const DIAG = [[-1, -1], [-1, 1], [1, -1], [1, 1]];
const DIRECTIONS = [D8, D8, [[-1, 0], [1, 0]], [[0, -1], [0, 1]], DIAG, DIAG, DIAG];
const dans = (r, c) => r >= 0 && r < 8 && c >= 0 && c < 8;
const VOISINS = Array.from({ length: 64 }, (_, i) => D8.map(([dr, dc]) => [(i >> 3) + dr, (i & 7) + dc]).filter(([r, c]) => dans(r, c)).map(([r, c]) => r * 8 + c));

/* Le pas du Roi : avant droit ou diagonal ; arrière droit ou diagonal
   seulement si le départ ET l'arrivée sont dans le royaume adverse (il ne
   repasse donc jamais la frontière en reculant) ; jamais de côté. */
function pasRoi(de, a, p) {
  const dr = (a >> 3) - (de >> 3), dc = (a & 7) - (de & 7);
  if (Math.max(Math.abs(dr), Math.abs(dc)) !== 1 || dr === 0) return false;
  return dr === avant(p) || (!dansRoyaume(de, p) && !dansRoyaume(a, p));
}
/* Saut de prise du Roi dans la direction (dr) vers la case d'arrivée a. */
const sautRoi = (de, a, dr, p) => dr === avant(p) || (dr === -avant(p) && !dansRoyaume(de, p) && !dansRoyaume(a, p));

/* Les pas d'une pièce sur plateau vide (cartes de distances). */
function pas(t, p, i) {
  const r = i >> 3, c = i & 7, out = [];
  if (t === SENTINELLE) { for (const dc of [-1, 1]) if (dans(r, c + dc)) out.push(i + dc); return out; }
  for (const [dr, dc] of DIRECTIONS[t]) {
    const n = t === SAUTEUR ? 2 : 1, rr = r + n * dr, cc = c + n * dc;
    if (!dans(rr, cc)) continue;
    const a = rr * 8 + cc;
    if (t === ROI && !pasRoi(i, a, p)) continue;
    out.push(a);
  }
  return out;
}

/* ── CARTES DE DISTANCES (BFS, plateau vide) ────────────────────────────────
   DIST[t][p][i] : nombre minimal de déplacements d'une pièce de sorte t du
   camp p, depuis i, jusqu'à une case du palais de p (la destination d'une
   couronne portée est toujours le palais du camp qui la porte : palais du
   voleur pour un vol, son propre palais pour un retour). Sentinelle : ∞.
   PORTEE[t][p][a*64+b] : déplacements de a à b (pour l'IA). 255 = jamais.
   (v0.2 : le Sauteur porteur prend la carte de l'Héritier, voir plus bas.) */
const DIST = [], PORTEE = [];
for (let t = 0; t < NT; t++) {
  DIST[t] = [null]; PORTEE[t] = [null];
  for (const p of [1, 2]) {
    const portee = new Uint8Array(64 * 64).fill(255);
    for (let a = 0; a < 64; a++) {
      portee[a * 64 + a] = 0; const file = [a];
      for (let k = 0; k < file.length; k++) for (const b of pas(t, p, file[k])) if (portee[a * 64 + b] === 255) { portee[a * 64 + b] = portee[a * 64 + file[k]] + 1; file.push(b); }
    }
    PORTEE[t][p] = portee;
    const d = new Array(64).fill(Infinity);
    if (t !== SENTINELLE) for (let a = 0; a < 64; a++) for (const b of PALAIS[p]) if (portee[a * 64 + b] !== 255) d[a] = Math.min(d[a], portee[a * 64 + b]);
    DIST[t][p] = d;
  }
}
/* v0.2 : le Sauteur porteur se déplace comme un Héritier (un pas en
   diagonale). DIST ne sert qu'aux couronnes portées : sa carte est celle de
   l'Héritier. PORTEE (aller vers une couronne, sans la porter) garde le saut. */
for (const p of [1, 2]) DIST[SAUTEUR][p] = DIST[PRINCESSE][p];
const distance = (t, p, i) => (t === SENTINELLE ? Infinity : DIST[t][p][i]);
const portee = (t, p, a, b) => { const v = PORTEE[t][p][a * 64 + b]; return v === 255 ? Infinity : v; };

/* ── HASARD À GRAINE ─────────────────────────────────────────────────────── */
function mulberry32(graine) {
  let a = graine >>> 0;
  return function () { a = (a + 0x6D2B79F5) >>> 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
}

/* ── ÉTAT ───────────────────────────────────────────────────────────────────
   { b: 64 jetons, c: [null, couronneIvoire, couronneEbene], tour, ply, calme,
     heritiers: bool, ev: événements du dernier coup }
   Couronne : { sq, porte, trajet: null | { camp, record } }. Portée, sq est
   la case du porteur ; au sol, la case où elle est posée. */
function vide() {
  /* entre[i] : la pièce de la case i est déjà entrée une fois dans le royaume adverse. */
  return { b: new Array(64).fill(0), c: [null, { sq: -1, porte: false, trajet: null }, { sq: -1, porte: false, trajet: null }], tour: 1, ply: 0, calme: 0, heritiers: false, entre: new Array(64).fill(false), ev: null };
}
function initial(opts = {}) {
  const s = vide(), mettre = (p, t, x) => { s.b[caseDe(x)] = jeton(p, t); };
  for (const [t, x] of [[ROI, 'D1'], [REINE, 'E1'], [GARDE, 'C2'], [GARDE, 'F2'], [SENTINELLE, 'B3'], [SENTINELLE, 'G3'], [SAUTEUR, 'A3'], [SAUTEUR, 'H3']]) {
    mettre(1, t, x); mettre(2, t, nomCase(63 - caseDe(x))); // symétrie 180°
  }
  s.c[1].sq = caseDe('E2'); s.c[2].sq = caseDe('D7');
  const graine = opts.graine ?? 1;
  s.heritiers = opts.heritiers !== false;
  if (s.heritiers) {
    /* Princesse pour Ivoire et Prince pour Ébène, inversés quand la graine
       est impaire ; colonne tirée au sort, indépendante pour chaque camp,
       sur une case libre de la rangée 4 (Ivoire) et 5 (Ébène). */
    const hasard = mulberry32(graine * 7919 + 17), inverse = (graine & 1) === 1;
    for (const p of [1, 2]) {
      const t = (p === 1) !== inverse ? PRINCESSE : PRINCE, rangee = p === 1 ? 4 : 5;
      const libres = [0, 1, 2, 3, 4, 5, 6, 7].map((c) => (8 - rangee) * 8 + c).filter((i) => !s.b[i] && s.c[1].sq !== i && s.c[2].sq !== i);
      s.b[libres[Math.floor(hasard() * libres.length)]] = jeton(p, t);
    }
  }
  return s;
}

const porteePar = (s, i) => (s.c[1].porte && s.c[1].sq === i ? 1 : s.c[2].porte && s.c[2].sq === i ? 2 : 0);
const auSol = (s, i) => [1, 2].filter((k) => !s.c[k].porte && s.c[k].sq === i);
/* Règle 8 (v0.2.1) : une couronne est « dans » le palais de p si elle est au
   sol sur une de ses cases, ou portée par une pièce DU CAMP p qui s'y tient.
   Portée par une pièce ennemie dans ce palais, elle n'y est pas. */
const dansPalais = (s, k, p) => palaisDe(s.c[k].sq) === p && (!s.c[k].porte || camp(s.b[s.c[k].sq]) === p);
const conquete = (s, p) => dansPalais(s, 1, p) && dansPalais(s, 2, p);
function piecesAuPalais(s, p) { let n = 0; for (const i of PALAIS[p]) if (camp(s.b[i]) === p) n++; return n; }

/* ── GÉNÉRATION BRUTE (sans la règle d'honneur) ─────────────────────────────
   Coup : { de, a, prise: case|null, pris, piece, ramasse: 0|1|2 }. */
function brut(s, p = s.tour, seulementPrises = false) {
  const out = [], b = s.b, auPalais = piecesAuPalais(s, p), f = avant(p);
  function pousser(de, a, prise, piece, porte) {
    if (PALAIS_DE[a] === p && PALAIS_DE[de] !== p && auPalais >= 2) return; // palais petit
    const pris = prise === null ? 0 : b[prise];
    if (porte || seulementPrises) { out.push({ de, a, prise, pris, piece, ramasse: 0 }); return; }
    const sol = auSol(s, a);
    if (!sol.length) { out.push({ de, a, prise, pris, piece, ramasse: 0 }); return; }
    // Règle 3 : sa propre couronne au sol dans son propre palais → « entrer » ou « entrer et ramasser ».
    if (sol.length === 1 && sol[0] === p && PALAIS_DE[a] === p) out.push({ de, a, prise, pris, piece, ramasse: 0 });
    for (const k of sol) out.push({ de, a, prise, pris, piece, ramasse: k });
  }
  for (let i = 0; i < 64; i++) {
    const v = b[i];
    if (camp(v) !== p) continue;
    const t = sorte(v), r = i >> 3, c = i & 7, porte = porteePar(s, i) !== 0;
    for (const [dr, dc] of DIRECTIONS[t]) {
      if (t === SAUTEUR && porte) { // v0.2 : la couronne pèse, un pas en diagonale
        const rr = r + dr, cc = c + dc;
        if (!seulementPrises && dans(rr, cc) && !b[rr * 8 + cc]) pousser(i, rr * 8 + cc, null, v, porte);
        continue;
      }
      if (t === SAUTEUR) {
        const rr = r + 2 * dr, cc = c + 2 * dc;
        if (!dans(rr, cc)) continue;
        const a = rr * 8 + cc, mi = (r + dr) * 8 + c + dc;
        if (b[a]) continue;
        const prend = camp(b[mi]) === 3 - p;
        if (seulementPrises && !prend) continue;
        pousser(i, a, prend ? mi : null, v, porte);
        continue;
      }
      const rr = r + dr, cc = c + dc;
      if (!dans(rr, cc)) continue;
      const a = rr * 8 + cc;
      if (!b[a]) { if (!seulementPrises && (t !== ROI || pasRoi(i, a, p))) pousser(i, a, null, v, porte); continue; }
      if (porte || camp(b[a]) !== 3 - p) continue; // règle 5 : un porteur ne prend jamais
      const jr = r + 2 * dr, jc = c + 2 * dc;
      if (!dans(jr, jc)) continue;
      const j = jr * 8 + jc;
      if (b[j] || (t === ROI && !sautRoi(i, j, dr, p))) continue;
      pousser(i, j, a, v, porte);
    }
  }
  if (seulementPrises) return out;
  return out;
}

/* ── JOUER UN COUP (pur : rend un nouvel état) ─────────────────────────────── */
function jouer(s, m) {
  const b = s.b.slice(), c = [null, { ...s.c[1] }, { ...s.c[2] }], entre = s.entre.slice();
  const v = b[m.de], p = camp(v), t = sorte(v);
  const ev = { prise: 0, progres: 0, corrompus: [], depot: 0, ramasse: 0, nouveauTrajet: 0, vol: 0, sortie: 0, heritierPris: false, premiereEntree: false };
  b[m.a] = v; b[m.de] = 0;
  entre[m.a] = entre[m.de]; entre[m.de] = false;
  if (!entre[m.a] && !dansRoyaume(m.a, p)) { entre[m.a] = true; ev.premiereEntree = true; }
  if (m.prise !== null) {
    ev.prise = b[m.prise]; ev.heritierPris = estHeritier(sorte(b[m.prise]));
    b[m.prise] = 0; entre[m.prise] = false;
    for (const k of [1, 2]) if (c[k].porte && c[k].sq === m.prise) c[k].porte = false; // règle 6
  }
  for (const k of [1, 2]) {
    if (!(c[k].porte && c[k].sq === m.de)) continue;
    c[k].sq = m.a;
    if (k === p && PALAIS_DE[m.de] === p && PALAIS_DE[m.a] !== p) ev.sortie = k;
    const d = PALAIS_DE[m.a] === p && t !== SENTINELLE ? 0 : distance(t, p, m.a);
    if (PALAIS_DE[m.a] === p && PALAIS_DE[m.de] !== p) { c[k].porte = false; ev.depot = k; } // règle 7
    if (c[k].trajet && d < c[k].trajet.record) { c[k].trajet = { camp: c[k].trajet.camp, record: d }; ev.progres = k; }
  }
  if (m.ramasse) {
    const k = m.ramasse, d = distance(t, p, m.a), tr = c[k].trajet;
    c[k].porte = true; c[k].sq = m.a; ev.ramasse = k;
    if (!tr || tr.camp !== p) { c[k].trajet = { camp: p, record: d }; ev.nouveauTrajet = k; if (k !== p) ev.vol = k; }
    else if (d < tr.record) { c[k].trajet = { camp: p, record: d }; ev.progres = k; }
  }
  /* Corruption : la Reine qui termine un déplacement SANS prise à côté d'un
     Héritier ennemi isolé (aucun allié à lui dans les 8 directions) le fait
     changer de camp, sur sa case, avec sa couronne éventuelle (nouveau trajet). */
  if (t === REINE && m.prise === null) {
    const cibles = VOISINS[m.a].filter((n) => camp(b[n]) === 3 - p && estHeritier(sorte(b[n])) && !VOISINS[n].some((x) => camp(b[x]) === 3 - p));
    for (const n of cibles) {
      b[n] = jeton(p, sorte(b[n])); ev.corrompus.push(n);
      const k = porteePar({ c }, n);
      if (k) { c[k].trajet = { camp: p, record: distance(sorte(b[n]), p, n) }; if (k !== p) ev.vol = k; ev.nouveauTrajet = k; }
    }
  }
  const calme = m.prise !== null || ev.progres || ev.ramasse || ev.depot || ev.corrompus.length || ev.premiereEntree ? 0 : s.calme + 1;
  return { b, c, tour: 3 - s.tour, ply: s.ply + 1, calme, heritiers: s.heritiers, entre, ev };
}

function roiPrenable(s, p) {
  for (const m of brut(s, 3 - p, true)) if (m.pris && sorte(m.pris) === ROI && camp(m.pris) === p) return true;
  return false;
}
/* Coups légaux : chaque coup emporte son état suivant (m.suite). */
function coupsLegaux(s, p = s.tour) {
  const out = [];
  for (const m of brut(s, p)) {
    const n = jouer(s, m);
    if (conquete(n, p) || !roiPrenable(n, p)) { m.suite = n; out.push(m); }
  }
  return out;
}

/* Fin de partie constatée après un coup (s.tour = le camp qui doit jouer).
   La répétition se juge sur la partie entière : voir creerPartie. */
function fin(s, coups) {
  const j = 3 - s.tour;
  if (conquete(s, j)) return { gagnant: j, raison: 'conquete' };
  coups = coups || coupsLegaux(s);
  if (!coups.length) return roiPrenable(s, s.tour) ? { gagnant: j, raison: 'piege' } : { gagnant: 0, raison: 'pat' };
  if (s.calme >= 40) return { gagnant: 0, raison: 'calme' };
  return null;
}
const RAISONS = { conquete: 'Conquête', piege: 'Roi piégé', pat: 'Nulle — pat', calme: 'Nulle — 40 demi-coups sans prise, ramassage, dépôt, corruption, progrès ni première entrée', repetition: 'Nulle — même position trois fois', plafond: 'Non terminée (plafond de 300 demi-coups)' };

const cle = (s) => s.b.join(',') + '|' + s.c[1].sq + (s.c[1].porte ? '*' : '') + '|' + s.c[2].sq + (s.c[2].porte ? '*' : '') + '|' + s.tour;

/* État d'une couronne, pour le bandeau et la simulation. */
function etatCouronne(s, k) {
  const C = s.c[k], porteur = C.porte ? camp(s.b[C.sq]) : 0, tr = C.trajet;
  const base = { sq: C.sq, porte: C.porte, porteur: C.porte ? s.b[C.sq] : 0, trajet: tr, distance: null };
  if (C.porte) base.distance = PALAIS_DE[C.sq] === porteur ? 0 : distance(sorte(s.b[C.sq]), porteur, C.sq);
  if (dansPalais(s, k, k)) return { ...base, etat: 'chez-elle' };
  if (!C.porte && palaisDe(C.sq) === 3 - k) return { ...base, etat: 'deposee' };
  if (C.porte) return { ...base, etat: porteur === k ? 'retour' : 'vol' };
  return { ...base, etat: tr && tr.camp !== k ? 'vol-au-sol' : 'au-sol' };
}
function heritiers(s) {
  const out = [];
  for (let i = 0; i < 64; i++) if (s.b[i] && estHeritier(sorte(s.b[i]))) {
    const p = camp(s.b[i]);
    out.push({ sq: i, camp: p, sorte: sorte(s.b[i]), protege: VOISINS[i].some((x) => camp(s.b[x]) === p) });
  }
  return out;
}

function notation(m, s) {
  let t = nomCase(m.de) + (m.prise !== null ? 'x' : '-') + nomCase(m.a);
  if (m.ramasse) t += '+C' + (m.ramasse === 1 ? 'i' : 'e');
  const n = m.suite || (s && jouer(s, m));
  if (n) { if (n.ev.depot) t += '↓'; if (n.ev.corrompus.length) t += '~' + n.ev.corrompus.map(nomCase).join('~'); }
  return t;
}

/* ── PARTIE (historique, répétition, plafond) ──────────────────────────── */
function creerPartie(opts = {}) {
  const s = opts.etat || initial(opts);
  const partie = { etats: [s], coups: [], vus: new Map([[cle(s), 1]]), resultat: null, plafond: opts.plafond || 0, legaux: null };
  partie.legaux = coupsLegaux(s);
  partie.resultat = partie.legaux.length ? null : fin(s, partie.legaux);
  return partie;
}
const etatActuel = (partie) => partie.etats[partie.etats.length - 1];
function jouerCoup(partie, m) {
  const s = m.suite || jouer(etatActuel(partie), m);
  partie.etats.push(s); partie.coups.push(m);
  const k = cle(s), n = (partie.vus.get(k) || 0) + 1; partie.vus.set(k, n);
  partie.legaux = coupsLegaux(s);
  partie.resultat = fin(s, partie.legaux);
  if (!partie.resultat && n >= 3) partie.resultat = { gagnant: 0, raison: 'repetition' };
  if (!partie.resultat && partie.plafond && s.ply >= partie.plafond) partie.resultat = { gagnant: 0, raison: 'plafond' };
  return s;
}
function annuler(partie, n = 1) {
  for (let i = 0; i < n && partie.coups.length; i++) {
    const s = partie.etats.pop(), k = cle(s); partie.coups.pop();
    const c = partie.vus.get(k) - 1; if (c) partie.vus.set(k, c); else partie.vus.delete(k);
  }
  partie.legaux = coupsLegaux(etatActuel(partie));
  partie.resultat = partie.coups.length ? fin(etatActuel(partie), partie.legaux) : (partie.legaux.length ? null : fin(etatActuel(partie), partie.legaux));
  return etatActuel(partie);
}

/* ── POSITIONS EN TEXTE (tests et scénarios) ───────────────────────────────
     8 . . . q r . . .        Ivoire en MAJUSCULES, Ébène en minuscules :
     7 . . . . . . . .        R Roi · Q Reine · G Garde · S Sentinelle
     …                        J Sauteur · F Princesse · P Prince · . vide
     1 . . . R Q . . .
     couronnes: ivoire=E2 ebene=D7*     (* : portée par la pièce de la case)
     trajets: ebene=1:4                  (trajet de la couronne d'Ébène : camp 1, record 4)
     tour: ivoire        calme: 0
   Sans « trajets », une couronne portée reçoit un trajet du camp de son
   porteur, record = sa distance actuelle. Les lignes de rangée peuvent
   omettre les espaces. Les lignes vides et après « # » sont ignorées. */
function depuisTexte(texte) {
  const s = vide(); s.heritiers = true;
  const trajets = {};
  for (const brute of texte.split('\n')) {
    const l = brute.replace(/#.*/, '').trim();
    if (!l) continue;
    let m;
    if ((m = l.match(/^([1-8])\s+(.+)$/))) {
      const cases = m[2].replace(/\s+/g, '');
      if (cases.length !== 8) throw new Error('rangée ' + m[1] + ' : 8 cases attendues');
      [...cases].forEach((ch, col) => {
        if (ch === '.') return;
        const t = LETTRES.indexOf(ch.toUpperCase());
        if (t < 0) throw new Error('pièce inconnue : ' + ch);
        s.b[(8 - Number(m[1])) * 8 + col] = jeton(ch === ch.toUpperCase() ? 1 : 2, t);
      });
    } else if ((m = l.match(/^couronnes\s*:\s*(.+)$/i))) {
      for (const [, qui, ou, etoile] of m[1].matchAll(/(ivoire|ebene|ébène)\s*=\s*([A-Ha-h][1-8])(\*?)/gi)) {
        const k = /^i/i.test(qui) ? 1 : 2; s.c[k].sq = caseDe(ou); s.c[k].porte = !!etoile;
      }
    } else if ((m = l.match(/^trajets\s*:\s*(.+)$/i))) {
      for (const [, qui, cp, rec] of m[1].matchAll(/(ivoire|ebene|ébène)\s*=\s*([12])\s*:\s*(\d+|inf)/gi)) trajets[/^i/i.test(qui) ? 1 : 2] = { camp: Number(cp), record: rec === 'inf' ? Infinity : Number(rec) };
    } else if ((m = l.match(/^tour\s*:\s*(\S+)/i))) s.tour = /^i/i.test(m[1]) ? 1 : 2;
    else if ((m = l.match(/^calme\s*:\s*(\d+)/i))) s.calme = Number(m[1]);
    else if (/^[A-H\s]+$/.test(l)) continue;
    else throw new Error('ligne incomprise : ' + l);
  }
  // Une pièce déjà dans le royaume adverse y est entrée : sa première entrée est passée.
  for (let i = 0; i < 64; i++) if (s.b[i] && !dansRoyaume(i, camp(s.b[i]))) s.entre[i] = true;
  for (const k of [1, 2]) {
    if (trajets[k]) s.c[k].trajet = trajets[k];
    else if (s.c[k].porte) { const v = s.b[s.c[k].sq]; if (!v) throw new Error('couronne portée sans porteur'); s.c[k].trajet = { camp: camp(v), record: distance(sorte(v), camp(v), s.c[k].sq) }; }
  }
  return s;
}
function versTexte(s) {
  const l = [];
  for (let r = 0; r < 8; r++) l.push((8 - r) + ' ' + s.b.slice(r * 8, r * 8 + 8).map((v) => (v ? (camp(v) === 1 ? LETTRES[sorte(v)] : LETTRES[sorte(v)].toLowerCase()) : '.')).join(' '));
  l.push('  A B C D E F G H');
  l.push('couronnes: ivoire=' + nomCase(s.c[1].sq) + (s.c[1].porte ? '*' : '') + ' ebene=' + nomCase(s.c[2].sq) + (s.c[2].porte ? '*' : ''));
  l.push('tour: ' + (s.tour === 1 ? 'ivoire' : 'ebene') + '  calme: ' + s.calme);
  return l.join('\n');
}

/* ── IA ─────────────────────────────────────────────────────────────────────
   Profondeur 1 Apprenti, 2 Gardien, 3 Maître ; beam 8 ; minimax alpha-bêta
   du point de vue du camp qui joue. Hasard contrôlé : tirage parmi les coups
   à ±1 % du meilleur, avec une graine (mulberry32). */
const NIVEAUX = { apprenti: { profondeur: 1, beam: 8 }, gardien: { profondeur: 2, beam: 8 }, maitre: { profondeur: 3, beam: 8 } };
const GAGNE = 100000;
const CHEZ_MOI = 240;                                       // une couronne dans mon palais
const valeurPortee = (d) => 60 + 22 * (8 - Math.min(d, 8)); // une couronne que je porte, à d de mon palais

/* Les deux couronnes à un coup du palais de q (dans le palais, ou portées
   par une pièce de q à une case). */
function imminente(s, q) {
  for (const k of [1, 2]) {
    const C = s.c[k];
    if (dansPalais(s, k, q)) continue;
    if (!(C.porte && camp(s.b[C.sq]) === q && distance(sorte(s.b[C.sq]), q, C.sq) <= 1)) return false;
  }
  return true;
}

function evaluer(s, p, reglages = {}) {
  const j = 3 - s.tour; // le camp qui vient de jouer
  if (conquete(s, j)) return j === p ? GAGNE - s.ply : -GAGNE + s.ply;
  if (roiPrenable(s, s.tour) && !coupsLegaux(s).length) return s.tour === p ? -GAGNE + s.ply : GAGNE - s.ply;
  if (s.calme >= 40) return 0;
  const prises = [null, brut(s, 1, true), brut(s, 2, true)];
  return cote(s, p, prises, reglages) - cote(s, 3 - p, prises, reglages);
}

/* La valeur d'un camp p (évaluer fait la différence p − adversaire). */
function cote(s, p, prises, reglages = {}) {
  const e = 3 - p, b = s.b, monTour = s.tour === p;
  const menaces = new Set(prises[e].map((m) => m.prise));
  let v = 0, monRoi = -1, maReine = -1;
  const miennes = [];
  for (let i = 0; i < 64; i++) if (camp(b[i]) === p) {
    const t = sorte(b[i]); v += VALEUR[t] * 100; miennes.push(i);
    if (t === ROI) monRoi = i; else if (t === REINE) maReine = i;
  }
  // (a)(b)(c) : les deux couronnes vues vers MON palais.
  for (const k of [1, 2]) {
    const C = s.c[k];
    // Portée par l'adversaire, même dans mon palais : elle part (c'est sa valeur à lui).
    // (a) vise la couronne adverse « chez elle » : au sol OU portée dans son propre palais.
    const chezEllePortee = C.porte && k === e && camp(b[C.sq]) === e && palaisDe(C.sq) === e;
    if (C.porte && camp(b[C.sq]) !== p && !chezEllePortee) continue;
    /* Ma couronne dans mon palais (scénario 9) : au sol, une pièce ennemie à
       deux pas de sa case finira par venir la voler — même si une des miennes
       s'assoit dessus. La ramasser n'a de sens que sous cette menace, et
       seulement s'il existe une case de sortie que l'ennemi n'atteint pas au
       coup suivant ; sans menace, la porter ne fait que l'exposer. */
    if (k === p && palaisDe(C.sq) === p && reglages.gardeCouronne !== false) {
      const menace = menaceSur(s, C.sq, e);
      if (C.porte) {
        v += menace ? (sortieSure(s, C.sq, p) ? 0 : -35) : -15;
        // v0.2.1 : porteur prenable au coup suivant dans mon palais → petit malus, la sortie vient d'elle-même.
        if (menaces.has(C.sq)) v -= 25;
      } else if (menace) v -= 90;
    }
    if (palaisDe(C.sq) === p) { v += CHEZ_MOI; continue; }
    if (C.porte && !chezEllePortee) {
      v += valeurPortee(distance(sorte(b[C.sq]), p, C.sq));
      // (d) mon porteur prenable au prochain coup ; protégé si un allié reprend l'intercepteur.
      if (menaces.has(C.sq)) {
        const perte = valeurPortee(distance(sorte(b[C.sq]), p, C.sq)) + (k === p ? 120 : 0);
        // À mon tour, un porteur qui a une case de fuite sûre n'est presque pas en danger.
        v -= (protege(s, C.sq, p, prises[e]) ? 0.35 : 0.7) * perte * (monTour ? (sortieSure(s, C.sq, p) ? 0.1 : 0.4) : 1);
      }
      continue;
    }
    // Au sol hors de mon palais : ma pièce la plus proche, pondérée par son retour (Sentinelle exclue).
    let meilleur = Infinity;
    for (const i of miennes) {
      const t = sorte(b[i]);
      if (t === SENTINELLE || porteePar(s, i)) continue;
      const aller = portee(t, p, i, C.sq), retour = distance(t, p, C.sq);
      if (aller + retour < meilleur) meilleur = aller + retour;
    }
    const pression = k === e ? 7 : 9; // (a) aller voler ; (c) récupérer la mienne
    v -= pression * Math.min(meilleur, 20);
    if (k === p) v -= 60; // ma couronne hors de chez moi
  }
  // (f) victoire imminente : décisive si le camp au trait la tient.
  if (imminente(s, p)) v += monTour ? 5000 : 250;
  // (g) sécurité du roi.
  if (monRoi >= 0) {
    if (menaces.has(monRoi)) v -= 60;
    for (const n of VOISINS[monRoi]) if (camp(b[n]) === e) v -= 5;
  }
  // Pièces menacées (le camp qui n'est pas au trait les perd).
  if (!monTour) { let pire = 0; for (const i of menaces) if (camp(b[i]) === p) pire = Math.max(pire, VALEUR[sorte(b[i])]); v -= 70 * pire; }
  // Héritiers : protégé (+), isolé à portée de la Reine adverse (−) ; ma Reine vers un Héritier ennemi isolé.
  if (s.heritiers) {
    let reineAdverse = -1;
    for (let i = 0; i < 64; i++) if (b[i] === jeton(e, REINE)) reineAdverse = i;
    const cheb = (a, c) => Math.max(Math.abs((a >> 3) - (c >> 3)), Math.abs((a & 7) - (c & 7)));
    let cible = Infinity;
    for (let i = 0; i < 64; i++) {
      if (!b[i] || !estHeritier(sorte(b[i]))) continue;
      const q = camp(b[i]), isole = !VOISINS[i].some((x) => camp(b[x]) === q);
      if (q === p) {
        if (!isole) v += 12;
        else if (reineAdverse >= 0 && cheb(reineAdverse, i) <= 2) v -= monTour ? 40 : 320;
      } else if (isole && maReine >= 0) cible = Math.min(cible, cheb(maReine, i));
    }
    if (cible < Infinity) v -= 8 * cible;
    if (maReine >= 0 && menaces.has(maReine)) v -= monTour ? 30 : 150;
  }
  return v;
}

/* Une pièce libre du camp e à deux déplacements au plus de la case sq (plateau vide). */
function menaceSur(s, sq, e) {
  for (let i = 0; i < 64; i++) if (camp(s.b[i]) === e && !porteePar(s, i) && portee(sorte(s.b[i]), e, i, sq) <= 2) return true;
  return false;
}
/* Le porteur de sq (camp p) a-t-il un pas vers une case libre hors de son palais
   qu'aucune pièce adverse n'atteint au coup suivant ? */
function sortieSure(s, sq, p) {
  const t = sorte(s.b[sq]), e = 3 - p;
  return pas(t === SAUTEUR ? PRINCESSE : t, p, sq).some((n) => !s.b[n] && PALAIS_DE[n] !== p &&
    !s.b.some((w, j) => camp(w) === e && portee(sorte(w), e, j, n) <= 1));
}

/* Après la prise de mon porteur en sq, un allié peut-il reprendre l'intercepteur ? */
function protege(s, sq, p, prisesAdverses) {
  for (const m of prisesAdverses) {
    if (m.prise !== sq) continue;
    const n = jouer(s, m);
    if (!brut(n, p, true).some((r) => r.prise === m.a)) return false;
  }
  return true;
}

function analyser(s, opts = {}) {
  const niveau = NIVEAUX[opts.niveau] || {};
  const profondeur = opts.profondeur || niveau.profondeur || 2, beam = opts.beam || niveau.beam || 8;
  const hasard = opts.hasard || Math.random, vus = opts.vus || null, p = s.tour;
  let noeuds = 0;
  const reglages = { gardeCouronne: opts.gardeCouronne };
  const tri = (q, rows) => rows.sort((x, y) => (q.tour === p ? y.v - x.v : x.v - y.v));
  function enfants(q) { return tri(q, coupsLegaux(q).map((m) => ({ m, n: m.suite, v: evaluer(m.suite, p, reglages) }))).slice(0, beam); }
  function terminal(q) {
    const j = 3 - q.tour;
    if (conquete(q, j)) return j === p ? GAGNE - q.ply : -GAGNE + q.ply;
    if (q.calme >= 40) return 0;
    return null;
  }
  function chercher(q, d, alpha, beta) {
    noeuds++;
    const t = terminal(q);
    if (t !== null) return t;
    if (!d) return evaluer(q, p, reglages);
    const rows = enfants(q);
    if (!rows.length) return roiPrenable(q, q.tour) ? (q.tour === p ? -GAGNE + q.ply : GAGNE - q.ply) : 0;
    let best = q.tour === p ? -Infinity : Infinity;
    for (const x of rows) {
      const val = chercher(x.n, d - 1, alpha, beta);
      if (q.tour === p) { best = Math.max(best, val); alpha = Math.max(alpha, best); } else { best = Math.min(best, val); beta = Math.min(beta, best); }
      if (beta <= alpha) break;
    }
    return best;
  }
  const racines = enfants(s);
  if (!racines.length) return null;
  const valeurs = racines.map((x) => {
    let val = profondeur === 1 ? x.v : chercher(x.n, profondeur - 1, -Infinity, Infinity);
    // Répétition : la 3e occurrence est une nulle ; une 2e est découragée.
    const deja = vus ? vus.get(cle(x.n)) || 0 : 0;
    if (deja >= 2 && Math.abs(val) < GAGNE / 2) val = 0; else if (deja === 1 && Math.abs(val) < GAGNE / 2) val -= 85;
    return { coup: x.m, valeur: val };
  }).sort((x, y) => y.valeur - x.valeur);
  const top = valeurs[0].valeur, marge = Math.max(1e-9, Math.abs(top) * 0.01);
  const egaux = valeurs.filter((x) => x.valeur >= top - marge);
  const choix = egaux[Math.floor(hasard() * egaux.length)];
  return { coup: choix.coup, valeur: choix.valeur, egaux: egaux.length, classement: valeurs, noeuds };
}

return {
  VERSION, IVOIRE, EBENE, ROI, REINE, GARDE, SENTINELLE, SAUTEUR, PRINCESSE, PRINCE, NOMS, CAMPS, LETTRES, VALEUR, QUARTIERS, PALAIS, NIVEAUX, RAISONS,
  jeton, camp, sorte, estHeritier, nomCase, caseDe, avant, dansRoyaume, quartier, palaisDe, pasRoi, distance, portee, mulberry32,
  initial, depuisTexte, versTexte, brut, jouer, coupsLegaux, roiPrenable, conquete, dansPalais, piecesAuPalais, fin, cle, etatCouronne, heritiers, porteePar, auSol, notation,
  creerPartie, etatActuel, jouerCoup, annuler, evaluer, analyser, imminente, menaceSur, sortieSure,
};
});
