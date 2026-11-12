/* PYLO 1.4 — la règle d'honneur : coup interdit, pris au piège, pat,
   conquête tenue ; l'IA et le worker ne jouent que des coups légaux. */
import assert from 'node:assert/strict';
import { test } from 'node:test';
import { charger, html } from './charger.mjs';

const { E, M, I } = charger();
/* Le moteur vit dans son propre contexte (vm) : on compare des valeurs, pas des prototypes. */
const egal = (a, b, m) => assert.deepEqual(JSON.parse(JSON.stringify(a)), b, m);
const T = { R: 0, G: 1, S: 2, J: 3 };
/** '1RH1' = Ivoire, Roi, en H1. */
function poser(liste, rule = 'honneur', turn = 1) {
  const b = Array(64).fill(0), royals = Array(64).fill(-1);
  let z = 0;
  for (const x of liste) { const i = E.square(x[2], +x.slice(3)); b[i] = E.token(+x[0], T[x[1]]); if (x[1] === 'R') royals[i] = z++ % 4; }
  const s = { b, royals, turn, ply: 20 }; if (rule) s.rule = rule; return s;
}
const coups = (l) => l.map((m) => E.coord(m.from) + E.coord(m.to)).sort();
const COIN = ['1RH1', '2GG2', '2GH2', '2GF3', '2GH3'];   // un roi ivoire immobile et à l'abri, dans son coin

test('coup interdit : on ne laisse jamais son roi capturable (et la règle classique le permet)', () => {
  // Trouvée par recherche : le Roi ivoire C4 et la Sentinelle C6 ; Ébène guette.
  const pieces = ['2GA7', '1SC6', '2RE5', '1RC4', '2RD3', '1SF3', '1RF1'];
  const honneur = poser(pieces), classique = poser(pieces, 'classique');
  const interdits = E.legalMoves(classique).filter((m) => !E.legalMoves(honneur).some((x) => x.from === m.from && x.to === m.to));
  assert.ok(interdits.length >= 1, 'au moins un coup classique devient interdit');
  for (const m of interdits) assert.ok(E.kingCapturable(E.apply(honneur, m), 1), `${E.coord(m.from)}→${E.coord(m.to)} laisserait un roi capturable`);
  for (const m of E.legalMoves(honneur)) assert.equal(E.kingCapturable(E.apply(honneur, m), 1), false, 'aucun coup légal ne laisse un roi capturable');
});

test('pris au piège : menacé, aucune parade → l’adversaire gagne (raison « piege »)', () => {
  // Trouvée par recherche.
  const s = poser(['2RA8', '1RA7', '1SA3', '1SC3', '1RE3', '2GE2', '2RH1']);
  assert.equal(E.kingCapturable(s, 1), true);
  egal(E.legalMoves(s), []);
  assert.ok(E.rawMoves(s).length > 0, 'des coups bruts existent, tous déshonorants');
  egal(M.result(s), { winner: 2, reason: 'piege' });
  egal(E.stalemate(s), { winner: 2, reason: 'piege' });
  assert.ok(E.legalMoves({ ...s, rule: 'classique' }).length > 0, 'en classique, la partie continue');
  assert.equal(M.result({ ...s, rule: 'classique' }), null);
});

test('pat : aucun roi menacé et aucun coup légal → partie nulle', () => {
  const s = poser([...COIN, '1RB2', '1SB1', '2GB3', '2GB4', '2GA3', '2GC3', '2GD4', '2RA8', '2RE8']);
  assert.equal(E.kingCapturable(s, 1), false);
  egal(coups(E.rawMoves(s)), ['B1A1', 'B1C1'], 'la Sentinelle B1 protège son roi : la bouger le livrerait');
  egal(E.legalMoves(s), []);
  egal(M.result(s), { winner: 0, reason: 'pat' });
  // Toucher la Sentinelle clouée : l'entrée dit pourquoi, au lieu de « bloqué ».
  const r = I.resolve(s, { busy: false, ended: false, review: null, mode: 'local', selected: null }, E.square('B', 1));
  assert.equal(r.kind, 'blocked');
  assert.match(r.text, /Règle d’honneur : ce jeton protège un de vos rois/);
});

test('plus de dernier souffle : pris au piège, même avec une prise de roi sous la main', () => {
  const s = poser([...COIN, '1RB1', '2SC1', '2GA2', '2GB2', '2GC2', '2GB3', '2GD3', '1SD5', '2RE5', '2RA8']);
  assert.equal(E.kingCapturable(s, 1), true, 'le Roi B1 est menacé par la Sentinelle C1');
  egal(coups(E.rawMoves(s)), ['D5C5', 'D5F5'], 'la prise du roi E5 existe parmi les coups bruts…');
  egal(E.legalMoves(s), [], '… mais elle laisserait le Roi B1 capturable : interdite');
  egal(M.result(s), { winner: 2, reason: 'piege' });
});

test('conquête tenue : deux palais occupés, la victoire attend le tour suivant', () => {
  // Les rois ivoire B6 (Spiritualité) et F6 (Amour) occupent les deux palais ; c'est à Ébène.
  const s = poser(['1RB6', '1RF6', '2RA8', '2RH8', '1GH1'], 'honneur', 2);
  assert.equal(E.outcome(s), null, 'pas encore : l’adversaire a un coup pour réagir');
  assert.ok(E.legalMoves(s).length > 0);
  const tenu = E.apply(s, E.legalMoves(s).find((m) => E.coord(m.from) === 'H8'));
  egal(E.outcome(tenu), { winner: 1, reason: 'conquest' }, 'le tour revient, les palais sont tenus : conquête');
  egal(E.outcome({ ...s, rule: 'classique' }), { winner: 1, reason: 'conquest' }, 'en classique, immédiate');
  // Aucun coup pour réagir : la conquête tient.
  const bloque = poser(['1RB6', '1RF6', '2RA8', '2RH8', '1GH1'], 'honneur', 2);
  bloque.b[E.square('A', 8)] = 0; bloque.b[E.square('H', 8)] = 0; bloque.b[E.square('A', 1)] = E.token(2, 0); bloque.b[E.square('B', 1)] = E.token(2, 0);
  bloque.b[E.square('A', 2)] = E.token(1, 1); bloque.b[E.square('B', 2)] = E.token(1, 1); bloque.b[E.square('A', 3)] = E.token(1, 1); bloque.b[E.square('B', 3)] = E.token(1, 1); bloque.b[E.square('C', 2)] = E.token(1, 1); bloque.b[E.square('C', 3)] = E.token(1, 1); bloque.b[E.square('D', 3)] = E.token(1, 1);
  egal(E.legalMoves(bloque), [], 'Ébène n’a aucun coup');
  egal(M.result(bloque), { winner: 1, reason: 'conquest' }, 'la conquête tient, ce n’est pas un pat');
});

test('l’IA ne joue que des coups légaux sous la règle d’honneur', () => {
  let s = E.initial(1, 'honneur');
  assert.equal(s.rule, 'honneur');
  let seed = 3; const rng = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
  for (let n = 0; n < 40 && !M.result(s); n++) {
    const r = E.analyse(s, { depth: 2, beam: 8, budgetMs: 5000, rng });
    assert.ok(E.legalMoves(s).some((m) => m.from === r.move.from && m.to === r.move.to), 'coup légal');
    s = E.apply(s, r.move);
    assert.equal(s.rule, 'honneur', 'la règle suit la partie');
    if (!E.outcome(s)) assert.equal(E.kingCapturable(s, 3 - s.turn), false, 'celui qui vient de jouer n’a pas laissé de roi capturable');
  }
});

test('la page : honneur par défaut, réglage « Classique », worker nourri par le moteur de la page', () => {
  const page = html();
  assert.match(page, /settings=\{[^}]*rule:'honneur'/);
  assert.match(page, /<option value="classique">Classique<\/option>/);
  assert.match(page, /getElementById\('pylo-moteur'\)\.textContent/, 'le worker reçoit le moteur de la page, pas une copie');
  assert.doesNotMatch(page, /PYLO_WORKER_URL=URL\.createObjectURL\(new Blob\(\["\/\*/, 'plus de copie du moteur en chaîne');
});
