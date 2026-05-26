interface ArchitectureViewProps {
  onBack: () => void
  onViewPrd: () => void
}

const TOOLS = [
  { num: '01', label: 'Intent Classifier' },
  { num: '02', label: 'Damage Assessment' },
  { num: '03', label: 'Anti-fraud Reviewer' },
  { num: '04', label: 'Policy RAG & Coverage' },
  { num: '05', label: 'Estimate Calculator' },
  { num: '06', label: 'Repair Shop & Claim ID' },
]

const GUARDRAILS = [
  'Fraud Detection Agent',
  'Task Scope Guardrail',
  'Input Validation',
  'Response Schema Linting',
]

const EVALS = [
  'Latency — p50 / p95',
  'Hallucination Rate',
  'Tool Call Accuracy',
  'Structured Output Compliance',
  'Coverage Decision Audit Log',
]

function Connector() {
  return (
    <div className="flex flex-col items-center py-1">
      <div className="w-px h-5 bg-neutral-300" />
      <svg className="w-3 h-2 text-neutral-300 -mt-px" viewBox="0 0 12 8" fill="currentColor">
        <path d="M6 8L0 0h12z" />
      </svg>
    </div>
  )
}

function LayerLabel({ tag, label, sublabel }: { tag: string; label: string; sublabel?: string }) {
  return (
    <div className="mb-4">
      <p className="text-xs font-mono text-neutral-400 uppercase tracking-widest mb-0.5">{tag}</p>
      <p className="text-base font-semibold text-neutral-900">{label}</p>
      {sublabel && <p className="text-xs text-neutral-500 mt-0.5">{sublabel}</p>}
    </div>
  )
}

export function ArchitectureView({ onBack, onViewPrd }: ArchitectureViewProps) {
  return (
    <div className="h-full flex flex-col bg-white">
      <header className="shrink-0 border-b border-neutral-200 px-6 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 text-sm text-neutral-500 hover:text-neutral-900 transition-colors cursor-pointer"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            Demo
          </button>
          <div className="h-4 w-px bg-neutral-200" />
          <span className="text-sm font-medium text-neutral-900">Architecture</span>
        </div>
        <button
          onClick={onViewPrd}
          className="text-sm text-neutral-500 hover:text-violet-600 transition-colors cursor-pointer"
        >
          ← PRD
        </button>
      </header>

      <div className="flex-1 overflow-y-auto">
        <div className="max-w-2xl mx-auto px-8 py-10">

          <div className="mb-8">
            <h1 className="text-xl font-semibold text-neutral-900">Agent Architecture</h1>
            <p className="text-sm text-neutral-500 mt-1">Conceptual system design for a production claims processing agent.</p>
          </div>

          {/* Layer 1 — User Interface */}
          <div className="border border-violet-200 bg-violet-50/60 rounded-xl p-5">
            <LayerLabel tag="Layer 1" label="User Interface" sublabel="React · Vite · TypeScript" />
            <div className="flex flex-wrap gap-2">
              {['4-Step Claim Form', 'Chat Interface', 'Damage Review Panel', 'Coverage Sheet', 'Dashboard'].map(c => (
                <span key={c} className="text-xs bg-white border border-violet-200 text-violet-700 rounded-full px-3 py-1">{c}</span>
              ))}
            </div>
          </div>

          <Connector />

          {/* Layer 2 — Orchestrator */}
          <div className="border-2 border-neutral-800 bg-neutral-900 rounded-xl p-5">
            <LayerLabel tag="Layer 2" label="Orchestrator" sublabel="Routes intent · Manages phases · Coordinates HITL" />
            <div className="flex flex-wrap gap-2">
              {['Intent Routing', 'Phase Transitions', 'Human-in-the-Loop', 'Tool Dispatch', 'Response Scoping'].map(c => (
                <span key={c} className="text-xs bg-neutral-800 border border-neutral-700 text-neutral-300 rounded-full px-3 py-1">{c}</span>
              ))}
            </div>
          </div>

          <Connector />

          {/* Layer 3 — Tool Layer */}
          <div className="border border-neutral-200 bg-white rounded-xl p-5">
            <LayerLabel tag="Layer 3" label="Tool Layer" sublabel="Async generator pipeline · Sequential execution · Structured output" />
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {TOOLS.map(t => (
                <div key={t.num} className="flex items-center gap-2.5 border border-neutral-100 bg-neutral-50 rounded-lg px-3 py-2.5">
                  <span className="text-xs font-mono text-neutral-400 shrink-0">{t.num}</span>
                  <span className="text-xs font-medium text-neutral-700 leading-tight">{t.label}</span>
                </div>
              ))}
            </div>
          </div>

          <Connector />

          {/* Layer 4 — Split: Guardrails + Evals */}
          <div className="grid grid-cols-2 gap-4">
            <div className="border border-amber-200 bg-amber-50/50 rounded-xl p-4">
              <LayerLabel tag="Layer 4a" label="Guardrail Layer" />
              <ul className="space-y-2">
                {GUARDRAILS.map(g => (
                  <li key={g} className="flex items-center gap-2 text-xs text-neutral-600">
                    <div className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
                    {g}
                  </li>
                ))}
              </ul>
            </div>

            <div className="border border-emerald-200 bg-emerald-50/50 rounded-xl p-4">
              <LayerLabel tag="Layer 4b" label="Evals + Observability" />
              <ul className="space-y-2">
                {EVALS.map(e => (
                  <li key={e} className="flex items-center gap-2 text-xs text-neutral-600">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                    {e}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Legend */}
          <div className="mt-8 pt-6 border-t border-neutral-100">
            <p className="text-xs text-neutral-400 mb-3 uppercase tracking-wider font-medium">Data flow</p>
            <div className="flex flex-wrap gap-x-6 gap-y-2">
              {[
                ['Claim form data', 'UI → Orchestrator'],
                ['Tool instructions', 'Orchestrator → Tools'],
                ['Risk signals', 'Tools → Guardrails'],
                ['Metrics & traces', 'All layers → Observability'],
              ].map(([label, flow]) => (
                <div key={label} className="flex items-center gap-1.5 text-xs text-neutral-500">
                  <span className="font-medium text-neutral-700">{label}</span>
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
