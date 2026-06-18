import { useState, type FormEvent } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { PublicAppFrame } from '../components/layout/PublicAppFrame'
import { authApi } from '../api/auth'
import { useAuth } from '../contexts/AuthContext'
import {
  consumePostAuthRedirect,
  homeForZone,
  loginForZone,
  type AuthZone,
} from '../auth/auth-zones'
import ls from './Login.module.css'
import styles from './Register.module.css'

interface RegisterProps {
  zone?: AuthZone
}

function resolveAfterAuth(zone: AuthZone, from: string | undefined): string {
  if (from && from.startsWith('/')) return from
  return homeForZone(zone)
}

function UserIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <circle cx="10" cy="7" r="3.5" stroke="currentColor" strokeWidth="1.5" />
      <path d="M3 17c0-3.3 3.1-6 7-6s7 2.7 7 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

function MailIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <rect x="2" y="5" width="16" height="11" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <path d="M2 7l8 5.5L18 7" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  )
}

function CalendarIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <rect x="2" y="4" width="16" height="13" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <path d="M6 2v3M14 2v3M2 8h16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

function LockIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <rect x="4" y="9" width="12" height="9" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <path d="M7 9V7a3 3 0 016 0v2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

function EyeIcon({ visible }: { visible: boolean }) {
  return visible ? (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <ellipse cx="10" cy="10" rx="7" ry="4.5" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="10" cy="10" r="2" fill="currentColor" />
    </svg>
  ) : (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path d="M3 3l14 14M8.5 8.7A2 2 0 0011.3 11.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M4.5 6C3 7.2 2 8.6 2 10c0 2.5 3.6 5.5 8 5.5 1.5 0 2.9-.4 4-1M16.5 13.5C17.9 12.3 18 11 18 10c0-2.5-3.6-5.5-8-5.5-.9 0-1.8.1-2.6.3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

export default function Register({ zone = 'mobility' }: RegisterProps) {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = (location.state as { from?: string } | null)?.from

  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [birthDate, setBirthDate] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    if (password !== confirm) {
      setError('Les mots de passe ne correspondent pas.')
      return
    }
    if (password.length < 8) {
      setError('Le mot de passe doit contenir au moins 8 caractères.')
      return
    }
    setLoading(true)
    try {
      const { accessToken } = await authApi.register({ firstName, lastName, birthDate, email, password })
      await login(accessToken)
      const target = consumePostAuthRedirect(resolveAfterAuth(zone, from))
      navigate(target, { replace: true })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <PublicAppFrame variant="white">
      <main className={ls.page}>
        {/* Logo IDFM */}
        <div className={ls.logoWrap}>
          <img
            // src="/images/idfm-mobilites-logo.png"
            // alt="Île-de-France Mobilités"
            src="/images/comutitres-logo.svg"
            alt="Comutitres"
            className={ls.logo}
          />
        </div>

        <div className={ls.card}>
          <h1 className={ls.title}>Créer un compte</h1>

          {error && (
            <div className={ls.error} role="alert">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className={ls.form} noValidate>

            {/* Prénom + Nom côte à côte */}
            <div className={styles.row}>
              <div className={ls.field}>
                <label htmlFor="firstName" className={ls.label}>Prénom</label>
                <div className={ls.inputWrap}>
                  <span className={ls.inputIcon}><UserIcon /></span>
                  <input
                    id="firstName"
                    required
                    className={ls.input}
                    placeholder="Jean"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                </div>
              </div>
              <div className={ls.field}>
                <label htmlFor="lastName" className={ls.label}>Nom</label>
                <div className={ls.inputWrap}>
                  <span className={ls.inputIcon}><UserIcon /></span>
                  <input
                    id="lastName"
                    required
                    className={ls.input}
                    placeholder="Dupont"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Date de naissance */}
            <div className={ls.field}>
              <label htmlFor="birthDate" className={ls.label}>Date de naissance</label>
              <div className={ls.inputWrap}>
                <span className={ls.inputIcon}><CalendarIcon /></span>
                <input
                  id="birthDate"
                  type="date"
                  required
                  className={ls.input}
                  value={birthDate}
                  onChange={(e) => setBirthDate(e.target.value)}
                />
              </div>
            </div>

            {/* Email */}
            <div className={ls.field}>
              <label htmlFor="email" className={ls.label}>Adresse e-mail</label>
              <div className={ls.inputWrap}>
                <span className={ls.inputIcon}><MailIcon /></span>
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  required
                  className={ls.input}
                  placeholder="exemple@email.fr"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            {/* Mot de passe */}
            <div className={ls.field}>
              <label htmlFor="password" className={ls.label}>Mot de passe</label>
              <div className={ls.inputWrap}>
                <span className={ls.inputIcon}><LockIcon /></span>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  required
                  minLength={8}
                  className={ls.input}
                  placeholder="8 caractères minimum"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  className={ls.eyeBtn}
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? 'Masquer' : 'Afficher'}
                >
                  <EyeIcon visible={showPassword} />
                </button>
              </div>
            </div>

            {/* Confirmer mot de passe */}
            <div className={ls.field}>
              <label htmlFor="confirm" className={ls.label}>Confirmer le mot de passe</label>
              <div className={ls.inputWrap}>
                <span className={ls.inputIcon}><LockIcon /></span>
                <input
                  id="confirm"
                  type={showConfirm ? 'text' : 'password'}
                  autoComplete="new-password"
                  required
                  className={ls.input}
                  placeholder="••••••••"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                />
                <button
                  type="button"
                  className={ls.eyeBtn}
                  onClick={() => setShowConfirm((v) => !v)}
                  aria-label={showConfirm ? 'Masquer' : 'Afficher'}
                >
                  <EyeIcon visible={showConfirm} />
                </button>
              </div>
            </div>

            <button type="submit" className={ls.btnPrimary} disabled={loading}>
              {loading && <span className={ls.spinner} aria-hidden="true" />}
              {loading ? 'Création…' : 'Créer mon compte'}
            </button>
          </form>

          {/* Déjà un compte */}
          <p className={ls.createRow}>
            <Link to={loginForZone(zone)} className={ls.createLink}>
              Déjà un compte ? Se connecter <span aria-hidden="true">›</span>
            </Link>
          </p>

          {/* CGU */}
          <p className={ls.legal}>
            En continuant vous acceptez les{' '}
            <a href="https://www.comutitres.fr/cgu" className={ls.legalLink} target="_blank" rel="noopener noreferrer">
              CGU
            </a>
          </p>
        </div>
      </main>
    </PublicAppFrame>
  )
}
