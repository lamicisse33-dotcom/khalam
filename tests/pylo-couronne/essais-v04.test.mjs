/* PYLO COURONNE — ESSAIS AVANT v0.4 (simulation seulement ; éteints par défaut).
   A princePas · B couronneCentre · C compteur. */
import test from 'node:test';
import assert from 'node:assert/strict';
import { P, c, pos, depuis } from './charger.mjs';

test('par défaut, rien ne change : couronnes E2/D7, compteur 40, Prince sans pas', () => {
  const s = P.initial({ graine: 3 });
  assert.equal(P.nomCase(s.c[1].sq), 'E2'); assert.equal(P.nomCase(s.c[2].sq), 'D7');
  assert.equal(s.compteur, 40); assert.equal(s.princePas, false);
});

test('A : le Prince saute de deux OU avance d’un pas en ligne droite (sans prise par le pas) ; porteur : idem', () => {
  const s = pos(`
    8 . . . . . . . r
    5 . . . g . . . .
    4 . . . P . . . .
    1 R . . . . . . .
    couronnes: ivoire=H1 ebene=A8
    prince-pas: oui`);
  const d = depuis(s, 'D4');
  for (const x of ['D4-C4', 'D4-D3', 'D4-E4']) assert.ok(d.includes(x), x);
  assert.ok(!d.includes('D4-D5'), 'case occupée'); assert.ok(!d.includes('D4-C5'), 'pas de pas en diagonale');
  assert.ok(d.includes('D4xD6'), 'la prise reste le saut');
  const porteur = pos(`
    8 . . . . . . . r
    5 . . . g . . . .
    4 . . . P . . . .
    1 R . . . . . . .
    couronnes: ivoire=H1 ebene=D4*
    prince-pas: oui`);
  const dp = depuis(porteur, 'D4');
  assert.ok(dp.includes('D4-C4') && dp.includes('D4-D2↓') && !dp.some((x) => x.includes('x')));
  // La parité ne l'enferme plus : il atteint la case de départ de la couronne adverse.
  assert.ok(Number.isFinite(P.portee(P.PRINCE, 1, c('C4'), c('D7'), { princePas: true })));
  assert.equal(P.portee(P.PRINCE, 1, c('C4'), c('D7')), Infinity);
});

test('B : couronnes de départ en D4 et E5, pièces inchangées', () => {
  const a = P.initial({ graine: 2, heritiers: false }), b = P.initial({ graine: 2, heritiers: false, couronneCentre: true });
  assert.deepEqual(a.b, b.b);
  assert.equal(P.nomCase(b.c[1].sq), 'D4'); assert.equal(P.nomCase(b.c[2].sq), 'E5');
  assert.equal(P.etatCouronne(b, 1).etat, 'au-sol');
});

test('C : compteur à 60 demi-coups', () => {
  const s = P.initial({ graine: 2, compteur: 60 });
  assert.equal(P.fin({ ...s, calme: 40 }), null);
  assert.deepEqual(P.fin({ ...s, calme: 60 }), { gagnant: 0, raison: 'calme' });
});
