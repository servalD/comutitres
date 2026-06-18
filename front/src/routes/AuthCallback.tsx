import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import MobileShell from '../components/MobileShell';
import { useAuth } from '../contexts/AuthContext';
import ui from '../styles/comutitres-ui.module.css';

export default function AuthCallback() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const handled = useRef(false);

  useEffect(() => {
    if (handled.current) return;
    handled.current = true;

    const hash = window.location.hash;
    const params = new URLSearchParams(hash.slice(1));
    const token = params.get('access_token');

    if (!token) {
      navigate('/login?error=callback_failed', { replace: true });
      return;
    }

    login(token)
      .then(() => navigate('/', { replace: true }))
      .catch(() => navigate('/login?error=callback_failed', { replace: true }));
  }, [login, navigate]);

  return (
    <MobileShell title="Connexion" subtitle="FranceConnect" showNav={false}>
      <div className={ui.screenBody} style={{ textAlign: 'center', paddingTop: 32 }}>
        <span className={ui.spinnerDark} style={{ width: 32, height: 32, margin: '0 auto 16px', display: 'block' }} />
        <p className={ui.hint}>Connexion en cours…</p>
      </div>
    </MobileShell>
  );
}
