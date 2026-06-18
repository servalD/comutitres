import { Link } from 'react-router-dom'
import { useAuth } from '../../auth/use-auth'
import { Button } from '../ui/Button'
import styles from './Header.module.css'

export function Header() {
  const { isAuthenticated, clearToken } = useAuth()

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <Link to="/mobility" className={styles.brand}>
          <span className={styles.logo} aria-hidden="true">
            🚇
          </span>
          <span>
            <strong>Comutitres</strong>
            <small>Mobilité</small>
          </span>
        </Link>

        {isAuthenticated ? (
          <Button variant="ghost" onClick={clearToken}>
            Déconnexion
          </Button>
        ) : null}
      </div>
    </header>
  )
}
