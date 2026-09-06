# Être trouvé : ce qui est fait, ce qui reste, ce qui ne dépend de personne

*6 septembre 2026*

## D'abord, la vérité mesurée

Avant de toucher à quoi que ce soit, j'ai cherché `khalam.app` de deux façons.
**Aucun résultat ne pointait vers le site.** Le dépôt n'avait ni `robots.txt`,
ni `sitemap.xml`, ni image de partage. Ce n'était pas un problème de classement :
le site n'était pas dans l'index du tout.

## Ce qui est fait, et qui dépendait de nous

| Fichier | À quoi il sert |
|---|---|
| `robots.txt` | Dit aux moteurs que tout est autorisé, et où trouver le plan du site. Sans lui, chacun devine. |
| `sitemap.xml` | La liste des trois pages, avec leur date. C'est ce qu'on donne à Google pour qu'il n'ait pas à deviner. |
| `partage.png` | **Le défaut le plus coûteux.** La page annonçait « grande image » sans en fournir aucune : un lien khalam.app envoyé sur WhatsApp s'affichait en rectangle vide. Ici presque tout circule par WhatsApp. |
| `/jeux/` et `/applications/` | Google classe des **pages**, pas des sites. Une page par sujet, c'est trois portes d'entrée au lieu d'une. |
| Données structurées | Chaque produit décrit comme un objet : nom, adresse, gratuit, langue. C'est ce qui permet d'apparaître autrement qu'en simple lien bleu. |
| Titres et descriptions | Écrits avec les mots que les gens **tapent** : « jeu de cartes sénégalais », « traducteur français wolof », « jeu pour enfants ». Personne ne cherche « expérience immersive ». |

## Ce qui reste, et que je ne peux pas faire à votre place

Ces étapes demandent **votre compte Google**. Je ne saisis jamais vos
identifiants — c'est la même règle que pour vos coordonnées bancaires.

### 1. Google Search Console — l'étape qui change tout

Sans elle, Google finira par passer, mais quand il voudra. Avec elle, on le lui
demande.

1. Ouvrez **search.google.com/search-console** avec votre compte Google.
2. « Ajouter une propriété » → choisissez **Préfixe d'URL** → tapez
   `https://khalam.app/`.
3. Google propose plusieurs façons de prouver que le site est à vous.
   Prenez **Balise HTML** : il vous donne une ligne qui ressemble à
   `<meta name="google-site-verification" content="…">`.
4. **Collez-moi cette ligne** : je la mets dans la page, vous poussez, et vous
   cliquez « Vérifier ». C'est tout.
   *(Ou, si vous préférez : « Enregistrement DNS » chez Namecheap, compte
   khalam33 — même principe, mais vous le faites vous-même dans Namecheap.)*
5. Une fois vérifié, dans le menu **Sitemaps**, entrez `sitemap.xml` et
   envoyez.
6. Dans **Inspection de l'URL**, collez `https://khalam.app/` et cliquez
   « Demander une indexation ». Recommencez pour `/jeux/` et
   `/applications/`.

### 2. Bing — il alimente d'autres moteurs

**bing.com/webmasters** accepte d'**importer** directement depuis Google Search
Console. Une fois l'étape 1 faite, celle-ci prend deux minutes.

### 3. Vos jeux ont chacun leur propre site

`quatredames.khalam.app`, `les4case.khalam.app`, `tonequilibre.khalam.app`…
sont des **sites séparés** aux yeux de Google. Chacun mériterait son titre, sa
description et son `robots.txt`. Les liens depuis `/jeux/` aident déjà à les
faire découvrir, mais ce n'est pas la même chose. À faire ensuite, si vous
voulez.

## Ce qui ne dépend de personne

Je ne peux pas vous promettre un délai, et personne ne le peut — pas même une
agence qui vous le facturerait. Google décide seul quand il passe et comment il
classe. Ce qu'on peut faire, c'est **enlever toutes les raisons de ne pas
venir**, et le prévenir. C'est fait.

Ordre de grandeur honnête, sans garantie : quelques jours après une demande
d'indexation, plusieurs semaines sans. Un site neuf sur un nom de domaine neuf
part de zéro dans tous les cas.

**Ce qui accélérera vraiment**, ensuite, ce ne sont pas des réglages : ce sont
des liens depuis d'autres sites qui parlent de vous — un article, un annuaire
d'applications africaines, une page qui cite KHALAM. Un seul bon lien vaut
davantage que dix balises.
