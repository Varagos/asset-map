type BadgeTone = 'ok' | 'warning' | 'critical' | 'neutral'

type BadgeProps = {
  children: string
  tone?: BadgeTone
}

const toneClasses: Record<BadgeTone, string> = {
  ok: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
  warning: 'bg-amber-50 text-amber-800 ring-amber-200',
  critical: 'bg-rose-50 text-rose-700 ring-rose-200',
  neutral: 'bg-surface-container text-on-surface-variant ring-outline-variant',
}

export function Badge({ children, tone = 'neutral' }: BadgeProps) {
  return (
    <span
      className={[
        'inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold capitalize ring-1 ring-inset',
        toneClasses[tone],
      ].join(' ')}
    >
      {children}
    </span>
  )
}
