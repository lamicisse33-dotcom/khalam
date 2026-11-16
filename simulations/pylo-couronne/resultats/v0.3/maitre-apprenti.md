# Pylo Couronne v0.3 — série maitre-apprenti

- IA « blanc » : **maitre** · IA « noir » : **apprenti** · Héritiers : **oui** · Garde de sa couronne (scénario 9) : **oui** · beam du Maître : 8
- 1000 parties appariées (500 graines × 2, camps inversés), graines 1 à 500 · plafond 300 demi-coups
- Temps : 56 s au total, 0.42 s par partie en moyenne (un cœur)

## Issues

| Issue | Parties | % |
|---|---:|---:|
| Victoire par conquête | 40 | 4.0 % |
| Victoire par roi piégé | 611 | 61.1 % |
| Nulle — 40 demi-coups sans progrès | 338 | 33.8 % |
| Nulle — triple répétition | 9 | 0.9 % |
| Nulle — pat | 0 | 0.0 % |
| **Nulles (total)** | 347 | 34.7 % |
| Non terminées (plafond, à part) | 2 | 0.2 % |

## Longueur (demi-coups)

- Toutes les parties : médiane **72**, quartiles 48 – 115 (min 14, max 300)
- Parties terminées seulement : médiane 72, quartiles 48 – 114

## Équilibre

- Victoires du premier joueur (Ivoire) : **34.9 %** de toutes les parties ; 53.6 % des parties décisives (349/651)
- Score de « blanc » (maitre) contre « noir » (apprenti) : **746.5/1000 = 74.7 %** (victoire 1, nulle ou non terminée ½, défaite 0)

## Couronnes

- Parties avec au moins un vol entrepris : **11.8 %** (0.13 vols par partie)
- Les deux couronnes volées en même temps : 3 parties (0.3 %) → 0 conquêtes, 2 rois piégés, 1 nulles, 0 non terminées
- Blocage (portée à ≤ 2 cases de son palais de destination pendant ≥ 10 demi-coups sans entrer) : **10.0 %** des parties
- Couronne au sol hors palais ≥ 10 demi-coups : 1.8 % des parties ; 9/347 nulles (2.6 %) en contiennent une
- Sorties de sa propre couronne hors de son palais : 27.6 % des parties (0.35 par partie) ; 1/2 non terminées (50.0 %) en contiennent une

## Héritiers

- Corruptions : 0.18 par partie (14.1 % des parties en ont au moins une)
- Captures d’Héritier : 0.17 par partie
- Victoires précédées d’une corruption par le vainqueur : 107/651 (16.4 %)

## v0.3 — Princesse contre Prince

- Prince porteur : **garde son saut (éclaireur)**
- Score du camp avec la Princesse contre le camp avec le Prince : **513.5/1000 = 51.4 %** (victoire 1, nulle ou non terminée ½) — parties appariées : chaque graine jouée avec les rôles dans les deux sens
- Parties décisives : Princesse 339, Prince 312 → **le Prince gagne 47.9 % des parties décisives**
- Trajets de vol (coups du porteur, du ramassage au dépôt) : avec le Prince porteur **—** coups en moyenne (0 trajets, 0 déposés) ; avec un autre porteur **4.33** (126 trajets, 59 déposés)
- Trajets déposés seulement : Prince —, autres 5.73
- Corruptions du Prince : 0.09 par partie ; parties où une corruption du Prince par le vainqueur précède la victoire : **43/1000 = 4.3 %** des parties (6.6 % des victoires)
- Nulles quand la Princesse est encore sur le plateau à la fin : **35.1 %** (316/900) ; quand elle n’y est plus (prise) : **33.0 %** (33/100)

## Les 5 parties non terminées les plus courtes

- graine 319, manche 0 (Ivoire maitre, Ébène apprenti), 300 demi-coups :

  `B4-B2 D8-D7+Ce E1-E2+Ci B5-A4 A3-C5 B6-C6 H3-F5 G6-F6 E2-E1 A6-C8 E1-D2 H6-F8 B3-C3 D7-E7 F5-D3 E7-D7 D3-B1 D7-E7 C2-C1 F6-G6 F2-F3 C8-A6 F3-F2 C7-C8 G3-H3 E8-D7 B1-D3 E7-E8 D3-F1 D7-E6 H3-G3 G6-F6 D2-E2 A6-C4 E2-D2 C4-A2 C5-A3 E6-F5 D2-E1 F8-H6 G3-F3 C6-D6 D1-D2 H6-F4 A3-C5 D6-C6 C5-E3 F4-D6 E1-D1 A4-A5 F1-D3 A5-A6 E3-G5 F6-E6 F2-F1 A6-A7 D3-B5 A7-B6 B5-D3 B6-A6 D1-E1 A6-A7 D3-B5 A7-B6 B5-D3 B6-A6 C1-C2 A6-A7 D3-B5 A7-B6 B5-D3 B6-A6 F1-F2 A6-A7 D3-B5 A7-B6 B5-D3 B6-A6 C2-C1 A6-A7 D3-B5 A7-B6 B5-D3 F5-G4 E1-E2 B6-A7 D3-F5 G4-H3 F5xD7 A7-B7 E2-E1 B7-B6 F3-G3 B6-C5 C3-D3 C5-D5 G5-E3 D6-F8 E3-G1 C6-B6 D7-F5 D5-D6 D2-C3 H3-H4 B2-D2 F8-H6 C1-C2 F7-F8 F5-H7 D6-E6 G1-E3 B6-A6 C3-C4 A6-B6 D2-B2 H4-H3 E3-C5 B6-A6 C5-E3 H3-G4 H7-F5 G4xG2 F5xD7 G2-F1 E3-G1 F1xF3 B2-D2 F3-G4 D2-F4 G4-H3 F4-H4 H3-H2 H4-F2 H2-H3 D7-F5 H6-F4 F5-D7 F4-H2 C2-C3 A6-B6 D7-F5 B6-A6 E1-D1 H2-F4 C4-D5 A6-B6 D5-E6 F4-D6 F2-H4 H3-H2 H4-F2 B6-A6 G1-E3 A6-B6 F5-D7 H2-H1 D7-B5 C8-C7 E3-G1 H1-H2 D1-E1 H2-H3 G1-E3 H3-G4 F2-H4 G4-F3 E3-G5 F3-F2 E1-D1 F2-G1 H4-F4 B6-A6 G5-E3 C7-C8 F4-D2 G1-G2 D2-F2 G2-H3 D1-E1 H3-H2 E3-G1 H2-H3 F2-H4 H3-H2 H4-H6 H2-H3 H6-F4 C8-C7 F4-H4 H3-G2 H4-H2 G2-F1 C3-C4 C7-C8 B5-D7 C8-C7 D7-F5 C7-C8 E1-D1 A6-B6 F5-H7 B6-A6 E6-D5 D6-F4 D5-E6 F4-H6 H7-F5 C8-C7 F5-H3 C7-C8 D3-C3 H6-F4 C3-B3 F4-D6 E6-D5 D6-B8 D5-E6 F1-E2 H3-F1 E2-E3 F1-D3 E3-F4 D3-F5 B8-D6 C4-C5 D6xB4 B3-A3 B4-D6 E6-D5 D6-B4 F5-H7 A2-C4 D5-E6 B4-D6 H2-F2 C8-C7 F2-D2 C7-C8 D1-E1 C8-C7 G1-E3 F4-G3 E6-F5 G3-H2 F5-F6 F8-F7 F6xF8 C7-C6 D2-F2 C6-C7 E1-D1 D6-B4 E3-G1 H2-H3 D1-E1 C7-C8 F2-H4 H3-H2 E1-D1 C4-E2 H4-F4 H2-H3 F4-F2 E2-G4 F2-H4 H3-G2 H4xF4 G2-H3 F4-H4 H3-H2 H7-F5 C8-C7 A3-B3 C7-C8 F8-F7 H2-H1 H4-F2 H1-H2 D1-E1 H2-H3 F2-H4 H3-G2 H4-H2 G2-F1 F5-D3 A6-B6 F7-F8 B4-D2 F8-F7 D2-F4 F7-F8 B6-C6 F8-F7 C8-C7 B3-A3 F4-H6 E1-D1 H6-F8 D3-B5 C6-D6`

- graine 472, manche 0 (Ivoire maitre, Ébène apprenti), 300 demi-coups :

  `F4-F5 D8-D7+Ce F5xH7 H6-F8 E1-E2+Ci C5-A7 H3-F1 D7-E7 B3-C3 A6-C8 H7-H8 E8-D7 G3-F3 D7-C6 H8-H7 F8-D6 A3-C1 E7-E8 E2-D2 D6-B8 D2-E2 C6-D5 C3-B3 D5-D4 E2-D2 B8-D6 F1-D3 D6-F4 C1-E3 A7-C5 E3xG5 D4-E3 C2-C1 E3xG1 H7-H8 C5-A7 G5-E3 B6-A6 B3-C3 E8-D8 H8-H7 G1-H2 D3-F1 A6-B6 H7-H6 F7-F6 D1-C2 D8-E7 H6-H5 C8-A6 C2-B3 A6-C8 B3-B4 C8-E6 E3-G1 E6-C4 H5-H6 E7-E8 C1-C2 H2-H3 H6-H5 E8-D8 F3-E3 C7-C8 H5-G5 D8-E7 E3-F3 F6-F7 G5-H5 E7-E8 F3-E3 C8-C7 E3-F3 E8-D8 F3-E3 F7-F8 E3-F3 C7-C8 F3-E3 A7-C7 C2-C1 B6-A6 B4-A5 A6-B6 H5-H4 H3-H2 H4-G4 C4-A2 C3-D3 F8-F7 G4-G5 D8-E7 G5-G4 E7-E8 G4-H4 E8-D8 H4-H5 H2-G3 F1-H3 F7-F8 D3-C3 D8-E8 E3-D3 A2-C4 D3-E3 E8-D8 H5-G5 D8-E7 G5-H5 E7-E8 H5-G5 E8-D8 A5-A6 C7-A5 A6-A7 B6-A6 E3-F3 D8-E7 G5-H5 E7-E8 H3-F5 G3-H2 A7-A8 A5-A7 H5-H6 H2-H3 H6-H7 E8-D8 G1-E3 H3-H4 E3-G5 H4-H3 F3-G3 C8-C7 H7-G8 D8-E8 F5-H7 C4-E6 C1-C2 C7-C6 C2-C1 E6-G4 G8-H8 E8-D8 H8-G8 D8-D7 G5-E7 D7-E8 G8-G7 E8-D8 G7-G8 C6-C5 G8xE8 D8-C8 E8-D8 C8-B8 D8-E8 B8-C7 E8-D8 C7-D6 D8-D7 D6-E5 D7-D6 E5-F5 D6xB4 F5-E6 E7-C5 E6-D7↓ D2-D1 D7-E6 B4-A5 E6-D7+Ce A5-A4 A7-A5 A4-B5 A5-A7 B5-C6 D7-E8 D1-D2 E8-D8 A8-B7 D8-E8 B7-C8 H3-H2 C6-C7 H2xF4 C7-D8 E8-F7 C5-E7 F4-G3 C8-C7 G3-G2 C7-C8 F7-E6 H7-F5 E6-F7 D8-E8 F7-G8 E8-F8 G8-H7 F5xH3 G2-H1 C3-D3 H7-G6 F8-F7 G6-F5 F7-E6 F5-G5 E6-F6 G5-H4 F6-E6 A6-B6 E7-G5 B6-A6 E6-D6 A6-B6 D6-C5 H4-H5 C5-B5 B6-A6 B5-A5 H5-G6 C8-D7 G6-F7 D7-E8 F7-E6 G5-E3 E6-D6 E3-C5 D6-C7 A5-A4 C7-D8↓ E8-F7 D8-E7 F7-E8 E7-F8 E8-D7 F8-E7 D7-D8+Ce E7-E8 D8-C7 E8-D7 C7-D8 A7-A5 A4-B3 D7-E8 D8-C7 E8-D7 C7-B8 D7-C8 B8-B7 C8-C7 B7-A8 A5-A3 D2-C3 C7-B7 C3-B2~A3 B7-C7 B2-C3 C7-B8 C3-D2↓ B8-A7 B3-B4 H1-H2 H3-F1 H2-H1 C5-E3 A7-B7 D2-C3 B7-A7 C3-D4 H1-H2 B4-A4 H2-H3 D4-E5 A6-B6 E5-D6 A7-A6 D6-C7 A6-A7 C7xA5 H3-H4 A5-B5 A7-B7 B5-A5 H4-G3 A5-A6 B7-A7 A4-A5 G3-H4 E3-C5 H4-G3 A3-C3 G3-F2 C3-E1 F2-F3 E1-E3 F3-G4 A5-B6 G4-G3`


Notation : D1-D2 déplacement, C3xE5 prise, +Ci/+Ce ramasse la couronne d’Ivoire/d’Ébène, ↓ dépôt au palais, ~F5 corruption de l’Héritier en F5.
