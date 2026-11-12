/* PYLO — simulation avant d'activer la règle d'honneur par défaut.
   node tests/pylo/simulation.mjs [parties=1000] [oui|non : dernier souffle] [tenue : conquête tenue]
   Maître (profondeur 3) contre Maître, et Maître contre Apprenti
   (profondeur 1, le Maître alterne Ivoire/Ébène), règle d'honneur contre
   classique. Moteur chargé depuis la page ; recherche sans limite de temps
   (déterministe à graine égale) ; 300 demi-coups au plus (« limite »). */
import { Worker, isMainThread, parentPort, workerData } from 'node:worker_threads';
import { availableParallelism } from 'node:os';
import { charger } from './charger.mjs';

const LIMITE = 300, BEAM = 8;

function partie({ rule, profondeurs, graine, souffle, tenue }) {
  const { E, M } = charger();
  let x = graine * 7919 + 13; const rng = () => (x = (x * 16807) % 2147483647) / 2147483647;
  let s = E.initial(1, rule); if (souffle === false) s.souffle = false;
  if (tenue && rule === 'honneur') s.tenue = tenue;
  const vues = [E.key(s)]; let souffles = 0, fin = null;
  while (!(fin = M.result(s, vues, LIMITE))) {
    const r = E.analyse(s, { depth: profondeurs[s.turn], beam: BEAM, budgetMs: 1e9, rng, seen: vues });
    if (!r) { fin = { winner: 0, reason: 'blocked' }; break; }
    if (r.move.souffle) souffles++;
    s = E.apply(s, r.move); vues.push(E.key(s));
  }
  return { winner: fin.winner, reason: fin.reason, plies: s.ply, souffles };
}

if (!isMainThread) {
  for (const t of workerData) parentPort.postMessage(partie(t));
  parentPort.postMessage(null);
} else {
  const N = Number(process.argv[2] || 1000), souffle = process.argv[3] !== 'non', tenue = process.argv.includes('tenue');
  const taches = [];
  for (const rule of ['classique', 'honneur']) for (const duel of ['Maître–Maître', 'Maître–Apprenti']) for (let i = 0; i < N; i++) {
    const maitreIvoire = i % 2 === 0;
    const profondeurs = duel === 'Maître–Maître' ? { 1: 3, 2: 3 } : maitreIvoire ? { 1: 3, 2: 1 } : { 1: 1, 2: 3 };
    taches.push({ rule, duel, profondeurs, graine: i + 1, maitreIvoire, souffle: rule === 'honneur' ? souffle : undefined, tenue });
  }
  const n = availableParallelism(), lots = Array.from({ length: n }, () => []);
  taches.forEach((t, i) => lots[i % n].push(t));
  const resultats = []; const t0 = Date.now(); let fini = 0;
  await Promise.all(lots.map((lot) => new Promise((ok, ko) => {
    const w = new Worker(new URL(import.meta.url), { workerData: lot }); let k = 0;
    w.on('message', (r) => { if (r === null) return ok(); resultats.push({ ...lot[k++], ...r }); if (++fini % 200 === 0) process.stderr.write(`${fini}/${taches.length} (${Math.round((Date.now() - t0) / 1000)} s)\n`); });
    w.on('error', ko);
  })));
  const med = (a) => { const s = [...a].sort((x, y) => x - y); return s.length % 2 ? s[s.length >> 1] : (s[s.length / 2 - 1] + s[s.length / 2]) / 2; };
  const pc = (k, n) => (100 * k / n).toFixed(1) + ' %';
  const lignes = [];
  for (const duel of ['Maître–Maître', 'Maître–Apprenti']) for (const rule of ['classique', 'honneur']) {
    const r = resultats.filter((x) => x.duel === duel && x.rule === rule), n = r.length;
    const cnt = (f) => r.filter(f).length;
    const l = {
      duel, regle: rule, parties: n, longueur_mediane: med(r.map((x) => x.plies)),
      captures: pc(cnt((x) => x.reason === 'royal'), n), conquetes: pc(cnt((x) => x.reason === 'conquest'), n),
      pieges: pc(cnt((x) => x.reason === 'piege'), n), nulles: pc(cnt((x) => x.winner === 0), n),
      detail_nulles: Object.fromEntries(['repetition', 'pat', 'limit', 'blocked'].map((k) => [k, cnt((x) => x.winner === 0 && x.reason === k)])),
      premier_joueur: `Ivoire ${pc(cnt((x) => x.winner === 1), n)} · Ébène ${pc(cnt((x) => x.winner === 2), n)}`,
      dernier_souffle: cnt((x) => x.souffles > 0),
    };
    if (duel === 'Maître–Apprenti') l.maitre_gagne = pc(cnt((x) => x.winner === (x.maitreIvoire ? 1 : 2)), n);
    lignes.push(l);
  }
  for (const duel of ['Maître–Maître', 'Maître–Apprenti']) {
    const [c, h] = lignes.filter((l) => l.duel === duel);
    lignes.find((l) => l === h).rapport_longueur = +(h.longueur_mediane / c.longueur_mediane).toFixed(2);
  }
  console.log(JSON.stringify({ parties_par_case: N, dernier_souffle: souffle, conquete_tenue: tenue, duree_s: Math.round((Date.now() - t0) / 1000), lignes }, null, 1));
}
