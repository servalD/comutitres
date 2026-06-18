# Analyse CGVU / CGU IDFM — Règles métier, impacts UX & back-office

> Périmètre : extraction opérationnelle des règles issues des CGVU/CGU Île-de-France Mobilités utiles pour la refonte du parcours Comutitres : souscription, renouvellement, paiement, justificatifs, impayés, SAV, fraude, RGPD, supports physiques et supports mobiles.
>
> Statut : analyse produit / métier. Ce document n’est pas un avis juridique final. Les règles doivent être validées par les équipes juridiques, métier, comptables et back-office avant implémentation.

---

## 1. Pourquoi analyser les CGVU maintenant ?

Nous voulons concevoir un parcours client unifié et intelligent couvrant notamment Navigo Annuel, Navigo Senior, Navigo Mois, Navigo Semaine, imagine R, Liberté+, TST / Solidarité Transport et Améthyste, avec tunnel de souscription, collecte de justificatifs, documents RGPD, vérification des réductions, paiement et back-office.

Objectif de ce livrable : transformer les CGVU en règles concrètes pour le produit.

---

## 2. Sources publiques analysées

| Document | Version / date repérée | Usage principal dans le produit |
|---|---:|---|
| Page centrale CGVU IDFM | Page officielle CGVU | Inventaire des titres, supports, applications, règles de cohabitation et documents de référence |
| CGVU forfait Navigo Annuel | Juillet 2025 / juin 2026 selon page officielle | Abonnement long terme, payeur, suspension, résiliation, impayés, senior |
| CGVU Navigo Mois / Semaine | Juin 2025 | Achat ponctuel, chargement, validation, remboursement |
| CGVU imagine R Scolaire & Junior | Saison 2025-2026 | Mineurs, responsable légal, bourse, renouvellement annuel, justificatifs scolaires |
| CGVU imagine R Étudiant | Saison 2025-2026 | Étudiants, âge, statut scolaire, parcours post-secondaire, renouvellement |
| CGVU Navigo Liberté + sur passe | Validité à partir de décembre 2025 / juin 2026 selon page officielle | Post-paiement, prélèvement SEPA, trajets facturés a posteriori, impayés courts |
| CGVU Navigo Liberté + sur téléphone | Juin 2026 selon page officielle | Post-paiement sur téléphone compatible, titulaire-payeur unique, prélèvement SEPA, impayés, cohabitation, changement de téléphone |
| CGU iPhone achat de titres | Validité 06/2025 | Achat / chargement sur iPhone et Apple Watch, élément sécurisé, cohabitation |
| CGU Android achat de titres | Validité à partir de 06/2025 | Achat / chargement sur Android, téléphone NFC, montre, application Mes Tickets Navigo |
| CGVU Passe Navigo | À compter de juin 2025 | Support nominatif, propriété IDFM, perte, vol, remplacement, justificatifs |
| CGVU Tarification Solidarité Transport | Valable à compter de 01/2026 | Gratuité, Solidarité 75 %, Réduction 50 %, éligibilité sociale, suspension fraude |
| CGVU Améthyste | Juin 2025 | Produit attribué par les départements, chargement sur passe Navigo, validation |
| Politique de confidentialité IDFM | Page officielle données personnelles | Socle RGPD transverse : responsable de traitement, finalités, durées, droits, partage de données |
| Guide Tarification Solidarité Transport | Septembre 2019 | Synthèse opérationnelle TST : support requis, droits, renouvellement, justificatifs, non-remboursement des titres d’attente |

---

## 3. Concepts métier utilisés dans ce document

Les définitions détaillées des notions **porteur**, **payeur**, **responsable légal**, **compte Connect**, **contrat**, **support**, **titre**, **droit**, **justificatif**, **incomplétude**, **SAV**, **paiement** et **recouvrement** sont centralisées dans le document `notions_metier_structurantes_comutitres.md`.

Dans cette analyse CGVU, ces notions sont seulement réutilisées pour traduire les règles juridiques en impacts produit, UX, comptables et back-office.

### Points de modèle à retenir pour les CGVU

| Notion | Usage dans cette analyse |
|---|---|
| Titulaire / porteur | Personne qui utilise le titre ou le support ; sert à vérifier identité, âge, photo, droits et éligibilité. |
| Payeur | Personne responsable du paiement, du mandat SEPA, des impayés et de l’acceptation des clauses financières. |
| Responsable légal | Acteur à faire intervenir pour les mineurs ou personnes représentées, notamment pour signature, autorisation et notifications. |
| Support | Passe, téléphone ou montre sur lequel le titre est chargé ; à distinguer du contrat. |
| Titre / forfait | Droit de voyager, avec validité, zones, conditions d’usage et règles de remboursement. |
| Droit | Réduction, gratuité ou éligibilité : TST, bourse, senior, scolaire, étudiant, handicap, etc. |
| Justificatif | Preuve documentaire ou donnée vérifiée par API ; doit être contrôlée, historisée et minimisée côté RGPD. |
| Impayé | Dette ou incident de paiement pouvant bloquer souscription, SAV, suspension/reprise ou rôle de payeur. |

## 4. Règles transverses extraites

### 4.1 Acceptation des CGVU

Règle : chaque souscription ou achat suppose l’acceptation pleine et entière des CGVU du produit, ainsi que des CGU du support utilisé.

Implications produit :

- afficher les CGVU produit + CGU support avant validation ;
- tracer l’acceptation : version, date, IP/appareil si applicable, canal ;
- si payeur différent du titulaire, faire accepter au payeur les clauses qui l’engagent ;
- si titulaire mineur, gérer une acceptation par le responsable légal / payeur selon produit ;
- conserver la preuve d’acceptation en back-office.

### 4.2 Support nominatif, personnel et non cessible

Règle : les passes Navigo personnalisés, imagine R et certains contrats sont personnels, nominatifs, avec photo, et non cessibles.

Implications UX :

- expliquer clairement que le pass ne se prête pas ;
- afficher cette règle au moment du choix du support ;
- ajouter une étape pédagogique anti-fraude, surtout pour les parents / mineurs ;
- éviter les formulations ambiguës comme “partager le pass”.

Implications back-office :

- contrôle photo ;
- contrôle cohérence identité / âge / justificatif ;
- historique des pertes ou remplacements ;
- signalement des usages frauduleux.

### 4.3 Validation obligatoire

Règle : le titulaire doit valider systématiquement avant chaque trajet, y compris lors des correspondances et en sortie lorsque demandé, sous peine d’infraction.

Implications produit :

- prévoir une FAQ contextuelle “Pourquoi dois-je valider ?” ;
- envoyer des rappels pédagogiques lors de l’activation ;
- pour Liberté+, expliquer que la validation déclenche un droit de transport facturé a posteriori ;
- pour téléphone / montre, rappeler la nécessité du NFC / téléphone compatible / batterie selon règles support.

### 4.4 Oubli du support

Règle : en cas d’oubli du support, l’utilisateur doit acheter un autre titre pour voyager ; celui-ci n’est généralement pas remboursé.

Implications UX :

- intégrer un scénario “J’ai oublié mon pass” ;
- expliquer directement : “acheter un titre de dépannage, non remboursable” ;
- éviter de créer une promesse de remboursement.

### 4.5 Perte, vol, détérioration, dysfonctionnement

Règle : le passe Navigo peut être remplacé en cas de perte ou vol, avec frais forfaitaires ; selon les cas, une pièce d’identité, une procuration ou un passage en agence peuvent être nécessaires.

Implications produit :

- créer un parcours SAV dédié : perte / vol / détérioration / dysfonctionnement ;
- distinguer le support seul du support contenant plusieurs contrats ;
- afficher clairement les frais ;
- proposer mise en opposition ;
- indiquer les délais de reconstitution ;
- gérer les cas sans remboursement des titres achetés pendant l’intervalle.

### 4.6 Photo obligatoire

Règle : les supports nominatifs reposent sur l’identité et la photo du titulaire.

Implications produit :

- contrôle qualité photo dès le dépôt ;
- messages avant upload : visage visible, photo récente, pas de filtre, pas de document flou ;
- rejet motivé et compréhensible ;
- relance automatique ;
- suivi de statut : “photo en contrôle”, “photo refusée”, “photo validée”.

### 4.7 Payeur distinct du titulaire

Règle : beaucoup de produits autorisent un payeur distinct du titulaire, mais le payeur est responsable du paiement.

Implications produit :

- parcours en deux espaces : titulaire / payeur ;
- invitation du payeur à compléter IBAN, mandat et signature ;
- notification des deux parties lorsque nécessaire ;
- statut de dossier bloqué tant que le payeur n’a pas signé ;
- gestion des changements de payeur sans rupture de paiement.

### 4.8 Mineurs et majeurs protégés

Règle : les CGVU distinguent les mineurs non émancipés, mineurs émancipés, adultes sous tutelle ou curatelle. Certaines signatures ne sont pas exigées du titulaire mineur, mais le payeur / représentant doit être engagé.

Implications produit :

- détecter automatiquement l’âge ;
- interdire ou adapter le paiement direct pour les mineurs non autorisés ;
- faire intervenir le représentant légal ;
- collecter les justificatifs de représentation si nécessaire ;
- différencier le contact opérationnel du titulaire et du payeur ;
- prévoir un passage de relais à 16 ans / majorité selon les règles internes à valider.

### 4.9 Impayés et blocage

Règle : les incidents de paiement entraînent notification, suspension, résiliation et restrictions de souscription / de désignation comme payeur selon les produits.

Implications produit :

- créer un moteur de règles “eligibility_to_subscribe” et “eligibility_to_pay” ;
- bloquer ou limiter les nouveaux contrats si dette active ;
- afficher la dette, le motif, le canal de paiement et le délai de réactivation ;
- éviter un message générique “erreur de paiement” ;
- proposer régularisation CB / téléphone / agence selon produit ;
- notifier titulaire et payeur si différents.

### 4.10 Fraude documentaire et fraude d’usage

Règle : les fausses déclarations, falsifications de justificatifs et usages frauduleux peuvent entraîner résiliation, suspension du droit, période de carence et poursuites.

Implications produit :

- contrôle automatisé + humain sur justificatifs sensibles ;
- scoring de cohérence non discriminant ;
- journalisation des contrôles ;
- message clair mais prudent en cas de suspicion ;
- file back-office dédiée “contrôle renforcé” ;
- possibilité de demander un justificatif complémentaire ;
- recours ou contact humain.

### 4.11 Données personnelles / RGPD

Règle : les CGVU et la politique de confidentialité IDFM imposent de traiter les données personnelles selon des finalités explicites, avec information de l’usager, base légale, limitation de conservation, sécurité et possibilité d’exercice des droits.

Points consolidés depuis la politique de confidentialité :

- Île-de-France Mobilités agit comme responsable de traitement pour plusieurs services numériques et comptes clients ;
- Comutitres peut collecter et traiter des données dans le cadre des services Navigo / Mon Navigo / dédommagement ;
- les données peuvent couvrir l’identification, les coordonnées, les données de contrat, de paiement, de justificatifs, de SAV, de réclamations et, selon les produits, les données de validation ;
- les finalités doivent être distinguées : gestion du compte, gestion du contrat, facturation, paiement, SAV, lutte contre la fraude, réclamations, statistiques, communications institutionnelles ou commerciales ;
- les traitements de prospection et la conservation détaillée de certaines données de déplacement doivent être gérés séparément des données strictement nécessaires au contrat ;
- les droits RGPD doivent être accessibles : information, accès, rectification, opposition lorsque applicable, effacement lorsque possible, limitation, portabilité selon les cas ;
- les parcours doivent prévoir les cas de mineurs, représentants légaux et majeurs protégés ;
- les transferts ou partages avec prestataires, transporteurs, partenaires contractuels et sous-traitants doivent être visibles dans la documentation back-office et juridique.

Implications produit :

- limiter les données au strict nécessaire par produit ;
- éviter les champs non nécessaires comme civilité si aucune règle métier ne l’exige ;
- séparer les consentements de prospection des acceptations contractuelles ;
- horodater l’acceptation CGVU, les consentements et les modifications de préférences ;
- indiquer au client pourquoi chaque justificatif est demandé ;
- prévoir un centre de préférences et un parcours d’exercice des droits ;
- mettre en place des durées de conservation par type de donnée : compte, contrat, paiement, justificatif, validation, réclamation, fraude ;
- masquer ou restreindre en back-office les données sensibles non nécessaires au traitement d’un dossier ;
- tracer les accès agents aux justificatifs et données de paiement ;
- prévoir une information claire lorsque des données sont partagées avec transporteurs ou prestataires.

Règles produit à implémenter :

```yaml
privacy_rgpd:
  data_minimization: true
  purposes:
    - account_management
    - contract_management
    - eligibility_check
    - payment_and_billing
    - sav_and_claims
    - fraud_prevention
    - statistics
    - institutional_communication
    - commercial_prospection_if_consented
  consent_separation:
    cgvu_acceptance: required
    commercial_prospection: optional
    travel_detail_retention: optional_when_applicable
  audit:
    timestamp_acceptance: true
    timestamp_consent: true
    agent_access_log: true
  user_rights_flow:
    access: true
    rectification: true
    erasure_when_possible: true
    objection_when_applicable: true
    limitation_when_applicable: true
```

### 4.12 Cohabitation des titres

Règle : les titres et contrats peuvent cohabiter sur un même support selon des règles spécifiques. Certaines combinaisons sont impossibles ou prioritaires.

Implications produit :

- moteur de compatibilité support / titre ;
- affichage clair avant achat : “compatible avec votre support” ou “non compatible” ;
- éviter de vendre un titre impossible à charger ;
- gérer les priorités de validation, par exemple forfait toutes zones prioritaire avant Liberté+ ;
- synchronisation entre pass physique, téléphone et montre.

---

## 5. Analyse par produit

## 5.1 Passe Navigo

### Règles clés

- Le passe Navigo est une carte à puce personnalisée avec nom, prénom et photo.
- Il est personnel et non cessible.
- Il est réservé aux personnes résidant ou travaillant en Île-de-France.
- Un seul passe Navigo personnalisé peut être délivré par personne.
- Le remplacement pour perte ou vol est payant.
- La perte / vol avec plusieurs contrats peut imposer un traitement spécifique en agence.

### Impacts UX

- Le parcours doit commencer par “Ai-je déjà un support ?”.
- La création du support doit expliquer la photo, l’adresse, la durée de validité, les délais d’envoi.
- La récupération d’un pass perdu doit être très visible dans l’espace personnel.

### Impacts back-office

- Déduplication des titulaires.
- Validation photo.
- Gestion opposition / reconstitution.
- Suivi du nombre de pertes / vols.

### Règles produit à implémenter

```yaml
support_navigo:
  personal: true
  transferable: false
  requires_photo: true
  max_active_per_person: 1
  eligible_if:
    - resides_in_idf OR works_in_idf
  loss_or_theft:
    fee_eur: 15
    identity_check_required: true
```

---

## 5.2 Navigo Annuel / Navigo Senior

### Règles clés

- Forfait souscrit pour une durée indéterminée.
- Chargé sur un passe Navigo Annuel nominatif, personnel et non cessible.
- Payeur possible différent du titulaire.
- Impayé régularisable par espace personnel, téléphone ou autres canaux indiqués.
- Suspension et reprise possibles.
- Suspension maximale de 12 mois ; au-delà, résiliation de plein droit.
- Résiliation en cours de mois : mois dû en intégralité.
- Résiliation possible en cas d’impayés, pertes / vols trop fréquents, révocation SEPA sans remplacement, suspension supérieure à 12 mois.
- Des droits RGPD spécifiques existent, y compris pour mineurs de moins de 15 ans ou majeurs protégés via représentant légal.

### Impacts UX

- Afficher la différence entre suspension et résiliation.
- Montrer la date d’effet réelle de la suspension / reprise.
- Prévenir avant la fin des 12 mois de suspension.
- Parcours de régularisation d’impayé prioritaire.
- Pour Senior : déclencher une proposition automatique au bon âge, mais demander validation explicite.

### Impacts comptables

- Mois commencé dû.
- Prélèvements suspendus pendant suspension.
- Frais de rejet bancaire à la charge du payeur sauf incident technique non imputable.
- Preuve de demande de suspension / résiliation à conserver.

### Règles produit à implémenter

```yaml
navigo_annuel:
  contract_duration: indefinite
  support: navigo_annuel
  payer_can_differ: true
  suspendable: true
  max_suspension_months: 12
  cancellation:
    current_month_due: true
  unpaid:
    regularization_channels:
      - personal_space_card_payment
      - phone_card_payment
  automatic_termination_reasons:
    - unpaid_debt
    - more_than_3_loss_or_theft_in_12_months
    - sepa_revocation_without_replacement
    - suspension_over_12_months
```

---

## 5.3 Navigo Mois / Navigo Semaine

### Règles clés

- Achat et utilisation impliquent l’acceptation des CGVU produit et support.
- Navigo Mois : vente à partir du 20 du mois précédent jusqu’au 19 du mois de validité.
- Navigo Semaine : vente à partir du vendredi précédent jusqu’au jeudi inclus de la semaine de validité.
- Paiement comptant au moment de l’achat.
- Chargement possible sur plusieurs supports : passe Navigo, Navigo Découverte, imagine R, Navigo Annuel, téléphone compatible.
- Validation obligatoire à chaque trajet.
- Oubli du support : achat d’un autre titre non remboursé.
- Remboursement complet avant début de validité ; remboursement partiel dans certaines conditions après début de validité.

### Impacts UX

- Calendrier d’achat clair : “disponible à partir du 20”.
- Contrôle de compatibilité avant paiement.
- Message “non remboursé si oubli du support”.
- Parcours remboursement conditionnel.

### Règles produit à implémenter

```yaml
navigo_mois:
  sale_start: day_20_previous_month
  sale_end: day_19_validity_month
  payment: upfront
  validation_required: true
  forgotten_support_refund: false

navigo_semaine:
  sale_start: friday_before_validity_week
  sale_end: thursday_of_validity_week
  payment: upfront
  validation_required: true
```

---

## 5.4 imagine R Scolaire & Junior

### Règles clés

- Destiné aux élèves de l’enseignement primaire, secondaire et apprentissage.
- Chargé sur un passe Navigo imagine R nominatif, personnel et non cessible.
- Première souscription et renouvellement sont des notions distinctes.
- Le payeur doit être majeur ou mineur émancipé.
- Le payeur peut être différent du titulaire.
- Un payeur peut prendre en charge plusieurs forfaits imagine R.
- Le payeur avec dette non régularisée peut être temporairement empêché de redevenir payeur.
- Les justificatifs doivent être en français.
- Sans justificatifs demandés sous un mois, l’Agence peut considérer que le titulaire n’a pas droit au forfait ou au tarif boursier.
- En cas de fausse déclaration, il peut y avoir résiliation, interdiction de souscription et poursuites.
- Les élèves boursiers doivent fournir une notification ou attestation précisant les informations nécessaires ; sinon le tarif non boursier peut s’appliquer.
- Le payeur doit déclarer les changements d’adresse, établissement, statut boursier ou perte de statut scolaire sous un mois.
- Les adresses e-mail des titulaires de moins de 15 ans ne sont pas collectées dans certains cas ; les communications sont adressées au payeur.

### Impacts UX

- Parcours parent / enfant natif.
- Assistant de choix “Junior / Scolaire / Étudiant”.
- Détection âge + statut scolaire.
- Gestion bourse tardive : dépôt différé, tarif provisoire, régularisation éventuelle.
- Relances avant expiration du délai d’un mois pour justificatif.
- Statuts compréhensibles : “justificatif demandé”, “en attente bourse”, “tarif non boursier appliqué”, “contrôle complémentaire”.

### Impacts back-office

- Validation établissement et année scolaire.
- Contrôle bourse.
- Relance automatisée.
- Gestion des cas fausse déclaration.
- Blocage payeur avec dette.

### Règles produit à implémenter

```yaml
imagine_r_scolaire_junior:
  support: navigo_imagine_r
  annual_renewal: true
  payer:
    must_be: adult_or_emancipated_minor
    can_differ_from_holder: true
    can_pay_multiple_contracts: true
  scholarship:
    proof_required: true
    proof_language: fr
    late_proof_strategy: apply_non_scholarship_price_until_validated
  proof_request:
    response_deadline_days: 30
  holder_under_15:
    collect_email: false
    communications_to: payer
  fraud:
    possible_consequences:
      - termination
      - subscription_ban
      - criminal_proceedings
```

---

## 5.5 imagine R Étudiant

### Règles clés

- Concerne les étudiants en formations post-secondaires, supérieures et contrat d’apprentissage.
- Réservé aux étudiants résidant en Île-de-France, âgés de moins de 26 ans au 1er septembre de la saison concernée.
- Formation initiale d’au moins 350 heures théoriques dans un établissement éligible.
- Les élèves en contrat de professionnalisation sont exclus.
- Payeur distinct possible.
- CGVU imposées au titulaire et au payeur ; le payeur est responsable des conditions relatives au paiement.

### Impacts UX

- Vérification âge au 1er septembre, pas seulement âge actuel.
- Vérification résidence IDF.
- Vérification type de formation : apprentissage oui, professionnalisation non.
- Collecte justificatif de scolarité adaptée.
- Renouvellement étudiant en octobre : anticiper forte charge support.

### Règles produit à implémenter

```yaml
imagine_r_etudiant:
  eligible_if:
    - residence_idf: true
    - age_on_september_1_lt: 26
    - initial_training_hours_min: 350
    - institution_eligible: true
  excluded:
    - contrat_de_professionnalisation
  payer_can_differ: true
  renewal: annual
```

---

## 5.6 Navigo Liberté + sur passe

### Règles clés

- Contrat permettant de voyager sans achat préalable ; les trajets sont facturés a posteriori.
- Payeur distinct possible, mais payeur doit être majeur capable ou mineur émancipé.
- Chargé exclusivement sur passe Navigo personnalisé ; pas sur Navigo Découverte, imagine R ou Navigo Annuel.
- Création d’espace personnel obligatoire pour le titulaire en souscription en ligne.
- Le contrat est uniquement payable par prélèvement automatique.
- Facture mensuelle, prélèvement entre le 10 et le 20 du mois suivant.
- En cas de rejet de prélèvement : notification e-mail + SMS au titulaire et au payeur.
- Sans régularisation sous 5 jours : suspension.
- Sans régularisation sous 30 jours : résiliation.
- La suspension / résiliation ne dispense pas de payer les trajets effectués jusqu’à suspension effective.
- Un acte SAV n’est possible que si le contrat ne présente pas d’impayé.
- Fraudulent dossier or fraudulent use can trigger termination and carence.
- Validation obligatoire ; impossible de valider plusieurs fois pour faire voyager plusieurs personnes.

### Impacts UX

- Très fort besoin de pédagogie : “vous voyagez maintenant, vous payez le mois suivant”.
- Dashboard consommation mensuelle.
- Alertes avant prélèvement.
- Message très rapide en cas d’impayé : J+0 notification, J+5 suspension, J+30 résiliation.
- Interdiction de multi-validation expliquée simplement.
- Contrôle de support avant souscription : uniquement Navigo personnalisé.

### Impacts comptables

- Facturation a posteriori.
- Agrégation trajets / frais / remboursements.
- Gestion impayés rapides.
- Régularisation possible par espace personnel, agence ou téléphone.

### Règles produit à implémenter

```yaml
navigo_liberte_plus_passe:
  billing: postpaid_monthly
  payment_method: sepa_direct_debit_only
  payer:
    must_be: adult_or_emancipated_minor
    can_pay_max_contracts: 10
  support:
    allowed: navigo_personnalise
    forbidden:
      - navigo_decouverte
      - navigo_imagine_r
      - navigo_annuel
  unpaid_process:
    notify: email_sms_holder_and_payer
    suspend_after_days: 5
    terminate_after_days: 30
  sav_allowed_if_unpaid: false
  validation:
    required: true
    multiple_people_forbidden: true
```

---

## 5.7 Navigo Liberté + sur téléphone

### Règles clés

- Le contrat Navigo Liberté + sur téléphone est un contrat de post-paiement chargé sur un téléphone compatible Android ou iOS.
- Le titulaire et le payeur doivent être la même personne physique. Contrairement au contrat sur passe, le payeur distinct n’est pas autorisé.
- Le payeur / titulaire doit être majeur capable ou mineur à partir de 15 ans.
- La création d’un compte Île-de-France Mobilités Connect est obligatoire.
- La souscription se fait uniquement dans l’application Île-de-France Mobilités.
- Le titulaire-payeur doit renseigner un IBAN SEPA, signer les documents de souscription, signer le mandat SEPA et accepter les CGVU du contrat.
- Le contrat est souscrit pour une durée indéterminée.
- Le contrat est chargé exclusivement sur un téléphone compatible ; son usage est personnel.
- Aucun tarif réduit n’est applicable sur Navigo Liberté + sur téléphone.
- Les trajets sont facturés a posteriori sur facture mensuelle.
- Le paiement est uniquement réalisé par prélèvement automatique.
- Le prélèvement intervient entre le 13 et le 18 du mois pour les trajets du mois précédent.
- Une notification préalable informe le titulaire-payeur du montant et de l’échéance du prélèvement.
- Le montant journalier des trajets est plafonné au prix du Navigo Jour, sauf trajets aéroport via RER et/ou métro.
- En cas de rejet de paiement : notification e-mail, notification applicative ou SMS.
- Sans régularisation sous 5 jours après notification du rejet : suspension du contrat.
- Sans régularisation sous 30 jours après rejet : résiliation du contrat.
- La suspension ou la résiliation ne dispense pas de payer les trajets effectués avant suspension / résiliation.
- L’impayé peut être régularisé par carte bancaire depuis l’espace personnel dans l’application.
- La validation est obligatoire à chaque trajet, y compris correspondances et sorties RER/train lorsque demandé.
- La validation vaut délivrance d’un titre de transport facturé ultérieurement.
- Il est interdit de valider plusieurs fois le contrat pour faire voyager plusieurs personnes.
- En cas d’oubli du téléphone, l’usager doit acheter un autre titre, non remboursé.
- En cas de perte ou vol du téléphone, la déclaration peut se faire depuis le site, l’application sur un autre téléphone ou par téléphone auprès de l’Agence Navigo.
- Les trajets effectués avant la déclaration de perte / vol ne sont pas remboursés ; la date et l’heure de déclaration servent au blocage de facturation.
- Pour continuer à voyager après perte / vol, l’usager doit acheter des titres de transport ; ceux-ci ne sont pas remboursés.
- Un contrat peut être restauré sur un nouveau téléphone via les parcours de sauvegarde / restauration.
- La restauration est possible uniquement Android compatible vers Android compatible ou iOS compatible vers iOS compatible.
- La sauvegarde supprime les titres présents dans l’ancien téléphone, qui deviennent inutilisables sur ce support.
- Les réclamations liées à une facture doivent être émises dans le délai compatible avec la durée de conservation des données de déplacement choisie par le client, 30 ou 90 jours.

### Cohabitation et priorités de validation

- Si un forfait Navigo Mois ou Semaine est déjà en cours de validité sur téléphone, la souscription Liberté + sur téléphone débute le lendemain de la fin de validité de ce forfait.
- Au moment de la souscription, certains titres à l’unité peuvent cohabiter avec Liberté + sur téléphone.
- Après souscription, la cohabitation avec des titres à l’unité n’est plus possible.
- Les titres Fête de la musique et Antipollution peuvent cohabiter et sont prioritaires.
- Quand le téléphone contient Liberté + et des titres à l’unité, Liberté + est prioritaire ; les titres unitaires ou carnets ne redeviennent validables qu’après résiliation, sans remboursement.
- Quand le téléphone contient Liberté + et des forfaits toutes zones, les forfaits sont prioritaires jusqu’à leur fin de validité.

### Impacts UX

- Ne pas réutiliser tel quel le parcours Liberté + sur passe : le téléphone impose un titulaire-payeur unique.
- Contrôler très tôt la compatibilité téléphone et OS.
- Bloquer le parcours si le demandeur veut désigner un payeur différent.
- Expliquer clairement l’absence de tarif réduit sur téléphone.
- Afficher un calendrier de facturation : trajets du mois M, facture disponible autour du 11, prélèvement entre le 13 et le 18.
- Montrer les délais d’impayé en langage simple : J+0 notification, J+5 suspension, J+30 résiliation.
- Prévoir un parcours “j’ai changé de téléphone” avec sauvegarde / restauration.
- Prévoir un parcours “téléphone perdu ou volé” distinct de la perte du passe physique.
- Avertir avant sauvegarde que les titres sont supprimés de l’ancien téléphone.
- Expliquer les priorités de validation pour éviter qu’un titre unitaire reste bloqué derrière Liberté +.
- Expliquer que les tickets ou titres achetés en dépannage après oubli, perte ou vol du téléphone ne sont pas remboursés.

### Impacts back-office

- Dossier téléphone rattaché au titulaire-payeur unique.
- Suivi de compatibilité et type d’appareil.
- Journalisation des sauvegardes, restaurations, pertes et vols.
- Suivi des consentements de conservation des données de déplacement, 30 ou 90 jours.
- File spécifique pour contestations de factures avec contrainte de délai.
- Blocage SAV ou résiliation si impayé non régularisé.
- Historique des notifications impayés : e-mail, notification, SMS.

### Règles produit à implémenter

```yaml
navigo_liberte_plus_phone:
  billing: postpaid_monthly
  support: compatible_phone_only
  subscription_channel: idfm_mobile_app_only
  contract_duration: indefinite
  holder_and_payer:
    must_be_same_person: true
    payer_can_differ: false
    min_age: 15
    adult_or_capable_minor_required: true
  account:
    idfm_connect_required: true
    french_mobile_number_required: true
  payment:
    method: sepa_direct_debit_only
    iban_zone: SEPA
    debit_window: day_13_to_day_18_following_month
    advance_notice: email_or_push_notification
  reduced_fare:
    applicable: false
  validation:
    required: true
    creates_billable_transport_right: true
    multiple_people_forbidden: true
  cohabitation:
    navigo_month_or_week_active: starts_after_current_pass_end
    unit_titles_after_subscription: forbidden
    liberte_plus_priority_over_unit_titles: true
    all_zone_pass_priority_over_liberte_plus: true
    antipollution_and_fete_de_la_musique_priority: true
  unpaid_process:
    notify_channels:
      - email
      - push_notification
      - sms
    suspend_after_days: 5
    terminate_after_days: 30
    regularization_channel: card_payment_in_app_personal_space
  device_lifecycle:
    loss_or_theft_declaration_channels:
      - website
      - mobile_app_on_another_phone
      - phone_agence_navigo
    temporary_titles_refunded: false
    backup_removes_titles_from_old_phone: true
    restore_allowed:
      - android_to_android_compatible
      - ios_to_ios_compatible
  invoice_claim:
    deadline_depends_on_travel_data_retention_days:
      - 30
      - 90
```

---

## 5.8 Téléphone iOS / Apple Watch

### Règles clés

- Le service permet d’acheter des titres pour les charger dans un passe Navigo ou dans un iPhone / Apple Watch et valider avec.
- Le service permet aussi de consulter le solde de titres disponibles.
- Il repose sur un élément sécurisé.
- Certaines fonctions nécessitent Île-de-France Mobilités Connect.
- Les applications éligibles sont l’application Île-de-France Mobilités et les revendeurs officiels.
- Les règles de cohabitation s’appliquent.

### Impacts UX

- Ne pas présenter le téléphone comme simple “copie” du pass physique.
- Avant achat, demander : charger sur passe, iPhone ou Watch ?
- Afficher les règles de cohabitation et d’incompatibilité.
- Prévoir messages Apple Wallet / priorité de carte.

---

## 5.9 Téléphone Android / montre Android

### Règles clés

- Le service permet d’acheter des titres sur téléphone NFC compatible.
- Les titres peuvent être chargés dans un passe Navigo, un téléphone ou une montre connectée compatible.
- L’application Mes Tickets Navigo peut intervenir comme application complémentaire.
- Le stockage repose sur un élément sécurisé.
- Certaines fonctions nécessitent Île-de-France Mobilités Connect.

### Impacts UX

- Contrôle compatibilité Android avant tunnel de paiement.
- Étape d’installation expliquée.
- Gestion des cas : carte SIM NFC, application complémentaire, montre, téléphone réinitialisé.
- Parcours de récupération après changement / réinitialisation.

---

## 5.10 Tarification Solidarité Transport / TST

### Règles clés

- Comprend Solidarité Gratuité, Réduction Solidarité 75 %, Réduction 50 %.
- Gérée et délivrée par Comutitres sous l’appellation Agence Solidarité Transport.
- Le titulaire doit disposer d’un passe Navigo personnalisé à son nom, prénom et photo.
- Les passes Navigo Découverte, imagine R ou Annuel ne peuvent pas être utilisés pour accéder à la TST.
- Une personne ne peut détenir qu’un seul passe Navigo chargé d’un droit TST.
- Les conditions d’éligibilité dépendent de droits sociaux / organismes : RSA, CAF, France Travail, Assurance Maladie, MDPH, ONACVG, etc.
- Le droit peut être suspendu de plein droit en cas de fraude sur le réseau ou fraude dans le dossier.
- Les conditions s’imposent au demandeur principal et aux ayants-droit.

### Complément opérationnel — Guide TST septembre 2019

Le guide TST 2019 apporte des règles opérationnelles utiles au parcours, en complément des CGVU plus récentes.

- Le passe Navigo est indispensable pour utiliser la Tarification Solidarité Transport, quel que soit le titre choisi.
- Le droit TST doit être chargé sur le passe Navigo.
- La TST ne peut pas être chargée sur un passe Navigo Découverte, un passe Navigo Annuel ou un passe imagine R.
- Les tickets au voyage à demi-tarif doivent être présentés au contrôleur avec le passe Navigo.
- Les forfaits à tarif réduit peuvent être achetés en guichet, automate RATP / SNCF et chez les commerçants agréés.
- La TST est valable sur les mêmes réseaux que le forfait Navigo correspondant.
- En cas de perte ou vol, le passe Navigo et les forfaits peuvent être remplacés moyennant des frais, indiqués à 8 € dans le guide 2019. Ce montant doit être revérifié dans les CGVU / tarifs actuels avant implémentation.
- Les titres achetés pendant l’attente de traitement du dossier AST ou pendant l’attente de réception du passe Navigo ne sont jamais remboursés dans le guide 2019.
- Les droits peuvent être attribués pour des durées variables : gratuité de 1 à 3 mois selon statut et fin de droits sociaux ; réduction de 1 à 12 mois selon statut et fin de droits sociaux.
- Le renouvellement peut être automatique dans certains cas lorsque l’AST peut consulter les droits sociaux, ou nécessiter l’envoi de nouveaux justificatifs.

Implications produit spécifiques :

- distinguer “droit accordé” et “droit chargé sur support” ;
- afficher clairement les supports interdits ;
- ne pas promettre le remboursement des titres achetés en attendant le traitement ;
- indiquer que certains montants historiques, comme les frais de remplacement du guide 2019, doivent être validés avec les tarifs actuels ;
- prévoir un renouvellement TST dépendant de la source de droit et de la capacité de vérification automatique.

### Impacts UX

- Parcours d’éligibilité guidé : “de quel droit social disposez-vous ?”.
- Connexion API prioritaire avec organismes sociaux lorsque possible.
- Chargement du droit sur passe expliqué comme une étape distincte de l’accord du droit.
- Renouvellement TST à part : période propre, potentiellement 3 mois selon le brief.
- Communication proactive avant fin de droit.
- Scénario “fin de droit : retour au plein tarif ou confirmation d’un nouveau droit”.

### Impacts back-office

- File de contrôle justificatif social.
- Gestion ayants droit.
- Synchronisation droits / supports.
- Suspension pour fraude.
- Historique des décisions d’éligibilité.

### Règles produit à implémenter

```yaml
tst:
  products:
    - solidarite_gratuite
    - reduction_solidarite_75
    - reduction_50
  support:
    required: navigo_personnalise
    forbidden:
      - navigo_decouverte
      - navigo_imagine_r
      - navigo_annuel
  max_active_right_per_person: 1
  eligibility_sources:
    - caf
    - france_travail
    - assurance_maladie
    - mdph
    - onacvg
  fraud:
    suspend_right: true
  renewal:
    specific_cycle: true
    duration_depends_on_social_right: true
    may_be_automatic_if_rights_can_be_checked: true
  operational_rules_from_2019_guide:
    right_must_be_loaded_on_pass: true
    waiting_period_tickets_refunded: false
    replacement_fee_historical_eur: 8
    replacement_fee_to_revalidate_current_tariff: true
```

---

## 5.11 Forfait Améthyste

### Règles clés

- Créé par Île-de-France Mobilités, attribué par les départements d’Île-de-France.
- Géré par Comutitres au nom et pour le compte d’IDFM.
- Chargé sur un passe Navigo nominatif, personnel et non cessible.
- Le demandeur doit être muni d’un passe Navigo avec nom, prénom et photo.
- Le forfait doit être chargé sur le passe via téléphone ou guichet / automate.
- Les CGVU du passe Navigo s’appliquent pour validation, perte, vol, dysfonctionnement.

### Impacts UX

- Parcours par département attributeur.
- Ne pas promettre une éligibilité uniforme : les départements attribuent.
- Étape “mon département m’a accordé le droit” puis “je charge mon forfait”.
- Renvoyer vers règles passe Navigo pour perte / vol.

### Règles produit à implémenter

```yaml
amethyste:
  attributed_by: departement_idf
  managed_by: comutitres_for_idfm
  support: navigo_personnalise
  requires_photo: true
  loading_channels:
    - mobile_app
    - ticket_office
    - vending_machine
  loss_theft_rules: inherit_from_passe_navigo
```

---

## 6. Matrice d’impacts UX

| Situation | Risque actuel | Recommandation UX |
|---|---|---|
| Payeur différent du titulaire | Confusion sur qui signe / qui paie / qui reçoit les alertes | Séparer clairement “voyageur” et “payeur” avec invitations et statuts |
| Mineur | Paiement impossible ou mal orienté | Parcours parent / responsable légal automatique |
| Boursier sans justificatif final | Dossier bloqué, appels support | Statut provisoire + relances + explication tarif non boursier |
| Impayé | Blocage incompris | Page de régularisation avec montant, raison, canaux et délai de réactivation |
| Perte / vol | Usager ne sait pas si titres remboursés | Parcours guidé + frais + délais + absence de remboursement si applicable |
| Téléphone / montre | Confusion transfert pass / mobile | Choix explicite du support avant achat + avertissement transfert limité |
| TST | Complexité des droits sociaux | Assistant d’éligibilité + vérification API quand possible |
| Suspension / résiliation | Mélange des notions | Comparateur simple : suspendre = pause ; résilier = fin du contrat |
| Photo refusée | Allers-retours support | Contrôle qualité avant dépôt + raison de refus + exemples visuels |
| Cohabitation titres | Achat impossible ou mauvaise validation | Moteur de compatibilité et priorité affichée avant paiement |

---

## 7. Matrice d’impacts back-office

| Domaine back-office | Besoin |
|---|---|
| Dossiers | Vue unifiée titulaire / payeur / responsable légal / support / contrat |
| Justificatifs | Workflow dépôt, contrôle, refus, relance, validation |
| Fraude | File de contrôle renforcé, historique, motifs, preuves |
| Paiement | Suivi impayé, statut SEPA, relance, suspension, recouvrement |
| SAV | Perte, vol, détérioration, opposition, reconstitution, frais |
| Renouvellement | Anticipation automatique, relances, changement de profil |
| TST | Gestion des droits, ayants droit, source d’éligibilité, expiration |
| Mobile | Suivi appareil, élément sécurisé, erreurs d’installation, transfert impossible |
| RGPD | Finalités, consentements, durées de conservation, exercice des droits |
| Reporting | Volumes par produit, délais de traitement, motifs de rejet, pics saisonniers |

---

## 8. Moteurs de règles à prévoir

### 8.1 Moteur d’éligibilité produit

Entrées :

- âge ;
- date de naissance ;
- résidence ;
- statut scolaire / étudiant ;
- statut boursier ;
- droits sociaux ;
- handicap / invalidité ;
- situation de payeur ;
- support disponible ;
- dettes actives ;
- historique fraude / résiliation.

Sorties :

- produits éligibles ;
- produits non éligibles + motif ;
- justificatifs nécessaires ;
- parcours recommandé ;
- niveau de contrôle requis.

### 8.2 Moteur de compatibilité support / titre

Entrées :

- support physique ;
- téléphone ;
- montre ;
- titres déjà chargés ;
- contrat existant ;
- règles de cohabitation ;
- priorités de validation.

Sorties :

- compatible / incompatible ;
- support recommandé ;
- conflit ;
- action corrective.

### 8.3 Moteur impayés / recouvrement

Entrées :

- payeur ;
- contrats associés ;
- type produit ;
- date de rejet ;
- montant ;
- stade : notification, suspension, résiliation, recouvrement ;
- avis des sommes à payer.

Sorties :

- peut souscrire ?
- peut être payeur ?
- SAV autorisé ?
- régularisation requise ?
- délai de réactivation ?

### 8.4 Moteur de renouvellement

Entrées :

- produit ;
- date anniversaire ;
- âge futur ;
- changement de profil ;
- droit social arrivant à expiration ;
- justificatifs arrivant à expiration ;
- moyen de paiement valide.

Sorties :

- renouvellement automatique ;
- renouvellement à confirmer ;
- bascule produit proposée ;
- suspension proposée ;
- relance utilisateur ;
- tâche back-office.

---

## 9. Parcours prioritaires à concevoir

### 9.1 Parcours “Je trouve le meilleur titre”

1. Profil rapide : âge, statut, résidence, fréquence de voyage.
2. Détection des droits : étudiant, scolaire, senior, TST, bourse.
3. Proposition produit principale + alternatives.
4. Explication simple : prix, support, validité, justificatifs, paiement.
5. CTA souscription.

### 9.2 Parcours “Souscription mineur”

1. Création ou identification du titulaire mineur.
2. Ajout responsable légal.
3. Ajout payeur.
4. Justificatifs scolaires / bourse.
5. Photo.
6. Acceptation CGVU par le bon signataire.
7. Paiement par payeur autorisé.
8. Suivi dossier par le payeur.

### 9.3 Parcours “Régulariser un impayé”

1. Détection impayé dès connexion.
2. Message : produit concerné, montant, date, conséquences.
3. Bouton paiement immédiat.
4. Alternative téléphone / agence.
5. Confirmation de régularisation.
6. Délai de réactivation affiché.
7. Déblocage souscription / SAV si applicable.

### 9.4 Parcours “Je suis boursier mais je n’ai pas encore l’attestation”

1. Déclaration statut boursier.
2. Explication : justificatif nécessaire.
3. Choix : payer tarif non boursier provisoire / compléter plus tard selon règles validées.
4. Relances avant délai.
5. Dépôt notification définitive.
6. Recalcul tarif éventuel.

### 9.5 Parcours “Perte / vol / pass HS”

1. Choisir : perdu, volé, cassé, ne fonctionne plus.
2. Identifier support et contrats présents.
3. Afficher frais, délai, remboursement ou non.
4. Mise en opposition.
5. Mode de remplacement : courrier / agence.
6. Suivi du nouveau support.

### 9.6 Parcours “Pass mobile”

1. Test compatibilité appareil.
2. Choix support : pass physique, téléphone, montre.
3. Règles transfert / non-transfert.
4. Achat / chargement.
5. Test de lecture / installation.
6. Aide contextuelle changement téléphone.

---

## 10. Points sensibles à valider juridiquement

1. Quel est le minimum légal de données à collecter par produit ?
2. Peut-on supprimer totalement les civilités ?
3. Quelles preuves d’acceptation CGVU doivent être conservées, combien de temps et où ?
4. Quelles règles exactes pour la signature du titulaire mineur selon l’âge ?
5. Comment articuler titulaire, payeur et responsable légal dans les CGVU et dans l’interface ?
6. Quels motifs peuvent être affichés en cas de suspicion de fraude sans risque juridique ?
7. Quelles données de validation peuvent être affichées dans l’espace personnel ?
8. Quelle durée de conservation pour photo, pièce d’identité, justificatif bourse, droit social, IBAN ?
9. Quelles règles de décision automatique sont autorisées ou nécessitent intervention humaine ?
10. Quels recours / contact humain doivent être proposés après refus de justificatif ou blocage ?

---

## 11. Points sensibles à valider comptablement

1. Traitement des mois commencés dus.
2. Frais de dossier non remboursables.
3. Remboursement complet / partiel des forfaits Mois / Semaine.
4. Facturation différée Liberté+.
5. Frais de rejet bancaire.
6. Remboursements liés à changement de situation.
7. Passage d’un tarif réduit à plein tarif.
8. Dette transférée au Trésor Public.
9. Délai de 21 jours après paiement auprès du Trésor Public.
10. Impacts d’un changement de payeur en cours de prélèvement.

---

## 12. Opportunités API / automatisation

| Besoin | API ou source potentielle | Objectif |
|---|---|---|
| Adresse | API Adresse | Réduire fausses adresses et retours courrier |
| Scolarité | Éducation nationale / référentiel établissements | Vérifier établissement et statut scolaire |
| Bourse | Source éducation / département selon faisabilité | Limiter justificatifs tardifs et faux documents |
| Droits sociaux | CAF / Assurance Maladie / France Travail / MDPH selon habilitation | Vérifier TST / droits sociaux |
| Identité | Identité numérique / FranceConnect selon faisabilité | Fiabiliser identité et éviter usurpation |
| Paiement | PSP / SEPA / scoring incidents interne | Prévenir impayés et gérer relances |
| Support | SI billettique / contrats | Vérifier cohabitation et titres actifs |

---

## 13. Backlog produit recommandé

### Must-have

- Moteur d’éligibilité produit.
- Moteur compatibilité support / titre.
- Gestion titulaire / payeur / responsable légal.
- Acceptation CGVU versionnée.
- Dépôt et contrôle justificatifs.
- Parcours impayé.
- Parcours perte / vol / détérioration.
- Suivi statut dossier.
- Notifications proactives.
- Back-office de validation.

### Should-have

- Pré-remplissage adresse via API.
- Détection bourse / établissement.
- Assistant TST.
- Relances intelligentes avant pics saisonniers.
- Dashboard payeur multi-contrats.
- Passage automatique Junior → Scolaire → Étudiant → Annuel / Senior selon validation.

### Could-have

- IA d’aide au choix de titre avec refus possible.
- OCR justificatifs avec contrôle humain.
- Score de complétude dossier.
- Assistant multilingue visuel.
- Espace employeur / B2B.

---

## 14. Questions ouvertes / documents encore à récupérer

Les documents suivants doivent encore être récupérés et consolidés pour une analyse complète :

- Règles de cohabitation des titres et contrats.
- CGU Île-de-France Mobilités Connect.
- CGU application Île-de-France Mobilités.
- Conditions SAV payant.
- Conditions Passe Navigo Easy et Navigo Découverte.
- Conditions Ticket Métro-Train-RER / Bus-Tram / Aéroports.
- Documents internes Comutitres sur recouvrement, rejet bancaire, délais et statuts back-office.
- Règles précises de conservation documentaire.

---

## 15. Synthèse exécutable

Le parcours cible ne doit pas être un simple formulaire de souscription. Il doit devenir un moteur de décision orienté utilisateur :

1. identifier qui voyage, qui paie et qui est responsable ;
2. déterminer les titres éligibles ;
3. vérifier les droits et justificatifs ;
4. choisir le bon support ;
5. contrôler la compatibilité ;
6. faire accepter les CGVU correctes ;
7. sécuriser le paiement ;
8. gérer l’après-vente et les incidents ;
9. réduire les fraudes et les impayés ;
10. rendre le dossier simple à traiter côté back-office.

La priorité produit est donc la création d’un socle transverse : modèle titulaire/payeur/responsable légal + règles d’éligibilité + règles de support + règles de paiement + back-office de contrôle.
