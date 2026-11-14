# Pylo Couronne v0.2.1 — série maitre-maitre-sans-heritiers

- IA « blanc » : **maitre** · IA « noir » : **maitre** · Héritiers : **non** · Garde de sa couronne (scénario 9) : **oui** · beam du Maître : 8
- 1000 parties appariées (500 graines × 2, camps inversés), graines 1 à 500 · plafond 300 demi-coups
- Temps : 46 s au total, 0.35 s par partie en moyenne (un cœur)

## Issues

| Issue | Parties | % |
|---|---:|---:|
| Victoire par conquête | 0 | 0.0 % |
| Victoire par roi piégé | 80 | 8.0 % |
| Nulle — 40 demi-coups sans progrès | 916 | 91.6 % |
| Nulle — triple répétition | 3 | 0.3 % |
| Nulle — pat | 0 | 0.0 % |
| **Nulles (total)** | 919 | 91.9 % |
| Non terminées (plafond, à part) | 1 | 0.1 % |

## Longueur (demi-coups)

- Toutes les parties : médiane **89**, quartiles 58 – 133 (min 28, max 300)
- Parties terminées seulement : médiane 89, quartiles 58 – 132

## Équilibre

- Victoires du premier joueur (Ivoire) : **3.9 %** de toutes les parties ; 48.8 % des parties décisives (39/80)
- Score de « blanc » (maitre) contre « noir » (maitre) : **500/1000 = 50.0 %** (victoire 1, nulle ou non terminée ½, défaite 0)

## Couronnes

- Parties avec au moins un vol entrepris : **3.8 %** (0.04 vols par partie)
- Les deux couronnes volées en même temps : 3 parties (0.3 %) → 0 conquêtes, 2 rois piégés, 1 nulles, 0 non terminées
- Blocage (portée à ≤ 2 cases de son palais de destination pendant ≥ 10 demi-coups sans entrer) : **1.3 %** des parties
- Couronne au sol hors palais ≥ 10 demi-coups : 0.1 % des parties ; 1/919 nulles (0.1 %) en contiennent une
- Sorties de sa propre couronne hors de son palais : 15.9 % des parties (0.18 par partie) ; 1/1 non terminées (100.0 %) en contiennent une

## Héritiers

- Corruptions : 0.00 par partie (0.0 % des parties en ont au moins une)
- Captures d’Héritier : 0.00 par partie
- Victoires précédées d’une corruption par le vainqueur : 0/80 (0.0 %)

## Les 5 parties non terminées les plus courtes

- graine 226, manche 0 (Ivoire maitre, Ébène maitre), 300 demi-coups :

  `E1-E2+Ci D8-D7+Ce A3-C5 B6-C6 H3-F5 G6-F6 E2-E1 A6-C4 B3-A3 H6-F8 F2-F3 F8-H6 G3-H3 E8-E7 F3-F4 C4-A6 C2-C3 C7-C8 C5-E3 F7-F8 E3-G1 C6-D6 C3-C2 D6-C6 H3-G3 C8-C7 G3-H3 E7-D6 C2-C3 C6-B6 C3-C2 C7-C6 F4-F3 D6-C5 C2-C3 A6-C4 C3-C2 D7-D8 F3-F4 D8-E8 C2-C1 B6-A6 F5-D7 C6-C7 F4-F5 A6-B6 F5xF7 F8xF6 H3-G3 F6-F5 G1-E3 H6-F8 D1-D2 F8-D6 E3-G1 E8-D8 G3-H3 D6-B8 H3-G3 C7-C8 D2-E3 C8-C7 C1-C2 B8-D6 C2-C1 D6-F8 E1-E2 F5-F6 C1-C2 B6-A6 D7-B5 C4-E6 G3-H3 E6-G4 E2-D1 D8-E8 C2-C1 F8-D6 D1-E1 F6-F7 E1-D1 F7-F8 D1-E1 G4-E2 E1-D1 D6-B4 A3-B3 A6-B6 H3-G3 F8-F7 C1-C2 B4-D2 E3-E4 D2-F4 G3-H3 B6-A6 C2-C1 C5-B4 B3-A3 B4-C3 E4-D5 F4-H6 D5-D6 C7-C8 D6-D5 A6-B6 D5-E6 F7-F6 E6-D5 C8-C7 D5-D6 C7-C8 D6-C5 B6-A6 B5-D7 E2-C4 D7-B5 C4-E6 B5-D3 E8-D8 A3-B3 H6-F4 C5-D6 D8-E8 D6-C5 F4-D2 D3-B5 C3-D4 C5-C6 D4-D3 D1-E1 E6-C4 B5-D7 C4xA2 C6-C5 A2-C4 D7-B5 C4-A2 H3-G3 D2-B4 C5-C6 F6-F5 B5-D7 D3-D4 C6-B7 B4-D6 G3-H3 E8-D8 C1-C2 F5-F4 E1-D1 D8-E8 D7-B5 F4-F3 H3-G3 F3-F4 B5-D7 D4-E3 B7-A8 D6-B8 A8-A7 C8-C7 A7xA5 B8-D6 A5-B6 E8-D8 B6-B7 D8-E8 B7-A6 C7-C8 A6-B5 A2-C4 B5-B6 E3-E4 B6-A5 E8-D8 C2-C3 C4-A2 A5-A6 E4-E3 A6-A5 D6-B4 C3-C4 E3-E4 D7-B5 C8-C7 D1-E1 F4-F5 A5-B6 B4-D6 G3-H3 F5-F4 B6-B7 D8-E8 B7-B8 E8-D8 B5-D7 F4-F5 H3-G3 F5-F4 C4-C3 F4-F3 G3xE3 E4xE2 B8-B7 D8-E8 B7-B6 E8-D8 B6-A5 D6-B4 C3-C4 E2-D1 E1-F2 D1-C2 F2-E1↓ C2-D3 E1-F2 D3-E4 A5-A6 D8-E8 D7-B5 B4-D6 A6-A5 E8-D8 A5-A6 D6-F4 F2-E2 E4-D3 E2-F3 D3-D2 F3-E2 D2-C1 E2-D1 C1-B2 B5-D3 F4-D6 A6-B5 D6-F8 B5-A6 D8-E8 D1-C1 B2-B3 C1-D2 B3-B2 A6-A5 B2-C1 D2-E2 C1-B2 D3-B5 F8-H6 C4-C5 E8-D8 B5-D7 D8-E8 C5-C4 H6-F8 C4-C5 F8-D6 C5-C4 E8-D8 E2-D2 D6-B4 D2-C1 B2-A1 C1-C2 D8-E8 C2-B3 B4-D2 B3-B4 E8-F7 B4-C5 F7-E8↓ C5-D6 C7-C8 D7-B5 A1-B2 B5-D3 B2-C1 D3-B1 E8-D8 D6-E6 D8-E8+Ce E6-E7 E8-D8 E7-E8 D2-B4 A5-B6 C1-D2 B6-A7 D2-E1+Ci B1-D3 B4-D2 D3-F1 D2-F4 A7-B6 F4-D2 E8-D7 D2-B4 D7-E8 E1-D2`


Notation : D1-D2 déplacement, C3xE5 prise, +Ci/+Ce ramasse la couronne d’Ivoire/d’Ébène, ↓ dépôt au palais, ~F5 corruption de l’Héritier en F5.
