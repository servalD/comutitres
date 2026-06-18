import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import MobileShell from '../components/MobileShell';
import { authApi } from '../api/auth';
import { useAuth } from '../contexts/AuthContext';
import ui from '../styles/comutitres-ui.module.css';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const { accessToken } = await authApi.login({ email, password });
      await login(accessToken);
      navigate('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue.');
    } finally {
      setLoading(false);
    }
  }

  async function handleFranceConnect() {
    setError(null);
    setLoading(true);
    try {
      const { accessToken } = await authApi.loginWithFranceConnect();
      await login(accessToken);
      navigate('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <MobileShell title="Bienvenue" subtitle="Gérez vos titres de transport" showNav={false}>
      <div className={ui.screenBody}>
        <p className={ui.sectionLabel}>Comment souhaitez-vous continuer ?</p>

        <button
          type="button"
          className={ui.btnFranceConnect}
          onClick={handleFranceConnect}
          disabled={loading}
        >
          Se connecter avec FranceConnect
        </button>

        <div className={ui.divider}>
          <div className={ui.dividerLine} />
          <span className={ui.dividerText}>ou</span>
          <div className={ui.dividerLine} />
        </div>

        {error && <div className={ui.errorCard} role="alert">{error}</div>}

        <form onSubmit={handleSubmit} noValidate>
          <div className={ui.field}>
            <label htmlFor="email" className={ui.fieldLabel}>Adresse e-mail</label>
            <input id="email" type="email" autoComplete="email" required className={ui.input} placeholder="vous@exemple.fr" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className={ui.field}>
            <label htmlFor="password" className={ui.fieldLabel}>Mot de passe</label>
            <input id="password" type="password" autoComplete="current-password" required className={ui.input} placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          <button type="submit" className={ui.btnPrimary} disabled={loading}>
            {loading && <span className={ui.spinner} aria-hidden="true" />}
            {loading ? 'Connexion…' : 'Se connecter →'}
          </button>
        </form>

        <div className={ui.iaCard}>
          <span className={ui.iaIcon} aria-hidden="true">🛡</span>
          <div>
            <p>FranceConnect pré-remplit votre identité et accélère la vérification de vos droits.</p>
            <small>Recommandé pour éviter les erreurs de saisie</small>
          </div>
        </div>

        <Link to="/register" className={ui.humanLink}>
          Pas encore de compte ? Créer un compte
        </Link>
      </div>
    </MobileShell>
  );
}
