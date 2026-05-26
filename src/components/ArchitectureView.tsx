import { TabNav } from './ui/TabNav'

interface ArchitectureViewProps {
  onBack: () => void
  onViewPrd: () => void
}

const TOOLS = [
  { num: '01', label: 'Damage Assessment', desc: 'Computer vision · Structured output' },
  { num: '02', label: 'Policy RAG & Coverage', desc: 'Coverage eligibility · Policy clauses' },
  { num: '03', label: 'Estimate Calculator', desc: 'Repair cost range' },
  { num: '04', label: 'Repair Shop & Claim ID', desc: 'Approved facilities · Claim number' },
]

const GUARDRAILS = [
  { label: 'Fraud Detection Agent', desc: 'Monitors claim for anomalies; flags to adjuster or denies outright' },
  { label: 'Task Scope Guardrail', desc: 'Ensures agent stays within the claims process and ignores unrelated queries' },
]

const EVALS = [
  'Latency — p50 / p95',
  'Hallucination Rate',
  'Tool Call Accuracy',
  'Structured Output Compliance',
  'Coverage Decision Audit Log',
]

function DownArrow() {
  return (
    <div className="flex flex-col items-center py-1">
      <div className="w-px h-5 bg-neutral-300" />
      <svg className="w-3 h-2 text-neutral-300 -mt-px" viewBox="0 0 12 8" fill="currentColor">
        <path d="M6 8L0 0h12z" />
      </svg>
    </div>
  )
}

function LayerTag({ text, color = 'text-neutral-400' }: { text: string; color?: string }) {
  return <p className={`text-xs font-mono uppercase tracking-widest mb-1 ${color}`}>{text}</p>
}

export function ArchitectureView({ onBack, onViewPrd }: ArchitectureViewProps) {
  return (
    <div className="h-full flex flex-col bg-white">
      <header className="shrink-0 border-b border-neutral-200 px-6 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-6 h-6 bg-violet-600 rounded-md flex items-center justify-center">
            <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <span className="text-neutral-900 font-medium text-sm tracking-tight">InsureCo</span>
        </div>
        <TabNav active="architecture" onDemo={onBack} onPrd={onViewPrd} onArchitecture={() => {}} />
      </header>

      <div className="flex-1 overflow-y-auto">
        <div className="max-w-2xl mx-auto px-8 py-10">

          <div className="mb-8">
            <h1 className="text-xl font-semibold text-neutral-900">Agent Architecture</h1>
            <p className="text-sm text-neutral-500 mt-1">Conceptual system design for a production claims processing agent.</p>
          </div>

          {/* Layer 1 — User Interface */}
          <div className="border border-violet-200 bg-violet-50/60 rounded-xl p-5">
            <LayerTag text="Layer 1 · User Interface" />
            <p className="text-base font-semibold text-neutral-900 mb-1">React · Vite · TypeScript</p>
            <div className="flex flex-wrap gap-2 mt-3">
              {['4-Step Claim Form', 'Chat Interface', 'Damage Review Panel', 'Coverage Sheet', 'Dashboard'].map(c => (
                <span key={c} className="text-xs bg-white border border-violet-200 text-violet-700 rounded-full px-3 py-1">{c}</span>
              ))}
            </div>
          </div>

          <DownArrow />

          {/* Layer 2 — Orchestrator + Guardrails side by side */}
          <div className="flex items-stretch gap-3">
            {/* Orchestrator */}
            <div className="flex-1 border-2 border-neutral-800 bg-neutral-900 rounded-xl p-5">
              <LayerTag text="Layer 2 · Orchestrator" color="text-neutral-500" />
              <p className="text-sm font-semibold text-neutral-100 mb-3 leading-snug">
                Routes intent · Manages phases · Coordinates HITL
              </p>
              <div className="flex flex-wrap gap-2">
                {['Intent Routing', 'Phase Transitions', 'Human-in-the-Loop', 'Tool Dispatch', 'Response Scoping'].map(c => (
                  <span key={c} className="text-xs bg-neutral-800 border border-neutral-700 text-neutral-300 rounded-full px-2.5 py-1">{c}</span>
                ))}
              </div>
            </div>

            {/* Bidirectional arrows */}
            <div className="flex flex-col items-center justify-center gap-1.5 px-1">
              <svg className="w-4 h-3 text-neutral-300" viewBox="0 0 16 12" fill="none" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M1 3h14M12 1l3 2-3 2" />
              </svg>
              <svg className="w-4 h-3 text-neutral-300" viewBox="0 0 16 12" fill="none" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 9H1M4 7l-3 2 3 2" />
              </svg>
            </div>

            {/* Guardrail Layer */}
            <div className="w-48 border border-amber-200 bg-amber-50/50 rounded-xl p-4">
              <LayerTag text="Guardrail Layer" color="text-amber-600" />
              <p className="text-sm font-semibold text-neutral-900 mb-3">Safety &amp; Scope</p>
              <ul className="space-y-3">
                {GUARDRAILS.map(g => (
                  <li key={g.label} className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0 mt-1.5" />
                    <div>
                      <p className="text-xs font-semibold text-neutral-800 leading-snug">{g.label}</p>
                      <p className="text-xs text-neutral-500 leading-snug mt-0.5">{g.desc}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <DownArrow />

          {/* Layer 3 — Tool Pipeline */}
          <div className="border border-neutral-200 bg-white rounded-xl p-5">
            <LayerTag text="Layer 3 · Tool Pipeline" />
            <p className="text-base font-semibold text-neutral-900 mb-4">
              Sequential execution · Structured output · Async generator
            </p>
            <div className="flex items-stretch gap-0">
              {TOOLS.map((t, i) => (
                <div key={t.num} className="flex items-center flex-1 min-w-0">
                  <div className="flex-1 border border-neutral-100 bg-neutral-50 rounded-lg px-3 py-3 min-w-0">
                    <p className="text-xs font-mono text-neutral-400 mb-1">{t.num}</p>
                    <p className="text-xs font-semibold text-neutral-800 leading-snug mb-1">{t.label}</p>
                    <p className="text-xs text-neutral-400 leading-snug">{t.desc}</p>
                  </div>
                  {i < TOOLS.length - 1 && (
                    <div className="flex items-center px-1.5 shrink-0">
                      <svg className="w-3 h-3 text-neutral-300" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2 6h8M7 3l3 3-3 3" />
                      </svg>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <DownArrow />

          {/* Layer 4 — Evals & Observability */}
          <div className="border border-emerald-200 bg-emerald-50/40 rounded-xl p-5">
            <LayerTag text="Layer 4 · Evals & Observability" color="text-emerald-600" />
            <p className="text-base font-semibold text-neutral-900 mb-4">Continuous measurement across all layers</p>
            <div className="flex flex-wrap gap-2">
              {EVALS.map(e => (
                <span key={e} className="flex items-center gap-1.5 text-xs text-neutral-700 bg-white border border-emerald-100 rounded-full px-3 py-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                  {e}
                </span>
              ))}
            </div>
          </div>

          {/* Data Flow Legend */}
          <div className="mt-8 pt-6 border-t border-neutral-100">
            <p className="text-xs text-neutral-400 mb-3 uppercase tracking-wider font-medium">Data flow</p>
            <div className="grid grid-cols-2 gap-x-6 gap-y-2">
              {[
                ['Claim form data', 'UI → Orchestrator'],
                ['Tool instructions', 'Orchestrator → Tools'],
                ['Risk signals', 'Tools → Guardrails'],
                ['Metrics & traces', 'All layers → Observability'],
              ].map(([label, flow]) => (
                <div key={label} className="flex items-center gap-1.5 text-xs text-neutral-500">
                  <span className="font-semibold text-neutral-700">{label}</span>
                  <span className="text-neutral-300">·</span>
                  <span className="font-mono text-neutral-400">{flow}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="h-8" />
        </div>
      </div>
    </div>
  )
}
