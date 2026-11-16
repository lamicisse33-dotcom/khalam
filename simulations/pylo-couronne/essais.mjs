/* ── PYLO COURONNE — ESSAIS A/B/C AVANT v0.4 : TABLEAU ──────────────────────
   node simulations/pylo-couronne/essais.mjs
   Lit resultats/v0.4-essais/maitre-maitre-*.jsonl (500 graines × 2) et écrit
   resultats/v0.4-essais/tableau.md. Désigne la meilleure combinaison : le plus
   de conquêtes parmi celles qui ont moins de 35 % de nulles et un premier
   joueur (Ivoire) entre 45 et 58 % des parties décisives.
   A : Prince saut de deux OU pas droit · B : couronnes en D4/E5 · C : compteur 60. */
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { v03 } from './mesures-v03.mjs';

const D = path.join(path.dirname(fileURLToPath(import.meta.url)), 'resultats', 'v0.4-essais');
const ESSAIS = [['v0.3', 'v0.3 telle quelle'], ['A', 'A seule'], ['B', 'B seule'], ['C', 'C seule'], ['A+B', 'A + B'], ['A+B+C', 'A + B + C']];
const lire = (f) => (existsSync(f) ? readFileSync(f, 'utf8').trim().split('\n').map((l) => JSON.parse(l)) : null);
const pc = (x, n) => (n ? (100 * x) / n : NaN), f1 = (x) => (Number.isNaN(x) ? '—' : x.toFixed(1) + ' %');

export function mesurer(R) {
  const n = R.length, dec = R.filter((r) => r.resultat === 'ivoire' || r.resultat === 'ebene'), v = v03(R);
  const L = R.map((r) => r.longueur).sort((a, b) => a - b);
  const vols = R.reduce((s, r) => s + r.vols, 0);
  return {
    conquetes: pc(R.filter((r) => r.raison === 'conquete').length, n), pieges: pc(R.filter((r) => r.raison === 'piege').length, n),
    nulles: pc(R.filter((r) => r.resultat === 'nulle').length, n), nonTerminees: pc(R.filter((r) => r.resultat === 'non-terminee').length, n),
    mediane: L[Math.floor((L.length - 1) / 2)], avecVol: pc(R.filter((r) => r.vols > 0).length, n), vols,
    volsPrince: v.nPrince, volsPrinceDeposes: v.depotsPrince, trajetPrince: v.moyPrince, trajetAutres: v.moyAutres,
    princesse: pc(v.scorePrincesse, n), princeDecisives: pc(v.gPrince, v.gPrince + v.gPrincesse),
    premier: pc(dec.filter((r) => r.resultat === 'ivoire').length, dec.length), decisives: dec.length,
  };
}
export const admissible = (m) => m.nulles < 35 && m.premier >= 45 && m.premier <= 58;

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const lignes = ESSAIS.map(([cle, titre]) => { const R = lire(path.join(D, `maitre-maitre-${cle}.jsonl`)); return R && { cle, titre, m: mesurer(R) }; }).filter(Boolean);
  const ok = lignes.filter((x) => admissible(x.m)).sort((a, b) => b.m.conquetes - a.m.conquetes);
  const l = ['# Pylo Couronne — essais A/B/C avant v0.4 (Maître – Maître)', '',
    '500 graines × 2 (camps et rôles Princesse/Prince inversés à la 2e manche), plafond 300 demi-coups, mêmes graines que la v0.3.',
    'A : le Prince saute de deux OU avance d’un pas en ligne droite (porteur : idem). B : couronnes de départ en D4 (Ivoire) et E5 (Ébène). C : nulle après 60 demi-coups sans progrès (au lieu de 40).', '',
    '| Mesure | ' + lignes.map((x) => x.titre).join(' | ') + ' |', '|---|' + lignes.map(() => '---:').join('|') + '|'];
  const rang = (t, fn) => l.push(`| ${t} | ${lignes.map((x) => fn(x.m)).join(' | ')} |`);
  rang('Conquêtes', (m) => f1(m.conquetes));
  rang('Rois piégés', (m) => f1(m.pieges));
  rang('Nulles', (m) => f1(m.nulles));
  rang('Non terminées (plafond)', (m) => f1(m.nonTerminees));
  rang('Longueur médiane (demi-coups)', (m) => m.mediane);
  rang('Parties avec un vol', (m) => f1(m.avecVol));
  rang('Vols portés par le Prince (déposés)', (m) => `${m.volsPrince} (${m.volsPrinceDeposes}) sur ${m.vols}`);
  rang('Trajet de vol moyen : Prince / autres (coups)', (m) => `${m.trajetPrince} / ${m.trajetAutres}`);
  rang('Score camp Princesse / camp Prince', (m) => `${f1(m.princesse)} / ${f1(100 - m.princesse)}`);
  rang('Prince, % des décisives', (m) => f1(m.princeDecisives));
  rang('Premier joueur (Ivoire), % des décisives', (m) => `${f1(m.premier)} (${m.decisives})`);
  rang('Critère (nulles < 35 %, premier joueur 45–58 %)', (m) => (admissible(m) ? '**oui**' : 'non'));
  l.push('');
  l.push(ok.length ? `**Meilleure combinaison : ${ok[0].titre}** (${f1(ok[0].m.conquetes)} de conquêtes, ${f1(ok[0].m.nulles)} de nulles, premier joueur ${f1(ok[0].m.premier)}).`
    : '**Aucune combinaison ne remplit le critère** (nulles < 35 % et premier joueur entre 45 et 58 %).');
  if (!ok.length) {
    const ecart = (m) => (m.premier < 45 ? 45 - m.premier : m.premier > 58 ? m.premier - 58 : 0);
    const proche = lignes.filter((x) => x.m.nulles < 35).sort((a, b) => ecart(a.m) - ecart(b.m) || b.m.conquetes - a.m.conquetes)[0];
    if (proche) l.push(`La plus proche : **${proche.titre}** — nulles ${f1(proche.m.nulles)}, premier joueur ${f1(proche.m.premier)} (${ecart(proche.m).toFixed(1)} point au-delà de 58 % ; sur ${proche.m.decisives} parties décisives, l’écart type d’une proportion est d’environ ${(100 * Math.sqrt(0.58 * 0.42 / proche.m.decisives)).toFixed(1)} point). C’est elle qui est éprouvée en Maître – Apprenti ci-dessous.`);
  }
  for (const [cle, titre] of ESSAIS) {
    const R = lire(path.join(D, `maitre-apprenti-${cle}.jsonl`));
    if (!R) continue;
    const m = mesurer(R), blanc = R.reduce((t, r) => t + (r.gagnantIA === 'blanc' ? 1 : r.gagnantIA === null ? 0.5 : 0), 0);
    l.push('', `## Maître – Apprenti, ${titre}`, '', '| Mesure | Valeur |', '|---|---:|');
    for (const [t, v] of [['Conquêtes', f1(m.conquetes)], ['Rois piégés', f1(m.pieges)], ['Nulles', f1(m.nulles)], ['Non terminées (plafond)', f1(m.nonTerminees)], ['Longueur médiane', m.mediane], ['Parties avec un vol', f1(m.avecVol)],
      ['Vols portés par le Prince (déposés)', `${m.volsPrince} (${m.volsPrinceDeposes}) sur ${m.vols}`], ['Score camp Princesse / camp Prince', `${f1(m.princesse)} / ${f1(100 - m.princesse)}`],
      ['Premier joueur (Ivoire), % des décisives', `${f1(m.premier)} (${m.decisives})`], ['Score du Maître contre l’Apprenti', f1(pc(blanc, R.length))]]) l.push(`| ${t} | ${v} |`);
  }
  l.push('', '« Vols portés par le Prince » : trajets de vol dont le porteur est le Prince (entre parenthèses, ceux qui finissent déposés au palais), sur le nombre total de vols entrepris.');
  writeFileSync(path.join(D, 'tableau.md'), l.join('\n') + '\n');
  console.log(l.join('\n'));
  console.log('MEILLEURE=' + (ok[0]?.cle ?? ''));
}
