# Guide d'Importation des Données Officielles (PCT & DPM Tunisie)

Ce document décrit la structure attendue et la procédure pour importer les données officielles des spécialités pharmaceutiques et de l'annuaire des pharmacies en Tunisie.

## 1. Sources Officielles Recommandées
- **Pharmacie Centrale de Tunisie (PCT)** : Nomenclature officielle et tarifs publics réglementés.
- **Direction de la Pharmacie et du Médicament (DPM)** : Répertoire des AMM (Autorisations de Mise sur le Marché) et listes des princeps / génériques.
- **CNAM Tunisie** : Référentiel des médicaments pris en charge et tarifs de convention.
- **Conseil National de l'Ordre des Pharmaciens de Tunisie (CNOPT)** : Liste et tableau des gardes de nuit et jours fériés.

---

## 2. Structure CSV : Médicaments (`medicines.csv`)

Séparateur : virgule (`,`) ou point-virgule (`;`). Encodage : **UTF-8** (crucial pour les caractères arabes et accents).

| Colonne | Type | Exemple | Description |
| :--- | :--- | :--- | :--- |
| `code` | string (unique) | `PCT-1014` | Code officiel PCT ou numéro d'AMM |
| `brand_name` | string | `DOLIPRANE 1000` | Nom commercial en français |
| `brand_name_ar` | string (optionnel) | `دوليبران 1000` | Nom commercial en arabe |
| `dci` | string | `PARACETAMOL` | Dénomination Commune Internationale |
| `dosage` | string | `1000 mg` | Dosage affiché |
| `form` | string | `Comprimé` | Forme pharmaceutique |
| `public_price_tnd` | numeric(3 dec) | `4.850` | Prix public réglementé en DT |
| `is_generic` | boolean | `false` | `true` si générique, `false` si princeps |
| `cnam_covered` | boolean | `true` | `true` si remboursable par la CNAM |

---

## 3. Structure CSV : Pharmacies (`pharmacies.csv`)

| Colonne | Type | Exemple | Description |
| :--- | :--- | :--- | :--- |
| `name` | string | `Pharmacie Centrale de Tunis` | Nom de l'officine |
| `name_ar` | string (optionnel) | `صيدلية تونس المركزية` | Nom en arabe |
| `governorate` | string | `Tunis` | L'un des 24 gouvernorats officiels |
| `delegation` | string | `Bab El Bhar` | Délégation / Municipalité |
| `address` | string | `Avenue Habib Bourguiba` | Adresse postale |
| `phone` | string | `+216 71 245 100` | Téléphone joignable |
| `latitude` | float (WGS84) | `36.8002` | Coordonnée géographique GPS |
| `longitude` | float (WGS84) | `10.1815` | Coordonnée géographique GPS |
