import type { ReactNode } from 'react'

type DialogProps = {
  actions?: ReactNode
  children: ReactNode
  open: boolean
  title: string
}

export function Dialog({ actions, children, open, title }: DialogProps) {
  if (!open) {
    return null
  }

  return (
    <div className="fixed inset-0 z-[1000] grid place-items-center bg-primary/30 p-6">
      <section className="w-full max-w-xl rounded-md border border-outline-variant bg-surface-container-lowest shadow-lg">
        <header className="border-b border-outline-variant px-5 py-4">
          <h2 className="font-headline-sm text-xl font-semibold text-on-surface">
            {title}
          </h2>
        </header>
        <div className="max-h-[70vh] overflow-auto px-5 py-4">{children}</div>
        {actions ? (
          <footer className="flex justify-end gap-2 border-t border-outline-variant px-5 py-4">
            {actions}
          </footer>
        ) : null}
      </section>
    </div>
  )
}
