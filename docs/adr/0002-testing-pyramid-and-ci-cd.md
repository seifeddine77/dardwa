# ADR 0002: Stratégie de Tests et Pipeline CI/CD

## Statut
Accepté

## Contexte
DarDwa traite de données de santé publiques et d'informations financières réglementées (tarifs en dinars tunisiens). Les bugs de calcul d'équivalences de médicaments ou de géocodage de pharmacies de garde ont un impact direct sur les citoyens. La couverture de tests doit être rigoureuse, rapide et automatisée.

## Décision
Nous implémentons une **Pyramide des Tests** à trois niveaux, intégrée dans un pipeline **GitHub Actions CI/CD** exécuté à chaque commit et pull request :

### 1. Niveau 1 : Tests Unitaires Métier (Vitest)
- **Cible** : Fonctions pures, calculs mathématiques et algorithmes.
- **Exemples** :
  - Détection de l'équivalence stricte : même ensemble de DCI, même dosage normalisé, même catégorie de forme.
  - Calcul du différentiel de prix et pourcentage d'économie en DT.
  - Normalisation des chaînes arabes et françaises (suppression des diacritiques, unaccent).
  - Algorithme de hachage d'IP avec sel rotatif (conformité loi tunisienne 2004-63).
  - Validation des entrées avec schémas Zod.
- **Performance** : Exécution totale < 1 seconde.

### 2. Niveau 2 : Tests d'Intégration Composants (Vitest + React Testing Library)
- **Cible** : Interaction utilisateur, accessibilité et bilinguisme.
- **Exemples** :
  - Affichage obligatoire de l'avertissement médical réglementaire sur chaque fiche médicament.
  - Bascule de langue (Français <-> Arabe) avec mise à jour automatique de la direction RTL (`dir="rtl"`).
  - Comportement des champs pièges (honeypot) sur les formulaires de signalement.

### 3. Niveau 3 : Tests End-to-End (Playwright)
- **Cible** : Parcours utilisateurs critiques en conditions réelles de production.
- **Exemples** :
  - Parcours Recherche -> Sélection d'un princeps -> Affichage de l'alternative générique moins chère.
  - Consultation de la liste des pharmacies de garde par gouvernorat.
  - Soumission d'un signalement de disponibilité.

### 4. Automatisation CI/CD (GitHub Actions)
La chaîne bloque tout déploiement si :
1. Le linter ESLint échoue.
2. Le compilateur TypeScript détecte une erreur de type (`strict: true`).
3. Un seul test unitaire ou d'intégration échoue.
4. La compilation Next.js de production échoue.
