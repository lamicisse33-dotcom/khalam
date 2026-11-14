/* ── PYLO COURONNE — SIMULATION ─────────────────────────────────────────────
   node simulations/pylo-couronne/simuler.mjs --blanc maitre --noir apprenti \
        --parties 1000 --graine 1 --sortie simulations/pylo-couronne/resultats/
   Options : --heritiers oui|non (oui)  --beam-maitre 8  --travailleurs N  --nom serie

   Parties APPARIÉES : chaque graine est jouée deux fois, l'IA « blanc » avec
   Ivoire (premier joueur) puis avec Ébène. Même position de départ (Héritiers
   tirés de la graine) ; le hasard des IA (±1 %) vient de la graine et de la
   manche, sinon deux IA de même niveau rejoueraient deux fois la même partie.
   Une graine et une manche rejouent toujours la même partie, quel que soit le
   nombre de travailleurs. Plafond technique : 300 demi-coups → « non terminée ».
   Même moteur que la page : jeux/pylo/couronne/moteur.js. */
import { createRequire } from 'node:module';
import { Worker, isMainThread, parentPort, workerData } from 'node:worker_threads';
import { mkdirSync, writeFileSync } from 'node:fs';
import { cpus } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const P = require('../../jeux/pylo/couronne/moteur.js');
const PLAFOND = 300;

function opts(argv) {
  const o = { blanc: 'maitre', noir: 'maitre', parties: 20, graine: 1, sortie: 'simulations/pylo-couronne/resultats/', heritiers: 'oui', 'beam-maitre': 8, travailleurs: Math.max(1, cpus().length - 2), nom: '' };
  for (let i = 0; i < argv.length; i += 2) o[argv[i].replace(/^--/, '')] = argv[i + 1];
  o.parties = Number(o.parties); o.graine = Number(o.graine); o['beam-maitre'] = Number(o['beam-maitre']); o.travailleurs = Number(o.travailleurs);
  if (o.parties % 2) throw new Error('--parties doit être pair (parties appariées)');
  return o;
}
const reglage = (niveau, o) => ({ niveau, beam: niveau === 'maitre' ? o['beam-maitre'] : undefined });

/* Une partie, avec son journal d'observations. */
function jouerPartie(graine, manche, o) {
  const iaIvoire = manche === 0 ? o.blanc : o.noir, iaEbene = manche === 0 ? o.noir : o.blanc;
  const partie = P.creerPartie({ graine, heritiers: o.heritiers !== 'non', plafond: PLAFOND });
  const hasard = P.mulberry32((graine * 2654435761 + manche * 97 + 13) >>> 0);
  const t0 = Date.now();
  const obs = { vols: 0, sorties: 0, blocages: 0, solGarde: 0, corruptions: 0, corruptionsParCamp: [0, 0, 0], heritiersPris: 0, deuxVolees: false };
  const serieBloc = [0, 0, 0], serieSol = [0, 0, 0];
  while (!partie.resultat) {
    const s = P.etatActuel(partie);
    const a = P.analyser(s, { ...reglage(s.tour === 1 ? iaIvoire : iaEbene, o), hasard, vus: partie.vus });
    const n = P.jouerCoup(partie, a.coup);
    const ev = n.ev;
    if (ev.vol) obs.vols++;
    if (ev.sortie) obs.sorties++;
    if (ev.corrompus.length) { obs.corruptions += ev.corrompus.length; obs.corruptionsParCamp[s.tour] += ev.corrompus.length; }
    if (ev.heritierPris) obs.heritiersPris++;
    for (const k of [1, 2]) {
      const C = n.c[k];
      // Blocage : portée à ≤ 2 du palais de destination, sans y entrer, 10 demi-coups de suite.
      const d = C.porte ? (P.palaisDe(C.sq) === P.camp(n.b[C.sq]) ? 0 : P.distance(P.sorte(n.b[C.sq]), P.camp(n.b[C.sq]), C.sq)) : -1;
      serieBloc[k] = d > 0 && d <= 2 ? serieBloc[k] + 1 : 0;
      if (serieBloc[k] === 10) obs.blocages++;
      // Couronne au sol hors de tout palais, 10 demi-coups de suite.
      serieSol[k] = !C.porte && !P.palaisDe(C.sq) ? serieSol[k] + 1 : 0;
      if (serieSol[k] === 10) obs.solGarde++;
    }
    if (n.c[1].porte && n.c[2].porte && P.camp(n.b[n.c[1].sq]) === 2 && P.camp(n.b[n.c[2].sq]) === 1) obs.deuxVolees = true;
  }
  const r = partie.resultat;
  const gagnantIA = r.gagnant === 0 ? null : (r.gagnant === 1) === (manche === 0) ? 'blanc' : 'noir';
  return {
    graine, manche, ivoire: iaIvoire, ebene: iaEbene, heritiers: o.heritiers !== 'non',
    resultat: r.gagnant ? (r.gagnant === 1 ? 'ivoire' : 'ebene') : (r.raison === 'plafond' ? 'non-terminee' : 'nulle'),
    raison: r.raison, gagnantIA, longueur: partie.coups.length,
    vols: obs.vols, sorties: obs.sorties, blocages: obs.blocages, solGarde: obs.solGarde,
    corruptions: obs.corruptions, heritiersPris: obs.heritiersPris, deuxVolees: obs.deuxVolees,
    corruptionAvantVictoire: r.gagnant ? obs.corruptionsParCamp[r.gagnant] > 0 : false,
    ms: Date.now() - t0,
    coups: partie.coups.map((m) => P.notation(m)).join(' '),
  };
}

if (!isMainThread) {
  const { taches, o } = workerData;
  for (const [g, m] of taches) parentPort.postMessage(jouerPartie(g, m, o));
} else {
  const o = opts(process.argv.slice(2));
  const nom = o.nom || `${o.blanc}-${o.noir}${o.heritiers === 'non' ? '-sans-heritiers' : ''}`;
  const taches = [];
  for (let g = o.graine; g < o.graine + o.parties / 2; g++) taches.push([g, 0], [g, 1]);
  const nT = Math.min(o.travailleurs, taches.length), lots = Array.from({ length: nT }, () => []);
  taches.forEach((t, i) => lots[i % nT].push(t));
  const resultats = [], t0 = Date.now();
  await Promise.all(lots.map((lot) => new Promise((ok, ko) => {
    const w = new Worker(fileURLToPath(import.meta.url), { workerData: { taches: lot, o } });
    w.on('message', (r) => { resultats.push(r); if (resultats.length % 50 === 0) process.stderr.write(`${nom} : ${resultats.length}/${taches.length} (${((Date.now() - t0) / 1000).toFixed(0)} s)\n`); });
    w.on('error', ko); w.on('exit', ok);
  })));
  resultats.sort((a, b) => a.graine - b.graine || a.manche - b.manche);
  mkdirSync(o.sortie, { recursive: true });
  writeFileSync(path.join(o.sortie, nom + '.jsonl'), resultats.map((r) => JSON.stringify(r)).join('\n') + '\n');
  const md = resume(resultats, o, nom, (Date.now() - t0) / 1000);
  writeFileSync(path.join(o.sortie, nom + '.md'), md);
  console.log(md);
}

function resume(R, o, nom, secondes) {
  const n = R.length, pc = (x, tot = n) => (tot ? ((100 * x) / tot).toFixed(1) : '0.0') + ' %';
  const compte = (f) => R.filter(f).length;
  const L = R.map((r) => r.longueur).sort((a, b) => a - b), q = (p) => L[Math.min(L.length - 1, Math.floor(p * (L.length - 1)))];
  const Lf = R.filter((r) => r.resultat !== 'non-terminee').map((r) => r.longueur).sort((a, b) => a - b), qf = (p) => Lf.length ? Lf[Math.min(Lf.length - 1, Math.floor(p * (Lf.length - 1)))] : '—';
  const conq = compte((r) => r.raison === 'conquete'), piege = compte((r) => r.raison === 'piege');
  const nulles = R.filter((r) => r.resultat === 'nulle'), nt = R.filter((r) => r.resultat === 'non-terminee');
  const parRaison = (x) => nulles.filter((r) => r.raison === x).length;
  const decisives = conq + piege, ivoireGagne = compte((r) => r.resultat === 'ivoire');
  const scoreBlanc = R.reduce((s, r) => s + (r.gagnantIA === 'blanc' ? 1 : r.gagnantIA === null && r.resultat === 'nulle' ? 0.5 : r.gagnantIA === null ? 0.5 : 0), 0);
  const dv = R.filter((r) => r.deuxVolees);
  const issue = (A) => `${A.filter((r) => r.raison === 'conquete').length} conquêtes, ${A.filter((r) => r.raison === 'piege').length} rois piégés, ${A.filter((r) => r.resultat === 'nulle').length} nulles, ${A.filter((r) => r.resultat === 'non-terminee').length} non terminées`;
  const sol = R.filter((r) => r.solGarde > 0), sortie = R.filter((r) => r.sorties > 0);
  const corr = R.reduce((s, r) => s + r.corruptions, 0), hp = R.reduce((s, r) => s + r.heritiersPris, 0);
  const victoires = R.filter((r) => r.gagnantIA !== null);
  const ms = R.map((r) => r.ms), msMoy = ms.reduce((a, b) => a + b, 0) / n;
  const courtes = nt.slice().sort((a, b) => a.longueur - b.longueur).slice(0, 5);
  const l = [];
  l.push(`# Pylo Couronne v0.1 — série ${nom}`, '');
  l.push(`- IA « blanc » : **${o.blanc}** · IA « noir » : **${o.noir}** · Héritiers : **${o.heritiers}** · beam du Maître : ${o['beam-maitre']}`);
  l.push(`- ${n} parties appariées (${n / 2} graines × 2, camps inversés), graines ${o.graine} à ${o.graine + n / 2 - 1} · plafond ${PLAFOND} demi-coups`);
  l.push(`- Temps : ${secondes.toFixed(0)} s au total, ${(msMoy / 1000).toFixed(2)} s par partie en moyenne (un cœur)`, '');
  l.push('## Issues', '', '| Issue | Parties | % |', '|---|---:|---:|');
  l.push(`| Victoire par conquête | ${conq} | ${pc(conq)} |`, `| Victoire par roi piégé | ${piege} | ${pc(piege)} |`);
  for (const [x, t] of [['calme', 'Nulle — 40 demi-coups sans progrès'], ['repetition', 'Nulle — triple répétition'], ['pat', 'Nulle — pat']]) l.push(`| ${t} | ${parRaison(x)} | ${pc(parRaison(x))} |`);
  l.push(`| **Nulles (total)** | ${nulles.length} | ${pc(nulles.length)} |`, `| Non terminées (plafond, à part) | ${nt.length} | ${pc(nt.length)} |`, '');
  l.push('## Longueur (demi-coups)', '');
  l.push(`- Toutes les parties : médiane **${q(0.5)}**, quartiles ${q(0.25)} – ${q(0.75)} (min ${L[0]}, max ${L[L.length - 1]})`);
  l.push(`- Parties terminées seulement : médiane ${qf(0.5)}, quartiles ${qf(0.25)} – ${qf(0.75)}`, '');
  l.push('## Équilibre', '');
  l.push(`- Victoires du premier joueur (Ivoire) : **${pc(ivoireGagne)}** de toutes les parties ; ${pc(ivoireGagne, decisives)} des parties décisives (${ivoireGagne}/${decisives})`);
  l.push(`- Score de « blanc » (${o.blanc}) contre « noir » (${o.noir}) : **${scoreBlanc}/${n} = ${pc(scoreBlanc)}** (victoire 1, nulle ou non terminée ½, défaite 0)`, '');
  l.push('## Couronnes', '');
  l.push(`- Parties avec au moins un vol entrepris : **${pc(compte((r) => r.vols > 0))}** (${(R.reduce((s, r) => s + r.vols, 0) / n).toFixed(2)} vols par partie)`);
  l.push(`- Les deux couronnes volées en même temps : ${dv.length} parties (${pc(dv.length)}) → ${issue(dv)}`);
  l.push(`- Blocage (portée à ≤ 2 cases de son palais de destination pendant ≥ 10 demi-coups sans entrer) : **${pc(compte((r) => r.blocages > 0))}** des parties`);
  l.push(`- Couronne au sol hors palais ≥ 10 demi-coups : ${pc(sol.length)} des parties ; ${sol.filter((r) => r.resultat === 'nulle').length}/${nulles.length} nulles (${pc(sol.filter((r) => r.resultat === 'nulle').length, nulles.length)}) en contiennent une`);
  l.push(`- Sorties de sa propre couronne hors de son palais : ${pc(sortie.length)} des parties (${(R.reduce((s, r) => s + r.sorties, 0) / n).toFixed(2)} par partie) ; ${sortie.filter((r) => r.resultat === 'non-terminee').length}/${nt.length} non terminées (${pc(sortie.filter((r) => r.resultat === 'non-terminee').length, nt.length)}) en contiennent une`, '');
  l.push('## Héritiers', '');
  l.push(`- Corruptions : ${(corr / n).toFixed(2)} par partie (${pc(compte((r) => r.corruptions > 0))} des parties en ont au moins une)`);
  l.push(`- Captures d’Héritier : ${(hp / n).toFixed(2)} par partie`);
  l.push(`- Victoires précédées d’une corruption par le vainqueur : ${victoires.filter((r) => r.corruptionAvantVictoire).length}/${victoires.length} (${pc(victoires.filter((r) => r.corruptionAvantVictoire).length, victoires.length)})`, '');
  l.push('## Les 5 parties non terminées les plus courtes', '');
  if (!courtes.length) l.push('Aucune partie non terminée.');
  for (const r of courtes) l.push(`- graine ${r.graine}, manche ${r.manche} (Ivoire ${r.ivoire}, Ébène ${r.ebene}), ${r.longueur} demi-coups :`, '', '  `' + r.coups + '`', '');
  l.push('', `Notation : D1-D2 déplacement, C3xE5 prise, +Ci/+Ce ramasse la couronne d’Ivoire/d’Ébène, ↓ dépôt au palais, ~F5 corruption de l’Héritier en F5.`);
  return l.join('\n') + '\n';
}
