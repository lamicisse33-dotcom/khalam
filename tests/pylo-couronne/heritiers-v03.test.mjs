/* PYLO COURONNE v0.3 — HÉRITIERS À DEUX RÔLES (node --test tests/pylo-couronne/).
   Princesse (protège) : un pas dans les 8 directions, ESCORTE.
   Prince (attaque) : saut de deux cases dans les 8 directions, ÉCLAIREUR. */
import test from 'node:test';
import assert from 'node:assert/strict';
import { P, c, pos, coups, depuis, apres } from './charger.mjs';

const piece = (s, x) => { const v = s.b[c(x)]; return v ? [P.camp(v), P.NOMS[P.sorte(v)]] : null; };
const prises = (s, x) => depuis(s, x).filter((n) => n.includes('x'));

test('Prince : saut de deux cases dans les 8 directions, par-dessus le vide, un ami ou un ennemi (prise) ; arrivée vide', () => {
  const s = pos(`
    8 . . . . . . . r
    6 . . . . . . . .
    5 . . . . g . . .
    4 . . . P G . . .
    1 R . . . . . . .
    couronnes: ivoire=H1 ebene=A8`);
  assert.deepEqual(depuis(s, 'D4'), ['D4-B2', 'D4-B4', 'D4-B6', 'D4-D2', 'D4-D6', 'D4-F2', 'D4-F4', 'D4xF6']);
  // Arrivée occupée : pas de saut.
  const plein = pos(`
    8 . . . . . . . r
    6 . . . . . G . .
    5 . . . . g . . .
    4 . . . P . . . .
    1 R . . . . . . .
    couronnes: ivoire=H1 ebene=A8`);
  assert.ok(!depuis(plein, 'D4').some((n) => n.endsWith('F6')));
  // La prise enlève la pièce survolée.
  assert.equal(apres(s, 'D4xF6').b[c('E5')], 0);
});

test('Princesse : prise par saut dans ses 8 directions, en ligne droite aussi', () => {
  const s = pos(`
    8 . . . . . . . r
    5 . . . g . . . .
    4 . . . F . . . .
    1 R . . . . . . .
    couronnes: ivoire=H1 ebene=A8`);
  assert.ok(depuis(s, 'D4').includes('D4xD6'));
});

test('ESCORTE : une pièce amie adjacente à la Princesse ne peut pas être prise ; la Princesse, si ; dès qu’elle s’éloigne ou est prise, la prise revient', () => {
  const s = pos(`
    8 . . . . . . . r
    6 . . . . . . . .
    5 . . . f g . . .
    4 . . . G G . . .
    1 R . . . . . . .
    couronnes: ivoire=H1 ebene=A8`);
  assert.deepEqual(P.escortees(s, 2), new Set([c('E5')]));
  assert.deepEqual(prises(s, 'E4'), [], 'la Garde E4 ne prend pas la Garde escortée E5');
  assert.deepEqual(prises(s, 'D4'), ['D4xD6'], 'la Princesse elle-même reste prenable');
  // Prise de la Princesse : l'escorte tombe, E4×E5 revient au coup suivant.
  const priseP = apres(s, 'D4xD6', 'H8-H7');
  assert.deepEqual(prises(priseP, 'E4'), ['E4xE6']);
  // La Princesse s'éloigne (C5 n'est pas voisine de E5) : la prise revient.
  const loin = pos(`
    8 . . . . . . . r
    5 . . . f g . . .
    4 . . . . G . . .
    1 R . . . . . . .
    couronnes: ivoire=H1 ebene=A8
    tour: ebene`);
  assert.deepEqual(prises(apres(loin, 'D5-C5'), 'E4'), ['E4xE6']);
});

test('ESCORTE contre le Sauteur et le Prince : la prise par-dessus une pièce escortée n’est pas générée', () => {
  const avec = `
    8 . . . . . . . r
    6 . . . . . P . .
    5 . . . f g . . .
    4 . . . . . J . .
    1 R . . . . . . .
    couronnes: ivoire=H1 ebene=A8`;
  const s = pos(avec);
  assert.deepEqual(prises(s, 'F4'), []);
  assert.deepEqual(prises(s, 'F6'), []);
  const sans = pos(avec.replace('. . . f g', '. . . . g'));
  assert.deepEqual(prises(sans, 'F4'), ['F4xD6']);
  assert.deepEqual(prises(sans, 'F6'), ['F6xD4']);
});

test('ESCORTE du Roi : un Roi voisin de sa Princesse n’est pas prenable (règle d’honneur incluse)', () => {
  const s = pos(`
    8 . . . . . . . .
    6 . . . f . . . .
    5 . . . . r . . .
    4 . . . . G . . .
    1 R . . . . . . .
    couronnes: ivoire=H1 ebene=A8`);
  assert.equal(P.roiPrenable(s, 2), false);
  assert.equal(P.roiPrenable(pos(`
    8 . . . . . . . .
    5 . . . . r . . .
    4 . . . . G . . .
    1 R . . . . . . .
    couronnes: ivoire=H1 ebene=A8`), 2), true);
});

test('ÉCLAIREUR : le Prince porteur garde son saut (sans prise, il ne survole pas d’ennemi) ; les autres porteurs font un pas', () => {
  const s = pos(`
    8 . . . . . . . r
    5 . . . . g . . .
    4 . . . P . . . .
    1 R . . . . . . .
    couronnes: ivoire=H1 ebene=D4*`);
  assert.deepEqual(depuis(s, 'D4'), ['D4-B2', 'D4-B4', 'D4-B6', 'D4-D2↓', 'D4-D6', 'D4-F2', 'D4-F4']);
  assert.ok(P.heritiers(s).find((h) => h.sorte === P.PRINCE).eclaireur);
  // Option d'étude (simulation) : sans son saut en portant, un pas dans les 8 directions.
  const sansSaut = pos(`
    8 . . . . . . . r
    5 . . . . g . . .
    4 . . . P . . . .
    1 R . . . . . . .
    couronnes: ivoire=H1 ebene=D4*
    eclaireur: non`);
  assert.deepEqual(depuis(sansSaut, 'D4'), ['D4-C3', 'D4-C4', 'D4-C5', 'D4-D3', 'D4-D5', 'D4-E3', 'D4-E4']);
  // La Princesse porteuse fait un pas, sans prise.
  const princesse = pos(`
    8 . . . . . . . r
    5 . . . . g . . .
    4 . . . F . . . .
    1 R . . . . . . .
    couronnes: ivoire=H1 ebene=D4*`);
  assert.deepEqual(depuis(princesse, 'D4'), ['D4-C3', 'D4-C4', 'D4-C5', 'D4-D3', 'D4-D5', 'D4-E3', 'D4-E4']);
  // Le Sauteur porteur : toujours un pas en diagonale (v0.2).
  const sauteur = pos(`
    8 . . . . . . . r
    4 . . . J . . . .
    1 R . . . . . . .
    couronnes: ivoire=H1 ebene=D4*`);
  assert.deepEqual(depuis(sauteur, 'D4'), ['D4-C3', 'D4-C5', 'D4-E3', 'D4-E5']);
});

test('cartes de distance : Princesse = roi-8-directions ; Prince porteur = saut de 2 en 8 directions', () => {
  for (const p of [1, 2]) for (let i = 0; i < 64; i++) {
    const roi8 = Math.min(...P.PALAIS[p].map((b) => Math.max(Math.abs((i >> 3) - (b >> 3)), Math.abs((i & 7) - (b & 7)))));
    assert.equal(P.distance(P.PRINCESSE, p, i), roi8, P.nomCase(i));
    assert.ok(Number.isFinite(P.distance(P.PRINCE, p, i)), 'le palais 2×2 couvre toutes les parités');
  }
  assert.equal(P.distance(P.PRINCE, 1, c('A5')), 2, 'A5 → C3 → E1');
  assert.equal(P.distance(P.PRINCE, 1, c('D4')), 1, 'D4 → D2');
  assert.equal(P.distance(P.PRINCE, 1, c('A5'), { eclaireur: false }), 3, 'sans saut : un pas en 8 directions');
  // Le record d'un trajet suit la carte du Prince porteur.
  const s = pos(`
    8 . . . . . . . r
    5 P . . . . . . .
    1 R . . . . . . .
    couronnes: ivoire=H1 ebene=A5*`);
  assert.equal(P.etatCouronne(s, 2).distance, 2);
  assert.equal(apres(s, 'A5-C3').c[2].trajet.record, 1);
});

test('corruption : le Prince l’est MÊME entouré ; la Princesse seulement isolée', () => {
  const prince = pos(`
    8 . . . . . . . r
    6 . . . . . g . .
    5 . . . . p . . .
    4 . . Q . . . . .
    1 R . . . . . . .
    couronnes: ivoire=H1 ebene=A8`);
  assert.equal(P.heritiers(prince)[0].protege, true);
  const n = apres(prince, 'C4-D4~E5');
  assert.deepEqual(piece(n, 'E5'), [1, 'Prince']);
  assert.deepEqual(n.ev.corrompus, [c('E5')]);
  // Prince porteur entouré : il change de camp avec la couronne (nouveau trajet).
  const porteur = pos(`
    8 . . . . . . . r
    6 . . . . . g . .
    5 . . . . p . . .
    4 . . Q . . . . .
    1 R . . . . . . .
    couronnes: ivoire=E5* ebene=A8`);
  const m = apres(porteur, 'C4-D4~E5');
  assert.equal(P.etatCouronne(m, 1).etat, 'retour');
  // Princesse entourée : rien ; isolée : corrompue.
  const entouree = pos(`
    8 . . . . . . . r
    6 . . . . . g . .
    5 . . . . f . . .
    4 . . Q . . . . .
    1 R . . . . . . .
    couronnes: ivoire=H1 ebene=A8`);
  assert.deepEqual(piece(apres(entouree, 'C4-D4'), 'E5'), [2, 'Princesse']);
  assert.ok(!coups(entouree).some((x) => x.includes('~')));
  const isolee = pos(`
    8 . . . . . . . r
    5 . . . . f . . .
    4 . . Q . . . . .
    1 R . . . . . . .
    couronnes: ivoire=H1 ebene=A8`);
  assert.deepEqual(piece(apres(isolee, 'C4-D4~E5'), 'E5'), [1, 'Princesse']);
});

test('inversion des rôles entre manches : mêmes cases, Princesse et Prince échangés', () => {
  for (let g = 1; g <= 30; g++) {
    const a = P.heritiers(P.initial({ graine: g })), b = P.heritiers(P.initial({ graine: g, inverse: true }));
    for (const p of [1, 2]) {
      const x = a.find((h) => h.camp === p), y = b.find((h) => h.camp === p);
      assert.equal(x.sq, y.sq, `graine ${g}, camp ${p} : même case`);
      assert.equal(x.sorte + y.sorte, P.PRINCESSE + P.PRINCE, `graine ${g}, camp ${p} : rôle inversé`);
    }
    // D'une graine à la suivante, les rôles alternent aussi (déjà en place depuis v0.1).
    const suivante = P.heritiers(P.initial({ graine: g + 1 }));
    assert.notEqual(a.find((h) => h.camp === 1).sorte, suivante.find((h) => h.camp === 1).sorte);
  }
  assert.equal(P.creerPartie({ graine: 4, inverse: true }).etats[0].b.indexOf(P.jeton(1, P.PRINCE)) >= 0, true);
});
