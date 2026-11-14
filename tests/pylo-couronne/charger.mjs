/* Le moteur de Pylo Couronne, tel que la page le charge (un seul fichier). */
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
export const P = require('../../jeux/pylo/couronne/moteur.js');
export const c = P.caseDe;
export const pos = (txt) => P.depuisTexte(txt);
/* Coups légaux au format lisible : « D1-D2 », « C3xE5 », « E1-E2+Ci »… */
export const coups = (s) => P.coupsLegaux(s).map((m) => P.notation(m));
export const depuis = (s, x) => coups(s).filter((n) => n.startsWith(x)).sort();
export const trouver = (s, n) => {
  const m = P.coupsLegaux(s).find((k) => P.notation(k) === n);
  if (!m) throw new Error(`coup ${n} absent ; légaux : ${coups(s).join(' ')}`);
  return m;
};
export const apres = (s, ...ns) => ns.reduce((q, n) => P.jouer(q, trouver(q, n)), s);
