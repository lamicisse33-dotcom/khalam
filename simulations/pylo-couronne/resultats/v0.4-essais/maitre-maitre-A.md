# Pylo Couronne v0.3 — série maitre-maitre-A

- IA « blanc » : **maitre** · IA « noir » : **maitre** · Héritiers : **oui** · Garde de sa couronne (scénario 9) : **oui** · beam du Maître : 8
- 1000 parties appariées (500 graines × 2, camps inversés), graines 1 à 500 · plafond 300 demi-coups
- Essais : Prince avec pas droit (A) **oui** · couronnes au centre D4/E5 (B) **non** · compteur (C) **40**
- Temps : 121 s au total, 0.89 s par partie en moyenne (un cœur)

## Issues

| Issue | Parties | % |
|---|---:|---:|
| Victoire par conquête | 3 | 0.3 % |
| Victoire par roi piégé | 310 | 31.0 % |
| Nulle — 40 demi-coups sans progrès | 674 | 67.4 % |
| Nulle — triple répétition | 9 | 0.9 % |
| Nulle — pat | 0 | 0.0 % |
| **Nulles (total)** | 683 | 68.3 % |
| Non terminées (plafond, à part) | 4 | 0.4 % |

## Longueur (demi-coups)

- Toutes les parties : médiane **69**, quartiles 49 – 104 (min 20, max 300)
- Parties terminées seulement : médiane 69, quartiles 49 – 103

## Équilibre

- Victoires du premier joueur (Ivoire) : **20.2 %** de toutes les parties ; 64.5 % des parties décisives (202/313)
- Score de « blanc » (maitre) contre « noir » (maitre) : **499.5/1000 = 50.0 %** (victoire 1, nulle ou non terminée ½, défaite 0)

## Couronnes

- Parties avec au moins un vol entrepris : **1.8 %** (0.03 vols par partie)
- Les deux couronnes volées en même temps : 3 parties (0.3 %) → 0 conquêtes, 1 rois piégés, 1 nulles, 1 non terminées
- Blocage (portée à ≤ 2 cases de son palais de destination pendant ≥ 10 demi-coups sans entrer) : **20.3 %** des parties
- Couronne au sol hors palais ≥ 10 demi-coups : 0.6 % des parties ; 2/683 nulles (0.3 %) en contiennent une
- Sorties de sa propre couronne hors de son palais : 33.4 % des parties (0.37 par partie) ; 4/4 non terminées (100.0 %) en contiennent une

## Héritiers

- Corruptions : 0.09 par partie (4.5 % des parties en ont au moins une)
- Captures d’Héritier : 0.05 par partie
- Victoires précédées d’une corruption par le vainqueur : 28/313 (8.9 %)

## v0.3 — Princesse contre Prince

- Prince porteur : **garde son saut (éclaireur)**
- Score du camp avec la Princesse contre le camp avec le Prince : **568.5/1000 = 56.9 %** (victoire 1, nulle ou non terminée ½) — parties appariées : chaque graine jouée avec les rôles dans les deux sens
- Parties décisives : Princesse 225, Prince 88 → **le Prince gagne 28.1 % des parties décisives**
- Trajets de vol (coups du porteur, du ramassage au dépôt) : avec le Prince porteur **2.00** coups en moyenne (13 trajets, 5 déposés) ; avec un autre porteur **5.50** (16 trajets, 6 déposés)
- Trajets déposés seulement : Prince 4.40, autres 6.83
- Corruptions du Prince : 0.08 par partie ; parties où une corruption du Prince par le vainqueur précède la victoire : **21/1000 = 2.1 %** des parties (6.7 % des victoires)
- Nulles quand la Princesse est encore sur le plateau à la fin : **69.2 %** (676/977) ; quand elle n’y est plus (prise) : **47.8 %** (11/23)

## Les 5 parties non terminées les plus courtes

- graine 111, manche 1 (Ivoire maitre, Ébène maitre), 300 demi-coups :

  `G4-H5 F5-H7 E1-E2+Ci D8-D7+Ce A3-C5 B6-C6 H3-F5 A6-C8 B3-C3 D7-E7 F5-D3 H6-F4 G3-H3 F4-D6 C5-A3 C6-B6 A3-C1 E8-D7 C3-B3 B6-A6 E2-D2 E7-D8 B3-A3 D6-F8 A3-B3 D8-E8 D3-B5 D7-D6 B3-A3 A6-B6 B5-D3 D6-C5 D2-E2 H7-G7 D3-F5 G6-F6 E2-D2 C7-C6 F5-D3 C6-C7 H3-G3 G7-G8 H5-H6 B6-A6 D3-B5 G8-H8 C2-C3 H8-G8 A3-B3 F6-E6 C3-C2 C5-D4 B5-D3 C7-C6 C1-E3 C6-C5 D1-E2 F8-D6 E2-F3 E8-E7 F3-E4 G8-E8 H6-H7 E8-G8 B3-A3 G8-F8 H7-H8 E6-F6 G3-H3 F8-D8 H3-G3 A6-B6 G3-H3 D8-F8 H3-G3 C8-A6 E4-D5 D6-B4 H8-H7 F8-G8 D5-D6 E7-F8 D6-C7 B6-C6 H7-H6 F8-G7~H6 C7-B8 A6-C8 B8-A7 G8-E8 G3-H3 E8-D8 C2-C1 D8-B8 C1-C2 G7-G6 A7-A6 G6-G5 A6-A5 F6-E6 H3-G3 H6-G6 A3-B3 G5-F6 C2-C1 D4-C3 D2-D1 C6-D6 A5-A6 G6-G5 E3-G1 G5-G6 D1-E2 G6-F5 G3-H3 B8-D8 H3-G3 D8-E8 G3-F3 F7-F8 F3-G3 F5-E5 A6-A7 C3-B2 E2-D2 F6-E7↓ D3-B1 E7-F7 A7-A8 B2-A1 F2-F3 E8-D8 B3-C3 D8-B8 F3-F4 F7-F6 F4-F3 D6-C6 C3-D3 F6-F7 D3-C3 C6-B6 C3-D3 F7-F6 F3-F2 E6-D6 C1-C2 B6-C6 D3-C3 F8-F7 C3-B3 D6-E6 B3-A3 C6-D6 C2-C1 F7-F8 C1-C2 F6-F7 G3-H3 D6-C6 C2-C1 C6-B6 A3-B3 B6-C6 A8-A7 F7-E7+Ce B3-A3 F8-F7 H3-G3 F7-F8 A3-B3 C6-B6 G3-F3 E5-D6 B3-A3 D6-C7 A7-A8 C7-D8 C1-C2 D8-C7 C2-C3 F8-F7 F3-G3 C7-D8 G3-F3 E7-E8 F2-F1 F7-F8 B1-D3 E6-F6 F1-F2 F8-F7 D3-B1 B6-C6 G1-E3 F7-F8 A8-A7 F6-E6 A3-B3 C6-B6 B3-A3 D8-E7 A3-B3 E7-D6 A7-A8 C5-C4 C3xC5 D6-D7 C5-C4 B6-A6 E3-G5 D7-C7 G5-E3 C7-B6 E3-C1 F8-F7 C4-C3 B6-A7 C3-C2 B4-D6 F2-F1 B8-D8 F1-F2 F7-F8 B3-A3 D6-B8 A3-B3 D8-B6 C1-A3 F8-F7 F3-E3 E6-F6 F2-F1 F7-F8 E3-D3 F8-F7 F1-F2 F6-G6 D3-C3 B6-B7 C2-C1 C8-E6 A3-C5 E6-C4 B3-A3 C4-E2 C3-B3 F7-F6 C5-E3 G6-H6 E3-G5 F6-F5 D2-E1 B8-D6 F2-F1 B7-B8 C1-C2 D6-F8 F1-F2 B8-B7 E1-D2 E2-C4 B3-C3 C4-E2 A3-B3 E2-C4 G5-E3 C4xA2 E3-G1 A2-C4 C2-C1 C4-E6 F2-F3 E6-G8 C1-C2 A1-A2 D2-E2 B7-B8 E2-E1 F5-F6 E1-D2 B8-D8 C2-C1 F6-F7 D2-E2 A2-A3 F3-F2 D8-C8 E2-D1 E8-D8 C1-C2 H6-G6 C2-C1 G8-E6 F2-F3 F7-F6 F3-F2 F8-D6 C3-D3 D6-B8`

- graine 115, manche 0 (Ivoire maitre, Ébène maitre), 300 demi-coups :

  `A3-C5 D8-D7+Ce C5xA7 D7-E6 E1-E2+Ci A6-C4 B3-A3 G6-F6 G4-H4 H6-F4 H4-H2 C7-C8 G3-F3 F5-E5 F2-F1 C8-C7 H2-F2 E5-E4 A7-C5 E8-E7 C5-A7 C7-C6 A7-C5 E4-D3 H3-F5 E6-E5 C2-C1 F4-D2 F2-G2 E5-E4 G2-H2 C4-A6 C5-A7 E4-F4 F5-H7 A6-C4 H7-F5 E7-D6 F5-H7 D6-D5 H7-F5 D5-D4 H2-H1 D4-E3 E2-E1 F4-E4 F5-D7 C4-E2 D7xB5 E2xG4 F1-F2 E3-E2 H1-F1 D3-E3 F2-F3 E2-D3 A7-C5 G4xE2 C5-E7 E4-F3 F1-F2 F3-G2~F2 E7xG5 F2-H2 G5-E7 G2-F3 E7-C5 F3-F4 A3-B3 D3-E4 B3-A3 H2-H3 C5-A7 F4-E5 A7-C5 E2-G4 B5-D7 E5-D5 C5-A7 D5-D6 A3-B3 D6-C7 E1-F1 H3-F5 D7-B5 G4-E2 F1-G2 F5-D7 G2-F1 D7-E7 C1-C2 E7-E8 C2-C1 C7-C8 C1-C2 F7-F8 F1-E1↓ E4-F3 E1-F1 C8-D8↓ C2-C1 D8-C7 D1-C2 C7-B8 A7-C5 B8-C8 C5-A3 E3-F2 A3-C5 C8-D8 B3-A3 F8-F7 A3-B3 D8-D7 C5-A3 E8-G8 A3-C5 D7-C8 B3-A3 C8-D7 C5-A7 D7-E8 A7-C5 E8-F8 C5-A7 F7-F6 C2-B3 D2-B4 F1-E1 F2-E3 E1-D2 E3-F2 D2-D1 F8-F7 D1-E1 F2-E3 E1-D1 F6-F5 B5-D7 F5-F4 B3xB5 G8-E8 B5-C6 E8-D8+Ce D1-E1+Ci F7-E7 D7-B5 E3-F2 C6-C5 F3-E4 C1-C2 E4-F3 C2-C3 D8-E8 C3-C4 E7-D8 C4-C3 F3-G4 A3-B3 F4-F5 C5-B6 F5-F4 B6-A5 G4-F3 C3-C4 F3-E4 C4-C3 D8-D7 C3-C2 E4-E3 A5-A6 F4-F5 C2-C1 E3-D4 E1-D1 F2-E1 D1-C2 D4-D3 C2-D1↓ E1-F2 A6-B7 E8-D8 B7-A8 F5-F4 A7-C5 D7-E7 C5-A3 E7-E8 D1-E1 F2-E3 E1-F1 E3-D2 B3-C3 D3-E4 F1-F2 F4-F5 C3-B3 F5-F6 A8-B7 E8-E7 B7-A6 F6-F5 A6-A7 E7-E8 A7-A6 E4-D3 F2-G3 F5-F6 G3-F4 D2-D1+Ci F4-E5 E8-D7 E5xG7 D1-D2 G7-F8 D8-B6 A3-C5 B6-B8 B3-C3 D2-E3 A6-A5 D7-C8 F8-E7 E3-E4 E7-D6 C8-B7 A5-A6 B7-C8 D6-E5 D3-D4 C3-B3 D4-E3 E5-D6 E3-F4 D6-C6 B8-D8↓ C6-D6 D8-B8 A6-A5 E4-F5 C5-A3 C8-C7 D6-E5 F5-E4 A3-C5 F4-E3 E5-D5 C7-B7 C5-A3 E4-F4 D5-C5 B8-A8 A5-B6 B7-A7 B6-C7 A7-B8 C7-D8+Ce B8-C8 D8-E7 C8-D7 E7-F8 D7-E8 F8-G7 E8-F8 G7-H8 F4-G5 C5-C6 G5-F6 C6-B7~A8 F6-E7↓ A3-C5 E7-F7 B7-B8 F7-G8 B8-B7 F8-E8 B3-A3 E8-D8 B7-B8 G8-G7 A3-B3 E3-E4 A8-A7 E2-G4 A7-A5 G7-H7 A5-A3 G4-E6 A3-A2 E6-G4 B3-A3 D8-D7 A2-C2 D7-E6 B8-C7 E4-E3 C7-D8 E3-E2 D8-E8 E6-F6`

- graine 194, manche 0 (Ivoire maitre, Ébène maitre), 300 demi-coups :

  `H4-H5 H6-F4 H5-G4 F4-D6 G4-F5 G6-H6 F5-E4 D8-D7+Ce E1-E2+Ci C7-C6 C2-C1 B5-B7 H3-F1 D7-D8 D1-C2 A6-C8 G3-H3 B7-D5 E2-D3 D5-B7 C2-C3 E8-E7 E4-D4 B7-B8 D4-E4 C6-C7 E4-D4 D8-E8 A3-C5 B6-A6 B3-A3 D6-F8 A3-B3 E8-D8 D4-C4 D8-E8 C5-E3 F8-D6 C3-D4 A6-B6 E3-C5 B6-A6 C5-A3 F7-F8 D3-C3 D6-F4 C4-B4 E8-D8 D4-D5 E7-F6 D5-E6 D8-D7 E6-E7 F6-E5 B4-C4 B8-D8 E7-D6 C8-E6 C4-D4 E5-E4 D4-E5 E4-D3 C3-D4 F4-D2 D6xB8 E6-C8 B8-A7 D3-C4 B3-C3 A6-B6 A3-C5 D2xB4 C5xA3 B6-C6 E5-D5 C4-C3 D5-C4 C3-D2 H3-G3 D8-B8 A7-A6 C6-B6 A3-C5 B6-C6 C5-A7 D7-E8 D4-C3 E8-D8 C4-B4 F8-F7 A6-A5 F7-F8 G3-F3 F8-F7 F1-H3 D2-D3 F3-G3 D3-E2 H3-F5 E2-D1 F5-D3 D8-E8 G3-F3 F7-F6 D3-F1 E8-D8 A5-A6 F6-F5 F3-E3 D8-E8 F1-D3 H6-G6 D3-B5 C6-D6 B4-C4 D6-E6 C3-D3 F5-F4 B5-D7 G6-H6 E3-F3 F4-F5 A6-A5 B8-D8 D7-B5 E6-D6 A7-C5 H6-G6 A5-A6 G6-H6 C5-E3 D8-F8 C4-D4 F8-D8 A6-A5 H6-G6 D4-E4 D8-F8 F3-G3 D1-D2 E4-D4 C8-E6 D3-C3 E6-G4 C3-D3 D2-E1 B5-D7 F8-D8 D4-E4 E1-E2 F2-F1 D8-F8 E4-D4 E2-D1 D3-C3 G6-F6 D4-C4 G4-E2 A5-A6 F6-E6 A6-A7 E2-G4 C4-B4 D1-C2 C3-C4 C2-B1 C4-C3 E6-F6 E3-C5 D6-E6 D7-B5 B1-A2 A7-A8 F6-G6 A8-A7 F5-F6 A7-A8 A2-A1 B5-D3 F8-D8 D3-B1 F6-F7 C3-D2↓ G6-H6 D2-C3 H6-G6 B4-A5 D8-F8 A8-A7 E8-D8 C5-A3 G4-E2 A5-B5 D8-D7 B5-A5 D7-E8 A7-B8 E6-F6 A5-A6 A1-A2 A3-C5 A2-A3 A6-A5 A3-A2 A5-A4 F6-E6 B8-A7 E8-D8 G3-H3 D8-E8 C5-E3 F7-F6 A7-A6 F6-F7 H3-G3 E8-D8 A6-B7 D8-E8 B7-B8 E8-D8 B8-C7 D8-E8 C3-D2+Ci E2-C4 D2-E2 E6-F6 C7-D8 E8-E7 D8-D7 F8-E8 D7-C8 C4-A6 C8-C7 A6-C4 E3-C5 F6-E6 C7-B8 E8-C8 B8-A7 C8-A8 A7-B6 E7-E8 G3-H3 A8-C8 A4-B3 C4-A6 B3-B2 C8-D8 C5-A7 A6-C8 B6-A5 A2-A3 B2-C3 D8-F8 F1-F2 F8-G8 F2-F3 G6-H6 H3-G3 A3-A4 F3-F4 A4-A3 F4-F5 H6-G6 E2-D1 G6-F6 G3-F3 F6-G6 A7-C5 A3-A4 F5-F4 G8-G7 A5-A6 G7-G8 F4-F5 G8-F8 A6-B5 C8-A6 C3-B4 A6-C8 D1-E1 F8-G8 B5-A6 G8-G7 B4-A5 A4-B3 A5-B5 F7-F8 E1-D2 G7-H7 C5-A3 E8-D8 A6-A5 F8-F7 D2-E2 H7-G7 E2-D2 G7-G8 A5-A6 G8-F8`

- graine 362, manche 1 (Ivoire maitre, Ébène maitre), 300 demi-coups :

  `D1-E2+Ci D8-D7+Ce H3-F1 B6-C6 C2-C3 F7-F6 C3-C2 F6-F5 G3-F3 C6-D6 B3-C3 D6-C6 A4-A2 D7-E7 E1-D1 A6-C8 D1-D2 A5-A6 D2-E3 A6-A7 E3-D4 C6-D6 C3-B3 E8-F7 F3-G3 F7-E6 A3-C1 A7-A8 G3-H3 H6-F8 D4-C4 F8-H6 C4-B5 E6-D5 B5-B6 A8-B8 B6-C5 D5-E4 C1-E3 C8-E6 C5-D4 F5-F4 E3-G1 E4-F3 E2-D3 F3-E2 D3-C4 E2-D1 D4-E4 F4-F5 C2-C1 C7-C6 E4-D4 E7-D7 A2-B2 H6-F8 H3-G3 G6-H6 G3-H3 E6-G4 H3-G3 F5-F6 G3-H3 D6-E6 H3-G3 B8-A8 G3-H3 F6-F7 B3-C3 A8-B8 D4-C5 B8-C7 C5-D5 D7-E7 D5-E4 C7-B6 E4-E5 B6-A5 B2-B3 C6-C7 F1-D3 A5-A4 C1-C2 E6-D6 E5-D4 C7-C6 D4-C5 A4-B5 C5xA5 F7-F6 A5-A4 G4-E6 A4-B4 C6-C7 B4-A5 D6-C6 H3-G3 C7-C8 A5-A4 E7-D7 A4-B4 F6-F5 B4-C5 E6-G8 D3-F1 C8-C7 C2-C1 D7-E7 C5-D5 C6-B6 D5-E6 E7-F7 E6xG4 F7-E8↓ G4-H5 E8-D7 H5xH7 D7-C6 B3-B1 C6-D5 C3-B3 D5-D4 C4-B5 D4-C4 B5-A6 C4xA2 B1-D3 A2-B3 D3-E3 B3-B4 E3-G5 B4-A5 A6-B7 A5-B5 B7-A8 B5-C4 G5-G6 C4-D5 G6-E8+Ce D5-E6 E8-G6 E6-F5~G6 H7-H6~G6 F5-F6~G6 H6-H5~G6 F6-F7~G6 H5-G5~G6 F7-G7~G6 G5-F5~G6 G7-H7~G6 F5-G5~G6 H7-G7~G6 G5-H5~G6 G7-H6~G6 H5xH7 G6-E4 F1-D3 E4-E5 H7-G6 E5-D5 G6-F5 D5-B5 F5-E4 B5-B7 E4-E5 C7-C8 E5-D6 B7-A7 D3-F1 B6-A6 D6-C6 A7-B7 C6-B6~B7 A6xC6 B7-B5 F8-H6 B5-D3 H6-F4 G3-F3 F4-D2 F3-G3 C8-C7 F2-F3 D1-E2 D3-D4 E2-D1 D4-F2 G8-E6 F2-E2↓ D2-B4 F1-D3 E6-G4 D3-B1 C7-C8 A8-B7 C8-C7 B7-B8 G4-E6 B8-A7 C6-D6 E2-E3 E6-G4 F3-F2 B4-D2 E3-E1 D6-C6 F2-F1 C6-D6 G3-H3 D6-C6 F1-F2 C7-C8 B1-D3 D2-F4 E1-C3 C6-D6 C3-A5 F4-H2 A5-C3 D6-C6 A7-B8 C6-D6 C3-E1 D6-C6 F2-F1 C8-C7 B8-B7 H2-F4 D3-B5 C6-D6 B7-B8 F4-H6 B5-D7 H6-F8 F1-F2 D6-E6 B8-A7 F8-D6 A7-B8 D6-B4 B8-B7 B4-D2 B7-B8 E6-D6 B8-A7 C7-C8 H3-G3 C8-C7 F2-F1 C7-C8 G3-H3 C8-C7 A7-A8 D2-B4 F1-F2 D6-E6 A8-A7 B4-D2 F2-F1 E6-F6 D7-B5 C7-C8 B5-D3 F6-E6 D3-F5 C8-C7 H3-G3 G4-E2+Ce E1xE3 D2xF4 G3-F3 E6-F6 F5-D3 D1-E2+Ce A7-B6 C7-C6 D3-B5 C6-C5 B6-B7 E2-D3 B7-C8 F4-D2 F1-F2 F6-E6 F2-F1 E6-D6 F1-F2 D2-F4 F2-F1 D6-E6 C8-B7 D3-D4 C1-C2 F4-D6 G1-E3 E6-F6 B7-A6 D6-B4 F3-G3 D4-D3`


Notation : D1-D2 déplacement, C3xE5 prise, +Ci/+Ce ramasse la couronne d’Ivoire/d’Ébène, ↓ dépôt au palais, ~F5 corruption de l’Héritier en F5.
