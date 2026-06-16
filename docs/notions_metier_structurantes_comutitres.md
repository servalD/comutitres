# Les notions métier structurantes — Comutitres / IDFM

> Rôle éditorial : ce fichier est le **référentiel de définitions**. Les autres documents doivent éviter de redéfinir longuement ces notions et plutôt y renvoyer.

---

## 1. Objectif du document

Ce document formalise les notions métier structurantes à intégrer dans la refonte de la plateforme de souscription Comutitres.

Il sert de base pour concevoir :

- le modèle de données ;
- les parcours utilisateurs ;
- les règles de souscription ;
- les règles de renouvellement ;
- les parcours de SAV ;
- le back-office ;
- les contrôles documentaires ;
- les règles de paiement et de recouvrement ;
- les opportunités API et IA.

---

## 2. Porteur

## Définition

Le **porteur** est la personne qui utilise le titre ou le support sur le réseau de transport.

Il peut être :

- un enfant ;
- un scolaire ;
- un étudiant ;
- un adulte ;
- un senior ;
- un bénéficiaire de droits sociaux ;
- une personne en situation de handicap ;
- un usager occasionnel ou régulier.

Le porteur peut être différent du payeur.

## Exemples

- Un enfant mineur utilise un forfait imagine R : il est le **porteur**.
- Un demandeur d’emploi bénéficie de la Tarification Solidarité Transport : il est le **porteur**.
- Un salarié utilise un forfait Navigo Annuel pour ses déplacements : il est le **porteur**.

## Impacts produit

Le parcours doit permettre de :

- créer une fiche porteur ;
- enregistrer son identité ;
- associer un ou plusieurs contrats ;
- associer un ou plusieurs supports ;
- suivre son âge et son profil ;
- gérer ses transitions de statut ;
- gérer ses droits et réductions ;
- distinguer clairement le porteur du payeur.

## Données possibles associées au porteur

- Nom ;
- prénom ;
- date de naissance ;
- pièce d’identité ;
- photo ;
- adresse ;
- statut scolaire ou étudiant ;
- droits sociaux ;
- profil tarifaire ;
- compte Connect ;
- historique des contrats ;
- historique des supports.

## Points d’attention RGPD

Toutes les données demandées au porteur doivent être justifiées par une finalité claire :

- attribution du titre ;
- vérification de l’éligibilité ;
- contrôle anti-fraude ;
- facturation ;
- SAV ;
- obligation réglementaire.

Les données non nécessaires doivent être évitées.

---

## 3. Payeur

## Définition

Le **payeur** est la personne ou l’organisation qui paie lors de la souscription.

Il peut être :

- le porteur lui-même ;
- un parent ;
- un responsable légal ;
- une association ;
- un employeur ;
- un tiers financeur ;
- une collectivité ou un organisme selon les cas.

## Exemples

- Un parent paie le forfait imagine R de son enfant mineur.
- Une association paie l’abonnement TST d’un demandeur d’emploi.
- Un employé souscrit à Navigo Annuel pour ses propres déplacements : il est à la fois porteur et payeur.

## Impacts produit

Le système doit gérer :

- un payeur différent du porteur ;
- le changement de payeur ;
- la validation des CGVU par le payeur ;
- le moyen de paiement ;
- les mandats ou autorisations de prélèvement ;
- les impayés ;
- la chaîne de recouvrement ;
- la traçabilité juridique de l’acceptation.

## Données possibles associées au payeur

- Identité ;
- coordonnées ;
- adresse e-mail ;
- téléphone ;
- moyen de paiement ;
- mandat de prélèvement ;
- acceptation des CGVU ;
- historique de paiement ;
- statut de recouvrement.

## Règle structurante

Un contrat ne doit pas seulement identifier un utilisateur : il doit identifier séparément :

```text
Contrat
├── Porteur
├── Payeur
├── Responsable légal, si nécessaire
├── Produit souscrit
├── Moyen de paiement
├── CGVU acceptées
└── Statut de paiement
```

---

## 4. Responsable légal

## Définition

Le **responsable légal** intervient lorsque le porteur est mineur ou juridiquement représenté.

Il peut aussi être le payeur, mais ce n’est pas obligatoire.

## Cas d’usage

- Souscription d’un forfait imagine R Junior.
- Souscription d’un forfait imagine R Scolaire pour un mineur.
- Validation d’informations personnelles d’un enfant.
- Acceptation de documents contractuels.
- Autorisation de paiement par un tiers.

## Impacts produit

Le parcours doit gérer :

- l’identité du responsable légal ;
- son lien avec le porteur ;
- sa validation ou signature ;
- la distinction entre responsable légal et payeur ;
- le cas où le responsable légal n’est pas le payeur.

## Points d’attention

Pour les mineurs, le parcours doit être particulièrement clair sur :

- qui utilise le titre ;
- qui paie ;
- qui accepte les conditions ;
- qui reçoit les notifications ;
- qui peut modifier le contrat ;
- qui peut résilier ou suspendre.

---

## 5. Compte Connect

## Définition

Le compte Connect est le compte utilisateur permettant d’accéder aux services numériques liés à l’univers IDFM / Comutitres.

Dans la logique du cycle de vie, il peut être proposé au porteur afin de le suivre tout au long de sa vie de transport.

## Rôle métier

Le compte Connect sert à :

- identifier l’usager ;
- centraliser ses contrats ;
- suivre ses titres ;
- gérer ses informations personnelles ;
- accéder au SAV ;
- gérer les renouvellements ;
- recevoir des notifications ;
- rattacher les droits ou supports.

## Impacts produit

Le compte Connect doit être pensé comme un socle transverse :

```text
Compte Connect
├── Identité utilisateur
├── Porteurs rattachés
├── Contrats
├── Supports
├── Justificatifs
├── Notifications
└── Historique SAV
```

## Enjeu principal

Le compte Connect ne doit pas être seulement un compte de connexion. Il doit devenir le point d’entrée d’une relation long terme entre l’usager et Comutitres.

---

## 6. Contrat

## Définition

Le **contrat** représente la souscription à une offre de transport.

Il relie :

- un porteur ;
- un payeur ;
- un produit ;
- un tarif ;
- un support ;
- des CGVU ;
- un moyen de paiement ;
- un statut.

## Produits concernés

Le périmètre du hackathon couvre notamment :

- Navigo Annuel ;
- Navigo Annuel Senior ;
- imagine R ;
- Liberté+ ;
- TST — Tarification Solidarité Transport ;
- Améthyste.

## Statuts possibles

```text
brouillon
à compléter
en attente de justificatif
en attente de validation documentaire
en attente de paiement
en attente de signature payeur
actif
suspendu
résilié
expiré
bloqué pour impayé
en recouvrement
à renouveler
renouvelé
```

## Enjeux métier

Le contrat doit permettre de gérer :

- la souscription ;
- le renouvellement ;
- la suspension ;
- la résiliation ;
- le changement de payeur ;
- le changement de moyen de paiement ;
- les droits temporaires ;
- les impayés ;
- les contrôles anti-fraude.

---

## 7. Support

## Définition

Le **support** est le moyen physique ou numérique sur lequel le titre est chargé ou utilisé.

Exemples :

- passe Navigo physique ;
- passe imagine R ;
- téléphone ;
- montre connectée ;
- autre support compatible.

## Règle importante

Le support doit être distingué du contrat.

Un contrat peut exister même si le support :

- est perdu ;
- est volé ;
- est endommagé ;
- arrive à expiration ;
- doit être renouvelé ;
- est remplacé par un autre support.

## Durée de vie

La slide « Une vie de titres de transport » indique une **durée de vie du passe de 10 ans**.

## Impacts produit

Le système doit gérer :

- l’expiration du support ;
- le renouvellement du support ;
- le remplacement ;
- la perte ;
- le vol ;
- la défaillance technique ;
- le lien entre titre, contrat et support.

---

## 8. Titre

## Définition

Le **titre** correspond au droit de voyager chargé ou associé à un support.

Il peut être :

- un abonnement long ;
- un forfait court ;
- un titre unitaire ;
- un droit de réduction ;
- un droit de gratuité.

## Différence entre titre, contrat et support

```text
Contrat = relation commerciale et juridique
Titre = droit de transport utilisable
Support = objet physique ou numérique qui porte le titre
```

## Exemple

Un usager peut avoir :

- un contrat Navigo Annuel actif ;
- un titre chargé correspondant à son droit à circuler ;
- un passe Navigo comme support physique.

Si le passe est perdu, le contrat ne disparaît pas : il faut remplacer le support et restaurer le droit de transport.

---

## 9. Droit

## Définition

Un **droit** est une condition d’éligibilité permettant d’accéder à un tarif, une réduction ou une gratuité.

Exemples :

- droit scolaire ;
- droit étudiant ;
- droit boursier ;
- droit senior ;
- droit TST ;
- droit Améthyste ;
- droit lié au handicap ;
- droit lié à une situation sociale.

## Enjeux métier

Le droit peut être :

- permanent ;
- temporaire ;
- renouvelable ;
- conditionnel ;
- soumis à justificatif ;
- vérifié par API ;
- vérifié manuellement en back-office.

## Modèle recommandé

```text
Droit
├── Type de droit
├── Porteur concerné
├── Justificatif associé
├── Date de début
├── Date de fin
├── Statut de vérification
├── Source de vérification
└── Impact tarifaire
```

---

## 10. Justificatif

## Définition

Un **justificatif** est un document ou une donnée permettant de prouver une éligibilité, une identité ou une situation.

Exemples :

- pièce d’identité ;
- photo ;
- certificat de scolarité ;
- attestation de bourse ;
- justificatif de domicile ;
- justificatif CAF ;
- attestation de droits sociaux ;
- document lié au handicap ;
- mandat de prélèvement.

## Validation asynchrone

Le PDF client indique que la **validation de justificatif est asynchrone**.

Cela signifie que l’utilisateur peut déposer un justificatif, puis attendre une validation ultérieure.

## Impacts UX

Le parcours doit afficher un statut clair :

- justificatif reçu ;
- en cours de vérification ;
- accepté ;
- refusé ;
- incomplet ;
- expiré ;
- à redéposer.

## Impacts back-office

Le back-office doit permettre :

- de visualiser les justificatifs ;
- de les accepter ;
- de les refuser ;
- de demander un complément ;
- de suivre les délais ;
- de prioriser les dossiers ;
- de tracer les décisions.

---

## 11. Incomplétude

## Définition

L’**incomplétude** désigne un dossier qui ne peut pas être finalisé parce qu’une information, une validation ou un document manque.

## Exemples

- photo manquante ;
- photo refusée ;
- pièce d’identité absente ;
- justificatif scolaire manquant ;
- attestation de bourse non fournie ;
- CGVU non acceptées ;
- paiement non validé ;
- mandat de prélèvement incomplet ;
- droit TST non confirmé.

## Enjeux UX

L’utilisateur doit comprendre immédiatement :

- ce qui manque ;
- pourquoi c’est nécessaire ;
- comment corriger ;
- avant quelle date ;
- ce qui se passe s’il ne corrige pas.

## Enjeux back-office

Le back-office doit permettre de :

- repérer les dossiers incomplets ;
- relancer automatiquement ;
- relancer manuellement ;
- filtrer par type de blocage ;
- débloquer certains cas ;
- historiser les relances.

---

## 12. Renouvellement

## Définition

Le **renouvellement** correspond à la prolongation d’un abonnement, d’un droit ou d’un tarif.

## Règles générales

Le PDF client précise que chaque année, le client doit renouveler son abonnement, sauf cas particuliers.

Les renouvellements varient selon les produits :

- Navigo Annuel / Navigo Senior : renouvellement automatique à date anniversaire, sauf paiements au comptant ;
- imagine R : renouvellement annuel ;
- Améthyste : selon département ;
- TST : périodes de renouvellement spécifiques ;
- TST dans la frise : renouvellement tarifaire par périodes de 3 mois.

## Enjeux produit

Le renouvellement doit être anticipé par :

- notifications ;
- alertes ;
- mise à jour de justificatifs ;
- validation de droits ;
- recalcul tarifaire ;
- validation du payeur si nécessaire ;
- gestion des refus ou suspensions.

---

## 13. Transition de profil

## Définition

Une **transition de profil** se produit lorsque la situation du porteur change et modifie son offre ou son tarif.

## Exemples

- Junior vers Scolaire ;
- Scolaire vers Étudiant ;
- Étudiant vers Navigo Annuel ;
- Navigo Annuel vers Navigo Senior ;
- tarif réduit vers plein tarif ;
- droit TST actif vers droit expiré.

## Règle métier clé

Le système doit pouvoir anticiper les transitions grâce aux données connues :

- âge ;
- date de naissance ;
- date de fin du droit ;
- date de fin du contrat ;
- date d’expiration du support ;
- statut scolaire ou étudiant ;
- statut social.

## Impacts UX

- Prévenir avant la transition.
- Expliquer l’impact tarifaire.
- Proposer le meilleur forfait.
- Éviter les ruptures de service.
- Permettre d’accepter, refuser ou suspendre.

---

## 14. TST — Tarification Solidarité Transport

## Définition

La **TST** correspond à la Tarification Solidarité Transport.

Elle peut donner accès à :

- une réduction de 50 % ;
- une réduction de 75 % ;
- une gratuité ;
- d’autres droits selon situation.

## Règles structurantes

- Les droits TST doivent être vérifiés.
- Le renouvellement est spécifique.
- La frise indique une tarification par périodes de 3 mois.
- À la fin du droit, une communication doit permettre de valider le retour au plein tarif.
- En cas de refus, le contrat et les prélèvements peuvent être suspendus.

## Impacts produit

Le parcours doit gérer :

- vérification des droits ;
- dépôt de justificatif ;
- appel API si disponible ;
- communication de fin de droit ;
- retour au plein tarif ;
- suspension ;
- mise à jour des mensualités.

---

## 15. Bourse

## Définition

Certains élèves sont boursiers et peuvent bénéficier d’une réduction sur leur abonnement imagine R selon le département.

## Justificatif attendu

L’élève doit fournir une attestation d’attribution de bourse lors de la souscription.

## Points sensibles

- Les justificatifs peuvent arriver tardivement.
- Le dossier peut rester incomplet temporairement.
- Une validation asynchrone est nécessaire.
- Des relances doivent être prévues.
- Le tarif peut dépendre de la validation du droit.

## Impacts produit

- Prévoir un parcours boursier.
- Expliquer la réduction.
- Permettre le dépôt tardif de l’attestation.
- Gérer un statut conditionnel.
- Mettre à jour le tarif après validation.

---

## 16. Back-office

## Définition

Le **back-office** regroupe les outils internes permettant de suivre, contrôler, débloquer et piloter les dossiers clients.

Le PDF client indique explicitement le besoin d’outils en back-office pour suivre et débloquer les clients.

## Fonctions attendues

- Suivi des souscriptions ;
- validation des justificatifs ;
- gestion de l’incomplétude ;
- relances ;
- gestion des paiements ;
- traitement des impayés ;
- changement de payeur ;
- suspension ;
- résiliation ;
- renouvellement ;
- SAV ;
- supervision des API ;
- pilotage des volumes.

## Statuts back-office recommandés

```text
nouvelle_demande
dossier_en_brouillon
dossier_incomplet
justificatif_en_attente
justificatif_en_verification
justificatif_refuse
photo_en_attente
photo_refusee
paiement_en_attente
paiement_echoue
cgvu_payeur_a_valider
contrat_actif
contrat_suspendu
contrat_resilie
impaye_detecte
recouvrement_en_cours
droit_a_renouveler
transition_profil_a_valider
sav_en_cours
```

---

## 17. SAV

## Définition

Le **SAV** couvre tous les événements de vie du contrat ou du support après souscription.

## Cas transverses identifiés

La frise mentionne :

- suspension ;
- changement de payeur ;
- chaîne de recouvrement ;
- règles de gestion uniques.

## Autres cas SAV à prévoir

- perte de passe ;
- vol ;
- passe endommagé ;
- passe qui ne fonctionne plus ;
- oubli du passe ;
- changement de téléphone ;
- expiration du support ;
- remboursement ;
- attestation ;
- changement d’adresse ;
- changement de coordonnées bancaires.

## Enjeu principal

Le SAV doit être intégré au parcours, et non traité comme un module séparé. L’utilisateur doit pouvoir comprendre et résoudre son problème sans appeler le support lorsque c’est possible.

---

## 18. Paiement

## Définition

Le paiement couvre les modalités financières de la souscription et de la gestion du contrat.

## Cas à gérer

- paiement direct ;
- prélèvement ;
- paiement au comptant ;
- mensualisation ;
- changement de moyen de paiement ;
- échec de paiement ;
- impayé ;
- régularisation ;
- suspension ;
- recouvrement.

## Règle structurante

Le paiement doit être lié au **payeur**, pas seulement au porteur.

```text
Payeur
├── Moyen de paiement
├── Autorisation / mandat
├── Historique de paiements
├── Impayés
└── Statut de recouvrement
```

---

## 19. Impayé et recouvrement

## Définition

Un **impayé** survient lorsqu’un paiement attendu n’est pas honoré.

Le **recouvrement** désigne la chaîne de traitement permettant de régulariser la situation.

## Impacts produit

Le parcours doit permettre de :

- détecter l’impayé ;
- informer clairement le payeur ;
- informer le porteur si nécessaire ;
- expliquer les conséquences ;
- proposer une régularisation ;
- bloquer certaines actions si nécessaire ;
- reprendre le contrat après régularisation.

## Statuts possibles

```text
paiement_a_jour
paiement_echoue
impaye_detecte
relance_envoyee
recouvrement_en_cours
contrat_suspendu_pour_impaye
regularisation_en_attente
regularise
```

---

## 20. API

## Définition

Les API permettent d’échanger des données entre systèmes internes, partenaires ou services publics.

Le PDF client indique que le SI Comutitres s’appuie sur des échanges de données via API, y compris avec des API publiques.

## Objectifs

- Sécuriser les échanges ;
- réduire la saisie manuelle ;
- limiter les erreurs ;
- fiabiliser les données ;
- vérifier les droits ;
- automatiser certaines validations ;
- réduire la fraude documentaire.

## API potentielles

- adresse ;
- identité ;
- éducation nationale ;
- scolarité ;
- bourse ;
- CAF ;
- droits sociaux ;
- fiscalité ;
- handicap ;
- entreprises ;
- paiement.

## Enjeu hackathon

Même si les API réelles ne sont pas disponibles, le projet peut prévoir des **mocks d’API** pour simuler les vérifications.

---

## 21. CGVU

## Définition

Les **CGVU** sont les Conditions Générales de Vente et d’Utilisation.

Elles encadrent les règles juridiques et contractuelles des titres et supports.

## Documents mentionnés

### CGVU Titres

- Navigo Annuel ;
- imagine R Scolaire et Junior ;
- imagine R Étudiant ;
- TST ;
- Améthyste.

### CGVU Supports

- Navigo Liberté+ sur passe ;
- Navigo Liberté+ sur téléphone ;
- Passe Navigo ;
- Passe Navigo Annuel ;
- Passe Navigo imagine R ;
- support téléphone iPhone ;
- support téléphone Android.

## Impacts produit

Le parcours doit gérer :

- l’affichage des CGVU ;
- leur acceptation ;
- la version acceptée ;
- la date d’acceptation ;
- la personne qui accepte ;
- la distinction porteur / payeur / responsable légal ;
- la preuve d’acceptation.

---

## 22. RGPD et IA Act

## Définition

Le périmètre du hackathon mentionne la conformité **RGPD** et **IA Act**.

## Enjeux RGPD

- Minimisation des données ;
- finalités explicites ;
- durée de conservation ;
- sécurité ;
- information utilisateur ;
- droits d’accès, rectification et suppression ;
- protection renforcée des mineurs ;
- gestion des justificatifs sensibles.

## Enjeux IA Act

Si de l’IA est utilisée, il faut prévoir :

- transparence ;
- possibilité de recours humain ;
- maîtrise des biais ;
- non-discrimination ;
- explicabilité ;
- traçabilité ;
- supervision humaine.

## Usage IA recommandé

L’IA peut aider à :

- orienter vers le bon forfait ;
- détecter les dossiers incomplets ;
- proposer des réponses FAQ contextuelles ;
- assister les agents back-office ;
- prioriser les dossiers ;
- suggérer des relances.

Elle ne doit pas décider seule sur des cas sensibles sans contrôle humain.

---

## 23. Modèle de données synthétique

```text
Utilisateur / Compte Connect
├── Identité
├── Coordonnées
├── Porteurs rattachés
└── Préférences de communication

Porteur
├── Identité
├── Âge
├── Profil
├── Droits
├── Supports
└── Contrats

Payeur
├── Identité
├── Moyen de paiement
├── Mandat
├── CGVU acceptées
└── Historique financier

Responsable légal
├── Identité
├── Lien avec le porteur
├── Autorisations
└── Validations

Contrat
├── Produit
├── Tarif
├── Statut
├── Porteur
├── Payeur
├── CGVU
├── Paiement
├── Renouvellement
└── Historique

Droit
├── Type
├── Justificatif
├── Statut
├── Date de début
├── Date de fin
└── Source de vérification

Support
├── Type
├── Numéro
├── Statut
├── Date d’émission
├── Date d’expiration
└── Titres associés

Justificatif
├── Type
├── Fichier ou donnée
├── Statut
├── Motif de refus
├── Date de dépôt
├── Date de validation
└── Agent ou source de validation
```

---

## 24. Questions produit à traiter

- Qui est le porteur ?
- Qui est le payeur ?
- Le porteur est-il mineur ?
- Faut-il un responsable légal ?
- Qui doit accepter les CGVU ?
- Quel produit est le plus adapté ?
- Le porteur a-t-il droit à une réduction ?
- Quel justificatif est nécessaire ?
- Le justificatif peut-il être vérifié par API ?
- Le dossier est-il complet ?
- Le contrat peut-il être activé avant validation complète ?
- Le titre doit-il être suspendu en cas de refus ?
- Le support est-il valide ?
- Le payeur est-il à jour de ses paiements ?
- Le porteur approche-t-il d’une transition de profil ?
- Le contrat doit-il être renouvelé ?
- Le droit doit-il être renouvelé ?
- Le client doit-il être relancé ?
- Le dossier doit-il être traité par un agent ?

---

## 25. Backlog fonctionnel issu des notions métier

## MVP utilisateur

- Création de compte ;
- création ou rattachement du porteur ;
- choix guidé du forfait ;
- tunnel de souscription ;
- distinction porteur / payeur ;
- dépôt de justificatifs ;
- suivi du dossier ;
- paiement ;
- acceptation CGVU ;
- notifications d’incomplétude ;
- renouvellement ;
- SAV de base.

## MVP back-office

- Liste des dossiers ;
- filtres par statut ;
- visualisation d’un dossier ;
- validation de justificatif ;
- refus avec motif ;
- relance client ;
- changement de statut ;
- suivi des paiements ;
- suivi des impayés ;
- pilotage des volumes.

## MVP règles métier

- moteur d’éligibilité ;
- moteur de justificatifs ;
- moteur de renouvellement ;
- moteur de transition de profil ;
- moteur de statuts ;
- moteur de relances ;
- moteur de blocage / suspension.

---

## 26. Synthèse

Les notions métier structurantes à maîtriser sont :

1. **Porteur** : celui qui utilise le titre.
2. **Payeur** : celui qui paie.
3. **Responsable légal** : celui qui valide pour un mineur ou une personne représentée.
4. **Compte Connect** : socle d’identité et de suivi long terme.
5. **Contrat** : relation commerciale et juridique.
6. **Support** : passe, téléphone ou montre.
7. **Titre** : droit de transport utilisable.
8. **Droit** : éligibilité à un tarif ou une réduction.
9. **Justificatif** : preuve documentaire ou vérification API.
10. **Incomplétude** : dossier bloqué ou partiellement validé.
11. **Renouvellement** : prolongation du contrat ou du droit.
12. **Transition de profil** : évolution du porteur dans le temps.
13. **Back-office** : outil de suivi, contrôle et déblocage.
14. **SAV** : gestion des événements de vie.
15. **Paiement / recouvrement** : gestion financière du contrat.
16. **API** : automatisation et fiabilisation des données.
17. **CGVU** : cadre juridique d’utilisation.
18. **RGPD / IA Act** : cadre de conformité.

Ces notions doivent devenir les briques de base du parcours utilisateur, du back-office et du modèle technique.
