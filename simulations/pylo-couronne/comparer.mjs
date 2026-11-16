/* ── PYLO COURONNE — TABLEAU COMPARATIF v0.2.1 / v0.3 ───────────────────────
   node simulations/pylo-couronne/comparer.mjs
   Lit les parties (.jsonl) : v0.2.1 dans resultats/, v0.3 dans resultats/v0.3/
   (et, s'il existe, resultats/v0.3/maitre-maitre-prince-sans-saut.jsonl).
   Écrit resultats/v0.3/comparatif.md. Mêmes graines (1 à 500 × 2) partout. */
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { v03 } from './mesures-v03.mjs';

const ici = path.dirname(fileURLToPath(import.meta.url)), R = path.join(ici, 'resultats');
const lire = (f) => (existsSync(f) ? readFileSync(f, 'utf8').trim().split('\n').map((l) => JSON.parse(l)) : null);
const SERIES = [['maitre-maitre', 'Maître – Maître'], ['maitre-apprenti', 'Maître – Apprenti'], ['gardien-gardien', 'Gardien – Gardien'], ['maitre-maitre-sans-heritiers', 'Maître – Maître sans Héritiers']];

const pc = (x, n) => (n ? ((100 * x) / n).toFixed(1) + ' %' : '—');
const med = (a) => { const s = a.slice().sort((x, y) => x - y); return s.length ? s[Math.floor((s.length - 1) / 2)] : '—'; };
function mesures(P) {
  if (!P) return null;
  const n = P.length, dec = P.filter((r) => r.resultat === 'ivoire' || r.resultat === 'ebene');
  const blanc = P.reduce((s, r) => s + (r.gagnantIA === 'blanc' ? 1 : r.gagnantIA === null ? 0.5 : 0), 0);
  const victoires = P.filter((r) => r.gagnantIA !== null);
  const base = {
    'Conquêtes': pc(P.filter((r) => r.raison === 'conquete').length, n),
    'Rois piégés': pc(P.filter((r) => r.raison === 'piege').length, n),
    'Nulles': pc(P.filter((r) => r.resultat === 'nulle').length, n),
    'dont 40 demi-coups sans progrès': pc(P.filter((r) => r.raison === 'calme').length, n),
    'Non terminées (plafond)': pc(P.filter((r) => r.resultat === 'non-terminee').length, n),
    'Longueur médiane (demi-coups)': med(P.map((r) => r.longueur)),
    'Ivoire, % des décisives': pc(dec.filter((r) => r.resultat === 'ivoire').length, dec.length),
    'Score de « blanc »': pc(blanc, n),
    'Parties avec un vol': pc(P.filter((r) => r.vols > 0).length, n),
    'Vols par partie': (P.reduce((s, r) => s + r.vols, 0) / n).toFixed(2),
    'Blocages (porteur à ≤ 2, 10 demi-coups)': pc(P.filter((r) => r.blocages > 0).length, n),
    'Corruptions par partie': (P.reduce((s, r) => s + r.corruptions, 0) / n).toFixed(2),
    'Captures d’Héritier par partie': (P.reduce((s, r) => s + r.heritiersPris, 0) / n).toFixed(2),
    'Victoires précédées d’une corruption': pc(victoires.filter((r) => r.corruptionAvantVictoire).length, victoires.length),
  };
  if (!('voyages' in P[0])) return base;
  const v = v03(P), aH = P[0].heritiers;
  const tous = P.flatMap((r) => r.voyages), moy = (a) => (a.length ? (a.reduce((x, y) => x + y, 0) / a.length).toFixed(2) : '—');
  return {
    ...base,
    'Trajet de vol moyen, tous porteurs (coups)': `${moy(tous.map((x) => x.coups))} (${tous.length})`,
    'Trajet de vol moyen, Prince porteur': aH ? `${v.moyPrince} (${v.nPrince})` : '—',
    'Trajet de vol moyen, autre porteur': aH ? `${v.moyAutres} (${v.nAutres})` : `${v.moyAutres} (${v.nAutres})`,
    'Trajet déposé moyen, Prince / autres': aH ? `${v.moyPrinceDepot} / ${v.moyAutresDepot}` : `— / ${v.moyAutresDepot}`,
    'Score camp Princesse contre camp Prince': aH ? pc(v.scorePrincesse, n) : '—',
    'Prince, % des décisives contre la Princesse': aH ? `${pc(v.gPrince, v.gPrince + v.gPrincesse)} (${v.gPrince}/${v.gPrince + v.gPrincesse})` : '—',
    'Corruption du Prince avant la victoire (% des parties)': aH ? pc(v.corrPrinceVict, n) : '—',
    'Nulles, Princesse sur le plateau à la fin': aH ? `${pc(v.nullesAvec, v.avec)} (${v.avec} parties)` : '—',
    'Nulles, Princesse prise': aH ? `${pc(v.nullesSans, v.sans)} (${v.sans} parties)` : '—',
  };
}

const l = ['# Pylo Couronne — tableau comparatif v0.2.1 / v0.3', '',
  'Mêmes graines (1 à 500, chacune jouée deux fois : camps inversés ; en v0.3 la 2e manche inverse aussi Princesse et Prince). Plafond 300 demi-coups. v0.2.1 : Héritiers identiques, un pas en diagonale. v0.3 : Princesse (escorte) et Prince (saut, éclaireur).', ''];
for (const [nom, titre] of SERIES) {
  const a = mesures(lire(path.join(R, nom + '.jsonl'))), b = mesures(lire(path.join(R, 'v0.3', nom + '.jsonl')));
  const extra = nom === 'maitre-maitre' ? mesures(lire(path.join(R, 'v0.3', 'maitre-maitre-prince-sans-saut.jsonl'))) : null;
  l.push(`## ${titre}`, '', `| Mesure | v0.2.1 | v0.3 |${extra ? ' v0.3, Prince porteur sans saut |' : ''}`, `|---|---:|---:|${extra ? '---:|' : ''}`);
  for (const k of Object.keys(b || a || {})) l.push(`| ${k} | ${a?.[k] ?? '—'} | ${b?.[k] ?? '—'} |${extra ? ` ${extra[k] ?? '—'} |` : ''}`);
  l.push('');
}
l.push('**Observation de structure (v0.3)** : un saut de deux cases garde la parité de la rangée et de la colonne. Depuis sa rangée frontière, le Prince d’Ivoire ne peut jamais atteindre D7, ni celui d’Ébène E2 (0 colonne de départ sur 8) : il ne ramasse la couronne adverse que si elle a déjà bougé. D’où presque aucun trajet de vol porté par le Prince ; « éclaireur » ne sert, en pratique, qu’après un premier déplacement de la couronne ou une corruption.', '');
l.push('Trajet de vol : nombre de coups joués par le porteur, du ramassage (ou de la corruption) qui donne la couronne adverse au voleur jusqu’au dépôt, à la perte ou à la reprise ; entre parenthèses, le nombre de trajets. Mesure nouvelle en v0.3 (absente des parties v0.2.1).');
writeFileSync(path.join(R, 'v0.3', 'comparatif.md'), l.join('\n') + '\n');
console.log(l.join('\n'));
