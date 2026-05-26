import { useState } from 'react'

const SUGGESTED_PROMPTS = [
  "What's the status of my claim?",
  "I have additional damage to report",
  "What does this estimate cover?",
  "How do I contact support?",
]

interface ChatInputProps {
  onSend: (message: string) => void
  disabled?: boolean
}

export function ChatInput({ onSend, disabled }: ChatInputProps) {
  const [value, setValue] = useState('')

  const send = () => {
    const msg = value.trim()
    if (!msg) return
    onSend(msg)
    setValue('')
  }

  return (
    <div className="shrink-0 bg-neutral-50 dark:bg-neutral-950 px-4 pt-3 pb-4">
      <div className="max-w-xl mx-auto bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl shadow-sm p-3 space-y-2.5">
        <div className="flex flex-wrap gap-1.5">
          {SUGGESTED_PROMPTS.map(p => (
            <button
              key={p}
              type="button"
              disabled={disabled}
              onClick={() => onSend(p)}
              className="text-xs text-neutral-500 dark:text-neutral-400 bg-neutral-50 dark:bg-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-700 border border-neutral-200 dark:border-neutral-700 rounded-full px-2.5 py-1 transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {p}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Ask about your claim…"
            value={value}
            disabled={disabled}
            onChange={e => setValue(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && !disabled && send()}
            className="flex-1 bg-neutral-50 dark:bg-neutral-800/50 rounded-lg px-3 py-2 text-sm text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 dark:placeholder-neutral-600 focus:outline-none disabled:opacity-40 border-0"
          />
          <button
            type="button"
            disabled={disabled || !value.trim()}
            onClick={send}
            className="bg-violet-600 hover:bg-violet-500 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-lg px-3 transition-colors cursor-pointer"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}
