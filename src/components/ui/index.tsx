
import { useEffect, useRef, useState, type KeyboardEvent as ReactKeyboardEvent, type ReactNode } from 'react'
import { ArrowDownRight, ArrowUpRight, Check, ChevronDown, Search, X } from 'lucide-react'
import { formatPercent } from '../../utils'

export function StatusBadge({ status }: { status: string }) {
  return <span className={`status-badge status-${status.replaceAll('_', '-')}`}>{status.replaceAll('_', ' ')}</span>
}

export function EmptyState({ title, message }: { title: string; message: string }) {
  return (
    <div className="empty-state">
      <span className="empty-icon"><Search size={18} /></span>
      <strong>{title}</strong>
      <p>{message}</p>
    </div>
  )
}

export function PageHeader({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow: string
  title: string
  description: string
  action?: ReactNode
}) {
  return (
    <div className="page-header">
      <div>
        <div className="eyebrow">{eyebrow}</div>
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
      {action && <div className="page-header-action">{action}</div>}
    </div>
  )
}

export function CardHeading({
  title,
  detail,
  action,
}: {
  title: string
  detail?: string
  action?: ReactNode
}) {
  return (
    <div className="card-heading">
      <div>
        <h2>{title}</h2>
        {detail && <p>{detail}</p>}
      </div>
      {action}
    </div>
  )
}

export function MetricCard({
  label,
  value,
  change,
  caption,
  icon,
}: {
  label: string
  value: string
  change?: number
  caption: string
  icon: ReactNode
}) {
  const positive = (change ?? 0) >= 0
  return (
    <article className="metric-card">
      <div className="metric-topline">
        <span>{label}</span>
        <span className="metric-icon">{icon}</span>
      </div>
      <div className="metric-value">{value}</div>
      <div className="metric-foot">
        {change !== undefined && <span className={`change-pill ${positive ? 'positive' : 'negative'}`}>
          {positive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
          {formatPercent(change)}
        </span>}
        <span>{caption}</span>
      </div>
    </article>
  )
}

export function TableSearch({
  value,
  onChange,
  placeholder,
}: {
  value: string
  onChange: (value: string) => void
  placeholder: string
}) {
  return (
    <label className="search-field">
      <Search size={16} aria-hidden="true" />
      <span className="sr-only">{placeholder}</span>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
      />
      {value && (
        <button type="button" className="icon-button clear-search" aria-label="Clear search" onClick={() => onChange('')}>
          <X size={14} />
        </button>
      )}
    </label>
  )
}

export function DropdownSelect({
  label,
  value,
  onChange,
  options,
  icon,
  className,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  options: readonly { value: string; label: string }[]
  icon?: ReactNode
  className?: string
}) {
  const [open, setOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const optionRefs = useRef<(HTMLButtonElement | null)[]>([])
  const selected = options.find((option) => option.value === value) ?? options[0]

  useEffect(() => {
    if (!open) return
    function closeOnOutsideClick(event: MouseEvent) {
      if (event.target instanceof Node && !menuRef.current?.contains(event.target)) setOpen(false)
    }
    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setOpen(false)
        triggerRef.current?.focus()
      }
    }
    document.addEventListener('mousedown', closeOnOutsideClick)
    document.addEventListener('keydown', closeOnEscape)
    optionRefs.current[options.findIndex((option) => option.value === value)]?.focus()
    return () => {
      document.removeEventListener('mousedown', closeOnOutsideClick)
      document.removeEventListener('keydown', closeOnEscape)
    }
  }, [open, value, options])

  function moveFocus(event: ReactKeyboardEvent<HTMLButtonElement>, currentIndex: number) {
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault()
      const direction = event.key === 'ArrowDown' ? 1 : -1
      const nextIndex = (currentIndex + direction + options.length) % options.length
      optionRefs.current[nextIndex]?.focus()
    } else if (event.key === 'Home') {
      event.preventDefault()
      optionRefs.current[0]?.focus()
    } else if (event.key === 'End') {
      event.preventDefault()
      optionRefs.current[options.length - 1]?.focus()
    }
  }

  return (
    <div className={`dropdown-select${className ? ` ${className}` : ''}`} ref={menuRef}>
      <button
        ref={triggerRef}
        className="dropdown-select-trigger"
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={label}
        onClick={() => setOpen((current) => !current)}
        onKeyDown={(event) => {
          if (event.key === 'ArrowDown' || event.key === 'Enter' || event.key === ' ') {
            event.preventDefault()
            setOpen(true)
          }
        }}
      >
        {icon}
        <span>{selected?.label}</span>
        <ChevronDown size={14} className={open ? 'dropdown-select-chevron open' : 'dropdown-select-chevron'} />
      </button>
      {open && (
        <div className="dropdown-select-popover" role="listbox" aria-label={`Choose ${label.toLowerCase()}`}>
          <div className="dropdown-select-heading">{label}</div>
          {options.map((option, index) => (
            <button
              key={option.value}
              ref={(element) => { optionRefs.current[index] = element }}
              type="button"
              role="option"
              aria-selected={option.value === value}
              className={`dropdown-select-option${option.value === value ? ' selected' : ''}`}
              onClick={() => {
                onChange(option.value)
                setOpen(false)
                triggerRef.current?.focus()
              }}
              onKeyDown={(event) => moveFocus(event, index)}
            >
              <span>{option.label}</span>
              {option.value === value && <Check size={15} />}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
