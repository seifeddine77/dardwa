# DarDwa (دار الدواء) — Plateforme Publique d'Accès aux Médicaments en Tunisie

[![CI/CD Pipeline](https://github.com/dardwa/dardwa/actions/workflows/ci.yml/badge.svg)](https://github.com/dardwa/dardwa/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-emerald.svg)](LICENSE)
[![TypeScript: Strict](https://img.shields.io/badge/TypeScript-Strict-blue.svg)](tsconfig.json)

**DarDwa (دار الدواء — La maison du médicament)** est une plateforme web citoyenne, gratuite et d'intérêt public conçue pour aider les Tunisiens à :
1. **Trouver des alternatives génériques économiques** réduisant immédiatement les dépenses de santé des ménages.
2. **Localiser les pharmacies de garde ouvertes** (nuit, dimanches et jours fériés) par gouvernorat avec numéros d'urgence et guidage GPS.
3. **Vérifier la prise en charge CNAM** et le tarif de convention de référence.
4. **Consulter et signaler la disponibilité en officine** via un système collaboratif avec expiration stricte après 48h.

---

## ⚠️ Contexte Réglementaire Tunisien Crucial

- **Prix Fixés par l'État** : En Tunisie, les prix des médicaments sont strictement réglementés et identiques d'une officine à l'autre. DarDwa n'est **pas** un comparateur de prix entre pharmacies. La valeur réside dans l'identification des génériques homologués ayant la même molécule (DCI), le même dosage et la même forme à un prix public inférieur.
- **Avertissement Médical Réglementaire Obligatoire** :
  > *FR* : **« Demandez conseil à votre pharmacien ou médecin avant toute substitution. »**  
  > *AR* : **« استشر الصيدلي أو الطبيب قبل أي تعويض. »**
- **Interdiction Formelle des Échanges Entre Particuliers** : La loi tunisienne et les règles de pharmacovigilance interdisent la vente ou le don de médicaments entre particuliers. DarDwa ne permet aucune annonce P2P et oriente vers les organismes officiels habilités (ex: Croissant-Rouge).

---

## 🛠️ Stack Technologique

- **Framework Web** : Next.js 15 (App Router, Server Components par défaut, Turbopack ready).
- **Langage** : TypeScript 5.7 (Mode `strict: true`, zéro `any`).
- **Styles & Design** : Tailwind CSS avec support natif RTL (Right-to-Left) pour l'arabe.
- **Internationalisation** : `next-intl` (Français par défaut `/fr` et Arabe `/ar`).
- **Base de Données & Géolocalisation** : Supabase (PostgreSQL 16 + PostGIS `ST_DWithin`, `pg_trgm`, `unaccent`, RLS).
- **Cartographie** : MapLibre GL + Tuiles OpenStreetMap (100% libre, 0€ de frais d'API).
- **Validation** : Zod.
- **Tests** : Vitest + React Testing Library (56 tests automatisés).
- **PWA** : Service Worker hors-ligne pour la consultation des gardes et du cache de recherche.
- **Conformité Données** : Loi organique tunisienne n° 2004-63 (hachage d'IP cryptographique salé, géolocalisation en mémoire locale jamais enregistrée).

---

## 🚀 Installation & Démarrage Rapide (< 5 minutes)

### Prérequis
- Node.js >= 20
- npm ou pnpm

### 1. Cloner et Installer
```bash
git clone https://github.com/dardwa/dardwa.git
cd dardwa
npm install
```

### 2. Configuration Environnement
```bash
cp .env.example .env.local
```
*(Le projet fonctionne immédiatement en développement local grâce au jeu de données tunisien intégré).*

### 3. Lancer le Serveur de Développement
```bash
npm run dev
```
Ouvrez [http://localhost:3000](http://localhost:3000) dans votre navigateur.

---

## 🧪 Suite de Tests & Qualité de Code

Le projet applique une couverture de tests stricte exécutée sur la chaîne GitHub Actions CI :

```bash
# Lancer les 56 tests unitaires et d'intégration (Vitest)
npm test

# Contrôle strict du typage TypeScript
npm run typecheck

# Analyse statique ESLint
npm run lint

# Compiler la version de production Next.js
npm run build
```

---

## 📁 Architecture des Dossiers

```
dardwa/
├── docs/                      # Enregistrements de décisions d'architecture (ADR)
├── public/                    # Manifest PWA, Service Worker, Robots.txt
├── src/
│   ├── app/
│   │   ├── [locale]/          # Pages bilingues App Router (fr/ar)
│   │   │   ├── medicines/     # Catalogue et fiches de médicaments
│   │   │   ├── pharmacies/    # Annuaire et pharmacies de garde
│   │   │   ├── report/        # Signalements citoyens
│   │   │   ├── admin/         # Back-office d'import CSV et modération
│   │   │   └── solidarity/    # Organismes de collecte légale
│   │   └── api/               # API de recherche et signalements
│   ├── components/            # Composants UI accessibles & bilingues
│   ├── features/              # Logique métier découplée par domaine
│   ├── lib/                   # Supabase, Rate Limiting, Module IA
│   └── i18n/                  # Dictionnaires de traduction FR / AR
├── supabase/
│   ├── migrations/            # Schéma relationnel, index PostGIS et RLS
│   └── seed_csv/              # Fichiers CSV modèles pour imports PCT
└── tests/                     # Tests automatisés Vitest & RTL
```

---

## 📜 Licence
Projet open source d'intérêt public distribué sous licence MIT.
