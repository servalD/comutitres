# Module RAG — Assistant Comutitres

Chatbot de support qui répond aux questions sur les titres de transport
Île-de-France à partir d'une documentation interne (RAG = *Retrieval-Augmented
Generation*). Tout le RAG tourne **côté backend** via l'API **Mistral** ; le front
n'est qu'une UI de chat.

---

## 1. Comment ça marche

```
Navigateur (front)                         Backend NestJS (ce module)
─────────────────                          ──────────────────────────
RagChatbot.tsx ──POST /api/rag/chat──▶ rag.controller.ts
  (react-chatbotify)   { question }         │
                                            ├─ rag.service.ts
chat-client.ts ◀──NDJSON (stream)──────────┤   1. embed la question  ─┐
  (lit le flux,                             │   2. similarité cosinus  │ Mistral API
   affiche en markdown)                     │      top-K (6 chunks)    │ (mistral.client.ts)
                                            │   3. construit le prompt │
                                            │   4. chat.stream ───────┘
                                            └─ vector-store.ts
                                                (chunks de data/*.json
                                                 embeddés 1× en mémoire)
```

### Étapes d'une requête
1. Le front envoie `POST /api/rag/chat` avec `{ question }` (route **publique**,
   utilisable même sans être connecté).
2. `RagService` :
   - embed la question via `mistral-embed` ;
   - calcule la **similarité cosinus** contre tous les chunks et garde les
     **`TOP_K = 6`** meilleurs (`rag.service.ts`) ;
   - construit un prompt système (« réponds uniquement à partir du CONTEXTE… »)
     avec les chunks retenus, puis appelle le modèle de chat en **streaming**.
3. La réponse est renvoyée en **NDJSON** (une ligne JSON par événement) :
   - `{"type":"token","delta":"…"}` au fil de la génération,
   - puis `{"type":"done","sources":[…]}`,
   - ou `{"type":"error","message":"…"}` en cas de souci.
4. Le front (`chat-client.ts`) parse ce flux et affiche la réponse en direct
   (rendu markdown, lecture vocale optionnelle).

### Le vector store
- Les chunks sont chargés depuis `data/*.json` et **embeddés une seule fois**,
  en mémoire, **au premier message** (lazy + mémoïsé — voir `vector-store.ts`).
- Rien n'est persisté : à chaque redémarrage du backend, les chunks sont
  ré-embeddés (1 appel batch `mistral-embed`, ~1–2 s).
- Les vecteurs sont normalisés (L2) → la recherche est un simple produit scalaire.

### Fichiers du module
| Fichier | Rôle |
|---|---|
| `presentation/rag.controller.ts` | Route `POST /api/rag/chat`, stream NDJSON |
| `application/rag.service.ts` | Orchestration : embed → retrieve → prompt → stream (`TOP_K`, prompt système) |
| `infrastructure/mistral.client.ts` | Wrapper SDK Mistral (`embed`, `streamChat`) |
| `infrastructure/vector-store.ts` | Chargement + embedding + recherche cosinus |
| `domain/rag.types.ts` | Types (`Chunk`, `Source`, événements de stream) |
| `data/*.json` | **Les chunks de documentation** (voir §3) |

Côté front : `front/src/components/RagChatbot.tsx` (UI react-chatbotify, markdown,
audio/voix) et `front/src/rag/chat-client.ts` (appel + parsing du flux NDJSON).

---

## 2. Configuration (variables d'environnement)

| Variable | Défaut | Description |
|---|---|---|
| `MISTRAL_API_KEY` | _(vide)_ | **Requise** pour que l'assistant réponde. Peut être injectée via `MISTRAL_API_KEY_FILE` (secret Docker/Swarm). |
| `MISTRAL_CHAT_MODEL` | `ministral-3b-2512` | Modèle de génération. |
| `MISTRAL_EMBED_MODEL` | `mistral-embed` | Modèle d'embedding (build + requête). |

Sans clé, l'endpoint renvoie une erreur claire (`type:"error"`) au lieu de planter.
En dev : renseigner ces variables dans `.env.dev`.

---

## 3. Mettre à jour les chunks

Les chunks vivent dans **`back/src/modules/rag/data/*.json`**. Chaque fichier est
un **tableau JSON** d'objets de cette forme :

```json
{
  "id": "faq-007",
  "source": "faq_idfm_questions_reponses.md",
  "title": "Forfait imagine R — offres, tarifs, éligibilité",
  "section": "Forfait imagine R (offres)",
  "content": "Q : Qu'est-ce que le forfait imagine R ? R : ..."
}
```

| Champ | Obligatoire | Notes |
|---|---|---|
| `id` | ✅ | **Unique** sur l'ensemble des fichiers. |
| `content` | ✅ | Texte embeddé **et** injecté comme contexte au modèle. C'est le cœur du chunk. |
| `title` | recommandé | Préfixé au `content` lors de l'embedding (améliore la recherche) et affiché dans les sources. |
| `source` | recommandé | Fichier d'origine (traçabilité). |
| `section` | optionnel | Sous-section, pour s'y retrouver. |

### Procédure
1. **Éditer / ajouter / supprimer** des objets dans les fichiers de `data/`
   (ou créer un nouveau `mon-sujet.json` contenant un tableau de chunks).
2. Respecter le schéma ci-dessus (`id` unique, `content` non vide).
3. **Taille recommandée** : ~500 à ~1000 tokens par chunk (≈ 2000–4000 caractères).
   Des chunks trop gros diluent la pertinence ; trop petits perdent le contexte.
4. **Appliquer** : il faut redémarrer le backend pour que les nouveaux chunks
   soient rechargés et ré-embeddés.
   - Dev : `pnpm start:dev` (le watch redémarre ; `nest-cli.json` recopie les
     `.json` dans `dist/` grâce à `watchAssets`).
   - Build/prod : `pnpm build` puis relancer ; les `.json` sont copiés dans
     `dist/modules/rag/data/` (déclaré dans `nest-cli.json` → `compilerOptions.assets`).
5. Le ré-embedding se fait automatiquement **à la première question** après le
   redémarrage (lazy). Pas de script à lancer.

> ⚠️ Le `MISTRAL_EMBED_MODEL` utilisé ici **doit** rester le même entre
> l'embedding des chunks et l'embedding des questions (c'est déjà le cas, les deux
> passent par `mistral.client.ts`). Changer de modèle d'embedding invalide la
> cohérence des vecteurs — il suffit alors de redémarrer pour tout ré-embedder.

### Vérifier
```bash
# Backend lancé avec une clé Mistral valide :
curl -N -X POST http://localhost:3000/api/rag/chat \
  -H 'Content-Type: application/json' \
  -d '{"question":"Puis-je prêter mon passe Navigo ?"}'
# → lignes {"type":"token",...} puis {"type":"done","sources":[...]}
```
Le tableau `sources` du dernier événement indique quels chunks ont été utilisés —
pratique pour vérifier que tes nouveaux chunks sont bien retrouvés.

---

## 4. Réglages utiles

- **Nombre de chunks injectés** : constante `TOP_K` dans `rag.service.ts`.
- **Ton / consignes de réponse** : prompt système dans `rag.service.ts`
  (`buildMessages`).
- **Modèles** : via les variables d'environnement (§2).
