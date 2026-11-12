/* Charge les modules purs de Pylo DIRECTEMENT depuis jeux/pylo/index.html :
   les tests et la simulation éprouvent le code que le joueur reçoit, pas une
   copie. Chaque module est un <script> qui exporte par module.exports. */
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

export const PAGE = new URL('../../jeux/pylo/index.html', import.meta.url);
export const html = () => readFileSync(PAGE, 'utf8');

function scripts(source) {
  return [...source.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/g)].map((m) => m[1]);
}
function module_(code, requis = {}) {
  const module = { exports: {} };
  vm.runInNewContext(code, { module, exports: module.exports, require: (n) => requis[n], globalThis: {}, self: undefined, console, Math, Date, Set, Map, JSON, Array, Object, Number, String, Infinity });
  return module.exports;
}
export function charger(source = html()) {
  const s = scripts(source);
  const trouver = (marque) => { const c = s.find((x) => x.includes(marque)); if (!c) throw new Error('module introuvable : ' + marque); return c; };
  const E = module_(trouver('moteur pur partagé'));
  const M = module_(trouver('État de partie et annonces'), { './engine.js': E });
  const I = module_(trouver('Résolution des clics'), { './engine.js': E });
  return { E, M, I };
}
