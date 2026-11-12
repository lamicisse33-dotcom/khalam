/* PYLO 1.4 — les moments importants, dits et entendus dans l'ordre :
   menace → parade → capture → palais → fin, voix et sons dans UNE file,
   jamais deux à la fois, jamais un son par-dessus la voix. */
import assert from 'node:assert/strict';
import { test } from 'node:test';
import { charger, html } from './charger.mjs';

const { E, M } = charger();
const T = { R: 0, G: 1, S: 2, J: 3 };
const ROYAUME = { Spiritualité: 0, Amour: 1, Santé: 2, Argent: 3 };
/** '1RD4:Amour' = Roi ivoire Amour en D4 ; partie classique (positions d'école). */
function poser(liste, turn) {
  const b = Array(64).fill(0), royals = Array(64).fill(-1);
  for (const x of liste) { const [c, r] = x.split(':'); const i = E.square(c[2], +c.slice(3)); b[i] = E.token(+c[0], T[c[1]]); if (c[1] === 'R') royals[i] = ROYAUME[r] ?? 3; }
  return { b, royals, turn, ply: 20 };
}
const jouer = (s, de, a) => { const m = E.legalMoves(s).find((x) => E.coord(x.from) === de && E.coord(x.to) === a); assert.ok(m, `coup ${de}→${a}`); return { m, n: E.apply(s, m) }; };
const textes = (l) => JSON.parse(JSON.stringify(l));
const ROIS = ['1RH1:Santé', '2RA8:Spiritualité', '2RH8:Amour'];

const etapes = [];
test('menace : « Ton roi Amour est menacé par la Sentinelle. » / « Tu menaces son roi … »', () => {
  const s = poser([...ROIS, '1RD4:Amour', '2SF4'], 2);
  const { m, n } = jouer(s, 'F4', 'E4');
  const l = textes(M.evenements(s, m, n, 1));
  assert.deepEqual(l, [{ kind: 'voix', text: 'Ton roi Amour est menacé par la Sentinelle.' }]);
  etapes.push(...l);
  // Le même coup, vu du camp qui menace.
  assert.deepEqual(textes(M.evenements(s, m, n, 2)), [{ kind: 'voix', text: 'Tu menaces son roi Amour.' }]);
});

test('parade : « Menace écartée. »', () => {
  const s = poser([...ROIS, '1RD4:Amour', '2SE4'], 1);
  const { m, n } = jouer(s, 'D4', 'D5');
  const l = textes(M.evenements(s, m, n, 1));
  assert.deepEqual(l, [{ kind: 'voix', text: 'Menace écartée.' }]);
  etapes.push(...l);
});

test('capture : « Tu captures son Garde. » / « Garde capturé. » / « Roi capturé ! »', () => {
  const s = poser([...ROIS, '1RD4:Amour', '1GC3', '2GC4'], 1);
  const { m, n } = jouer(s, 'C3', 'C5');
  const l = textes(M.evenements(s, m, n, 1));
  assert.deepEqual(l, [{ kind: 'voix', text: 'Tu captures son Garde.' }]);
  etapes.push(...l);
  assert.deepEqual(textes(M.evenements(s, m, n, 2)), [{ kind: 'voix', text: 'Garde capturé.' }]);
  const r = poser([...ROIS, '1RD4:Amour', '2SE4'], 2);
  const k = jouer(r, 'E4', 'C4');
  assert.equal(textes(M.evenements(r, k.m, k.n, 1))[0].text, 'Roi capturé !');
});

test('palais : tambour puis « Palais Spiritualité occupé. Il en reste un. »', () => {
  const s = poser([...ROIS, '1RB5:Amour'], 1);
  const { m, n } = jouer(s, 'B5', 'B6');
  const l = textes(M.evenements(s, m, n, 1));
  assert.deepEqual(l, [{ kind: 'son', text: 'tambour' }, { kind: 'voix', text: 'Palais Spiritualité occupé. Il en reste un.' }]);
  etapes.push(...l);
  const sortie = jouer({ ...n, turn: 1 }, 'B6', 'A7');
  assert.ok(textes(M.evenements({ ...n, turn: 1 }, sortie.m, sortie.n, 1)).some((x) => x.text === 'Palais perdu.'));
});

test('fin : roulement, « Conquête ! La partie est à toi. », fanfare ; « Pris au piège. La partie est perdue. » ; « Égalité. »', () => {
  const l = textes(M.annonceDeFin({ winner: 1, reason: 'conquest' }, 1));
  assert.deepEqual(l.map((x) => x.text), ['roulement', 'Conquête ! La partie est à toi.', 'fanfare']);
  etapes.push(...l);
  assert.equal(textes(M.annonceDeFin({ winner: 2, reason: 'piege' }, 1)).at(-1).text, 'Pris au piège. La partie est perdue.');
  assert.equal(textes(M.annonceDeFin({ winner: 0, reason: 'pat' }, 1))[0].text, 'Égalité.');
});

test('la file : menace → parade → capture → palais → fin, dans l’ordre, sans aucun chevauchement', async () => {
  const journal = []; const t0 = performance.now(); const now = () => performance.now() - t0;
  const duree = { voix: 35, son: 20 };
  let actif = null; const etats = [];
  const f = M.makeAnnouncer({
    speak(text, fini) { journal.push({ kind: 'voix', text, debut: now() }); setTimeout(() => { journal.at(-1).fin = now(); fini(); }, duree.voix); },
    play(nom, fini) { journal.push({ kind: 'son', text: nom, debut: now() }); setTimeout(() => { journal.at(-1).fin = now(); fini(); }, duree.son); },
    etat(x) { actif = x; etats.push(x ? x.kind : null); },
    cancel() {},
  });
  // Les événements arrivent par paquets, comme pendant une partie : un coup, puis le suivant, sans attendre.
  for (const x of etapes) (x.kind === 'son' ? f.son(x.text) : f.enqueue(x.text));
  await new Promise((r) => { const tic = () => (f.pending() ? setTimeout(tic, 5) : r()); tic(); });
  assert.deepEqual(journal.map((x) => x.text), etapes.map((x) => x.text), 'dans l’ordre, rien de perdu');
  for (let i = 1; i < journal.length; i++) assert.ok(journal[i].debut >= journal[i - 1].fin - 0.5, `aucun chevauchement : ${journal[i - 1].text} / ${journal[i].text}`);
  assert.deepEqual(etapes.map((x) => x.text), [
    'Ton roi Amour est menacé par la Sentinelle.', 'Menace écartée.', 'Tu captures son Garde.',
    'tambour', 'Palais Spiritualité occupé. Il en reste un.', 'roulement', 'Conquête ! La partie est à toi.', 'fanfare']);
  assert.equal(actif, null);
  assert.ok(etats.includes('voix') && etats.includes('son'), 'la page sait quand la voix parle (le battement s’efface)');
});

test('la page : battement, tambour, roulement synthétisés, aucun fichier son', () => {
  const page = html();
  for (const nom of ['battement', 'tambour', 'roulement']) assert.match(page, new RegExp(`function ${nom}\\(`), nom);
  assert.doesNotMatch(page, /new Audio\(|\.mp3|\.wav|\.ogg/, 'aucun fichier son');
});

test('la page : voix active par défaut, en français ; ouverture et pendule annoncées', () => {
  const page = html();
  assert.match(page, /settings=\{[^}]*voice:true/);
  assert.match(page, /lang='fr-FR'/);
  assert.match(page, /'À toi\.':'À l’ordinateur\.'/);
  assert.match(page, /'Trente secondes\.'/); assert.match(page, /'Dix secondes\.'/);
});


test('conquête tenue : « Deux palais occupés… il doit tenir. », puis « Conquête brisée. » si un roi est délogé', () => {
  const s = { ...poser([...ROIS, '1RB6:Amour', '1RF5:Argent'], 1), rule: 'honneur' };
  const { m, n } = jouer(s, 'F5', 'F6');
  assert.deepEqual(textes(M.evenements(s, m, n, 1)), [{ kind: 'son', text: 'tambour' }, { kind: 'voix', text: 'Deux palais occupés… il doit tenir.' }]);
  assert.equal(E.outcome(n), null, 'pas encore gagné');
  assert.equal(textes(M.evenements(s, m, n, 2)).at(-1).text, 'Deux palais occupés par l’adversaire… déloge un roi !');
  const r = { ...n, turn: 1 };
  const sortie = jouer(r, 'F6', 'E7');
  const l = textes(M.evenements(r, sortie.m, sortie.n, 1)).map((x) => x.text);
  assert.ok(l.includes('Conquête brisée.')); assert.ok(!l.includes('Palais perdu.'));
});
