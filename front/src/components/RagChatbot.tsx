import { useEffect, useMemo, useRef, useState } from 'react'
import ChatBot, { type Flow, type Settings } from 'react-chatbotify'
import {
  type LoadPhase,
  type MainToWorker,
  type WorkerToMain,
} from '../rag/protocol'
import './RagChatbot.css'

type Status = 'loading' | 'ready' | 'error'

type ProgressState = { phase: LoadPhase; percent: number; text: string }

/** Per-query handlers, keyed by the id we send to the worker, so async worker
 *  messages can be routed back to the awaiting flow function. */
type PendingQuery = {
  onToken: (delta: string) => void
  resolve: () => void
  reject: (error: Error) => void
}

const PHASE_LABELS: Record<LoadPhase, string> = {
  'vector-store': 'Base documentaire',
  embedder: "Modèle d'embedding",
  llm: 'Modèle de langage',
}

export function RagChatbot() {
  const workerRef = useRef<Worker | null>(null)
  const pendingRef = useRef<Map<string, PendingQuery>>(new Map())

  const [status, setStatus] = useState<Status>('loading')
  const [open, setOpen] = useState(false)
  const [progress, setProgress] = useState<ProgressState>({
    phase: 'vector-store',
    percent: 0,
    text: 'Initialisation…',
  })
  const [error, setError] = useState<string>('')

  // Create the worker once and drive the cold-start. Cleanup terminates it
  // (covers React StrictMode's mount/unmount/mount in dev).
  useEffect(() => {
    const pending = pendingRef.current
    const worker = new Worker(new URL('../rag/worker.ts', import.meta.url), {
      type: 'module',
    })
    workerRef.current = worker

    worker.onmessage = (event: MessageEvent<WorkerToMain>) => {
      const msg = event.data
      switch (msg.type) {
        case 'progress':
          setProgress({ phase: msg.phase, percent: msg.percent, text: msg.text })
          break
        case 'ready':
          setStatus('ready')
          break
        case 'token':
          pendingRef.current.get(msg.id)?.onToken(msg.delta)
          break
        case 'answer': {
          const pending = pendingRef.current.get(msg.id)
          pendingRef.current.delete(msg.id)
          pending?.resolve()
          break
        }
        case 'error': {
          if (msg.id) {
            const pending = pendingRef.current.get(msg.id)
            pendingRef.current.delete(msg.id)
            pending?.reject(new Error(msg.message))
          } else {
            setError(msg.message)
            setStatus('error')
          }
          break
        }
      }
    }

    worker.onerror = (e) => {
      setError(e.message || 'Erreur du worker')
      setStatus('error')
    }

    const initMsg: MainToWorker = { type: 'init' }
    worker.postMessage(initMsg)

    return () => {
      worker.terminate()
      workerRef.current = null
      pending.clear()
    }
  }, [])

  // Stable flow: streams the answer for each user question through the worker.
  const flow: Flow = useMemo(
    () => ({
      start: {
        message:
          "Bonjour ! Je suis l'assistant Comutitres. Posez-moi une question sur les titres de transport Île-de-France (forfaits, Navigo, imagine R, Solidarité Transport, SAV…).",
        path: 'loop',
      },
      loop: {
        message: async (params) => {
          const question = (params.userInput ?? '').trim()
          if (!question) return
          const worker = workerRef.current
          if (!worker) return

          const id =
            typeof crypto !== 'undefined' && 'randomUUID' in crypto
              ? crypto.randomUUID()
              : String(Date.now() + Math.random())

          let accumulated = ''
          await new Promise<void>((resolve, reject) => {
            pendingRef.current.set(id, {
              onToken: (delta) => {
                accumulated += delta
                void params.streamMessage(accumulated)
              },
              resolve: () => {
                void params.endStreamMessage('BOT')
                resolve()
              },
              reject,
            })
            const queryMsg: MainToWorker = { type: 'query', id, question }
            worker.postMessage(queryMsg)
          }).catch(async (err: Error) => {
            await params.injectMessage(
              `Désolé, une erreur est survenue : ${err.message}`,
            )
          })
        },
        path: 'loop',
      },
    }),
    [],
  )

  // Settings MUST be stable: any change to this prop makes react-chatbotify
  // re-initialize the flow (which would replay the greeting and reset the input
  // state). Input gating during the cold start is handled by the overlay below,
  // not by toggling chatInput.disabled.
  const settings: Settings = useMemo(
    () => ({
      general: { embedded: true, showFooter: false },
      header: { title: 'Assistant Comutitres' },
      tooltip: { mode: 'NEVER' },
      notification: { disabled: true },
      audio: { disabled: true },
      emoji: { disabled: true },
      fileAttachment: { disabled: true },
      chatHistory: { disabled: true },
      botBubble: { simulateStream: false },
      chatInput: {
        enabledPlaceholderText:
          'Posez votre question sur les titres de transport…',
      },
    }),
    [],
  )

  return (
    <>
      <button
        type="button"
        className="rag-fab"
        aria-label={open ? "Fermer l'assistant" : "Ouvrir l'assistant"}
        onClick={() => setOpen((v) => !v)}
      >
        {open ? '×' : '💬'}
        {status !== 'ready' && !open && <span className="rag-fab__dot" />}
      </button>

      {open && (
        <div className="rag-panel">
          <div className="rag-chatbot">
            <ChatBot flow={flow} settings={settings} />

            {status !== 'ready' && (
              <div className="rag-overlay" role="status" aria-live="polite">
                <div className="rag-overlay__card">
                  {status === 'error' ? (
                    <>
                      <p className="rag-overlay__title">Échec du chargement</p>
                      <p className="rag-overlay__text">{error}</p>
                      <p className="rag-overlay__hint">
                        Vérifiez que votre navigateur supporte WebGPU
                        (Chrome/Edge récents) puis rechargez la page.
                      </p>
                    </>
                  ) : (
                    <>
                      <p className="rag-overlay__title">
                        Préparation de l'assistant…
                      </p>
                      <div className="rag-progress">
                        <div
                          className="rag-progress__bar"
                          style={{ width: `${progress.percent}%` }}
                        />
                      </div>
                      <p className="rag-overlay__text">
                        {progress.percent}% — {PHASE_LABELS[progress.phase]}
                      </p>
                      <p className="rag-overlay__sub">{progress.text}</p>
                      <p className="rag-overlay__hint">
                        Le modèle s'exécute 100% localement (WebGPU). Le premier
                        chargement peut être long ; il est ensuite mis en cache.
                      </p>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}
