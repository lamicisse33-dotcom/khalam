# Les Quatre Piliers — v235 · changement de nom et d'adresse

Le jeu s'appelle désormais **Les Quatre Piliers** et vit sur **4piliers.khalam.app**.
Le nom ÉQUILIBRE et l'adresse `equilibre.khalam.app` sont libérés pour le grand jeu.

## 1. DNS — à faire EN PREMIER

Chez ton hébergeur de `khalam.app`, ajoute un enregistrement :

| Type | Nom | Valeur |
|---|---|---|
| CNAME | `4piliers` | `TON-PSEUDO.github.io` |

Remplace `TON-PSEUDO` par ton nom d'utilisateur GitHub. Compte 10 min à 1 h de propagation.

## 2. GitHub — dépôt `les-4-plies`

Add file → Upload files, dépose les **trois** fichiers :

| Fichier | Quoi |
|---|---|
| `index.html` | nom + adresse changés, BUILD_TAG v235 |
| `sw.js` | cache `piliers-v235` |
| `CNAME` | remplace l'ancien `equilibre.khalam.app` |

Puis **Settings → Pages** : vérifie que le domaine affiché est `4piliers.khalam.app`,
et coche **Enforce HTTPS** dès qu'il est disponible (quelques minutes après le DNS).

## 3. manifest.json — deux lignes à corriger à la main

Il est déjà en ligne, ne le remplace pas. Ouvre-le sur GitHub, crayon, et change :

```json
"name": "Les Quatre Piliers de Vie",
"short_name": "4 Piliers",
```

Sans ça, l'icône installée sur les téléphones continuera d'afficher ÉQUILIBRE.

## Ce qui a changé dans index.html

23 remplacements, aucun sur la logique de jeu :

- `<title>`, titre iOS, aria-label de l'emblème
- splash : **LES QUATRE PILIERS** sur deux lignes (18 caractères ne tiennent pas
  à 40 px dans une carte de 296 px utiles → 34 px, deux lignes), sous-titre remplacé
  par « Spiritualité · Amour · Santé · Argent »
- mode d'emploi, fiches d'installation, bannière d'install, textes de partage
- les 4 adresses en dur → `4piliers.khalam.app`

**Non touché, volontairement :** « VOTRE ÉQUILIBRE S'EFFONDRE » (×2) — c'est le
concept du jeu, pas son nom. Et les clés `eq_*` du localStorage : invisibles,
et les renommer n'apporterait rien.

## Ce que ça coûte aux joueurs

Le navigateur range les données par domaine. Ceux qui avaient installé le jeu depuis
`equilibre.khalam.app` **perdent points, habillages et réglages**, et leur icône
pointera vers un site qui ne répondra plus. C'est une règle du navigateur, rien à
faire. `MODE_TEST` étant encore à `true` et Google Play pas encore fait, c'est le
moment le moins coûteux.

Préviens tes testeurs, et donne-leur le QR code.

## Vérifier

Ouvre `https://4piliers.khalam.app`. La boutique doit afficher `v235 · MODE TEST · images : OK`.
Si elle affiche `images : ABSENTES`, c'est que les `.webp` ne sont pas remontés — ils
sont déjà dans le dépôt, tu n'as pas à les redéposer.
