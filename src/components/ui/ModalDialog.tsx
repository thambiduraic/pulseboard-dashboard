import { useEffect, useRef, type ReactNode } from 'react'

export function ModalDialog({ titleId, onClose, children }: { titleId: string; onClose: () => void; children: ReactNode }) {
  const dialogRef = useRef<HTMLElement>(null)
  const closeRef = useRef(onClose)

  useEffect(() => {
    closeRef.current = onClose
  }, [onClose])

  useEffect(() => {
    const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null
    const dialog = dialogRef.current
    const focusableElements = () => Array.from(dialog?.querySelectorAll<HTMLElement>('button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])') ?? [])
    ;(focusableElements()[0] ?? dialog)?.focus()

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        event.preventDefault()
        closeRef.current()
        return
      }
      if (event.key !== 'Tab') return
      const items = focusableElements()
      if (items.length === 0) {
        event.preventDefault()
        dialog?.focus()
      } else if (event.shiftKey && document.activeElement === items[0]) {
        event.preventDefault()
        items[items.length - 1].focus()
      } else if (!event.shiftKey && document.activeElement === items[items.length - 1]) {
        event.preventDefault()
        items[0].focus()
      }
    }

    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      previousFocus?.focus()
    }
  }, [])

  return (
    <div className="dialog-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) closeRef.current() }}>
      <section ref={dialogRef} className="detail-dialog" role="dialog" aria-modal="true" aria-labelledby={titleId} tabIndex={-1}>
        {children}
      </section>
    </div>
  )
}
