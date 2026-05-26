import type { ReactNode } from 'react'

interface BadgeProps {
  variant?: 'success' | 'warning' | 'info' | 'error' | 'neutral'
  children: ReactNode
  className?: string
}

const variants = {
  success: 'text-emerald-700 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-400/10',
  warning: 'text-amber-700 bg-amber-50 dark:text-amber-400 dark:bg-amber-400/10',
  info: 'text-violet-700 bg-violet-50 dark:text-violet-400 dark:bg-violet-400/10',
  error: 'text-red-700 bg-red-50 dark:text-red-400 dark:bg-red-400/10',
  neutral: 'text-neutral-600 bg-neutral-100 dark:text-neutral-400 dark:bg-neutral-800',
}

export function Badge({ variant = 'neutral', children, className = '' }: BadgeProps) {
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${variants[variant]} ${className}`}>
      {children}
    </span>
  )
}
