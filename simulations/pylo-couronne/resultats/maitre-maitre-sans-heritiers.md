# Pylo Couronne v0.2 — série maitre-maitre-sans-heritiers

- IA « blanc » : **maitre** · IA « noir » : **maitre** · Héritiers : **non** · beam du Maître : 8
- 1000 parties appariées (500 graines × 2, camps inversés), graines 1 à 500 · plafond 300 demi-coups
- Temps : 45 s au total, 0.35 s par partie en moyenne (un cœur)

## Issues

| Issue | Parties | % |
|---|---:|---:|
| Victoire par conquête | 1 | 0.1 % |
| Victoire par roi piégé | 79 | 7.9 % |
| Nulle — 40 demi-coups sans progrès | 914 | 91.4 % |
| Nulle — triple répétition | 4 | 0.4 % |
| Nulle — pat | 0 | 0.0 % |
| **Nulles (total)** | 918 | 91.8 % |
| Non terminées (plafond, à part) | 2 | 0.2 % |

## Longueur (demi-coups)

- Toutes les parties : médiane **89**, quartiles 58 – 131 (min 28, max 300)
- Parties terminées seulement : médiane 88, quartiles 58 – 131

## Équilibre

- Victoires du premier joueur (Ivoire) : **4.0 %** de toutes les parties ; 50.0 % des parties décisives (40/80)
- Score de « blanc » (maitre) contre « noir » (maitre) : **499/1000 = 49.9 %** (victoire 1, nulle ou non terminée ½, défaite 0)

## Couronnes

- Parties avec au moins un vol entrepris : **4.0 %** (0.04 vols par partie)
- Les deux couronnes volées en même temps : 4 parties (0.4 %) → 1 conquêtes, 1 rois piégés, 2 nulles, 0 non terminées
- Blocage (portée à ≤ 2 cases de son palais de destination pendant ≥ 10 demi-coups sans entrer) : **1.1 %** des parties
- Couronne au sol hors palais ≥ 10 demi-coups : 0.1 % des parties ; 1/918 nulles (0.1 %) en contiennent une
- Sorties de sa propre couronne hors de son palais : 16.2 % des parties (0.18 par partie) ; 2/2 non terminées (100.0 %) en contiennent une

## Héritiers

- Corruptions : 0.00 par partie (0.0 % des parties en ont au moins une)
- Captures d’Héritier : 0.00 par partie
- Victoires précédées d’une corruption par le vainqueur : 0/80 (0.0 %)

## Les 5 parties non terminées les plus courtes

- graine 150, manche 1 (Ivoire maitre, Ébène maitre), 300 demi-coups :

  `E1-E2+Ci D8-D7+Ce A3-C5 B6-C6 H3-F5 G6-F6 E2-E1 C7-C8 C5-E3 C8-C7 E3-C1 A6-C8 F2-F1 C8-E6 F5-H7 C7-C8 C1-A3 C8-C7 A3-C5 E8-E7 C5-A7 C6-D6 B3-A3 D7-E8 D1-E2 E6-C8 C2-C1 D6-C6 G3-F3 C6-D6 A7-C5 D6-C6 C5-E3 C6-B6 E2-D3 C8-E6 E3-C5 B6-A6 A3-B3 E6-G4 F3-G3 C7-C6 C5-E3 E7-D6 G3-H3 A6-B6 D3-C4 D6-E5 C1-C2 F7-F8 C2-C3 G4-E6 H3-G3 C6-C7 B3-A3 E8-D8 E3-G1 D8-E8 E1-D1 C7-C8 G3-F3 E6-G4 F3-E3 G4-E6 C3-C2 B6-A6 C4-C5 H6-F4 E3-D3 F4-D2 C2-C1 E6-C4 D1-E1 C4xE2 C5-D6 D2-B4 H7-F5 B4-D2 F1-F2 E2-C4 F5-H7 F6-E6 D6-D5 E6-F6 D5-C6 F8-F7 C6-B7 E5-D4 E1-D1 D4-D3 B7-A8 A6-B6 A8-A7 B6-C6 F2-F1 F6-E6 F1-F2 C6-D6 A7-A8 C4-A6 F2-F1 F7-F6 F1-F2 E8-D8 A8-A7 A6-C4 A7-A6 C8-C7 A6-A7 C7-C6 A7-A8 C6-C5 F2-F1 D8-E8 F1-F2 C5-C6 A8-A7 F6-F5 A7-A8 F5-F4 A8-A7 C6-C7 A7-A8 C4-A6 A8-A7 A6-C8 A7-B6 C7-C6 B6-C7 F4-F3 F2xF4 D3-C4 C7xE5 C6-C7 E5xE7 C8-A6 E7-F6 E8-D8 F6-F7 A6-C8 H7-F5 D2-B4 F7-F8 B4-D6 F4-F3 D6-B8 F3-F4 C7-C6 F8-F7 C6-C7 F7-F6 C8-A6 F5-D7 B8-D6 F6-F7 A6-C8 F7-E6 D8-E8 G1-E3 D6-B8 C1-C2 C4-D3 C2-C1 D3-E4 E3-G5 E4-E3 D7-F5 E3-D4 E6-F7 E8-D8 F7-F8 C8-A6 F5-H7 C7-C6 F4-F5 D4-D3 F5-F4 A6-C8 D1-E1 D3-E2 F8-F7 C8-A6 E1-D1 E2-E3 F7-G6 E3-D4 F4-F5 A6-C4 G6-F7 B8-D6 C1-C2 C4-E2 F5-F4 C6-C7 F7-F8 E2-G4 D1-E1 G4-E6 G5-E7 C7-C6 E7xC5 C6xC4 F8-G7 E6-C8 G7-H6 D4-C3 C2-C1 C3-B2 H6-H5 C4-C3 H5-G6 C3-C4 G6-G5 D8-E7 E1-D2 B2-C3 D2-E1 C8-A6 G5-F6 E7-D8 F6-G5 D8-E8 G5-G6 C4-C5 G6-F7 C3-C4 F7-G8 E8-F8 G8-G7 F8-E7↓ G7-F8 E7-E8 F8-G7 E8-F7 E1-D2 F7-E7 H7-F5 A6-C8 F5-H7 E7-F7 C1-C2 C8-E6 G7-F8 F7-F6 D2-D1 E6-G8 C2-C1 C5-C6 C1-C2 C6-C7 D1-E1 C7-C8 C2-C1 C8-C7 E1-E2 C7-C8 H7-F5 C8-C7 F5-D3 C4-C3 D3-B5 C3-B2 E2-D3 B2-C3 D3-C2 C7-C8 C2-D1↓ C3-D4 D1-C2 C8-C7 C2-D2 C7-C8 F4-F3 F6-E6 F3-F2 C8-C7 A3-B3 E6-D6 D2-E3 D6-C5 E3-E4 C5-C4 F8-E7+Ce C7-C8 E7-D6 G8-E6 D6-E7 E6-G4 E7-F8 G4-E2 F8-F7 C8-C7 F7-E8 C7-C8 E8-E7 C8-C7 E7-F8 C7-C6 F8-E7 C6-C5`

- graine 226, manche 0 (Ivoire maitre, Ébène maitre), 300 demi-coups :

  `E1-E2+Ci D8-D7+Ce A3-C5 B6-C6 H3-F5 G6-F6 E2-E1 A6-C4 B3-A3 H6-F8 F2-F3 F8-H6 G3-H3 E8-E7 F3-F4 C4-A6 C2-C3 C7-C8 C5-E3 F7-F8 E3-G1 C6-D6 C3-C2 D6-C6 H3-G3 C8-C7 G3-H3 E7-D6 C2-C3 C6-B6 C3-C2 C7-C6 F4-F3 D6-C5 C2-C3 A6-C4 C3-C2 D7-D8 F3-F4 D8-E8 C2-C1 B6-A6 F5-D7 C6-C7 F4-F5 A6-B6 F5xF7 F8xF6 H3-G3 F6-F5 G1-E3 H6-F8 D1-D2 F8-D6 E3-G1 E8-D8 G3-H3 D6-B8 H3-G3 C7-C8 D2-E3 C8-C7 C1-C2 B8-D6 C2-C1 D6-F8 E1-E2 F5-F6 C1-C2 B6-A6 D7-B5 C4-E6 G3-H3 E6-G4 E2-D1 D8-E8 C2-C1 F8-D6 D1-E1 F6-F7 E1-D1 F7-F8 D1-E1 G4-E2 E1-D1 D6-B4 A3-B3 A6-B6 H3-G3 F8-F7 C1-C2 B4-D2 E3-E4 D2-F4 G3-H3 B6-A6 C2-C1 C5-B4 B3-A3 B4-C3 E4-D5 F4-H6 D5-D6 C7-C8 D6-D5 A6-B6 D5-E6 F7-F6 E6-D5 C8-C7 D5-D6 C7-C8 D6-C5 B6-A6 B5-D7 E2-C4 D7-B5 C4-E6 B5-D3 E8-D8 A3-B3 H6-F4 C5-D6 D8-E8 D6-C5 F4-D2 D3-B5 C3-D4 C5-C6 D4-D3 D1-E1 E6-C4 B5-D7 C4xA2 C6-C5 A2-C4 D7-B5 C4-A2 H3-G3 D2-B4 C5-C6 F6-F5 B5-D7 D3-D4 C6-B7 B4-D6 G3-H3 E8-D8 C1-C2 F5-F4 E1-D1 D8-E8 D7-B5 F4-F3 H3-G3 F3-F4 B5-D7 D4-E3 B7-A8 D6-B8 A8-A7 C8-C7 A7xA5 B8-D6 A5-B6 E8-D8 B6-B7 D8-E8 B7-A6 C7-C8 A6-B5 A2-C4 B5-B6 E3-E4 B6-A5 E8-D8 C2-C3 C4-A2 A5-A6 E4-E3 A6-A5 D6-B4 C3-C4 E3-E4 D7-B5 C8-C7 D1-E1 F4-F5 A5-B6 B4-D6 G3-H3 F5-F4 B6-B7 D8-E8 B7-B8 E8-D8 B5-D7 F4-F5 H3-G3 F5-F4 C4-C3 F4-F3 G3xE3 E4xE2 B8-B7 D8-E8 B7-B6 E8-D8 B6-A5 D6-B4 C3-C4 E2-D1 E1-F2 D1-C2 F2-E1↓ C2-D3 E1-F2 D3-E4 A5-A6 D8-E8 D7-B5 B4-D6 A6-A5 E8-D8 A5-A6 D6-F4 F2-E2 E4-D3 E2-F3 D3-D2 F3-E2 D2-C1 E2-D1 C1-B2 B5-D3 F4-D6 A6-B5 D6-F8 B5-A6 D8-E8 D1-C1 B2-B3 C1-D2 B3-B2 A6-A5 B2-C1 D2-E2 C1-B2 D3-B5 F8-H6 C4-C5 E8-D8 B5-D7 D8-E8 C5-C4 H6-F8 C4-C5 F8-D6 C5-C4 E8-D8 E2-D2 D6-B4 D2-C1 B2-A1 C1-C2 D8-E8 C2-B3 B4-D2 B3-B4 E8-F7 B4-C5 F7-E8↓ C5-D6 C7-C8 D7-B5 A1-B2 B5-D3 B2-C1 D3-B1 E8-D8 D6-E6 D8-E8+Ce E6-E7 E8-D8 E7-E8 D2-B4 A5-B6 C1-D2 B6-A7 D2-E1+Ci B1-D3 B4-D2 D3-F1 D2-F4 A7-B6 F4-D2 E8-D7 D2-B4 D7-E8 E1-D2`


Notation : D1-D2 déplacement, C3xE5 prise, +Ci/+Ce ramasse la couronne d’Ivoire/d’Ébène, ↓ dépôt au palais, ~F5 corruption de l’Héritier en F5.
