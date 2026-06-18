# ESGI  
## École Supérieure de Génie Informatique

# Projet client : Comutitre  
## Sous couvert de Île-de-France Mobilités

# Cahier des Charges & Attendus Techniques

**Hackathon de fin d'études — Master 2 (5ème année) — Filière Web**

Ce document définit précisément le cadre méthodologique, technique et architectural attendu de la part des étudiants de 5ème année lors du hackathon de fin d'études.

Les équipes doivent livrer une application web et/ou mobile moderne, hautement scalable, sécurisée et supervisée, répondant directement aux problématiques de transport et de gestion de données de notre client.

---

# 1. Attendus Techniques & Exemples de Mise en Œuvre

## 1.1. Design & Conception UI/UX

L'expérience utilisateur doit être pensée de manière globale, de la phase de recherche à la formalisation d'interfaces soignées, accessibles et fluides, respectant les contraintes métier du domaine des transports.

### Exemples de livrables et outils attendus

- Conception de maquettes fonctionnelles (*Wireframes*) et haute fidélité complètes sur **Figma** ou **Penpot**.
- Production d'un prototype interactif navigable (*User Flow*) simulant le parcours principal de l'usager.
- Prise en compte rigoureuse de l'accessibilité numérique :
  - normes de contraste ;
  - lisibilité des polices.

---

## 1.2. Gestion de Projet Agile

Le rythme intensif du hackathon impose une organisation collective sans faille. L'équipe doit faire preuve de transparence et de réactivité à l'aide de rituels agiles adaptés.

### Exemples de livrables et outils attendus

- Mise en place d'un tableau de suivi Kanban opérationnel :
  - **GitHub Projects** ;
  - **GitLab Issue Board**.
- Traduction des besoins du client en **User Stories** claires, estimées et réparties.
- Intégration de critères d'acceptation précis pour chaque fonctionnalité majeure.

---

## 1.3. Développement Front-End

L'interface finale délivrée doit être dynamique, performante, adaptative et codée selon les standards modernes du développement web ou mobile.

### Exemples de livrables et outils attendus

- Utilisation de technologies modernes typées ou structurées :
  - **React** ;
  - **Vue.js** ;
  - **Angular** ;
  - solutions cross-platform comme **React Native** ou **Flutter**.
- Intégration d'interfaces entièrement **Responsive**, adaptées aux formats mobiles et desktops.
- Consommation propre et sécurisée des APIs développées.

---

## 1.4. Développement Back-End

Le système doit s'appuyer sur un serveur robuste, capable de traiter les requêtes efficacement et de manipuler de larges volumes de données relatives aux transports.

### Exemples de livrables et outils attendus

- Conception d'une API **REST** ou **GraphQL** performante :
  - Node.js / TypeScript ;
  - Go ;
  - Python ;
  - etc.
- Modélisation rigoureuse et persistance des données au sein d'une base :
  - relationnelle : **PostgreSQL**, **MySQL** ;
  - NoSQL : **MongoDB**.
- Fourniture d'une documentation dynamique et interactive des routes :
  - **Swagger** ;
  - **OpenAPI**.

---

## 1.5. Gestion du Backoffice & Administration

L'application doit impérativement proposer une interface d'administration métier dédiée permettant à Comutitre et Île-de-France Mobilités de manager, modérer et piloter les données collectées.

### Exemples de livrables et outils attendus

- Mise en production d'un panneau d'administration clé en main ou sur mesure avec :
  - **Strapi** ;
  - **Directus** ;
  - **Filament**.
- Implémentation d'un contrôle d'accès basé sur les rôles :
  - **RBAC** — *Role-Based Access Control*.
- Restriction des actions selon les privilèges du personnel d'administration.

---

## 1.6. Scalabilité & Conteneurisation

Pour faire face à des pics d'audience simulés sur le réseau de transports, l'infrastructure applicative doit être modulaire, isolée et facilement réplicable.

### Exemples de livrables et outils attendus

- Conteneurisation systématique de l'ensemble de l'écosystème à l'aide de **Docker** :
  - Dockerfiles optimisés ;
  - multi-stage builds.
- Orchestration locale standardisée.
- **Facultatif / Bonus** : configuration ou ébauche d'un cluster d'orchestration via **Docker Swarm** pour assurer la haute disponibilité et la tolérance aux pannes.

---

## 1.7. Automatisation & CI/CD

La qualité logicielle doit être validée de manière automatisée à chaque étape du cycle de développement pour garantir la stabilité de la plateforme.

### Exemples de livrables et outils attendus

- Création et exécution de pipelines d'intégration continue via :
  - **GitHub Actions** / **GitHub CI** ;
  - **GitLab CI**.
- Automatisation du lancement :
  - des tests unitaires ;
  - des tests d'intégration.
- Vérification stricte des standards de code à l'aide de linters et de formateurs :
  - **ESLint** ;
  - **Prettier**.

---

## 1.8. Déploiement & Infrastructure

L'application doit quitter l'environnement de développement local pour être accessible publiquement sur le web via des processus de livraison modernes.

### Exemples de livrables et outils attendus

- Déploiement effectif de la solution sur un **VPS** (*Virtual Private Server*).
- Configuration d'un **Reverse Proxy** performant :
  - **Traefik** ;
  - **Nginx** ;
  - **Caddy**.
- Sécurisation obligatoire de l'ensemble des flux en **HTTPS** via l'automatisation des certificats SSL :
  - **Let's Encrypt**.
- Utilisation de **Docker Context** pour piloter les déploiements distants directement en ligne de commande.

---

## 1.9. Architecture Logicielle

Les étudiants doivent attester de leur niveau d'ingénierie en appliquant des patrons de conception logicielle éprouvés, facilitant la maintenabilité et l'évolution future du code.

### Exemples de livrables et outils attendus

- Organisation du code source selon le modèle **MVC** (*Model-View-Controller*) pour les modules simples.
- Application des principes de la **Clean Architecture** / **Architecture Hexagonale** afin d'isoler la logique métier des frameworks techniques et des bases de données.
- Respect global des principes **SOLID**.

---

## 1.10. Sécurité applicative et système

La protection des données et des infrastructures est un prérequis non négociable. Aucun secret ou identifiant ne doit transiter de manière non chiffrée ou être partagé publiquement.

### Exemples de livrables et outils attendus

- Gestion hermétique des configurations via des fichiers d'environnement `.env` exclus des dépôts Git.
- Utilisation avancée des mécanismes de gestion des secrets :
  - **Docker Secrets** ;
  - variables d'environnement masquées et injectées par la CI/CD.
- Isolation réseau au sein du **Docker Compose** :
  - les bases de données doivent être placées sur des réseaux internes étanches ;
  - les bases de données ne doivent pas être exposées sur les ports publics.

---

## 1.11. Analytics, Observabilité & Feedback

Une fois l'application en ligne, l'équipe doit être capable d'analyser son utilisation réelle et de détecter immédiatement le moindre dysfonctionnement technique.

### Exemples de livrables et outils attendus

- Intégration d'un outil de suivi d'audience et d'usage respectueux de la vie privée et conforme RGPD :
  - **Umami**.
- Centralisation et remontée des erreurs logicielles en temps réel à l'aide d'une plateforme d'observabilité :
  - **GlitchTip** ;
  - **Sentry**.

---

# 2. Grille d'Évaluation & Barème de Soutenance

**Note sur 20**

L'évaluation des équipes repose sur un équilibre rigoureux entre la pertinence de la réponse au besoin métier du client, l'excellence technique de l'implémentation, et la posture professionnelle lors de la restitution orale.

## 1. Réponse Métier & Approche Produit — 10 / 20

| Critères d'évaluation | Description & attendus principaux | Barème |
|---|---|---:|
| Adéquation besoin client & Valeur | Compréhension fine des enjeux de Comutitre / IDF Mobilités. Alignement des fonctionnalités développées avec les cas d'usage réels des usagers des réseaux de transport. | 3.0 pts |
| UI/UX & Design | Qualité et fidélité des maquettes et prototypes interactifs, Figma / Penpot. Ergonomie générale, fluidité du parcours utilisateur et respect des normes d'accessibilité. | 3.0 pts |
| Gestion du Backoffice & Administration | Livraison d'un espace d'administration fonctionnel, Strapi, Directus, etc. Pertinence des outils de pilotage de données mis à disposition du client et gestion des rôles, RBAC. | 2.0 pts |
| Gestion de projet & Agilité | Organisation de l'équipe matérialisée par un tableau Kanban rigoureux. Découpage fonctionnel pertinent en User Stories et maîtrise du périmètre livré. | 2.0 pts |

---

## 2. Réponse Technique, Architecture & DevOps — 7 / 20

| Critères d'évaluation | Description & attendus principaux | Barème |
|---|---|---:|
| Architecture Logicielle & Code | Qualité, propreté et maintenabilité du code source, ex : TypeScript. Structuration claire respectant les patrons de conception, MVC, Clean Architecture. | 2.0 pts |
| Déploiement & Infrastructure | Application accessible en ligne via une URL dédiée sur un VPS. Configuration fonctionnelle d'un Reverse Proxy, Nginx ou Traefik, sécurisé en HTTPS, Let's Encrypt. Déploiement via Docker Context. | 2.0 pts |
| Conteneurisation & Sécurité | Isolation stricte des services sous Docker Compose : réseaux étanches, BDD non exposée publiquement. Gestion sécurisée des fichiers d'environnement `.env` et des secrets. **Bonus : ébauche ou mise en œuvre de Docker Swarm (+0.5 pt).** | 2.0 pts |
| Automatisation & Analytics | Pipeline d'intégration continue, GitHub CI / GitLab CI, opérationnel avec linters ou tests. Intégration d'outils d'observabilité et de tracking, Umami, GlitchTip. | 1.0 pt |

---

## 3. Soutenance & Posture Professionnelle — 3 / 20

| Critères d'évaluation | Description & attendus principaux | Barème |
|---|---|---:|
| Clarté du discours & Temps | Structure de la présentation, aisance oratoire et gestion rigoureuse du temps imparti. Capacité à adapter son discours face à un jury mixte, profils techniques et métiers. | 1.0 pt |
| Démonstration en direct (*Live Demo*) | Déroulement d'un scénario de démonstration fluide, logique et préparé. Maîtrise de « l'effet démo » et capacité à réagir sereinement face aux imprévus techniques. | 1.0 pt |
| Dynamique d'équipe & Questions | Répartition équitable du temps de parole entre tous les membres du groupe. Pertinence, précision et professionnalisme lors de la phase de questions/réponses. | 1.0 pt |

---

# Note Finale Globale

| Élément | Note |
|---|---:|
| Note finale globale | 20 / 20 |

---

**ESGI Paris — 2026**