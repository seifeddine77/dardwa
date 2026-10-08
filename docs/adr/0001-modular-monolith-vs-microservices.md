# ADR 0001: Architecture Monolithe Modulaire vs Microservices

## Statut
Accepté

## Contexte
Le projet **DarDwa** (دار الدواء) est une plateforme publique, gratuite et solidaire visant à informer les citoyens tunisiens sur :
1. La disponibilité des médicaments et leurs génériques moins chers.
2. La géolocalisation des pharmacies et des pharmacies de garde.
3. Les informations de remboursement CNAM.
4. Les signalements communautaires de disponibilité.

La plateforme cible un hébergement sur le **Vercel Free Tier** couplé à une base de données managée **Supabase (PostgreSQL + PostGIS)**, avec des exigences strictes de performance mobile (Lighthouse >= 90) sur des connexions 3G/4G en Tunisie.

## Décision
Nous choisissons formellement une architecture **Monolithe Modulaire (Modular Monolith)** basée sur **Next.js (App Router)** et rejetons l'architecture en microservices pour les raisons suivantes :

### 1. Éviter le piège de l'Overengineering (Complexité Opérationnelle)
Les microservices nécessitent :
- Un maillage réseau complexe (Service Mesh, API Gateways multiples).
- La gestion des pannes partielles, retries et circuit breakers réseau.
- Des transactions distribuées (patterns Saga / Outbox) pour garantir la cohérence des données.
- Des coûts d'infrastructure démultipliés (conteneurs multiples, observabilité distribuée type Jaeger/Prometheus).
Pour une application d'intérêt public à l'échelle tunisienne, cela représente une dette technique et un coût opérationnel injustifiés.

### 2. Performance et Latence Mobile (Tunisie 3G/4G)
En microservices, une simple requête de recherche pourrait nécessiter des appels réseau inter-services (Catalog Service -> Equivalence Service -> Pharmacy Service). 
Dans un monolithe modulaire Next.js + PostgreSQL, une seule requête SQL hautement optimisée (avec PostGIS + pg_trgm) résout la recherche en < 15ms sans aucun saut réseau supplémentaire.

### 3. Structure Modulaire Orientée Domaine
Le code n'est pas un bloc désordonné, mais un monolithe modulaire strict structuré par domaine fonctionnel :
- `src/features/medicines` : Catalogue, calcul d'équivalence, dosages.
- `src/features/pharmacies` : Géolocalisation PostGIS, calcul de distances.
- `src/features/duty` : Calendrier des gardes de nuit et jours fériés.
- `src/features/reports` : Signalements communautaires, limitation de débit, antispam.
- `src/lib/ai` : Couche IA agnostique découplée (Phase 2).

### 4. Évolutivité Future
Si un domaine particulier (ex: le pipeline d'importation CSV ou un worker de scraping des gardes) nécessite un scaling indépendant à l'avenir, son isolation modulaire permet de l'extraire en microservice/worker indépendant en quelques heures, sans refactorisation du reste du code.
