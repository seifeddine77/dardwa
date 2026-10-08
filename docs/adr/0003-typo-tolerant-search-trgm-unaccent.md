# ADR 0003: Architecture du Moteur de Recherche (pg_trgm, unaccent & Normalisation Arabe)

## Statut
Accepté

## Contexte
La recherche de médicaments en Tunisie présente plusieurs défis linguistiques et techniques :
1. **Multilinguisme et dialectes** : Les utilisateurs recherchent indifféremment en français (avec ou sans accents) ou en arabe.
2. **Tolérance aux fautes de frappe (Typos)** : Les noms de médicaments sont complexes (ex: *Amoxicilline* vs *Amoxiline*, *Doliprane* vs *Dolipran*).
3. **Double niveau d'interrogation** : La recherche doit matcher à la fois sur le **Nom commercial** (ex: *Doliprane*) et sur la **Dénomination Commune Internationale (DCI)** (ex: *Paracétamol*).
4. **Vitesse et fluidité (Autocomplete)** : Les suggestions doivent s'afficher en moins de 50 ms pour offrir une expérience instantanée sur mobile.

## Décision
Nous implémentons une architecture de recherche hybride basée sur :

### 1. Normalisation Unicode Stricte
Toute chaîne (requête ou entrée de base) subit un pipeline de normalisation standardisé :
- **Décomposition NFD & suppression des marques** : Élimination de tous les accents français (`é`, `è`, `ê`, `à`, `ç`).
- **Normalisation de l'alphabet arabe** :
  - Unification des variantes du Alef (`أ`, `إ`, `آ`, `ٱ` -> `ا`).
  - Normalisation de la Taa Marbuta (`ة` -> `ه`).
  - Unification du Yaa / Alef Maqsura (`ي`, `ى` -> `ي`).
  - Suppression intégrale du Tashkeel (harakat : Fatha, Damma, Kasra, Sukun, Tanwin, Shadda) via la classe Unicode `\p{M}`.

### 2. Algorithme de Similarité par Trigrammes (`pg_trgm`)
- Découpage des mots en 3-grammes glissants.
- Calcul du coefficient d'intersection de Sørensen-Dice / Jaccard.
- Permet de repérer un médicament même si l'utilisateur oublie une lettre, inverse deux lettres ou commet une faute phonétique.

### 3. Hiérarchie de Pertinence (Scoring)
1. **Match exact sur le nom commercial** : Score = 1.0.
2. **Match exact sur la molécule (DCI)** : Score = 0.95.
3. **Préfixe sur le nom commercial** : Score = 0.85.
4. **Préfixe sur la DCI** : Score = 0.80.
5. **Sous-chaîne contenue** : Score = 0.70.
6. **Similarité trigramme fuzzy** (seuil >= 0.28) : Score pondéré.

### 4. Dualité Base PostgreSQL & Moteur In-Memory Fallback
- En production avec Supabase connecté : exécution de la fonction RPC SQL `search_medicines()` tirant parti des index `GIN (brand_name gin_trgm_ops)`.
- En environnement local sans base distante configurée / tests CI : exécution du moteur in-memory pur reproduisant scrupuleusement la même logique.
