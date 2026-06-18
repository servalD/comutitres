import type { ReactNode } from 'react'
import styles from './Badge.module.css'

type BadgeVariant = 'pending' | 'neutral' | 'success'

interface BadgeProps {
  children: ReactNode
  variant?: BadgeVariant
  icon?: ReactNode
}

export function Badge({ children, variant = 'neutral', icon }: BadgeProps) {
  return (
    <span className={[styles.badge, styles[variant]].filter(Boolean).join(' ')}>
      {icon}
      {children}
    </span>
  )
}
