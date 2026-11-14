# Pylo Couronne v0.1 — série gardien-gardien

- IA « blanc » : **gardien** · IA « noir » : **gardien** · Héritiers : **oui** · beam du Maître : 8
- 1000 parties appariées (500 graines × 2, camps inversés), graines 1 à 500 · plafond 300 demi-coups
- Temps : 10 s au total, 0.08 s par partie en moyenne (un cœur)

## Issues

| Issue | Parties | % |
|---|---:|---:|
| Victoire par conquête | 175 | 17.5 % |
| Victoire par roi piégé | 156 | 15.6 % |
| Nulle — 40 demi-coups sans progrès | 659 | 65.9 % |
| Nulle — triple répétition | 7 | 0.7 % |
| Nulle — pat | 1 | 0.1 % |
| **Nulles (total)** | 667 | 66.7 % |
| Non terminées (plafond, à part) | 2 | 0.2 % |

## Longueur (demi-coups)

- Toutes les parties : médiane **80**, quartiles 52 – 122 (min 18, max 300)
- Parties terminées seulement : médiane 80, quartiles 52 – 122

## Équilibre

- Victoires du premier joueur (Ivoire) : **21.0 %** de toutes les parties ; 63.4 % des parties décisives (210/331)
- Score de « blanc » (gardien) contre « noir » (gardien) : **496.5/1000 = 49.6 %** (victoire 1, nulle ou non terminée ½, défaite 0)

## Couronnes

- Parties avec au moins un vol entrepris : **67.9 %** (1.12 vols par partie)
- Les deux couronnes volées en même temps : 352 parties (35.2 %) → 47 conquêtes, 33 rois piégés, 270 nulles, 2 non terminées
- Blocage (portée à ≤ 2 cases de son palais de destination pendant ≥ 10 demi-coups sans entrer) : **16.0 %** des parties
- Couronne au sol hors palais ≥ 10 demi-coups : 4.8 % des parties ; 40/667 nulles (6.0 %) en contiennent une
- Sorties de sa propre couronne hors de son palais : 0.0 % des parties (0.00 par partie) ; 0/2 non terminées (0.0 %) en contiennent une

## Héritiers

- Corruptions : 0.41 par partie (30.1 % des parties en ont au moins une)
- Captures d’Héritier : 0.71 par partie
- Victoires précédées d’une corruption par le vainqueur : 84/331 (25.4 %)

## Les 5 parties non terminées les plus courtes

- graine 77, manche 0 (Ivoire gardien, Ébène gardien), 300 demi-coups :

  `E1-D2 D8-D7 D2-C3 D7-C6 C3-B4 F7-F6 B4-A5 A6-C8 A5-A6 C6-C5 H3-F5 C5-C4 F5xH7 C4xA2 A3-C5 B5-C6 C5xA7 A2-B2 A6-B6 B2-C1 D1-E2 C1-D1 G3-F3 D1-E1 F3-E3 E1-D1 F2-F3 D1-D2 F3-F2 D2-D1 E3-F3 D1-E1 F4-E3 E1-F1 E2-D3 F1-E2+Ci B6xD8 H6-F8 D8-C7~C6 E8-F7 C7-B8 F8-D6 B8xD8 F7-E6 C6-D7+Ce F6-F7 D7-C6 E6-F5 C6-B5 D6-B8 E3-F4 B8-D6 B5-C4 F7-F8 D8-E8 F5-G4 E8xG8 G4-H3 F3-G3 H3-G2 H7-F5 D6-B4 G8-F7 E2-D2 F5-H3 G2-F1 G3-F3 F1-E2 F7-F8 D2-C3 F4-G5 B4-D2 F8-G8 E2-E3 C4-B3 C3-B4 A7-C5 E3-E2 D3-C4 B4-A4 G8-G7 E2-E1 H3-F1 A4-A5 F3-G3 A5-A6 G7-H7 A6-B7 C4-D5 B7-C8 C5-A7 C8-D8↓ D5-E6 D8-E8 A7-C5 E8-F8 H7-H8 F8-E8 C5-E7 E8-F8 E6-D5 F8-F7 G5-F4 F7xD7 C2-C1 D2-B4 H8-G8 D7-E8 F4-E5 B4-D6 E5-D4 D6-F4 G3-F3 E8-D7 G8-F8 D7-C7 B3-C2 C7-B6 C2-D1↓ B6-B5 F8-E8 B5-C4 D5-C6 C4-D5~D4 C6-C7 D4-C3 E8-D8+Ci D5-E6 C7-B8 E6-D5 B8-B7 C3-B2 B7-B8 D5-C4 D8-D7 B2-A1 B8-B7 C4-C3 D7-C6 C3-D2 C6-D5 F4-H2 B7-C8 H2-F4 C8-D7 F4-H2 D7-D6 H2-F4 D6-C7 F4-H2 C7-B6 H2-F4 B6-A5 F4-H2 A5-A6 H2-F4 A6-A7 F4-H2 A7-B8 H2-F4 D5-D4 D2-D3 D4-D5 D3-D4 D5-C6 D4-C4 B8-B7 C4-C5 C6-D7 C5-D6 D7-C8 D6-D5 B7-A6 D5-D4 C8-D7 D4-D3 D7-E6 D3-D2 E6-F5 F4-H2 F5-F4 A1-B2 A6-A7 B2-A1 A7-A8 A1-B2 A8-B7 B2-A3 B7-C6 A3-B4 C6-D5 B4-A3 D5-E6 A3-B2 E6-F5 B2-A3 F5-G6 A3-B2 G6-G7 B2-A1 F4-E3 D2xF4 G7-F8 A1-B2 F8-F7 B2-A3 F7-G8 A3-B4 G8-H7 B4-C3 C1-C2 C3-B4 H7-H8 B4-A5 C2-C3 A5-B6 H8-G7 B6-A5 G7-H6 A5-B4 C3-C4 B4-A3 C4-C3 A3-B2 C3-C4 B2-A1 C4-C3 F4-E4 F3-E3+Ci H2-F4 E3-F3 E1xG3 D1-C2 G3-H4 C2-B1 E4-E3 H6-G7 E3xG3 G7-H8 G3-F2 F1-D3 F2-E1 B1-C2 E1-D1+Ce D3-B1 D1-D2 C2-D3 D2-E3 C3-C2 E3-D4 H8-H7 F4-D6 H7-H6 D4-E5 D3-E2 D6-B4 E2-F1 E5-D6 H6-G7 D6-E7↓ G7-H6 E7-D6 F1-G2 D6-D5 B1-D3 D5-D4 D3-F1 D4-D3 C2-C1 D3-E3 H6-H7 E3-F2 H7-G8 F2xH2 F1-D3 H2-H3 D3-B5 H3-G4 G8-F7 B4-D2 F7-F8 H4-G3 F8-E7+Ce G3-H2 E7-F8 G4-F4 F8-G7 H2-G1 G7-H6 F4-G3 B5-D7 G3-F4 H6-H7 F4-E4 C1-C2 A1-B2 H7-H6 B2-C1 H6-G7 E4-E3`

- graine 163, manche 1 (Ivoire gardien, Ébène gardien), 300 demi-coups :

  `A3-C5 B6-C6 H3-F1 B5-C4 B3-C3 D8-E7 E1-E2 C4-D5 F2-F3 E7-F6 C3-B3 A6-C8 C5-E3 E8-E7 E3-C5 C8-E6 C2-C1 C7-C8 E2-D3 F6-G5 D3-D4 E6-G8 C5-A3 G5-G4 D4-E5 D5-E6 F3-F4 E6-D7 E4-D3 C6-B6 F1-H3 G4-H4 H3-F5 H4xF2 D1-C2 C8-C7 F5xH7 C7-C8 F4-F5 F7-F8 F5-F4 C8-C7 H7-F5 F8-F7 A3-C5 G8-E6 E5-D6 E7-F6 C5-E7 F6-E5 D6xF6 E5xG3 F6xF8 B6-C6 F8-E8 G3-H4 E8-D8 H6-F4 B3-A3 F4-D2 E7-G5 F2-E3 D8-C8 C6-D6 G5-E7 D6-E6 C8-D8 H4-G3 D8xB6 G3-H2 B6-C7 H2-H1 C7-D8 H1-H2 F5-H7 H2-G1 A3-B3 G1-H2 D8-E8 E6-D6 E7xC5 H2-H3 E8-E7~D7 D2-F4 C2-C3 F4-D2 C3-D4 H3-H4 E7-F8 H4-G3 F8-G8 G3-F4 G8-F8 D2-B4 F8-G8 B4xD6 D4-E5 E3-E2+Ci~D3 E5xC7 E2-F3 H7-F5 D3-C4 B3-C3 C4-B5 D7-E8 F4-G3 E8-D7+Ce F3-F4 D7-E6 F4-E5 G8-G7 E5-D5 G7-F8 B5-A4 F8-E8 G3-F2 E8-D7 D5-E5 D7-C6 A4-B3 C3xA3 E5-F6 C6-D7 F6-G7 C7-C8 F2-G3 C8-B7 G7-G8 B7-A6 G8-G7 D7-E7 G7-H8 E6-D5 G3-H2 D5-C4 H8-H7 E7-F8 H2-H1 C4-D3 H1-G2 D3-E2↓ G2-F1 E2-F3 H7-H6 F8-E8 H6-G5 E8-F7 G5-F4~F3 F7-F8 F3-E2+Ce F8-F7 E2-D3 F7-E6 F4-E3 A6-A5 F1-E2 E6-E5 E3-F2 E5-D4 F2-F3 D4xD2 E2-F1 D2-E3 F3-G3 F5-D7 G3-H4 A5-A6 H4-H5 A6-A5 H5-H6 E3-D2 F1-G2 D7-F5 G2-H3 F5-D7 H6-G7 A5-A6 G7-F7 D2-C3 F7-E8↓ D7-F5 E8-D7 C3-D3+Ce D7-C6 D3-D2↓ C6-B5 A6-A7 B5-A4 D2-E3 A4xA2 E3-D4 A2-B1 D4-E5 B1xD1 E5-D6 D1-D2+Ce D6-E7 D2-C3 E7-E8+Ci C3-D4 E8-E7 D4-E5 E7-F6 E5-D6 F6-E5 D6-E7↓ E5-E4 E7-F6 F5-H7 F6-F5 E4-F3 F5-F4 F3-E2↓ F4-E4 A7-B8 H3-G4 E2-F2 E4-F4 F2-E1 F4-E4 E1-D2 G4-G3 D2-C3 E4-F3 C3-B4 F3-E2+Ci B4-C5 E2-F3 C5-D6 F3-F4 D6-E7+Ce F4-G5 E7-F6 G3-H4 F6-E5 G5-F6 E5-E4 F6-E7↓ E4-D3 E7-E6 D3-E2↓ E6-D5 E2-D3 H4-H3 B8-C7 H3-H4 C7-D8 D5-E6 D3-E4 H4-H3 E4-F4 E6-F6 H7-F5 H3-H2 D8-C7 H2-H1 C7-B8 H1-H2 B8-B7 H2-H3 B7-B8 H3-H4 F4-G5 F6-E5 B8-A7 H4-H3 A7-B8 H3-H2 F5-D3 E5-D4 D3-B5 D4-E3 G5-F6 E3-E2+Ce F6-E7+Ci E2-E3 E7-F6 E3-F4 F6-G5 F4-E5 G5-G4 E5-F6 G4-F3 F6-E7↓ F3-E2↓ E7-D6 E2-E3 D6-E5 B5-D3 H2-H1 B8-C7 H1-H2 C7-B6 H2-H1 B6-B7 H1-H2 B7-C8 H2-H1 D3-F1 H1-H2`


Notation : D1-D2 déplacement, C3xE5 prise, +Ci/+Ce ramasse la couronne d’Ivoire/d’Ébène, ↓ dépôt au palais, ~F5 corruption de l’Héritier en F5.
