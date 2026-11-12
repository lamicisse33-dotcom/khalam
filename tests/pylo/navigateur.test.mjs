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
