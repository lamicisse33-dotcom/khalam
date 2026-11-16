/* PYLO COURONNE v0.3 — les mesures Princesse/Prince d'une série de parties
   (simuler.mjs pour les résumés, comparer.mjs pour le tableau comparatif). */
export function v03(R) {
  const moy = (a) => (a.length ? (a.reduce((x, y) => x + y, 0) / a.length).toFixed(2) : '—');
  const V = R.flatMap((r) => r.voyages || []), Vp = V.filter((v) => v.prince), Va = V.filter((v) => !v.prince);
  const nul = (r) => r.resultat !== 'ivoire' && r.resultat !== 'ebene';
  const avec = R.filter((r) => r.princesseFin), sans = R.filter((r) => !r.princesseFin);
  return {
    scorePrincesse: R.reduce((s, r) => s + (r.roleGagnant === 'princesse' ? 1 : r.roleGagnant === 'prince' ? 0 : 0.5), 0),
    gPrincesse: R.filter((r) => r.roleGagnant === 'princesse').length, gPrince: R.filter((r) => r.roleGagnant === 'prince').length,
    moyPrince: moy(Vp.map((v) => v.coups)), moyAutres: moy(Va.map((v) => v.coups)), nPrince: Vp.length, nAutres: Va.length,
    depotsPrince: Vp.filter((v) => v.issue === 'depot').length, depotsAutres: Va.filter((v) => v.issue === 'depot').length,
    moyPrinceDepot: moy(Vp.filter((v) => v.issue === 'depot').map((v) => v.coups)), moyAutresDepot: moy(Va.filter((v) => v.issue === 'depot').map((v) => v.coups)),
    corrPrince: R.reduce((s, r) => s + (r.corruptionsPrince || 0), 0), corrPrinceVict: R.filter((r) => r.corruptionPrinceAvantVictoire).length,
    avec: avec.length, sans: sans.length, nullesAvec: avec.filter(nul).length, nullesSans: sans.filter(nul).length,
  };
}
