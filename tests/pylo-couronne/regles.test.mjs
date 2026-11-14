/* PYLO COURONNE v0.1 — les règles, une par une (node --test tests/pylo-couronne/). */
import test from 'node:test';
import assert from 'node:assert/strict';
import { P, c, pos, coups, depuis, trouver, apres } from './charger.mjs';

const piece = (s, x) => { const v = s.b[c(x)]; return v ? [P.camp(v), P.NOMS[P.sorte(v)]] : null; };

test('placements de départ : 8 pièces par camp, symétrie 180°, couronnes, Ivoire au trait', () => {
  const s = P.initial({ heritiers: false });
  const attendu = { D1: 'Roi', E1: 'Reine', C2: 'Garde', F2: 'Garde', B3: 'Sentinelle', G3: 'Sentinelle', A3: 'Sauteur', H3: 'Sauteur' };
  for (const [x, nom] of Object.entries(attendu)) assert.deepEqual(piece(s, x), [1, nom], x);
  const eb = { E8: 'Roi', D8: 'Reine', F7: 'Garde', C7: 'Garde', G6: 'Sentinelle', B6: 'Sentinelle', H6: 'Sauteur', A6: 'Sauteur' };
  for (const [x, nom] of Object.entries(eb)) assert.deepEqual(piece(s, x), [2, nom], x);
  assert.equal(s.b.filter(Boolean).length, 16);
  assert.equal(P.nomCase(s.c[1].sq), 'E2'); assert.equal(P.nomCase(s.c[2].sq), 'D7');
  assert.equal(s.c[1].porte || s.c[2].porte, false);
  assert.equal(s.tour, 1);
  assert.deepEqual(P.PALAIS[1].map(P.nomCase).sort(), ['D1', 'D2', 'E1', 'E2']);
  assert.deepEqual(P.PALAIS[2].map(P.nomCase).sort(), ['D7', 'D8', 'E7', 'E8']);
});

test('Héritiers : rangée 4 (Ivoire) et 5 (Ébène), case libre, Princesse/Prince inversés une graine sur deux', () => {
  const colonnes = new Set();
  for (let g = 1; g <= 40; g++) {
    const s = P.initial({ graine: g });
    const h = P.heritiers(s);
    assert.equal(h.length, 2);
    const iv = h.find((x) => x.camp === 1), eb = h.find((x) => x.camp === 2);
    assert.equal(P.nomCase(iv.sq)[1], '4'); assert.equal(P.nomCase(eb.sq)[1], '5');
    assert.equal(s.b.filter(Boolean).length, 18);
    assert.equal(iv.sorte, g % 2 ? P.PRINCE : P.PRINCESSE, 'graine ' + g);
    assert.equal(eb.sorte, g % 2 ? P.PRINCESSE : P.PRINCE);
    colonnes.add(P.nomCase(iv.sq)[0] + P.nomCase(eb.sq)[0]);
    assert.deepEqual(P.heritiers(P.initial({ graine: g })), h, 'même graine, même placement');
  }
  assert.ok(colonnes.size > 10, 'colonnes tirées au sort, indépendantes');
  assert.equal(P.heritiers(P.initial({ graine: 3, heritiers: false })).length, 0);
});

test('déplacements : Reine 8 directions, Garde colonne, Sentinelle ligne, Sauteur (sans couronne) deux cases en diagonale, Héritier diagonale', () => {
  const s = pos(`
    8 . . . . . . . r
    4 . . Q . . G . .
    2 J . . . . S . F
    1 . . . R . . . .
    couronnes: ivoire=H8 ebene=A8`);
  assert.deepEqual(depuis(s, 'C4'), ['C4-B3', 'C4-B4', 'C4-B5', 'C4-C3', 'C4-C5', 'C4-D3', 'C4-D4', 'C4-D5']);
  assert.deepEqual(depuis(s, 'F4'), ['F4-F3', 'F4-F5']);
  assert.deepEqual(depuis(s, 'F2'), ['F2-E2', 'F2-G2']);
  assert.deepEqual(depuis(s, 'A2'), [], 'C4 occupée : le Sauteur n’a aucune arrivée');
  const s2 = apres(s, 'C4-B4', 'H8-H7');
  assert.deepEqual(depuis(s2, 'A2'), ['A2-C4'], 'il survole B3 (vide) ; la case survolée ne compte pas');
  assert.deepEqual(depuis(apres(s, 'C4-B3', 'H8-H7'), 'A2'), ['A2-C4'], 'il survole une pièce amie');
  assert.deepEqual(depuis(s, 'H2'), ['H2-G1', 'H2-G3']);
});

test('Roi : avant droit ou diagonal, jamais de côté ; recul seulement dans le royaume adverse, sans repasser la frontière', () => {
  const chez = pos(`
    8 . . . . . . . r
    3 . . . R . . . .
    couronnes: ivoire=H1 ebene=A8`);
  assert.deepEqual(depuis(chez, 'D3'), ['D3-C4', 'D3-D4', 'D3-E4']);
  const loin = pos(`
    8 . . . . . . . r
    6 . . . R . . . .
    couronnes: ivoire=H1 ebene=A8`);
  assert.deepEqual(depuis(loin, 'D6'), ['D6-C5', 'D6-C7', 'D6-D5', 'D6-D7', 'D6-E5', 'D6-E7']);
  const frontiere = pos(`
    8 . . . . . . . r
    5 . . . R . . . .
    couronnes: ivoire=H1 ebene=A8`);
  assert.deepEqual(depuis(frontiere, 'D5'), ['D5-C6', 'D5-D6', 'D5-E6'], 'pas de recul vers la rangée 4');
  const ebene = pos(`
    3 . . . . r . . .
    1 R . . . . . . .
    couronnes: ivoire=H1 ebene=A8
    tour: ebene`);
  assert.deepEqual(depuis(ebene, 'E3'), ['E3-D2', 'E3-D4', 'E3-E2', 'E3-E4', 'E3-F2', 'E3-F4'], 'Ébène : avant = vers la rangée 1 ; recul permis dans le royaume d’Ivoire');
  const bord = pos(`
    4 . . . . r . . .
    1 R . . . . . . .
    couronnes: ivoire=H1 ebene=A8
    tour: ebene`);
  assert.deepEqual(depuis(bord, 'E4'), ['E4-D3', 'E4-E3', 'E4-F3'], 'pas de recul vers la rangée 5');
});

test('prise par saut (Garde, Sauteur, Roi en recul chez l’adversaire)', () => {
  const s = pos(`
    8 . . . . . . . r
    6 . . . g . . . .
    5 . . . G . . . .
    3 J . . . . . . .
    2 . s . . . . . .
    1 R . . . . . . .
    couronnes: ivoire=H1 ebene=A8`);
  assert.deepEqual(depuis(s, 'D5'), ['D5-D4', 'D5xD7']);
  assert.ok(depuis(s, 'A3').includes('A3xC1'), 'le Sauteur prend en survolant');
  const n = P.jouer(s, trouver(s, 'D5xD7'));
  assert.equal(n.b[c('D6')], 0); assert.deepEqual(piece(n, 'D7'), [1, 'Garde']); assert.equal(n.calme, 0);
  const bloque = pos(`
    8 . . . . . . . r
    7 . . . g . . . .
    6 . . . g . . . .
    5 . . . G . . . .
    1 R . . . . . . .
    couronnes: ivoire=H1 ebene=A8`);
  assert.deepEqual(depuis(bloque, 'D5'), ['D5-D4'], 'case d’arrivée occupée : pas de prise');
  const recul = pos(`
    8 . . . . . . . r
    7 . . . R . . . .
    6 . . . . g . . .
    couronnes: ivoire=H1 ebene=A8`);
  assert.ok(depuis(recul, 'D7').includes('D7xF5'), 'recul en prise dans le royaume adverse');
  const frontiere = pos(`
    8 . . . . . . . r
    6 . . . R . . . .
    5 . . . . g . . .
    couronnes: ivoire=H1 ebene=A8`);
  assert.ok(!depuis(frontiere, 'D6').includes('D6xF4'), 'pas de prise en reculant au-delà de la frontière');
});

test('règle d’honneur : un coup qui laisse son roi capturable est illégal', () => {
  const s = pos(`
    8 . . . . . . . r
    5 . . . . g . . .
    4 . . . . R . . .
    3 . . . . S . . .
    couronnes: ivoire=H1 ebene=A8`);
  assert.equal(P.roiPrenable(s, 1), false);
  assert.deepEqual(depuis(s, 'E3'), [], 'la Sentinelle E3 couvre le Roi : ses pas de côté ouvriraient E5xE3');
  assert.equal(P.brut(s).filter((m) => m.de === c('E3')).length, 2, 'ces coups existent sans la règle d’honneur');
  assert.deepEqual(depuis(s, 'E4'), ['E4-D5', 'E4-F5', 'E4xE6'], 'la prise est permise, jamais obligatoire');
});

test('roi piégé : menacé sans parade = défaite ; pat = nulle', () => {
  const piege = pos(`
    8 . . . . . . . r
    4 . s . s . s . .
    3 . . s g s . . .
    2 . . . R . . . .
    couronnes: ivoire=H1 ebene=A8`);
  assert.equal(P.roiPrenable(piege, 1), true);
  assert.deepEqual(coups(piege), []);
  assert.deepEqual(P.fin(piege), { gagnant: 2, raison: 'piege' });
  const pat = pos(`
    8 . . . . . . . r
    4 . s . g . s . .
    3 . . s . s . . .
    2 . . . R . . . .
    couronnes: ivoire=H1 ebene=A8`);
  assert.equal(P.roiPrenable(pat, 1), false);
  assert.deepEqual(coups(pat), [], 'D3 laisserait le Roi sous la Garde D4');
  assert.deepEqual(P.fin(pat), { gagnant: 0, raison: 'pat' });
});

test('palais petit : pas de 3e pièce de son camp dans son palais ; les pièces adverses y entrent librement', () => {
  const s = pos(`
    8 . . . . . . . r
    3 . . . G . . . .
    2 . . . . . . . .
    1 . . . R Q . . .
    couronnes: ivoire=H1 ebene=A8`);
  assert.deepEqual(depuis(s, 'D3'), ['D3-D4'], 'D3-D2 ferait une 3e pièce au palais');
  assert.ok(depuis(s, 'D1').includes('D1-D2') && depuis(s, 'E1').includes('E1-E2'), 'bouger à l’intérieur reste permis');
  const adv = pos(`
    8 . . . . . . . r
    3 . . . g . . . .
    1 . . . R Q . . .
    couronnes: ivoire=H1 ebene=A8
    tour: ebene`);
  assert.ok(depuis(adv, 'D3').includes('D3-D2'));
});

test('couronne : ramassée en terminant dessus, jamais en passant ni en survolant', () => {
  const s = pos(`
    8 . . . . . . . r
    5 . . . . . . . .
    3 . . . . . . . .
    2 . . . . . . . .
    1 J . . R . . . G
    couronnes: ivoire=H5 ebene=B2`);
  assert.deepEqual(depuis(s, 'A1'), ['A1-C3'], 'survoler B2 ne ramasse pas');
  const n = P.jouer(s, trouver(s, 'A1-C3'));
  assert.equal(n.c[2].porte, false); assert.equal(P.nomCase(n.c[2].sq), 'B2');
  const g = pos(`
    8 . . . . . . . r
    3 . . . . . . . G
    1 . . . R . . . .
    couronnes: ivoire=H5 ebene=H4`);
  assert.deepEqual(depuis(g, 'H3'), ['H3-H2', 'H3-H4+Ce'], 'terminer sur la couronne la ramasse (un seul coup)');
  const n2 = P.jouer(g, trouver(g, 'H3-H4+Ce'));
  assert.equal(n2.c[2].porte, true); assert.equal(P.nomCase(n2.c[2].sq), 'H4');
  assert.deepEqual(n2.c[2].trajet.camp, 1);
  const deux = pos(`
    8 . . . . . . . r
    3 . . . . . . . G
    1 . . . R . . . .
    couronnes: ivoire=H4 ebene=H4`);
  assert.deepEqual(depuis(deux, 'H3'), ['H3-H2', 'H3-H4+Ce', 'H3-H4+Ci'], 'les deux couronnes : un coup par couronne');
  const porteur = P.jouer(deux, trouver(deux, 'H3-H4+Ci'));
  const p2 = P.jouer(P.jouer(porteur, trouver(porteur, 'H8-H7')), trouver(P.jouer(porteur, trouver(porteur, 'H8-H7')), 'H4-H3'));
  assert.equal(p2.c[2].sq, c('H4'), 'un porteur ne ramasse pas une seconde couronne');
});

test('sa couronne au sol dans son palais : « entrer » et « entrer et ramasser » ; l’emporter dehors est permis', () => {
  const s = pos(`
    8 . . . . . . . r
    3 . . . . G . . .
    1 . . . R . . . .
    couronnes: ivoire=E2 ebene=A8`);
  assert.deepEqual(depuis(s, 'E3'), ['E3-E2', 'E3-E2+Ci', 'E3-E4']);
  const n = P.jouer(s, trouver(s, 'E3-E2'));
  assert.equal(n.c[1].porte, false);
  const r = P.jouer(s, trouver(s, 'E3-E2+Ci'));
  assert.equal(r.c[1].porte, true);
  const dehors = apres(r, 'H8-H7', 'E2-E3');
  assert.equal(dehors.c[1].porte, true); assert.equal(P.nomCase(dehors.c[1].sq), 'E3');
  assert.equal(dehors.ev.sortie, 1);
});

test('un porteur ne prend jamais ; v0.2 : le Sauteur porteur fait un pas en diagonale, sans saut ni prise', () => {
  const s = pos(`
    8 . . . . . . . r
    6 . . . . . . . .
    5 . . . g . . . .
    4 . . . G . . . .
    1 R . . . . . . .
    couronnes: ivoire=H1 ebene=D4*`);
  assert.deepEqual(depuis(s, 'D4'), ['D4-D3']);
  const j = pos(`
    8 . . . . . . . r
    5 . . . . . . . .
    4 . . . . g . G .
    3 . . . J . . . .
    1 R . . . . . . .
    couronnes: ivoire=H1 ebene=D3*`);
  assert.deepEqual(depuis(j, 'D3'), ['D3-C2', 'D3-C4', 'D3-E2↓'], 'un pas en diagonale (E2 : dépôt au palais) ; E4 est occupée, aucune prise, aucun saut');
  const libre = pos(`
    8 . . . . . . . r
    4 . . . . g . G .
    3 . . . J . . . .
    1 R . . . . . . .
    couronnes: ivoire=H1 ebene=A8`);
  assert.ok(depuis(libre, 'D3').includes('D3xF5'), 'sans couronne, la même prise existe');
});

test('porteur pris : la couronne reste au sol sur sa case', () => {
  const s = pos(`
    8 . . . . . . . r
    5 . . . g . . . .
    4 . . . G . . . .
    1 R . . . . . . .
    couronnes: ivoire=H1 ebene=D5*
    tour: ivoire`);
  const n = P.jouer(s, trouver(s, 'D4xD6'));
  assert.equal(n.c[2].porte, false); assert.equal(P.nomCase(n.c[2].sq), 'D5');
});

test('dépôt en entrant dans son palais ; conquête quand les deux couronnes y sont', () => {
  const s = pos(`
    8 . . . . . . . r
    3 . . . . G . . .
    1 . . . R . . . .
    couronnes: ivoire=D2 ebene=E3*`);
  const n = P.jouer(s, trouver(s, 'E3-E2↓'));
  assert.equal(n.c[2].porte, false, 'déposée sur la case d’arrivée'); assert.equal(P.nomCase(n.c[2].sq), 'E2');
  assert.equal(n.ev.depot, 2);
  assert.deepEqual(P.fin(n), { gagnant: 1, raison: 'conquete' });
  const porte = pos(`
    8 . . . . . . . r
    3 . . . . G . . .
    2 . . . R . . . .
    couronnes: ivoire=D2* ebene=E3*`);
  assert.deepEqual(P.fin(P.jouer(porte, trouver(porte, 'E3-E2↓'))), { gagnant: 1, raison: 'conquete' }, 'portée dans le palais compte aussi (règle 8)');
  const une = pos(`
    8 . . . . . . . r
    3 . . . . G . . .
    1 . . . R . . . .
    couronnes: ivoire=A1 ebene=E3*`);
  assert.equal(P.fin(P.jouer(une, trouver(une, 'E3-E2↓'))), null, 'une seule couronne : pas de conquête');
});

test('« déposée chez l’adversaire » : record gelé, aucun progrès ; reprise par son camp = nouveau trajet (retour)', () => {
  const s = pos(`
    8 . . . . . . . r
    3 . . . G . . . .
    1 R . . . . . . .
    couronnes: ivoire=H1 ebene=D3*
    trajets: ebene=1:5`);
  const n = P.jouer(s, trouver(s, 'D3-D2↓'));
  assert.equal(P.etatCouronne(n, 2).etat, 'deposee');
  assert.equal(n.c[2].trajet.record, 0); assert.equal(n.calme, 0, 'l’entrée est un progrès (5 → 0)');
  let q = n;
  for (const k of ['H8-H7', 'A1-A2', 'H7-H6', 'A2-A3']) q = apres(q, k);
  assert.equal(q.calme, 4, 'au sol chez l’adversaire : plus rien ne progresse');
  assert.equal(P.etatCouronne(q, 2).etat, 'deposee');
  const retour = pos(`
    8 . . . . . . . r
    3 . . . g . . . .
    1 R . . . . . . .
    couronnes: ivoire=H1 ebene=D2
    trajets: ebene=1:0
    tour: ebene`);
  const r = P.jouer(retour, trouver(retour, 'D3-D2+Ce'));
  assert.deepEqual(r.c[2].trajet, { camp: 2, record: P.distance(P.GARDE, 2, c('D2')) });
  assert.equal(r.ev.nouveauTrajet, 2); assert.equal(P.etatCouronne(r, 2).etat, 'retour');
});

test('record et progression : un aller-retour ne remet pas le compteur à zéro ; un changement de camp ouvre un trajet', () => {
  const s = pos(`
    8 . . . . . . . r
    7 g . . . . . . .
    5 . . . . . . . G
    1 R . . . . . . .
    couronnes: ivoire=B1 ebene=H6
    calme: 7`);
  const pris = P.jouer(s, trouver(s, 'H5-H6+Ce'));
  assert.deepEqual(pris.c[2].trajet, { camp: 1, record: P.distance(P.GARDE, 1, c('H6')) });
  assert.equal(pris.ev.progres, 0, 'ramasser n’est pas progresser…');
  assert.equal(pris.calme, 0, '… mais v0.2 : un ramassage remet le compteur à zéro');
  // La Garde ne descend que sa colonne : H6 → H5 n'approche pas (colonne H hors palais : ∞). On prend une Reine.
  const r = pos(`
    8 . . . . . . . r
    7 g . . . . . . .
    5 . . . . . . . Q
    1 R . . . . . . .
    couronnes: ivoire=B1 ebene=H5*
    calme: 7`);
  const d0 = r.c[2].trajet.record;
  assert.equal(d0, P.distance(P.REINE, 1, c('H5')));
  const a1 = apres(r, 'H5-G4');
  assert.equal(a1.c[2].trajet.record, d0 - 1); assert.equal(a1.calme, 0, 'progrès');
  const a2 = apres(a1, 'A7-A6', 'G4-H5');
  assert.equal(a2.calme, 2, 'recul : pas de progrès');
  const a3 = apres(a2, 'A6-A5', 'H5-G4');
  assert.equal(a3.calme, 4, 'revenir à la même distance n’est pas un progrès');
  assert.equal(a3.c[2].trajet.record, d0 - 1);
  const a4 = apres(a3, 'A5-A4', 'G4-F3');
  assert.equal(a4.calme, 0); assert.equal(a4.c[2].trajet.record, d0 - 2);
  // Changement de camp : Ébène prend le porteur, la couronne tombe, Ébène la ramasse → nouveau trajet.
  const x = pos(`
    8 . . . . . . . r
    5 . . . . . . . g
    4 . . . . . . . Q
    1 R . . . . . . .
    couronnes: ivoire=B1 ebene=H4*
    tour: ebene`);
  const y = apres(x, 'H5xH3', 'A1-A2', 'H3-H4+Ce');
  assert.equal(y.c[2].trajet.camp, 2); assert.equal(y.ev.nouveauTrajet, 2);
});

test('nulle à 40 demi-coups sans prise ni progrès ; triple répétition', () => {
  const s = pos(`
    8 . . . . . . . r
    1 R . . . . . . .
    couronnes: ivoire=H1 ebene=A8
    calme: 39`);
  const n = apres(s, 'A1-A2');
  assert.equal(n.calme, 40); assert.deepEqual(P.fin(n), { gagnant: 0, raison: 'calme' });
  const g = P.creerPartie({ etat: pos(`
    8 . . . . . . . r
    5 q . . . . . . .
    4 . . . . . . . Q
    1 R . . . . . . .
    couronnes: ivoire=H1 ebene=A8`) });
  const tour = ['H4-H3', 'A5-A6', 'H3-H4', 'A6-A5'];
  const jouer = (n) => P.jouerCoup(g, P.coupsLegaux(P.etatActuel(g)).find((m) => P.notation(m) === n) || assert.fail(n + ' absent'));
  for (const k of [...tour, ...tour]) { assert.equal(g.resultat, null); jouer(k); }
  assert.deepEqual(g.resultat, { gagnant: 0, raison: 'repetition' });
  P.annuler(g); assert.equal(g.resultat, null, 'annuler rend la partie');
});

/* ── v0.2 ─────────────────────────────────────────────────────────────── */
test('v0.2 : le compteur repart à zéro sur ramassage, dépôt et première entrée de chaque pièce chez l’adversaire (une fois)', () => {
  const s = pos(`
    8 . . . . . . . r
    5 . . . . . . . .
    4 G . . . . . . .
    3 . . . . G . . .
    1 . R . . . . . .
    couronnes: ivoire=E2 ebene=E3*
    calme: 20`);
  const depot = apres(s, 'E3-E2↓');
  assert.equal(depot.ev.depot, 2); assert.equal(depot.calme, 0, 'dépôt');
  const q = pos(`
    8 . . . . . . . r
    4 G . . . . . . .
    1 . R . . . . . .
    couronnes: ivoire=H1 ebene=H8
    calme: 20`);
  const entree = apres(q, 'A4-A5');
  assert.equal(entree.ev.premiereEntree, true); assert.equal(entree.calme, 0, 'première entrée de la Garde');
  const retour = apres(entree, 'H8-H7', 'A5-A4', 'H7-H6', 'A4-A5');
  assert.equal(retour.ev.premiereEntree, false); assert.equal(retour.calme, 4, 'deuxième entrée de la même pièce : rien');
  const autre = apres(pos(`
    8 . . . . . . . r
    4 G . G . . . . .
    1 . R . . . . . .
    couronnes: ivoire=H1 ebene=H8
    calme: 20`), 'A4-A5', 'H8-H7', 'C4-C5');
  assert.equal(autre.calme, 0, 'chaque pièce a sa première entrée');
  const init = P.initial({ graine: 4 });
  assert.equal(init.entre.filter(Boolean).length, 0, 'au départ, personne n’est entré');
});

test('v0.2 : carte de distance du Sauteur porteur = celle de l’Héritier (un pas en diagonale)', () => {
  for (const p of [1, 2]) for (let i = 0; i < 64; i++) assert.equal(P.distance(P.SAUTEUR, p, i), P.distance(P.PRINCESSE, p, i));
  assert.equal(P.distance(P.SAUTEUR, 1, c('A5')), 3, 'A5 → B4 → C3 → D2');
  assert.equal(P.portee(P.SAUTEUR, 1, c('A3'), c('C5')), 1, 'sans couronne, il saute toujours deux cases');
});

/* ── HÉRITIERS ─────────────────────────────────────────────────────────── */
test('Héritier : un pas en diagonale, prise par saut diagonal, capturé il disparaît', () => {
  const s = pos(`
    8 . . . . . . . r
    6 . . . . . . . .
    5 . . . . g . . .
    4 . . . F . . . .
    1 R . . . . . . .
    couronnes: ivoire=H1 ebene=A8`);
  assert.deepEqual(depuis(s, 'D4'), ['D4-C3', 'D4-C5', 'D4-E3', 'D4xF6']);
  const pris = pos(`
    8 . . . . . . . r
    6 . . . . . . . .
    5 . . . . g . . .
    4 . . . . F . . .
    1 R . . . . . . .
    couronnes: ivoire=H1 ebene=A8
    tour: ebene`);
  const n = apres(pris, 'E5xE3');
  assert.equal(n.b[c('E4')], 0); assert.equal(n.ev.heritierPris, true);
});

test('corruption : la Reine qui s’arrête à côté d’un Héritier ennemi isolé le fait changer de camp', () => {
  const s = pos(`
    8 . . . . . . . r
    6 . . . . . . . .
    5 . . . . p . . .
    4 . . Q . . . . .
    1 R . . . . . . .
    couronnes: ivoire=H1 ebene=A8
    calme: 12`);
  const n = apres(s, 'C4-D4~E5');
  assert.deepEqual(piece(n, 'E5'), [1, 'Prince']);
  assert.deepEqual(n.ev.corrompus, [c('E5')]); assert.equal(n.calme, 0, 'compte comme une prise');
  // L'Héritier corrompu est une pièce ordinaire d'Ivoire : il bouge pour Ivoire.
  const m = apres(n, 'H8-H7');
  assert.ok(depuis(m, 'E5').includes('E5-F6'));
});

test('pas de corruption si l’Héritier a un voisin ami, ni par une autre pièce que la Reine, ni en prenant', () => {
  const voisin = pos(`
    8 . . . . . . . r
    6 . . . . . g . .
    5 . . . . p . . .
    4 . . Q . . . . .
    1 R . . . . . . .
    couronnes: ivoire=H1 ebene=A8`);
  assert.deepEqual(piece(apres(voisin, 'C4-D4'), 'E5'), [2, 'Prince']);
  const garde = pos(`
    8 . . . . . . . r
    5 . . . . p . . .
    3 . . . G . . . .
    1 R . . . . . . .
    couronnes: ivoire=H1 ebene=A8`);
  assert.deepEqual(piece(apres(garde, 'D3-D4'), 'E5'), [2, 'Prince'], 'une Garde ne corrompt pas');
  const roi = pos(`
    8 . . . . . . . r
    5 . . . . p . . .
    3 . . . R . . . .
    couronnes: ivoire=H1 ebene=A8`);
  assert.deepEqual(piece(apres(roi, 'D3-E4'), 'E5'), [2, 'Prince'], 'le Roi ne corrompt pas');
  const prise = pos(`
    8 . . . . . . . r
    5 . . . . p . . .
    3 . . . g . . . .
    2 . . . Q . . . .
    1 R . . . . . . .
    couronnes: ivoire=H1 ebene=A8`);
  const apresPrise = apres(prise, 'D2xD4');
  assert.deepEqual(piece(apresPrise, 'E5'), [2, 'Prince'], 'une prise de la Reine ne corrompt pas');
});

test('la couronne suit l’Héritier corrompu (nouveau trajet, nouveau record) ; recorruption possible', () => {
  const s = pos(`
    8 . . . . . . . r
    6 . . . . . . . .
    5 . . . . p . . .
    4 . . Q . . . . .
    1 R . . . . . . .
    couronnes: ivoire=E5* ebene=A8
    trajets: ivoire=2:9`);
  assert.equal(P.etatCouronne(s, 1).etat, 'vol');
  const n = apres(s, 'C4-D4~E5');
  assert.equal(n.c[1].porte, true); assert.equal(n.c[1].sq, c('E5'));
  assert.deepEqual(n.c[1].trajet, { camp: 1, record: P.distance(P.PRINCE, 1, c('E5')) });
  assert.equal(P.etatCouronne(n, 1).etat, 'retour');
  // La Reine d'Ébène le reprend : l'Héritier, isolé de ses nouveaux alliés, redevient Ébène.
  const t = pos(`
    8 . . . . . . . r
    6 . . . . . q . .
    5 . . . . F . . .
    3 . . . . . . . .
    1 R . . . . . . .
    couronnes: ivoire=H1 ebene=A8
    tour: ebene`);
  const u = apres(t, 'F6-F5~E5');
  assert.deepEqual(piece(u, 'E5'), [2, 'Princesse']);
  const re = pos(`
    8 . . . . . . . r
    6 . . . . . . . .
    5 . . . . p . . .
    4 . . . . . . . .
    3 . . . Q . . . .
    1 R . . . . . . .
    couronnes: ivoire=H1 ebene=A8`);
  const v = apres(re, 'D3-D4~E5', 'H8-H7');
  assert.deepEqual(piece(v, 'E5'), [1, 'Prince']);
});

test('une graine rejoue toujours la même partie (IA)', () => {
  const partie = (g) => {
    const p = P.creerPartie({ graine: g, plafond: 60 }), h = P.mulberry32(g), out = [];
    while (!p.resultat) { const a = P.analyser(P.etatActuel(p), { niveau: 'gardien', hasard: h, vus: p.vus }); out.push(P.notation(a.coup)); P.jouerCoup(p, a.coup); }
    return out.join(' ');
  };
  assert.equal(partie(11), partie(11));
  assert.notEqual(partie(11), partie(12));
});
