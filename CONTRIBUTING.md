# Guide de Contribution à DarDwa (دار الدواء)

Merci pour votre intérêt à contribuer à cette plateforme d'intérêt public au service de la santé des citoyens en Tunisie.

## 1. Principes Fondamentaux
1. **Éthique & Neutralité** : Aucun parti pris commercial ni publicité sur les médicaments.
2. **Accessibilité & Performance** : Tout développement doit respecter les cibles d'accessibilité (WCAG 2.1 AA) et de performance (Lighthouse >= 90 sur réseau mobile 3G).
3. **Bilinguisme Strict** : Toute nouvelle fonctionnalité doit être traduite en français et en arabe avec support RTL natif.
4. **Zéro Régression de Sécurité** : Les contrôles de schéma Zod, les en-têtes CSP et le respect de la loi 2004-63 sur la vie privée sont non négociables.

---

## 2. Processus de Développement
1. Créez une branche thématique : `git checkout -b feature/nom-de-fonctionnalite` ou `fix/nom-du-bug`.
2. Écrivez les tests unitaires correspondants dans `tests/unit/`.
3. Vérifiez la conformité locale avant commit :
   ```bash
   npm test
   npm run typecheck
   npm run lint
   npm run build
   ```
4. Soumettez une Pull Request avec une description claire des changements et captures d'écran (vue LTR et RTL).
