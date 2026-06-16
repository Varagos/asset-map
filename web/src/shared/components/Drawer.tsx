import type { ReactNode } from 'react'

type DrawerProps = {
  actions?: ReactNode
  children: ReactNode
  onClose: () => void
  open: boolean
  title: string
}

export function Drawer({
  actions,
  children,
  onClose,
  open,
  title,
}: DrawerProps) {
  if (!open) {
    return null
  }

  return (
    <aside className="w-full border-l border-outline-variant bg-surface-container-lowest lg:w-drawer-width">
      <header className="flex items-center justify-between border-b border-outline-variant px-5 py-4">
        <h2 className="font-headline-sm text-xl font-semibold text-on-surface">
          {title}
        </h2>
        <button
          aria-label="Close"
          className="rounded-default px-2 py-1 text-xl leading-none text-on-surface-variant hover:bg-surface-container"
          onClick={onClose}
          type="button"
        >
          x
        </button>
      </header>
      <div className="px-5 py-4">{children}</div>
      {actions ? (
        <footer className="flex gap-2 border-t border-outline-variant px-5 py-4">
          {actions}
        </footer>
      ) : null}
    </aside>
  )
}
