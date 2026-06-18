import styles from './Avatar.module.css'

interface AvatarProps {
  name: string
  size?: 'sm' | 'md' | 'lg'
  variant?: 'default' | 'child'
}

const COLORS = ['#64b5f6', '#1972d2', '#f39224', '#007d44', '#4f338b']

function getInitials(name: string) {
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
}

function getColor(name: string) {
  const index = name.charCodeAt(0) % COLORS.length
  return COLORS[index]
}

export function Avatar({ name, size = 'md', variant = 'default' }: AvatarProps) {
  return (
    <div
      className={[styles.avatar, styles[size], styles[variant]].join(' ')}
      style={{ backgroundColor: getColor(name) }}
      aria-hidden="true"
    >
      {variant === 'child' ? (
        <svg viewBox="0 0 24 24" className={styles.icon}>
          <circle cx="12" cy="8" r="4" fill="currentColor" />
          <path d="M4 20c0-4 3.6-6 8-6s8 2 8 6" fill="currentColor" />
        </svg>
      ) : (
        <span>{getInitials(name)}</span>
      )}
    </div>
  )
}
