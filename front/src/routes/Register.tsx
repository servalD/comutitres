import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import MobileShell from '../components/MobileShell';
import { authApi } from '../api/auth';
import { useAuth } from '../contexts/AuthContext';
import ui from '../styles/comutitres-ui.module.css';

export default function Register() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    if (password !== confirm) { setError('Les mots de passe ne correspondent pas.'); return; }
    if (password.length < 8) { setError('Le mot de passe doit contenir au moins 8 caractères.'); return; }

    setLoading(true);
    try {
      const { accessToken } = await authApi.register({ firstName, lastName, email, password });
      await login(accessToken);
      navigate('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <MobileShell title="Créer un compte" subtitle="Rejoignez Comutitres" showNav={false}>
      <div className={ui.screenBody}>
        {error && <div className={ui.errorCard} role="alert">{error}</div>}

        <form onSubmit={handleSubmit} noValidate>
          <div className={ui.fieldRow}>
            <div className={ui.field}>
              <label htmlFor="firstName" className={ui.fieldLabel}>Prénom</label>
              <input id="firstName" required className={ui.input} value={firstName} onChange={(e) => setFirstName(e.target.value)} />
            </div>
            <div className={ui.field}>
              <label htmlFor="lastName" className={ui.fieldLabel}>Nom</label>
              <input id="lastName" required className={ui.input} value={lastName} onChange={(e) => setLastName(e.target.value)} />
            </div>
          </div>
          <div className={ui.field}>
            <label htmlFor="email" className={ui.fieldLabel}>E-mail</label>
            <input id="email" type="email" required className={ui.input} value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className={ui.field}>
            <label htmlFor="password" className={ui.fieldLabel}>Mot de passe (8 car. min.)</label>
            <input id="password" type="password" required minLength={8} className={ui.input} value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          <div className={ui.field}>
            <label htmlFor="confirm" className={ui.fieldLabel}>Confirmer</label>
            <input id="confirm" type="password" required className={ui.input} value={confirm} onChange={(e) => setConfirm(e.target.value)} />
          </div>
          <button type="submit" className={ui.btnPrimary} disabled={loading}>
            {loading ? 'Création…' : 'Créer mon compte →'}
          </button>
        </form>

        <Link to="/login" className={ui.humanLink}>
          Déjà un compte ? Se connecter
        </Link>
      </div>
    </MobileShell>
  );
}
