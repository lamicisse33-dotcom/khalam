# Pylo Couronne v0.1 — série maitre-apprenti

- IA « blanc » : **maitre** · IA « noir » : **apprenti** · Héritiers : **oui** · beam du Maître : 8
- 1000 parties appariées (500 graines × 2, camps inversés), graines 1 à 500 · plafond 300 demi-coups
- Temps : 25 s au total, 0.19 s par partie en moyenne (un cœur)

## Issues

| Issue | Parties | % |
|---|---:|---:|
| Victoire par conquête | 222 | 22.2 % |
| Victoire par roi piégé | 404 | 40.4 % |
| Nulle — 40 demi-coups sans progrès | 368 | 36.8 % |
| Nulle — triple répétition | 4 | 0.4 % |
| Nulle — pat | 0 | 0.0 % |
| **Nulles (total)** | 372 | 37.2 % |
| Non terminées (plafond, à part) | 2 | 0.2 % |

## Longueur (demi-coups)

- Toutes les parties : médiane **54**, quartiles 40 – 80 (min 14, max 300)
- Parties terminées seulement : médiane 54, quartiles 40 – 79

## Équilibre

- Victoires du premier joueur (Ivoire) : **37.0 %** de toutes les parties ; 59.1 % des parties décisives (370/626)
- Score de « blanc » (maitre) contre « noir » (apprenti) : **765/1000 = 76.5 %** (victoire 1, nulle ou non terminée ½, défaite 0)

## Couronnes

- Parties avec au moins un vol entrepris : **80.0 %** (1.26 vols par partie)
- Les deux couronnes volées en même temps : 295 parties (29.5 %) → 57 conquêtes, 112 rois piégés, 124 nulles, 2 non terminées
- Blocage (portée à ≤ 2 cases de son palais de destination pendant ≥ 10 demi-coups sans entrer) : **13.4 %** des parties
- Couronne au sol hors palais ≥ 10 demi-coups : 3.5 % des parties ; 19/372 nulles (5.1 %) en contiennent une
- Sorties de sa propre couronne hors de son palais : 0.4 % des parties (0.00 par partie) ; 0/2 non terminées (0.0 %) en contiennent une

## Héritiers

- Corruptions : 0.37 par partie (28.4 % des parties en ont au moins une)
- Captures d’Héritier : 0.42 par partie
- Victoires précédées d’une corruption par le vainqueur : 147/626 (23.5 %)

## Les 5 parties non terminées les plus courtes

- graine 292, manche 1 (Ivoire apprenti, Ébène maitre), 300 demi-coups :

  `F4-E5 E8-D7 E1-E2 D7-C6 E2-F3 A6-C4 B3-C3 C4-E2+Ci F3-G4 E2-C4 G3-F3 D8-C8 H3-F1 C6-B5 D1-E2 C7-C6 E2-E3 C8-D8 C3-B3 C6-C7 A3-C1 D8-D7 G4-F5 C7-C8 E3-F4 D7-E7 F5xH7 E7-E6 H7xH5 E6xE4 H5-G4 C5-D6 F3-G3 E4-E3 F4-G5 E3xG1 F1-D3 G1-G2 D3-F1 G2-F2 G3-H3 F2-G1 F1-D3 C4-A6 G4-F5 B6-C6 F5-E6 D6-C5 E6-D7+Ce C8-C7 D7-E6 A6-C4 E6-E5 C5-B6 E5-E4 B6-A7 E4-E3 G1-H2 E3-D2↓ H2xH4 G5-H6 H4-H5 H6-H7 C4-E6 D3-F5 E6-G8 D2-C3 H5-G5 F5-D3 G5-F4 C3-B4 A7-B6 B4-C4 B5-A4 H7-H6 B6-A5 C4-B5 C6-D6 D3-B1 D6-E6 B1-D3 C7-C8 D3-F1 F7-F6 H6-H5 F4-E3 F1-H3 A5-B4 B5-A5 B4-A3 H5-H6 E6-D6 H6-H5 E3-D3 B3-C3 D3xB3 A5-B5 B3xD1 C1-E3 A3-B2 B5-A5 A4-A3 A5-A4 A3-A2 A4-B4 D6-E6 E3-G5 D1-D2+Ce G5xE7 D2-D3 B4-C4 D3-E3 C4-D3 E3-F4 D3-E3 F4-E5 E3-D4 E5-F4 D4-E5 F4-G5 E5-F4 G5-H4 H5-G6 B2-C3 F4-E3 C3-B4 E3-D4 A2-A3 D4-E3 C8-C7 E3-E2 H4-G5 G6-H7 A3-A2 E2-D2 B4-C5 D2-D3 C5-B6 H7-G6 C7-C6 D3-C4 B6-C7 C4-B5 C7-D8 B5xD7 A2-A3 D7-C7~D8 G5-F5 G6-H5 F5-G5 E7-C5 A3-A4 C7-B8 G5-F5 B8-A7 E6-F6 A7-B7 A4-A3 C5-A7 F5-E6 B7-C7 E6-F7 A7-C5 F7-E8↓ C7-C8 A3-A4 D8-C7 F6-E6 C5-A7 A4-B3 C7-B6 E8-D7 C8-D8 D7-C7 D8-E8+Ce C7xA5 E8-E7 A5-B5 H5-H6 E6-D6 E7-F6 B5-A6 A7-C5 D6-E6 F6-E5 A6-B5 C5-A3 E6-D6 E5-D4 B5-C5 D4-C3 B3-A4 C3-D2↓ A4xA2 D2-D3 C5-B4 H6-H5 A2-A3 D3-D4 D6-C6 D4-E4 B4-C4 H5-G6 C4-C3 E4-D5 C6-B6 D5-D6 C3-D2+Ce D6-E7 D2-C3 E7-F8 G8-E6 F8-E7 E6-C4 E7-E8 C3-B4 G6-G7 B6-A6 G7-F8 A6-B6 E8-D7 B6-A6 F8-F7 B4-A5 D7-C7 C4-A2 C7-C8 A3-B4 F7-E8 A2-C4 C8-B7 C4-E6 H3-F5 E6-G8 E8-D7 B4-A3 B7-B8 A3-B4 D7-E8 A5-B5 B8-A8 A6-B6 F5-D3 B4-A3 A8-B8 A3-A4 B8-C7 B6-A6 C7-C6 B5-B6 C6-B5 B6-A7 B5-A5 A4-B3 A5-B4 B3-A4 D3-B5 A4-A3 B4-A4 A3-A2 E8-D7 A6-B6 D7-E6 A7-B7 E6-E5 B7-C8 E5-D6 C8-D8↓ A4-A5 A2-B3 A5-B4 B3-A2 B4-C5 B6-A6 C5-C6 D8-C8 B5-D3 A2-A1 D3-B1 A1-A2 D6-D5 C8-D8 D5-D6 A2-B3 C6-D7 D8-E8 D7-C8 G8-E6 D6-E7 A6-B6 E7-D8+Ce E6-C4 B1-D3 C4-A2 D3-F5 B3-C4 F5-H7 B6-A6 D8-C7 A6-B6`

- graine 316, manche 1 (Ivoire apprenti, Ébène maitre), 300 demi-coups :

  `E1-D2 D8-E7 D2-C3 E7-F6 C3-B4 E8-E7 B4-A5 A6-C4 B3-C3 F7-F8 C2-C1 F6-F5 F2-F3 C4-E2+Ci F3-F2 E2-G4 A5-B5 C5-D6 B5xB7 C7-C8 B7-C6 H6-F4 C6-D7+Ce F4xH2 D7-C6 F8-F7 C6-D5 E7-E6 D5-D4 E6-D5 D4-E3 D5-D4 E3-E2↓ D4xB2 C1-C2 B2-A1 E2-F3 G4-E6 F3-E3 F7-F6 E3-D2 E6-C4 D2-D3 C4-E6 D3-C3 D6-E7 C3-B3 F5-E4 H3-F1 E4-E3 B3-A2 E3xG1 F1-D3 G1-F2 H4-G5 C8-C7 G5-H6 E7-F8 D3-B1 F2-F3 A2-B3 F3-G4 H6-G7 F8xH6 B3-A2 F6-F5 C2-C1 G6-F6 A2-B3 A1-A2 B3-A4 G4-F3 D1-C2 F3-E2+Ce B1-D3 E2-E3 D3-B5 A2-B3 C2-C3 B3-A2 C1-C2 E3-F4 C3-C4 E6-G4 C4-C5 A2-A1 A4-B3 F4-E5 B3-C3 E5-E6 C3-D2 E6-F7 D2-E3 F7-E8↓ E3-F3 G4-E6 F3-G4 H6-G7 C2-C1 G7-H8 G4-H5 E8-F8 H5-H6 H8-G7 C5-B6 C7-C8 H6-H5 H2-F4 B5-D3 G7-H8 H5-H6 E6-G8 D3-B1 F8-E8 B6-A5 E8-E7 H6-H7 E7-E6 A5-B6 F6-G6 B6-A5 E6-D5 B1-D3 D5-E6 C1-C2 E6-F6 H7-G7 C8-C7 C2-C3 C7-C8 D3-B1 F6-F7 G7xE7 A1-A2 E7-E8+Ce A2xA4 E8-E7 G8-E6 E7-F7 H8-G7 C3-C2 E6-G4 F7-E6 C8-C7 E6-D5 G7-F8 D5-E6 F8-G7 C2-C3 G6-F6 E6-D5 G7-F8 D5-D6 F8-G7 D6-C5 C7-C6 C5-B4 G7-H6 B4-C4 F4-D2 C3-C2 D2-B4 C4-D3 A4-B3 D3-E2↓ F5-F4 C2-C1 C6-C5 E2-E3 F4-F5 E3-F3 G4-E6 F3-G4 H6-G5 A5-A6 F6-G6 G4-H3 E6-G8 A6-A7 F5-F6 H3-H2 F6-F5 A7-A8 G5-F6 A8-A7 F6-E7 H2-G3 E7-D8 G3-G4 G8-E6 G4-G5 G6-H6 G5xE5 E6-C8 E5-E6 B4-D2 A7-A8 D8-C7 E6-D5 C5-C4 D5-E5 C7-B8 E5-E6 C4-C3 E6-D7 H6-G6 D7-D6 D2-F4 A8-A7 B3-C4 D6-D5 C4-D3 D5-D4 D3-E2+Ce B1-D3 E2-F3 D4-E4 F3-G4 E4-F5 G4-F3 F5-G4 F3-G2 G4xE4 G2-G3 E4-F4 G3-H2 A7-A6 B8-C7 F4-G3 C7-B6 G3-H3 H2-G1 H3-G2 G1-H2 G2-H1 H2-H3 H1-H2 H3-G4 H2-G3 G4-H3 G3-H4 H3-G2 H4-G3 G2-H1 G3-F2 H1-H2 F2-E3 G6-F6 E3-D4 B6-C7 D4xB2 C8-E6 D3-F5 E6-G8 B2-A3 H2-H1 A3-A4 C7-D8 A4-B5 H1-H2 B5-C6 D8-E7 F5-H3 E7-F8 C6-B6 F8-G7 B6-C6 G7-H6 C6-D7 H2-G1 D7-E8 H6-G5 E8-F8 G8-E6 F8-F7 F6-G6 F7xD5 G5-H4 D5-E6+Ci G6-H6 E6-F5 H4-G5 F5-G4 G1-H2 G4-F3 G5-F6 F3-E2↓ F6-E7 E2-D3 H6-G6 D3-C4 G6-H6 C4-C5 E7-F6 C5-D5 F6-G5 A6-A7 H2-G1 D5-D6 G1-H2`


Notation : D1-D2 déplacement, C3xE5 prise, +Ci/+Ce ramasse la couronne d’Ivoire/d’Ébène, ↓ dépôt au palais, ~F5 corruption de l’Héritier en F5.
