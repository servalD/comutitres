# Périmètre fonctionnel du hackathon Comutitres — version référencée

> Rôle éditorial : ce document définit le **périmètre fonctionnel du hackathon**. Il ne redéfinit pas en détail les notions métier, les règles CGVU, le cycle de vie des titres ou les contenus FAQ. Ces éléments sont centralisés dans les documents de référence listés ci-dessous.

---

## 0. Références documentaires

Ce document s’appuie sur les fichiers suivants, à consulter pour le détail des règles et définitions :

| Fichier | Rôle |
|---|---|
| `notions_metier_structurantes_comutitres.md` | Référentiel des notions métier : porteur, payeur, responsable légal, contrat, support, titre, droit, justificatif, incomplétude, SAV, paiement, recouvrement, API, CGVU, RGPD et IA Act. |
| `cycle_vie_titres_transport.md` | Cycle de vie du porteur et des titres : Junior, Scolaire, Étudiant, Navigo Annuel, Navigo Senior, TST, Améthyste, support physique et événements SAV transverses. |
| `analyse_cgvu_idfm_regles_metier.md` | Règles métier issues des CGVU / CGU : souscription, paiement, impayés, fraude, justificatifs, SAV, supports physiques et mobiles, RGPD, IA Act et impacts back-office. |
| `faq_idfm_questions_reponses.md` | Base FAQ / aide utilisateur : formulation des questions, cas d’usage fréquents, réponses pédagogiques et contenus d’assistance. |

Les répétitions doivent être limitées à ce qui est nécessaire pour comprendre le périmètre du hackathon. Les définitions, règles détaillées et formulations FAQ doivent rester dans les fichiers dédiés.

---

## 1. Objectif général

Le hackathon s’inscrit dans le cadre d’une **refonte globale de la plateforme de souscription Comutitres**, filiale d’Île-de-France Mobilités.

L’objectif n’est pas uniquement de moderniser une interface existante, mais de proposer une solution capable de repenser l’expérience de souscription, de renouvellement, de gestion des droits et de service après-vente autour des titres de transport.

La solution attendue doit couvrir à la fois :

- le parcours client ;
- l’orientation vers le bon forfait ;
- les règles métier nécessaires au parcours ;
- la collecte des justificatifs ;
- la gestion des droits et réductions ;
- le paiement ;
- les cas de service après-vente ;
- le pilotage back-office ;
- la conformité RGPD et IA Act ;
- la limitation de la fraude.

Pour les notions métier détaillées, se référer à `notions_metier_structurantes_comutitres.md`.

---

## 2. Produits concernés

Le périmètre produit couvre les principaux titres et contrats gérés par Comutitres.

### 2.1 Titres et abonnements principaux

- Navigo Annuel ;
- Navigo Annuel Senior ;
- Imagine R ;
- Navigo Liberté+ ;
- TST — Tarification Solidarité Transport ;
- Améthyste.

Les règles détaillées par produit sont documentées dans `analyse_cgvu_idfm_regles_metier.md`.

### 2.2 Produits et supports à considérer en extension

Même si le périmètre principal est centré sur les abonnements, la solution doit rester compatible avec une vision plus large de l’écosystème billettique :

- passe Navigo physique ;
- passe Navigo Imagine R ;
- support téléphone ;
- support montre connectée ;
- titres dématérialisés ;
- parcours de rechargement ;
- parcours de remplacement ou de renouvellement du support.

Les distinctions entre **support**, **titre** et **contrat** sont centralisées dans `notions_metier_structurantes_comutitres.md`. Les règles de compatibilité et de cohabitation des titres sont détaillées dans `analyse_cgvu_idfm_regles_metier.md`.

---

## 3. Ambition produit

La solution doit proposer un **parcours client unifié et intelligent**.

L’utilisateur ne devrait pas avoir à connaître à l’avance le nom exact du forfait qu’il doit choisir. Le service doit être capable de l’orienter selon son profil, son âge, sa situation, ses droits, ses usages et ses contraintes.

### Objectifs produit clés

- Aider l’utilisateur à choisir le forfait le plus adapté.
- Réduire la complexité de la souscription.
- Fluidifier le renouvellement.
- Gérer les cas particuliers dès le départ.
- Limiter les erreurs de saisie.
- Réduire les dossiers incomplets.
- Réduire les sollicitations au support.
- Faciliter le traitement back-office.
- Sécuriser les souscriptions.
- Limiter la fraude.

Les contenus d’aide et formulations pédagogiques peuvent être alimentés par `faq_idfm_questions_reponses.md`.

---

## 4. Parcours fonctionnels à couvrir

### 4.1 Orientation vers le forfait le plus adapté

Le parcours doit permettre à un utilisateur d’être guidé vers une offre adaptée à sa situation.

### Données utiles possibles

- âge ;
- statut scolaire ou étudiant ;
- statut senior ;
- situation sociale ;
- lieu de résidence ;
- usage fréquent ou occasionnel ;
- besoin d’un abonnement ou d’un paiement à l’usage ;
- support souhaité ;
- existence d’un droit social ou d’une réduction ;
- existence d’un payeur distinct.

### Résultat attendu

Le système doit recommander un ou plusieurs forfaits, expliquer pourquoi ils sont adaptés et permettre à l’utilisateur de poursuivre directement vers la souscription.

Les règles d’éligibilité et les notions de droit sont à maintenir dans `notions_metier_structurantes_comutitres.md` et `analyse_cgvu_idfm_regles_metier.md`.

---

### 4.2 Tunnel de souscription optimisé

Le tunnel de souscription doit permettre de créer ou renouveler un contrat sans friction inutile.

### Fonctionnalités attendues

- création ou rattachement à un compte Île-de-France Mobilités Connect ;
- identification du porteur ;
- identification du payeur ;
- gestion du responsable légal si nécessaire ;
- choix du produit ;
- collecte des informations nécessaires ;
- collecte des justificatifs ;
- acceptation des documents contractuels ;
- choix du moyen de paiement ;
- validation finale ;
- suivi de l’état du dossier.

### Objectif UX

Le tunnel doit être :

- progressif ;
- compréhensible ;
- mobile-first ;
- accessible ;
- explicite sur les documents attendus ;
- transparent sur les délais de traitement ;
- capable de gérer l’incomplétude.

Les définitions de porteur, payeur, responsable légal, contrat et incomplétude sont dans `notions_metier_structurantes_comutitres.md`.

---

### 4.3 Collecte des données et documents RGPD

Le périmètre inclut la collecte de données personnelles et de documents justificatifs.

Le principe à retenir dans ce document : **chaque donnée collectée doit être justifiée par une finalité claire**.

Les listes détaillées de données possibles, les finalités, les contraintes RGPD et les points de vigilance sur les mineurs et justificatifs sensibles sont à maintenir dans :

- `notions_metier_structurantes_comutitres.md` ;
- `analyse_cgvu_idfm_regles_metier.md`.

---

### 4.4 Gestion des justificatifs

Certains produits ou tarifs nécessitent des justificatifs : Imagine R, bourse, TST, Améthyste, mineurs, payeur distinct, changement de situation ou renouvellement de droits.

Le périmètre doit prévoir :

- le dépôt de justificatifs ;
- une validation potentiellement asynchrone ;
- des statuts compréhensibles ;
- la relance en cas d’incomplétude ;
- un traitement back-office.

Les typologies de justificatifs, états détaillés, règles de validation et impacts back-office sont documentés dans `notions_metier_structurantes_comutitres.md` et `analyse_cgvu_idfm_regles_metier.md`.

---

### 4.5 Gestion des réductions et de la TST

La solution doit intégrer un système de gestion des réductions, en particulier la **Tarification Solidarité Transport**.

Le périmètre doit prévoir :

- la vérification de l’éligibilité ;
- la collecte ou vérification des justificatifs nécessaires ;
- le renouvellement périodique ;
- la gestion de droits temporaires ;
- la notification avant expiration ;
- la bascule vers le bon tarif selon la situation ;
- la prévention des ruptures de droit à circuler.

Les règles détaillées de TST, de renouvellement, de fin de droit et de retour au plein tarif sont dans `cycle_vie_titres_transport.md` et `analyse_cgvu_idfm_regles_metier.md`.

---

### 4.6 Parcours SAV

Le périmètre inclut explicitement l’intégration des parcours de service après-vente.

### Cas SAV à couvrir

- perte de passe ;
- vol de passe ;
- passe endommagé ;
- passe qui ne fonctionne plus ;
- support expiré ;
- changement de support ;
- problème de chargement ;
- problème de paiement ;
- impayé ;
- changement de payeur ;
- suspension ;
- reprise d’un contrat ;
- résiliation ;
- dossier incomplet ;
- justificatif refusé ;
- photo refusée ;
- question sur le renouvellement.

Le SAV ne doit pas être traité comme un parcours séparé, mais comme une partie intégrée de la vie du contrat et du support.

Les événements de vie transverses sont détaillés dans `cycle_vie_titres_transport.md`. Les règles SAV issues des CGVU sont consolidées dans `analyse_cgvu_idfm_regles_metier.md`. Les formulations d’aide utilisateur peuvent être reprises depuis `faq_idfm_questions_reponses.md`.

---

### 4.7 Paiement

Le périmètre demande une amélioration de l’expérience de paiement.

### Cas à prévoir

- paiement direct ;
- prélèvement ;
- paiement au comptant ;
- mensualisation ;
- changement de moyen de paiement ;
- payeur différent du porteur ;
- paiement impossible pour certains mineurs ;
- impayés ;
- régularisation ;
- suspension liée au paiement ;
- reprise après régularisation.

### Points d’attention

- Le payeur doit accepter les conditions applicables.
- Le porteur et le payeur peuvent être deux personnes différentes.
- Le paiement doit être sécurisé.
- Le parcours doit expliquer clairement les conséquences d’un impayé.
- Le back-office doit pouvoir suivre l’état de paiement.

Les règles détaillées de paiement, impayés, recouvrement, blocage et régularisation sont à maintenir dans `analyse_cgvu_idfm_regles_metier.md`.

---

### 4.8 Back-office de pilotage

Le hackathon doit proposer un **back-office pour piloter le tout**.

Ce back-office est central, car Comutitres gère des volumes importants et doit pouvoir suivre les dossiers, débloquer les clients et traiter les cas complexes.

### Fonctions attendues

- consultation des dossiers ;
- suivi des souscriptions ;
- suivi des renouvellements ;
- gestion des justificatifs ;
- validation ou refus documentaire ;
- relances ;
- suivi des paiements ;
- suivi des impayés ;
- suspension / reprise ;
- changement de payeur ;
- gestion des droits TST ;
- gestion des statuts de contrat ;
- historique des actions ;
- traçabilité juridique ;
- indicateurs de pilotage.

Les workflows et statuts back-office détaillés sont documentés dans `notions_metier_structurantes_comutitres.md`, `cycle_vie_titres_transport.md` et `analyse_cgvu_idfm_regles_metier.md`.

---

## 5. Contraintes importantes

### 5.1 Accessibilité

La solution doit être accessible à plusieurs types de publics : parents, étudiants, personnes âgées, personnes en situation de handicap, personnes étrangères ou non francophones, utilisateurs peu à l’aise avec les démarches administratives.

### Implications

- langage clair ;
- interface lisible ;
- compatibilité mobile ;
- parcours guidé ;
- iconographie utile ;
- aide contextuelle ;
- statuts compréhensibles ;
- respect des principes d’accessibilité numérique.

---

### 5.2 Inclusivité

Le parcours doit éviter les hypothèses inutiles sur les utilisateurs.

### Recommandations

- éviter les champs non nécessaires comme la civilité si elle n’est pas indispensable ;
- ne pas imposer Monsieur / Madame si ce n’est pas juridiquement requis ;
- prévoir des formulations neutres ;
- permettre la compréhension par des personnes non natives ;
- utiliser des visuels et des explications simples.

---

### 5.3 Mobile first

La solution doit être pensée prioritairement pour mobile.

### Implications

- écrans courts ;
- étapes simples ;
- scan ou upload de justificatif depuis le téléphone ;
- notifications ;
- consultation rapide du statut ;
- reprise facile d’un dossier commencé ;
- paiement mobile ;
- accessibilité tactile ;
- performance.

---

### 5.4 RGPD

La conformité RGPD est une contrainte structurante.

Dans ce document, le périmètre retient les principes suivants :

- minimisation des données ;
- finalité claire pour chaque donnée ;
- information de l’utilisateur ;
- sécurité des données ;
- gestion des durées de conservation ;
- accès aux droits utilisateurs ;
- attention particulière aux mineurs ;
- attention particulière aux justificatifs sociaux.

Les règles détaillées, les finalités et les impacts produit / back-office sont à maintenir dans `analyse_cgvu_idfm_regles_metier.md`.

---

### 5.5 IA Act

L’usage de l’IA doit être maîtrisé, explicable et proportionné.

### Usages IA possibles

- aide à l’orientation vers le bon forfait ;
- résumé de situation ;
- détection de dossier incomplet ;
- aide à la lecture de justificatif ;
- pré-qualification d’un document ;
- assistant FAQ contextuel ;
- suggestion d’action back-office ;
- priorisation des dossiers urgents.

### Garde-fous

- ne pas prendre de décision sensible sans contrôle humain ;
- expliquer l’usage de l’IA ;
- éviter les biais ;
- ne pas demander plus de données que nécessaire ;
- prévoir une alternative sans IA ;
- tracer les décisions assistées.

Les recommandations détaillées liées au RGPD et à l’IA Act sont dans `notions_metier_structurantes_comutitres.md` et `analyse_cgvu_idfm_regles_metier.md`.

---

### 5.6 Design System IDFM

La solution doit s’inspirer du design system et de l’univers graphique Île-de-France Mobilités, sans que cela bloque la créativité.

### Implications

- cohérence graphique ;
- respect des codes visuels ;
- design accessible ;
- composants réutilisables ;
- clarté du parcours ;
- compatibilité avec les supports existants.

---

### 5.7 Conditions de souscription et limitation de la fraude

Comutitres est particulièrement attentif au respect des conditions de souscription et à la limitation de la fraude.

Le périmètre doit prévoir :

- des contrôles d’identité et de cohérence ;
- la vérification des justificatifs ;
- la détection d’incohérences ;
- un workflow back-office ;
- la traçabilité des validations ;
- des règles de blocage temporaire lorsque nécessaire.

Les risques de fraude, règles de contrôle, conséquences et points juridiques sont détaillés dans `analyse_cgvu_idfm_regles_metier.md`.

---

## 6. Acteurs et objets métier

Les acteurs et objets métier ne sont pas redéfinis dans ce document afin d’éviter les doublons.

Pour les définitions détaillées, se référer à `notions_metier_structurantes_comutitres.md`.

### Acteurs à prendre en compte dans le périmètre

- porteur ;
- payeur ;
- responsable légal ;
- agent back-office ;
- système automatisé / API.

### Objets métier à prendre en compte dans le périmètre

- compte Connect ;
- contrat ;
- titre ;
- support ;
- droit ;
- justificatif ;
- paiement ;
- impayé ;
- renouvellement ;
- événement SAV.

---

## 7. Statuts back-office

Les statuts back-office doivent être pensés comme un socle transverse pour suivre les dossiers, droits, justificatifs, paiements, renouvellements et cas SAV.

Ce document ne maintient pas une liste exhaustive afin d’éviter les divergences avec les référentiels dédiés.

Les listes détaillées de statuts sont documentées dans :

- `notions_metier_structurantes_comutitres.md` ;
- `cycle_vie_titres_transport.md` ;
- `analyse_cgvu_idfm_regles_metier.md`.

Pour le hackathon, les familles de statuts à prévoir sont :

- création / brouillon ;
- identité et porteur ;
- payeur / responsable légal ;
- justificatif ;
- photo ;
- CGVU ;
- paiement ;
- impayé / régularisation ;
- contrat ;
- renouvellement ;
- droit ;
- SAV.

---

## 8. Opportunités API

Le PDF client indique que le SI Comutitres s’appuie sur des échanges de données via API, internes, partenaires ou publiques.

### API ou sources à explorer

- API Adresse ;
- API d’identité ou identité numérique ;
- API liées à la scolarité ;
- API liées aux bourses ;
- API CAF ou droits sociaux ;
- API fiscales ou revenus selon faisabilité ;
- API de paiement ;
- API de suivi documentaire ;
- API internes de contrat ;
- API internes de support ;
- API internes de recouvrement.

### Objectifs

- réduire la saisie manuelle ;
- éviter les erreurs ;
- sécuriser les données ;
- limiter les faux justificatifs ;
- automatiser certaines vérifications ;
- accélérer le traitement ;
- diminuer la charge back-office.

Les opportunités API et règles de vérification sont détaillées dans `notions_metier_structurantes_comutitres.md` et `analyse_cgvu_idfm_regles_metier.md`.

---

## 9. Opportunités IA

Le brief invite les étudiants à explorer des usages innovants de l’IA.

### Côté utilisateur

- assistant d’orientation vers le bon forfait ;
- FAQ contextuelle ;
- explication des statuts de dossier ;
- aide au dépôt de justificatif ;
- reformulation en langage simple ;
- traduction ou aide multilingue ;
- rappel proactif des échéances.

### Côté back-office

- tri des dossiers ;
- détection d’incomplétude ;
- aide à la lecture documentaire ;
- détection d’anomalies ;
- résumé de dossier ;
- suggestion de prochaine action ;
- priorisation des cas urgents.

### Limites

- l’IA ne doit pas remplacer la décision humaine dans les cas sensibles ;
- l’utilisateur doit pouvoir comprendre son rôle ;
- les traitements doivent respecter le RGPD et l’IA Act ;
- les biais doivent être anticipés ;
- une alternative humaine doit rester possible.

Les garde-fous détaillés sont maintenus dans `notions_metier_structurantes_comutitres.md` et `analyse_cgvu_idfm_regles_metier.md`.

---

## 10. Backlog MVP hackathon

### Priorité 1 — Socle indispensable

- Créer un parcours d’orientation vers le bon forfait.
- Modéliser porteur, payeur et responsable légal.
- Créer un tunnel de souscription.
- Gérer le dépôt de justificatifs.
- Afficher un statut clair du dossier.
- Prévoir un back-office de suivi.
- Gérer le paiement ou la simulation de paiement.
- Intégrer les contraintes RGPD de base.
- Prévoir un design mobile-first.

### Priorité 2 — Valeur métier forte

- Gérer les transitions de profil.
- Gérer les renouvellements.
- Gérer la TST et les droits temporaires.
- Gérer les dossiers incomplets.
- Gérer les notifications.
- Gérer le changement de payeur.
- Gérer la suspension et la reprise.
- Ajouter des contrôles anti-fraude simples.
- Ajouter des mocks API.

### Priorité 3 — Différenciation

- Assistant IA d’orientation.
- Assistant IA back-office.
- Vérification documentaire assistée.
- Tableau de bord opérationnel.
- Scoring de risque de dossier incomplet.
- Expérience multilingue.
- Parcours SAV intelligent.
- Simulation de cycle de vie du porteur.

---

## 11. Parcours MVP recommandé

Pour le hackathon, un MVP réaliste pourrait couvrir le scénario suivant :

```text
1. L’utilisateur arrive sur la plateforme.
2. Il répond à quelques questions simples.
3. Le système identifie son profil.
4. Le système recommande un forfait.
5. L’utilisateur crée ou rattache un compte.
6. Il renseigne le porteur.
7. Il renseigne le payeur si différent.
8. Il dépose les justificatifs nécessaires.
9. Il accepte les conditions.
10. Il configure le paiement.
11. Le dossier passe en validation.
12. L’utilisateur suit son statut.
13. Le back-office voit le dossier.
14. L’agent accepte, refuse ou demande un complément.
15. L’utilisateur reçoit une notification.
16. Le contrat est activé ou mis en attente.
```

---

## 12. Parcours de démonstration possible

### Démo 1 — Orientation intelligente

Un parent veut souscrire pour son enfant. Le système détecte un profil jeune, propose Imagine R ou Junior, identifie que le porteur est mineur et demande un payeur / responsable légal.

### Démo 2 — Étudiant boursier

Un étudiant souhaite souscrire Imagine R avec tarif réduit. Le système demande une attestation de bourse, passe le justificatif en validation et affiche un statut clair.

### Démo 3 — TST

Un bénéficiaire TST arrive en fin de droit. Le système l’alerte, vérifie le droit, puis propose soit le maintien du droit, soit le retour au plein tarif.

### Démo 4 — Back-office

Un agent consulte les dossiers incomplets, voit les justificatifs en attente, débloque un dossier et suit les indicateurs de charge.

Les scénarios détaillés peuvent être enrichis avec les règles issues de `cycle_vie_titres_transport.md`, `analyse_cgvu_idfm_regles_metier.md` et les formulations FAQ de `faq_idfm_questions_reponses.md`.

---

## 13. Indicateurs de pilotage

Le back-office pourrait intégrer des indicateurs simples :

- nombre de souscriptions en cours ;
- nombre de dossiers incomplets ;
- nombre de justificatifs à vérifier ;
- délai moyen de traitement ;
- nombre de refus de justificatifs ;
- nombre d’impayés ;
- nombre de dossiers bloqués ;
- nombre de renouvellements à venir ;
- nombre de droits TST expirant bientôt ;
- volume de sollicitations SAV ;
- taux d’automatisation ;
- taux de conversion du tunnel.

---

## 14. Risques à anticiper

### 14.1 Risques UX

- parcours trop long ;
- vocabulaire administratif ;
- incompréhension entre porteur et payeur ;
- difficulté à déposer un justificatif ;
- statut de dossier flou ;
- rupture de droit à circuler.

### 14.2 Risques métier

- mauvaise orientation produit ;
- règles différentes selon produit ;
- confusion entre support, titre et contrat ;
- mauvaise gestion des renouvellements ;
- oubli du payeur ou du responsable légal.

### 14.3 Risques juridiques / RGPD

- collecte excessive ;
- mauvaise information utilisateur ;
- absence de base légale claire ;
- conservation excessive des justificatifs ;
- traitement IA non expliqué.

### 14.4 Risques fraude

- faux justificatif ;
- fausse identité ;
- fausse éligibilité ;
- moyen de paiement frauduleux ;
- usage d’un droit non valide ;
- prêt ou partage abusif du pass.

Les risques détaillés et les règles associées sont à consolider dans `analyse_cgvu_idfm_regles_metier.md`.

---

## 15. Synthèse

Le périmètre du hackathon Comutitres doit aboutir à une solution qui dépasse une simple interface de souscription.

La solution attendue doit proposer un **système complet de gestion de parcours**, capable de gérer :

- les profils utilisateurs ;
- les produits ;
- les droits ;
- les justificatifs ;
- les paiements ;
- les renouvellements ;
- les événements SAV ;
- le back-office ;
- les contrôles anti-fraude ;
- la conformité RGPD et IA Act.

La priorité est de concevoir un parcours **unifié, intelligent, accessible, mobile-first et pilotable**, en gardant toujours en tête les contraintes opérationnelles de Comutitres et la complexité du cycle de vie des titres de transport.

Les documents de référence doivent rester les sources de vérité pour les définitions, règles détaillées, formulations utilisateur et impacts juridiques / métier.
