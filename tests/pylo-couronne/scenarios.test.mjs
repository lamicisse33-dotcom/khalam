/* PYLO COURONNE — SCÉNARIOS PRÉPARÉS : l'IA à profondeur 2 (Gardien) doit
   jouer le coup attendu. Positions écrites à la main, au format texte de
   moteur.js (depuisTexte) :

     8 . . . q r . . .     Ivoire en MAJUSCULES, Ébène en minuscules :
     …                     R Roi · Q Reine · G Garde · S Sentinelle ·
     1 . . . R Q . . .     J Sauteur · F Princesse · P Prince · . vide
     couronnes: ivoire=E2 ebene=D7*   (* : portée par la pièce de la case)
     trajets: ebene=1:4               (facultatif : camp du trajet, record)
     tour: ivoire          calme: 0

   Les rangées absentes sont vides. Si un scénario échoue, on corrige
   l'évaluation, jamais le scénario. Chaque partie est tirée avec plusieurs
   graines : le hasard (±1 %) ne doit jamais changer la décision. */
import test from 'node:test';
import assert from 'node:assert/strict';
import { P, pos, coups } from './charger.mjs';

const GRAINES = [1, 2, 3, 4, 5];
function choix(s, graine = 1) {
  const a = P.analyser(s, { niveau: 'gardien', hasard: P.mulberry32(graine) });
  return a && P.notation(a.coup);
}
function attendu(s, ...bons) {
  for (const g of GRAINES) assert.ok(bons.includes(choix(s, g)), `graine ${g} : l'IA joue ${choix(s, g)}, attendu ${bons.join(' ou ')}`);
}

test('1. couronne adverse au sol à une case → la ramasser', () => {
  const s = pos(`
    8 . . . q r . . .
    7 . . g . . . . .
    6 . . . . . . g .
    4 . . . . . G . .
    2 . . . . . . . .
    1 . . . R Q . . .
    couronnes: ivoire=E2 ebene=F5`);
  attendu(s, 'F4-F5+Ce');
});

test('2. mon porteur à une case de mon palais, ma couronne chez moi → entrer et gagner', () => {
  const s = pos(`
    8 . . . q r . . .
    7 . . g . . g . .
    4 . . . . . . . .
    3 . . . G . . . .
    1 . . . R . . . .
    couronnes: ivoire=E2 ebene=D3*
    trajets: ebene=1:4`);
  attendu(s, 'D3-D2↓');
  assert.deepEqual(P.fin(P.jouer(s, P.coupsLegaux(s).find((m) => P.notation(m) === 'D3-D2↓'))), { gagnant: 1, raison: 'conquete' });
});

test('3. porteur adverse à deux cases de son palais, prenable par saut → le prendre', () => {
  const s = pos(`
    8 . . . q r . . .
    5 . . . g . . . .
    4 . . . G . . . .
    1 . . . R Q . . .
    couronnes: ivoire=D5* ebene=D7
    trajets: ivoire=2:5`);
  assert.equal(P.distance(P.GARDE, 2, P.caseDe('D5')), 2);
  attendu(s, 'D4xD6');
});

test('4. l’adversaire gagne au prochain coup ; parades : prendre son porteur, ou ramasser sa couronne dans son palais', () => {
  const s = pos(`
    8 . . . q r . . .
    6 . . . . g . . .
    5 . . . . G . . .
    2 . . . . . . . S
    1 . . . R . . . .
    couronnes: ivoire=E6* ebene=D7
    trajets: ivoire=2:6`);
  // Sans parade, Ébène joue E6-E7↓ : les deux couronnes dans son palais.
  assert.ok(P.imminente(P.jouer(s, P.coupsLegaux(s).find((m) => P.notation(m) === 'H2-G2')), 2));
  attendu(s, 'E5xE7');
  /* Seconde parade (règle 8 précisée) : ma Garde D6 termine sur D7, case de SA
     couronne dans SON palais, et la ramasse. Portée par une pièce ivoire, elle
     n'est plus « dans » le palais d'Ébène : son entrée E6-E7 ne gagne plus. */
  const ramasser = pos(`
    8 . . . . . . . r
    6 . . . G g . . .
    1 R . . . . . . .
    couronnes: ivoire=E6* ebene=D7
    trajets: ivoire=2:6`);
  const sansParade = P.jouer(ramasser, P.coupsLegaux(ramasser).find((m) => P.notation(m) === 'A1-A2'));
  assert.deepEqual(P.fin(P.jouer(sansParade, P.coupsLegaux(sansParade).find((m) => P.notation(m) === 'E6-E7↓'))), { gagnant: 2, raison: 'conquete' });
  attendu(ramasser, 'D6-D7+Ce');
  const pare = P.coupsLegaux(ramasser).find((m) => P.notation(m) === 'D6-D7+Ce').suite;
  assert.equal(P.fin(P.jouer(pare, P.coupsLegaux(pare).find((m) => P.notation(m) === 'E6-E7↓'))), null, 'plus de conquête');
});

test('5. mon palais contient déjà deux de mes pièces → aucun coup proposé n’y fait entrer une 3e', () => {
  const s = pos(`
    8 . . . q r . . .
    7 . . g . . . . .
    3 . . . G J . . .
    2 . . . . . . . .
    1 . . . R Q . . .
    couronnes: ivoire=H1 ebene=A8`);
  const entre = (m) => P.palaisDe(m.a) === 1 && P.palaisDe(m.de) !== 1;
  assert.equal(P.coupsLegaux(s).filter(entre).length, 0);
  for (const g of GRAINES) {
    const a = P.analyser(s, { niveau: 'gardien', hasard: P.mulberry32(g) });
    assert.equal(a.classement.filter((x) => entre(x.coup)).length, 0);
  }
});

test('6. roi menacé, une seule parade → la jouer ; sans parade, le piège est constaté', () => {
  const s = pos(`
    8 . . . . . . . r
    4 . s . s . . . .
    3 . . s g . . . .
    2 . . . R . . . .
    1 . . . . . . . .
    couronnes: ivoire=H1 ebene=A8`);
  assert.ok(P.roiPrenable(s, 1));
  assert.deepEqual(coups(s), ['D2-E3']);
  attendu(s, 'D2-E3');
  const piege = pos(`
    8 . . . . . . . r
    4 . s . s . s . .
    3 . . s g s . . .
    2 . . . R . . . .
    couronnes: ivoire=H1 ebene=A8`);
  assert.equal(P.analyser(piege, { niveau: 'gardien' }), null);
  assert.deepEqual(P.fin(piege), { gagnant: 2, raison: 'piege' });
});

test('7. ma couronne volée, porteur adverse à deux coups de son palais où la sienne est déjà → la récupérer', () => {
  const s = pos(`
    8 . . . q r . . .
    6 . . . . . . . .
    5 . . . . g . . .
    4 . . . J . . . .
    1 . . . R Q . . .
    couronnes: ivoire=E5* ebene=D7
    trajets: ivoire=2:5`);
  assert.equal(P.distance(P.GARDE, 2, P.caseDe('E5')), 2);
  attendu(s, 'D4xF6');
});

test('8. Sauteur porteur avec une prise disponible → la prise n’est pas dans ses coups légaux', () => {
  const s = pos(`
    8 . . . q r . . .
    5 . . . . . . . .
    4 . . . . g . . .
    3 . . . J . . . .
    1 . . . R Q . . .
    couronnes: ivoire=E2 ebene=D3*
    trajets: ebene=1:1`);
  const sauteur = coups(s).filter((n) => n.startsWith('D3'));
  assert.ok(!sauteur.some((n) => n.includes('x')));
  assert.ok(!sauteur.includes('D3-F5'), 'il ne survole pas l’ennemi E4');
  for (const g of GRAINES) assert.ok(!choix(s, g).includes('x'));
});

test('9. ma couronne au sol dans mon palais : « entrer » et « entrer et ramasser » existent ; ramasser seulement sous menace, vers une sortie sûre', () => {
  // Première moitié : les deux coups existent.
  const deux = pos(`
    8 . . . q r . . .
    7 . . g . . . . .
    3 . . . . G . . .
    1 . . . R . . . .
    couronnes: ivoire=E2 ebene=D7`);
  assert.ok(coups(deux).includes('E3-E2') && coups(deux).includes('E3-E2+Ci'));
  /* Sans menace (aucune pièce ennemie ne peut finir son prochain coup sur E2) :
     entrer sans ramasser vaut mieux qu'entrer et ramasser, et l'IA ne ramasse pas. */
  const calme = pos(`
    8 . . . q r . . .
    7 . . g . . . . .
    3 . . . F . . . .
    1 . R . . . . . .
    couronnes: ivoire=E2 ebene=D7`);
  const suite = (s, n) => P.coupsLegaux(s).find((m) => P.notation(m) === n).suite;
  assert.ok(coups(calme).includes('D3-E2') && coups(calme).includes('D3-E2+Ci'));
  assert.ok(P.evaluer(suite(calme, 'D3-E2'), 1) > P.evaluer(suite(calme, 'D3-E2+Ci'), 1), 'sans menace : entrer > entrer et ramasser');
  for (const g of GRAINES) assert.notEqual(choix(calme, g), 'D3-E2+Ci');
  /* Menace : le Sauteur d'Ébène G4 peut finir son prochain coup sur E2 (il
     survole F3) et voler la couronne. Ma Princesse D3 peut entrer en E2 ; avec
     la couronne, elle a des sorties (D3, F3, F1) que ce Sauteur n'atteint pas
     au coup suivant. Attendu : entrer et ramasser. */
  const menace = pos(`
    8 . . . q r . . .
    7 . . g . . . . .
    4 . . . . . . j .
    3 . . . F . . . .
    1 . R . . . . . .
    couronnes: ivoire=E2 ebene=D7`);
  assert.ok(P.coupsLegaux(P.jouer(menace, P.coupsLegaux(menace).find((m) => P.notation(m) === 'B1-A2'))).some((m) => m.a === P.caseDe('E2') && m.ramasse === 1), 'sans réaction, le Sauteur G4 finit sur E2 et vole la couronne');
  attendu(menace, 'D3-E2+Ci'); // le scénario s'arrête au ramassage
});

test('10. Héritier ennemi isolé à portée de ma Reine → la Reine va le corrompre', () => {
  const s = pos(`
    8 . . . q r . . .
    7 . . g . . . . .
    6 . . . . . . . .
    5 . . . . . p . .
    4 . . . . . . . .
    3 . . . Q . . . .
    1 . . . R . . . .
    couronnes: ivoire=E2 ebene=D7`);
  attendu(s, 'D3-E4~F5');
});

test('11. mon Héritier isolé, la Reine ennemie à un coup → le protéger ou le déplacer', () => {
  const s = pos(`
    8 . . . . r . . .
    7 . . g . . . . .
    6 . . . . . . . .
    5 . . . . . q . .
    4 . . . . . . . .
    3 . . . F . . . .
    2 . . . . . . G .
    1 . . . R . . . .
    couronnes: ivoire=E2 ebene=D7`);
  const corruptible = (n) => P.coupsLegaux(n).some((m) => m.suite.ev.corrompus.length);
  assert.ok(corruptible(P.jouer(s, P.coupsLegaux(s).find((m) => P.notation(m) === 'G2-G3'))), 'sans réaction (coup neutre G2-G3), la Reine F5 le corrompt');
  for (const g of GRAINES) {
    const a = P.analyser(s, { niveau: 'gardien', hasard: P.mulberry32(g) });
    assert.ok(!corruptible(a.coup.suite), `graine ${g} : ${P.notation(a.coup)} laisse l’Héritier corruptible`);
  }
});
