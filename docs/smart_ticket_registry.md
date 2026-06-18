# SmartTicketRegistry - registre minimal de validite droit/support
*Last updated: 2026-06-18*

Ce document cadre le smart contract de demonstration `SmartTicketRegistry`, situe dans `chain/`.

L'objectif n'est pas de mettre toute la billettique on-chain. Le registre prouve uniquement qu'un droit de transport pseudonymise est actif et qu'il est presente sur un support autorise par le SI Comutitres.

## Principe produit

Le multi-support ameliore l'experience utilisateur, mais il introduit un risque simple : un meme droit pourrait etre presente sur plusieurs supports dans des contextes incoherents.

Le smart contract ne detecte pas la fraude, ne sanctionne pas automatiquement, ne gere pas les paiements, ne stocke pas d'identite civile et ne remplace pas le back-office. Il expose une preuve minimale :

- `rightId` : identifiant pseudonymise du droit de transport utilisable.
- `holderCommitment` : engagement pseudonymise du porteur, secondaire et non derive directement d'une identite civile.
- `supportCommitment` : engagement pseudonymise du support autorise, carte, telephone ou montre.
- `RightStatus` : `ACTIVE`, `SUSPENDED`, `EXPIRED`, `REVOKED`.
- `SupportStatus` : `UNKNOWN`, `AUTHORIZED`, `REVOKED`.

Les engagements sont publics sur la blockchain. Ils doivent donc etre generes cote back-office avec des secrets non exposes et ne doivent jamais correspondre a des donnees brutes, comme un numero de support, un NIR, un email, un nom ou un identifiant client interne.

## Frontiere on-chain / off-chain

Le contrat verifie uniquement :

- le droit existe ;
- le droit est `ACTIVE` ;
- la date `validUntil` n'est pas depassee ;
- le support presente est `AUTHORIZED` pour ce droit.

`EXPIRED` peut etre publie comme statut persistant par le registrar, mais l'expiration est aussi traitee comme un etat derive : `isValid` retourne faux des que `validUntil` est depasse, meme si le statut stocke reste `ACTIVE`.

Le SI et le back-office gardent hors chaine :

- les donnees personnelles ;
- les raisons detaillees de suspension ou revocation ;
- les regles de compatibilite titre/support ;
- les limites de supports actifs par produit ;
- les impayes, litiges, suspicions de fraude et arbitrages humains ;
- les files SAV et anomalies.

Une incoherence doit creer un dossier ou une file back-office. Elle ne doit pas produire une sanction automatique.

## API du contrat

Le role `REGISTRAR_ROLE` represente l'adaptateur back-office autorise a publier les changements d'etat.

- `registerRight(rightId, holderCommitment, validUntil)` : cree un droit actif.
- `updateRightStatus(rightId, newStatus)` : suspend, expire ou revoque un droit.
- `authorizeSupport(rightId, supportCommitment)` : autorise un support encore inconnu.
- `revokeSupport(rightId, supportCommitment)` : revoque un support autorise.
- `replaceSupport(rightId, oldSupportCommitment, newSupportCommitment)` : revoque l'ancien support et autorise le nouveau dans une meme transaction.
- `matchesHolder(rightId, holderCommitment)` : verifie une correspondance d'engagement porteur, sans verifier l'identite civile.
- `isValid(rightId)` : verifie que le droit est actif et temporellement valide.
- `isValidForSupport(rightId, supportCommitment)` : verifie que le droit est valide pour ce support.

Un support deja connu, y compris revoque, ne peut pas etre reautorise dans la phase 1. Cela garde la trace lisible et evite de masquer un cycle de remplacement ou d'opposition.

## Demonstration hackathon

Le scenario recommande est volontairement court :

1. Le back-office cree un droit actif.
2. Le back-office autorise un support physique.
3. L'utilisateur change de support vers un telephone.
4. `replaceSupport` revoque l'ancien support et autorise le nouveau.
5. `isValidForSupport` retourne faux pour l'ancien support et vrai pour le nouveau.

Ce scenario montre la separation entre contrat administratif, droit de transport et support, tout en gardant les donnees sensibles et les decisions metier dans le SI.

## Commandes

Depuis `chain/` :

```bash
forge install --no-git foundry-rs/forge-std OpenZeppelin/openzeppelin-contracts
forge test
forge script script/Deploy.s.sol --rpc-url <RPC_URL> --broadcast
```

Variables optionnelles pour le script :

- `REGISTRY_ADMIN`
- `REGISTRY_REGISTRAR`
