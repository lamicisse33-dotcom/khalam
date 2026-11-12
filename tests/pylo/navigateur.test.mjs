/* PYLO dans un vrai navigateur (Playwright), téléphone 390×844 et écran 1280×800.
   PLAYWRIGHT_MODULE=/chemin/vers/node_modules/playwright node --test tests/pylo/navigateur.test.mjs */
import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import path from 'node:path';
import { after, before, test } from 'node:test';

const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const RACINE = path.resolve(new URL('../..', import.meta.url).pathname);
const TYPES = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.webmanifest': 'application/manifest+json', '.png': 'image/png', '.svg': 'image/svg+xml', '.json': 'application/json' };
let serveur, base, navigateur;

before(async () => {
  serveur = createServer(async (req, res) => {
    let p = decodeURIComponent(new URL(req.url, 'http://x').pathname); if (p.endsWith('/')) p += 'index.html';
    const f = path.join(RACINE, p); if (!f.startsWith(RACINE)) { res.writeHead(403).end(); return; }
    try { const d = await readFile(f); res.writeHead(200, { 'Content-Type': TYPES[path.extname(f)] || 'application/octet-stream' }).end(d); } catch { res.writeHead(404).end(); }
  });
  await new Promise((r) => serveur.listen(0, '127.0.0.1', r));
  base = `http://127.0.0.1:${serveur.address().port}`;
  navigateur = await chromium.launch();
});
after(async () => { await navigateur?.close(); serveur?.close(); });

async function ouvrir(largeur, hauteur, avant) {
  const ctx = await navigateur.newContext({ viewport: { width: largeur, height: hauteur } });
  if (avant) await ctx.addInitScript(avant);
  const p = await ctx.newPage(); const erreurs = []; p.on('pageerror', (e) => erreurs.push(e.message));
  await p.goto(`${base}/jeux/pylo/`); await p.waitForSelector('#board .cell');
  return { ctx, p, erreurs };
}
const boite = (p, s) => p.evaluate((s) => { const e = document.querySelector(s); if (!e || e.hidden || !e.offsetParent) return null; const r = e.getBoundingClientRect(); return { haut: r.top, bas: r.bottom, hauteur: r.height }; }, s);

test('téléphone 390×844 : le plateau entier sans défiler, à l’arrivée et après « Jouer »', async () => {
  const { ctx, p, erreurs } = await ouvrir(390, 844);
  const bandeau = await boite(p, '#welcome');
  assert.ok(bandeau && bandeau.hauteur <= 48, 'la première partie : un bandeau d’une ligne ' + JSON.stringify(bandeau));
  assert.ok((await boite(p, '#interactionBar')).hauteur <= 46, 'l’aide sur une ligne');
  let plateau = await boite(p, '#board');
  assert.ok(plateau.bas <= 844, 'plateau entier visible dès l’arrivée : ' + JSON.stringify(plateau));
  await p.click('.mode-nav [data-mode="ai"]'); await p.waitForTimeout(400);
  assert.equal(await p.evaluate(() => scrollY), 0);
  plateau = await boite(p, '#board');
  assert.ok(plateau.haut >= 0 && plateau.bas <= 844, 'après « Jouer », plateau entier sans défiler : ' + JSON.stringify(plateau));
  const conquetes = await boite(p, '#players');
  assert.ok(conquetes.haut >= plateau.bas, 'les cartes de conquête sous le plateau');
  assert.ok(conquetes.hauteur <= 80, 'en une rangée compacte : ' + conquetes.hauteur);
  assert.ok(await p.evaluate(() => document.documentElement.scrollWidth <= 390), 'pas de défilement horizontal');
  assert.deepEqual(erreurs, []);
  await ctx.close();
});

test('le bandeau « Première partie » se referme, et le reste', async () => {
  const { ctx, p } = await ouvrir(390, 844);
  assert.ok(await boite(p, '#welcome'));
  await p.click('#welcomeClose');
  assert.equal(await boite(p, '#welcome'), null);
  await p.reload(); await p.waitForSelector('#board .cell');
  assert.equal(await boite(p, '#welcome'), null, 'mémorisé');
  await ctx.close();
});

test('écran 1280×800 : plateau visible, conquêtes à droite, aucune erreur', async () => {
  const { ctx, p, erreurs } = await ouvrir(1280, 800);
  const plateau = await boite(p, '#board');
  assert.ok(plateau.bas <= 800, JSON.stringify(plateau));
  const joueurs = await boite(p, '#players');
  assert.ok(joueurs.haut < plateau.bas, 'à côté du plateau, pas dessous');
  assert.ok(await p.evaluate(() => document.documentElement.scrollWidth <= 1280));
  assert.deepEqual(erreurs, []);
  await ctx.close();
});

test('installation : manifeste « Pylo », service worker à la VERSION du moteur, « PYLO 1.5 » partout', async () => {
  const { ctx, p, erreurs } = await ouvrir(390, 844);
  const m = await p.evaluate(async () => { const l = document.querySelector('link[rel=manifest]'); return (await fetch(l.href)).json(); });
  assert.equal(m.name, 'Pylo'); assert.equal(m.display, 'standalone'); assert.equal(m.start_url, '/jeux/pylo/');
  for (const i of m.icons) assert.equal((await fetch(base + i.src)).status, 200, i.src);
  const reg = await p.evaluate(async () => { const r = await navigator.serviceWorker.ready; return r.scope; });
  assert.match(reg, /\/jeux\/pylo\/$/);
  const sw = await (await fetch(`${base}/jeux/pylo/sw.js`)).text();
  const version = await p.evaluate(() => Pilo.VERSION);
  assert.equal(version, '1.5');
  assert.match(sw, new RegExp(`const VERSION = 'pylo-${version.replace('.', '\\.')}'`), 'le service worker suit le moteur');
  assert.match(await p.textContent('#sessionSummary'), /^PYLO 1\.5/);
  assert.deepEqual(erreurs, []);
  await ctx.close();
});

test('partager : feuille de partage, repli copier, et le résultat après une partie', async () => {
  const { ctx, p } = await ouvrir(390, 844, () => { window.__partages = []; navigator.share = (d) => { window.__partages.push(d); return Promise.resolve(); }; });
  await p.click('#shareButton');
  let d = (await p.evaluate(() => window.__partages))[0];
  assert.equal(d.text, 'Pylo par KHALAM — khalam.app/jeux/pylo'); assert.equal(d.url, 'https://khalam.app/jeux/pylo/');
  await p.evaluate(() => { g.mode = 'ai'; g.history = Array.from({ length: 23 }, () => ({ move: { piece: 1, taken: 0, from: 52, to: 44, capture: null } })); endGame({ winner: 1, reason: 'conquest' }); });
  await p.click('#shareResult');
  d = (await p.evaluate(() => window.__partages)).at(-1);
  assert.match(d.text, /^J’ai gagné contre l’ordinateur \(\w+\) par conquête, en 23 coups ! Pylo par KHALAM — khalam\.app\/jeux\/pylo$/);
  await ctx.close();
  // Sans feuille de partage : le texte est copié.
  const c = await navigateur.newContext({ viewport: { width: 390, height: 844 }, permissions: ['clipboard-read', 'clipboard-write'] });
  await c.addInitScript(() => { delete Navigator.prototype.share; });
  const q = await c.newPage(); await q.goto(`${base}/jeux/pylo/`); await q.waitForSelector('#board .cell');
  await q.click('#shareButton');
  await q.waitForFunction(() => document.getElementById('messageTitle').textContent === 'Copié');
  assert.equal(await q.evaluate(() => navigator.clipboard.readText()), 'Pylo par KHALAM — khalam.app/jeux/pylo');
  await c.close();
});


test('le match : revanche aux couleurs échangées, score 1–0 puis 1–1, belle tirée au sort ; couleurs alternées', async () => {
  const { ctx, p, erreurs } = await ouvrir(390, 844, () => { try { localStorage.setItem('pilo_couleur_15', '2'); } catch {} });
  // Couleur précédente Ébène : la nouvelle partie se joue en Ivoire.
  assert.equal(await p.evaluate(() => g.humain), 1);
  const finir = (gagnant) => p.evaluate((w) => { stopAuto(); endGame({ winner: w === 'vous' ? g.humain : 3 - g.humain, reason: 'conquest' }); }, gagnant);
  await finir('vous');
  assert.equal(await p.textContent('#matchScore'), 'MANCHE 1 · VOUS 1–0 ORDINATEUR');
  assert.equal(await p.textContent('#rematch'), 'Revanche');
  await p.evaluate(() => { document.querySelectorAll('dialog[open]').forEach((d) => d.close()); document.getElementById('rematch').click(); });
  assert.equal(await p.evaluate(() => g.humain), 2, 'la revanche échange les couleurs');
  assert.ok(await p.evaluate(() => document.getElementById('board').classList.contains('retourne')), 'vos jetons restent en bas');
  assert.match(await p.textContent('#campBas'), /ÉBÈNE/);
  assert.equal(await p.textContent('#matchScore'), 'MANCHE 2 · VOUS 1–0 ORDINATEUR');
  // L'ordinateur (Ivoire) commence ; ensuite c'est à vous, avec les jetons ébène.
  await p.waitForFunction(() => g.history.length >= 1 && g.state.turn === 2 && !g.busy, null, { timeout: 15000 });
  assert.ok(await p.evaluate(() => canPlay()), 'vous jouez Ébène');
  await finir('ordinateur');
  assert.equal(await p.textContent('#matchScore'), 'MANCHE 2 · VOUS 1–1 ORDINATEUR');
  assert.equal(await p.textContent('#rematch'), 'Jouer la belle');
  await p.evaluate(() => { document.querySelectorAll('dialog[open]').forEach((d) => d.close()); document.getElementById('rematch').click(); });
  assert.equal(await p.textContent('#matchScore'), 'BELLE · VOUS 1–1 ORDINATEUR');
  assert.ok([1, 2].includes(await p.evaluate(() => g.humain)));
  await finir('vous');
  assert.equal(await p.textContent('#matchScore'), 'BELLE · VOUS 2–1 ORDINATEUR');
  // Match fini : une nouvelle revanche ouvre un nouveau match, couleurs encore échangées.
  const avant = await p.evaluate(() => g.humain);
  await p.evaluate(() => { document.querySelectorAll('dialog[open]').forEach((d) => d.close()); document.getElementById('rematch').click(); });
  assert.equal(await p.evaluate(() => g.humain), 3 - avant);
  assert.equal(await p.evaluate(() => match.manche), 1);
  assert.deepEqual(erreurs, []);
  await ctx.close();
});
