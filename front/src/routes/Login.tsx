import { useState, type FormEvent } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { PublicAppFrame } from '../components/layout/PublicAppFrame'
import { authApi } from '../api/auth'
import { useAuth } from '../contexts/AuthContext'
import {
  consumePostAuthRedirect,
  homeForZone,
  registerForZone,
  rememberPostAuthRedirect,
  type AuthZone,
} from '../auth/auth-zones'
import styles from './PublicPages.module.css'

interface LoginProps {
  zone?: AuthZone
}

function resolveAfterAuth(zone: AuthZone, from: string | undefined): string {
  if (from && from.startsWith('/')) {
    return from
  }
  return homeForZone(zone)
}

export default function Login({ zone = 'mobility' }: LoginProps) {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = (location.state as { from?: string } | null)?.from

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function afterLogin(accessToken: string) {
    await login(accessToken)
    const target = consumePostAuthRedirect(resolveAfterAuth(zone, from))
    navigate(target, { replace: true })
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      const { accessToken } = await authApi.login({ email, password })
      await afterLogin(accessToken)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue.')
    } finally {
      setLoading(false)
    }
  }

  async function handleFranceConnect() {
    setError(null)
    rememberPostAuthRedirect(resolveAfterAuth(zone, from))
    setLoading(true)
    try {
      if (import.meta.env.VITE_MOCK_AUTH === 'true') {
        const { accessToken } = await authApi.loginWithFranceConnect()
        await afterLogin(accessToken)
        return
      }
      window.location.href = `${import.meta.env.VITE_API_URL ?? 'http://localhost:3000/api'}/auth/franceconnect/login`
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue.')
      setLoading(false)
    }
  }

  return (
    <PublicAppFrame variant="white">
      <main className={styles.pageLogin}>
        <div className={styles.loginCard}>
        <h1 className={styles.loginTitle}>Connexion</h1>

        {error && (
          <div className={styles.error} role="alert">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className={styles.form} noValidate>
          <div className={styles.field}>
            <label htmlFor="email" className={styles.label}>
              Adresse e-mail
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              required
              className={styles.input}
              placeholder="vous@exemple.fr"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className={styles.field}>
            <label htmlFor="password" className={styles.label}>
              Mot de passe
            </label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              required
              className={styles.input}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button type="submit" className={styles.btnPrimary} disabled={loading}>
            {loading && <span className={styles.spinner} aria-hidden="true" />}
            {loading ? 'Connexion…' : 'Se connecter'}
          </button>
        </form>

        <div className={styles.divider}>ou</div>

        <button
          type="button"
          className={styles.btnFranceConnect}
          onClick={handleFranceConnect}
          disabled={loading}
        >
          <img
            src="/franceconnect-logo.svg"
            alt=""
            className={styles.fcLogo}
            aria-hidden="true"
          />
          S&apos;identifier avec FranceConnect
        </button>

        <p className={styles.footer}>
          Pas encore de compte ?{' '}
          <Link to={registerForZone(zone)} className={styles.link}>
            Créer un compte
          </Link>
        </p>

        <p className={styles.legal}>
          En vous connectant, vous acceptez les conditions générales d&apos;utilisation.
        </p>
        </div>
      </main>
    </PublicAppFrame>
  )
}
