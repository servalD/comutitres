import { createRoot } from 'react-dom/client'
import './styles/comutitres-tokens.css'
import './styles/global.css'
import './index.css'
import App from './App.tsx'

// NOTE: StrictMode is intentionally omitted. In dev it double-invokes mounts,
// and react-chatbotify persists its message store across that remount, which
// duplicated the assistant's greeting. This is a dev-only behavior change.
createRoot(document.getElementById('root')!).render(<App />)
