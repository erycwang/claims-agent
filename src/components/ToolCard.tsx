import type { ToolResult } from '../types/claims'

function renderOutput(text: string) {
  return text.split(/\*\*(.+?)\*\*/g).map((chunk, i) =>
    i % 2 === 1
      ? <strong key={i} className="text-neutral-800 dark:text-neutral-100 font-semibold">{chunk}</strong>
      : chunk
  )
}

export function ToolCard({ tool }: { tool: ToolResult }) {
  const isComplete = tool.status === 'complete'
  const isRunning = tool.status === 'running'

  return (
    <div className="flex gap-3">
      {/* Step indicator + connector line */}
      <div className="flex flex-col items-center shrink-0">
        <div className={`w-7 h-7 rounded-full flex items-center justify-center border transition-colors ${
          isComplete
            ? 'border-violet-500/40 bg-violet-50 dark:bg-violet-500/10 text-violet-600 dark:text-violet-400'
            : isRunning
            ? 'border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900'
            : 'border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900'
        }`}>
          {isComplete ? (
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          ) : isRunning ? (
            <span className="block w-3.5 h-3.5 border-2 border-neutral-300 dark:border-neutral-600 border-t-violet-500 rounded-full animate-spin" />
          ) : (
            <span className="text-xs font-medium text-neutral-400 dark:text-neutral-600">{tool.id}</span>
          )}
        </div>
        <div className="w-px flex-1 mt-1 bg-neutral-200 dark:bg-neutral-800" />
      </div>

      <div className="pb-5 min-w-0 flex-1">
        <div className="flex items-center gap-2 mb-0.5 pt-1">
          <span className={`text-sm font-medium transition-colors ${
            isComplete ? 'text-neutral-800 dark:text-neutral-200'
            : isRunning ? 'text-neutral-700 dark:text-neutral-300'
            : 'text-neutral-400 dark:text-neutral-600'
          }`}>
            {tool.name}
          </span>
          {isRunning && (
            <span className="text-xs text-violet-500 dark:text-violet-400">running</span>
          )}
        </div>
        <p className="text-xs text-neutral-400 dark:text-neutral-600 mb-2">{tool.description}</p>
        {tool.output && (
          <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed bg-neutral-50 dark:bg-neutral-900/60 border border-neutral-200 dark:border-neutral-800 rounded-lg px-3 py-2.5">
            {renderOutput(tool.output)}
          </p>
        )}
      </div>
    </div>
  )
}
