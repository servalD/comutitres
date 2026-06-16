# Cycle de vie — Une vie de titres de transport

_Source : slide 9 « Une vie de titres de transport » et slide 10 « Quelques notions » du PDF client Comutitres._

---

## 1. Vision générale

Le cycle de vie d’un titre de transport suit le **porteur** tout au long de sa vie, depuis les premiers titres jeunes jusqu’aux offres adultes, senior, solidaires ou départementales.

L’objectif métier est de proposer un parcours capable de gérer :

- l’évolution automatique du profil ;
- les changements de tarif ;
- le renouvellement périodique ;
- la distinction entre **porteur** et **payeur** ;
- les droits sociaux ou spécifiques ;
- les changements de support ;
- les événements SAV ;
- la suspension, le changement de payeur et le recouvrement.

---

## 2. Acteurs principaux

Les définitions complètes des acteurs sont centralisées dans `notions_metier_structurantes_comutitres_nettoye.md`. Dans ce document, on retient uniquement leur rôle dans le cycle de vie.

| Acteur | Rôle dans le cycle de vie |
|---|---|
| Porteur | Personne suivie dans le temps : Junior, Scolaire, Étudiant, Adulte, Senior, bénéficiaire TST ou Améthyste. |
| Payeur | Personne ou organisation responsable du paiement ; peut changer au fil de la vie du porteur. |
| Responsable légal | Intervient surtout pendant la minorité ou en cas de représentation juridique. |

Point clé : le parcours doit anticiper les changements de profil, de payeur, de droits et de support sans confondre ces acteurs.

## 3. Frise de vie du porteur

```text
4 ans        11 ans        15 ans        +16 ans              62 ans
 |             |             |             |                    |
 |             |             |             |                    |
Junior  →  Scolaire  →  Étudiant  →  Navigo Annuel  →  Navigo Senior
                         |
                         |
                         +→ TST / Améthyste selon droits et situation
```

---

## 4. 4 ans — Enregistrement de l’identité

À partir d’environ **4 ans**, le parcours prévoit l’**enregistrement de la pièce d’identité**.

Cette donnée est associée au porteur pour la durée de vie du contrat.

### Impacts produit

- Créer une fiche porteur.
- Associer une identité vérifiée.
- Prévoir un parcours mineur.
- Gérer le lien avec un payeur ou responsable légal.
- Prévoir la durée de conservation RGPD à valider.

---

## 5. Junior

Le porteur peut entrer dans un premier parcours de titre jeune via une offre de type **Junior**.

### Règles principales

- Le porteur est mineur.
- Le payeur est généralement un parent ou responsable légal.
- Le parcours doit gérer l’impossibilité pour un jeune porteur de payer lui-même.
- Le titre est intégré dans une logique de renouvellement tarifaire par période de **12 mois**.

### Transition importante

À l’approche de l’âge scolaire, le système peut proposer une bascule vers un profil **Scolaire**.

---

## 6. 11 ans — Passage vers Scolaire

À environ **11 ans**, le système propose une transition :

> On me propose de basculer automatiquement sur Scolaire ou de suspendre mes droits.

### Règles principales

- Détection de l’âge du porteur.
- Proposition automatique de bascule vers l’offre Scolaire.
- Possibilité de suspension si le porteur ne souhaite pas ou ne peut pas basculer.
- Mise à jour des conditions tarifaires associées au profil.

### Impacts UX

- Notification proactive avant échéance.
- Explication claire de la bascule.
- Choix explicite : accepter la bascule ou suspendre.
- Éviter une rupture de droit à circuler.

### Impacts back-office

- Statut `transition_profil_a_valider`.
- Statut `bascule_scolaire_proposee`.
- Statut `droits_suspendus`.
- Historique de décision du payeur / responsable légal.

---

## 7. Scolaire

Le profil **Scolaire** couvre une période jeune avec renouvellement tarifaire périodique.

### Règles principales

- Renouvellement tarifaire par périodes de **12 mois**.
- Possibilité de justificatifs scolaires.
- Possibilité de réduction liée à une bourse selon le département.
- Validation documentaire potentiellement asynchrone.

### Points sensibles

- Justificatif scolaire.
- Attestation de bourse.
- Relances en cas de justificatif manquant.
- Gestion des refus ou dossiers incomplets.

---

## 8. 15 ans — Création du compte Connect

À environ **15 ans**, le parcours prévoit une proposition de création de compte :

> Proposition de création compte Connect qui suivra le porteur toute sa vie.

### Objectif

Créer un compte durable rattaché au porteur, capable de suivre son historique de titres, contrats, droits et transitions.

### Impacts produit

- Création ou rattachement d’un compte Connect.
- Conservation d’un historique porteur.
- Préparation au passage vers l’autonomie du porteur.
- Préparation au changement futur de payeur.

### Impacts UX

- Expliquer pourquoi créer un compte.
- Rendre la création simple.
- Prévoir un parcours accompagné pour mineur.
- Gérer le consentement et les informations personnelles.

---

## 9. Étudiant

Le profil **Étudiant** succède au profil Scolaire lorsque la situation du porteur le justifie.

### Règles principales

- Le porteur reste potentiellement distinct du payeur.
- Le renouvellement reste annuel.
- Des justificatifs peuvent être requis.
- Les droits ou réductions peuvent dépendre du statut étudiant, de l’établissement ou de la bourse.

### Points sensibles

- Justificatif étudiant.
- Attestation de bourse.
- Changement d’établissement.
- Dossier incomplet.
- Validation asynchrone du justificatif.

---

## 10. Plus de 16 ans — Le porteur peut devenir payeur

À partir de **plus de 16 ans**, la slide indique :

> Le porteur a plus de 16 ans. Il peut devenir payeur de son contrat Navigo et validation des CGVU payeur.

### Règles principales

- Le porteur peut devenir son propre payeur.
- Le changement doit impliquer la validation des CGVU côté payeur.
- Le système doit gérer un changement de responsabilité de paiement.
- Le payeur précédent peut être remplacé.

### Impacts UX

- Parcours de changement de payeur.
- Validation claire des CGVU.
- Signature ou acceptation du nouveau payeur.
- Information de l’ancien payeur si nécessaire.
- Confirmation du changement.

### Impacts back-office

- Statut `changement_payeur_demande`.
- Statut `cgvu_payeur_a_valider`.
- Statut `payeur_modifie`.
- Historique du changement.
- Traçabilité juridique.

---

## 11. Navigo Annuel

Le porteur peut ensuite basculer vers un contrat **Navigo Annuel**.

### Règles principales

- Le contrat peut être porté et payé par la même personne.
- Le contrat peut aussi rester payé par un tiers.
- Le renouvellement est automatique selon les conditions du contrat, sauf cas particuliers.
- Les conditions tarifaires peuvent évoluer avec le profil.

### Renouvellement

La slide précise :

> Renouvellement automatique d’une année sur l’autre avec les conditions tarifaires associées à l’évolution de mon profil, selon titres.

### Impacts produit

- Détecter les changements de profil.
- Mettre à jour les conditions tarifaires.
- Prévenir le porteur et le payeur.
- Gérer les changements de moyen de paiement.
- Gérer les impayés et suspensions.

---

## 12. 62 ans — Proposition de bascule vers Navigo Senior

À environ **62 ans**, le système propose :

> Proposition automatique de basculer sur le tarif Senior.

### Règles principales

- Détection de l’âge du porteur.
- Proposition automatique du tarif Senior.
- Mise à jour possible des conditions tarifaires.
- Conservation du contrat ou création d’un nouveau parcours selon les règles applicables.

### Impacts UX

- Notification proactive.
- Explication de l’avantage tarifaire.
- Acceptation simple.
- Vérification éventuelle des conditions.
- Mise à jour du contrat.

### Impacts back-office

- Statut `eligible_senior`.
- Statut `bascule_senior_proposee`.
- Statut `bascule_senior_acceptee`.
- Statut `bascule_senior_refusee`.

---

## 13. Navigo Senior

Le profil **Navigo Senior** correspond à la phase senior du cycle de vie.

### Règles principales

- Tarif spécifique lié à l’âge ou au profil.
- Renouvellement automatique possible selon conditions.
- Gestion continue du contrat, du payeur et du support.
- Possibilité d’événements SAV comme pour les autres titres.

---

## 14. TST — Tarification Solidarité Transport

La slide indique que la **TST** fonctionne avec un renouvellement spécifique :

> TST : renouvellement tarification par périodes de 3 mois.

### Règles principales

- Le droit TST est temporaire.
- Le renouvellement se fait par période de **3 mois**.
- Les droits doivent être vérifiés.
- Une communication est envoyée à la fin du droit TST.
- Le porteur doit valider ou non le retour au plein tarif.

### Vérification des droits

Le cycle prévoit une étape de **vérification des droits TST**.

### Cas 1 — L’utilisateur valide

> Je valide : mon droit à circuler est maintenu et mes mensualités sont mises à jour.

Conséquences :

- maintien du droit à circuler ;
- mise à jour des mensualités ;
- continuité du contrat ;
- mise à jour du tarif applicable.

### Cas 2 — L’utilisateur refuse

> Je refuse : mon contrat et les prélèvements sont suspendus.

Conséquences :

- suspension du contrat ;
- suspension des prélèvements ;
- arrêt ou modification du droit à circuler ;
- nécessité d’un statut back-office clair.

### Fin de droit TST

> Fin de mon droit TST. Je reçois une communication pour valider le retour au plein tarif.

Impacts :

- communication proactive ;
- choix utilisateur ;
- bascule tarifaire ;
- traçabilité de la décision ;
- gestion du risque de rupture de service.

---

## 15. Améthyste

Le cycle de vie intègre aussi le forfait **Améthyste**.

### Règles principales

- Le droit dépend du département ou de la situation du bénéficiaire.
- Le renouvellement dépend des règles applicables localement.
- Le titre peut coexister dans la logique de droits spécifiques, comme TST.
- Une vérification documentaire ou administrative peut être nécessaire.

---

## 16. Support physique — Durée de vie du passe

La frise indique :

> Durée de vie du passe : 10 ans.

### Règles principales

- Le support physique a une durée de vie limitée.
- Des jalons de renouvellement du support doivent être anticipés.
- Le parcours doit distinguer le contrat, le droit et le support.

### Impacts produit

- Alerter avant expiration du support.
- Proposer le remplacement du passe.
- Éviter la confusion entre expiration du support et expiration du droit.
- Gérer les titres déjà associés au support.

---

## 17. Gestion et SAV transverses

La slide met en avant un besoin transversal : traiter les événements de vie avec des règles communes, notamment la suspension, le changement de payeur, le recouvrement et l’unification des statuts.

### Suspension

La suspension peut intervenir dans plusieurs cas :

- refus de bascule tarifaire ;
- fin de droit non validée ;
- impayé ;
- changement de situation ;
- décision du porteur ou du payeur.

### Changement de payeur

Le changement de payeur est central, notamment lorsque :

- le porteur devient autonome ;
- un parent cesse de payer ;
- une association ou un employeur prend le relais ;
- le moyen de paiement doit être changé.

### Recouvrement

La chaîne de recouvrement doit gérer :

- impayés ;
- relances ;
- blocages ;
- régularisation ;
- reprise éventuelle du contrat.

### Règles de gestion uniques

L’objectif est d’éviter des règles dispersées par produit, en créant un socle commun pour :

- les statuts ;
- les relances ;
- les justificatifs ;
- les paiements ;
- les suspensions ;
- les reprises ;
- les changements de payeur.

---

## 18. États back-office suggérés

```text
profil_junior
profil_scolaire
profil_etudiant
profil_adulte
profil_senior

piece_identite_enregistree
compte_connect_propose
compte_connect_cree

bascule_scolaire_proposee
bascule_scolaire_acceptee
bascule_scolaire_refusee

porteur_eligible_payeur
changement_payeur_demande
cgvu_payeur_a_valider
payeur_valide

renouvellement_a_preparer
renouvellement_automatique
renouvellement_refuse
contrat_suspendu

droits_tst_a_verifier
droits_tst_valides
droits_tst_expires
retour_plein_tarif_a_valider
retour_plein_tarif_accepte
retour_plein_tarif_refuse

eligible_senior
bascule_senior_proposee
bascule_senior_acceptee

support_a_renouveler
support_expire
sav_en_cours
impaye_detecte
recouvrement_en_cours
contrat_regularise
```

---

## 19. Modèle métier synthétique

```text
Porteur
 ├── Identité
 ├── Âge
 ├── Profil courant
 ├── Droits associés
 ├── Compte Connect
 ├── Support Navigo
 └── Contrats

Contrat
 ├── Produit
 ├── Tarif
 ├── Statut
 ├── Date de début
 ├── Date de fin / renouvellement
 ├── Payeur
 ├── CGVU acceptées
 ├── Moyen de paiement
 └── Historique des changements

Payeur
 ├── Identité
 ├── Coordonnées
 ├── Moyen de paiement
 ├── Mandat / autorisation
 └── Acceptation CGVU

Droit
 ├── Type : Scolaire / Étudiant / Senior / TST / Améthyste
 ├── Justificatif
 ├── Statut de validation
 ├── Date d’expiration
 └── Règles de renouvellement

Support
 ├── Type : passe physique / téléphone / autre
 ├── Date d’émission
 ├── Date d’expiration
 ├── Statut
 └── Titres associés
```

---

## 20. Enjeux UX à retenir

- Rendre visible l’évolution du profil dans le temps.
- Anticiper les transitions plutôt que les subir.
- Expliquer les changements tarifaires.
- Éviter les ruptures de droit à circuler.
- Séparer clairement porteur, payeur et responsable légal.
- Rendre les renouvellements fluides.
- Prévoir des notifications avant chaque échéance.
- Gérer les refus sans bloquer inutilement l’utilisateur.
- Donner un statut clair à chaque dossier.
- Réduire les appels au support grâce à un suivi explicite.

---

## 21. Enjeux back-office à retenir

- Suivre les transitions de profil.
- Valider les justificatifs de façon asynchrone.
- Débloquer les dossiers incomplets.
- Traiter les changements de payeur.
- Suivre les droits TST et Améthyste.
- Piloter les renouvellements.
- Gérer les suspensions.
- Gérer les impayés et le recouvrement.
- Centraliser les règles communes entre produits.
- Garder une traçabilité juridique des décisions et validations.
