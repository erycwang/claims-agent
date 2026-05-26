import { useState } from 'react'
import type { DamageItem } from '../types/claims'
import { Button } from './ui/Button'

interface DamageReviewCardProps {
  items: DamageItem[]
  onConfirm: (confirmed: DamageItem[]) => void
}

const SEVERITIES: DamageItem['severity'][] = ['minor', 'moderate', 'severe']

const severityStyle = {
  minor: 'text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-400/10',
  moderate: 'text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-400/10',
  severe: 'text-red-700 dark:text-red-400 bg-red-50 dark:bg-red-400/10',
}

export function DamageReviewCard({ items: initial, onConfirm }: DamageReviewCardProps) {
  const [items, setItems] = useState<DamageItem[]>(initial)
  const [newArea, setNewArea] = useState('')
  const [newSeverity, setNewSeverity] = useState<DamageItem['severity']>('minor')

  const updateSeverity = (id: string, severity: DamageItem['severity']) => {
    setItems(prev => prev.map(i => i.id === id ? { ...i, severity } : i))
  }

  const remove = (id: string) => setItems(prev => prev.filter(i => i.id !== id))

  const addItem = () => {
    if (!newArea.trim()) return
    setItems(prev => [...prev, { id: `custom-${Date.now()}`, area: newArea.trim(), severity: newSeverity }])
    setNewArea('')
  }

  return (
    <div className="bg-white dark:bg-neutral-900 border border-violet-200 dark:border-violet-500/30 rounded-xl p-5 space-y-4">
      <div>
        <p className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 mb-0.5">Review Damage Assessment</p>
        <p className="text-xs text-neutral-500">
          Edit severities, remove incorrect items, or add anything missing before confirming.
        </p>
      </div>

      <ul className="space-y-1.5">
        {items.map(item => (
          <li key={item.id} className="flex items-center gap-3 bg-neutral-50 dark:bg-neutral-800/60 rounded-lg px-3 py-2">
            <span className="flex-1 text-sm text-neutral-800 dark:text-neutral-200">{item.area}</span>
            <select
              value={item.severity}
              onChange={e => updateSeverity(item.id, e.target.value as DamageItem['severity'])}
              className={`text-xs rounded-md px-2 py-1 cursor-pointer focus:outline-none border-0 ${severityStyle[item.severity]}`}
            >
              {SEVERITIES.map(s => <option key={s} value={s} className="bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-200">{s}</option>)}
            </select>
            <button
              type="button"
              onClick={() => remove(item.id)}
              className="text-neutral-300 dark:text-neutral-600 hover:text-red-500 transition-colors cursor-pointer"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </li>
        ))}
      </ul>

      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Add a damage area…"
          value={newArea}
          onChange={e => setNewArea(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && addItem()}
          className="flex-1 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg px-3 py-2 text-sm text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 dark:placeholder-neutral-600 focus:outline-none focus:border-violet-500"
        />
        <select
          value={newSeverity}
          onChange={e => setNewSeverity(e.target.value as DamageItem['severity'])}
          className="bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg px-2 py-2 text-sm text-neutral-700 dark:text-neutral-300 focus:outline-none cursor-pointer"
        >
          {SEVERITIES.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        <Button variant="secondary" size="sm" onClick={addItem}>Add</Button>
      </div>

      <Button onClick={() => onConfirm(items)} className="w-full">
        Confirm Assessment ({items.length} item{items.length !== 1 ? 's' : ''})
      </Button>
    </div>
  )
}
