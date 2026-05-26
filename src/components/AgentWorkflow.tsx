import { useEffect, useRef, useState } from 'react'
import type { ChatMessage, ClaimFormData, ClaimOutcome, CompletedClaim, DamageItem, ToolResult } from '../types/claims'
import {
  SCRIPTED_RESPONSES,
  buildOutcome,
  runAgentPipeline,
  runAgentPipelinePart2,
} from '../mock/agentOrchestrator'
import { MOCK_REPAIR_SHOPS } from '../mock/repairShops'
import { ToolCard } from './ToolCard'
import { DamageReviewCard } from './DamageReviewCard'
import { ChatInput } from './ChatInput'
import { Badge } from './ui/Badge'

interface AgentWorkflowProps {
  formData: ClaimFormData
  demoOutcome: 'approved' | 'pending'
  vehicle: string
  onHome: () => void
  onClaimComplete: (claim: CompletedClaim) => void
}

type Phase = 'tools-part1' | 'damage-review' | 'tools-part2' | 'adjuster-wait' | 'done'

const delay = (ms: number) => new Promise(res => setTimeout(res, ms))

const DISPLAY_NAMES: Record<number, string> = {
  1: 'Processing your claim',
}
function remapName(tool: ToolResult): ToolResult {
  return DISPLAY_NAMES[tool.id] ? { ...tool, name: DISPLAY_NAMES[tool.id] } : tool
}

function StarRating({ rating }: { rating: number }) {
  return (
    <span className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map(i => (
        <svg key={i} className={`w-3 h-3 ${i <= Math.round(rating) ? 'text-amber-400' : 'text-neutral-300 dark:text-neutral-700'}`} fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
      <span className="ml-1 text-xs text-neutral-500 dark:text-neutral-400">{rating}</span>
    </span>
  )
}

export function AgentWorkflow({ formData, demoOutcome, vehicle, onHome, onClaimComplete }: AgentWorkflowProps) {
  const [tools, setTools] = useState<ToolResult[]>([])
  const [phase, setPhase] = useState<Phase>('tools-part1')
  const [damageItems, setDamageItems] = useState<DamageItem[]>([])
  const [confirmedItems, setConfirmedItems] = useState<DamageItem[]>([])
  const [outcome, setOutcome] = useState<ClaimOutcome | null>(null)
  const [chat, setChat] = useState<ChatMessage[]>([])
  const [adjusterProgress, setAdjusterProgress] = useState(0)
  const [showAllShops, setShowAllShops] = useState(false)
  const feedRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    setTimeout(() => feedRef.current?.scrollTo({ top: feedRef.current.scrollHeight, behavior: 'smooth' }), 50)
  }

  useEffect(() => {
    let cancelled = false
    async function run() {
      for await (const tool of runAgentPipeline(formData, demoOutcome)) {
        if (cancelled) return
        const mapped = remapName(tool)
        setTools(prev => {
          const idx = prev.findIndex(t => t.id === mapped.id)
          if (idx >= 0) { const n = [...prev]; n[idx] = mapped; return n }
          return [...prev, mapped]
        })
        scrollToBottom()
        if (tool.pauseForReview && tool.damageItems) {
          setDamageItems(tool.damageItems)
          setPhase('damage-review')
          return
        }
      }
    }
    run()
    return () => { cancelled = true }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleDamageConfirm = async (items: DamageItem[]) => {
    setConfirmedItems(items)
    setPhase('tools-part2')
    scrollToBottom()

    for await (const tool of runAgentPipelinePart2(formData, demoOutcome, items)) {
      const mapped = remapName(tool)
      setTools(prev => {
        const idx = prev.findIndex(t => t.id === mapped.id)
        if (idx >= 0) { const n = [...prev]; n[idx] = mapped; return n }
        return [...prev, mapped]
      })
      scrollToBottom()
    }

    setPhase('adjuster-wait')
    scrollToBottom()
    for (let i = 0; i <= 100; i += 2) { await delay(80); setAdjusterProgress(i) }
    await delay(800)
    const result = buildOutcome(formData, demoOutcome, items)
    setOutcome(result)
    setPhase('done')
    scrollToBottom()
  }

  const handleChat = (message: string) => {
    const userMsg: ChatMessage = { id: `u-${Date.now()}`, role: 'user', content: message, timestamp: new Date() }
    setChat(prev => [...prev, userMsg])
    scrollToBottom()
    setTimeout(() => {
      const reply = SCRIPTED_RESPONSES[message] ?? "I'll look into that. For urgent matters, call 1-800-555-0192."
      setChat(prev => [...prev, { id: `a-${Date.now()}`, role: 'agent', content: reply, timestamp: new Date() }])
      scrollToBottom()
    }, 800)
  }

  const handleReturnToDashboard = () => {
    if (!outcome?.claimId) { onHome(); return }
    onClaimComplete({
      claimId: outcome.claimId,
      status: outcome.status,
      vehicle,
      location: formData.location,
      submittedAt: new Date(),
      repairShop: outcome.repairShop,
      pendingReason: outcome.pendingReason,
    })
  }

  const allPart1Done = tools.length >= 2 && tools[1]?.status === 'complete'

  return (
    <div className="h-full flex flex-col bg-neutral-50 dark:bg-neutral-950 overflow-hidden">
      <header className="shrink-0 border-b border-neutral-200 dark:border-neutral-800 px-6 py-3.5 flex items-center gap-3">
        <button
          onClick={onHome}
          className="w-8 h-8 rounded-lg flex items-center justify-center text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
          aria-label="Home"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
        </button>
        <div className="flex-1">
          <h1 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">Claims Processing</h1>
          <p className="text-xs text-neutral-400 dark:text-neutral-600">
            {phase === 'done' ? 'Review complete' :
             phase === 'adjuster-wait' ? 'Awaiting adjuster review…' :
             phase === 'damage-review' ? 'Action required — confirm damage assessment' :
             'Running automated checks…'}
          </p>
        </div>
        <div>
          {phase === 'done' && outcome && (
            <Badge variant={outcome.status === 'approved' ? 'success' : 'warning'}>
              {outcome.status === 'approved' ? 'Approved' : 'Pending Review'}
            </Badge>
          )}
          {(phase === 'tools-part1' || phase === 'tools-part2') && <Badge variant="info">Processing</Badge>}
          {phase === 'adjuster-wait' && <Badge variant="warning">Adjuster Review</Badge>}
        </div>
      </header>

      <div ref={feedRef} className="flex-1 overflow-y-auto px-4 py-6">
        <div className="max-w-2xl mx-auto space-y-0">

          {tools.map(tool => <ToolCard key={tool.id} tool={tool} />)}

          {phase === 'damage-review' && damageItems.length > 0 && (
            <div className="mt-2">
              <DamageReviewCard items={damageItems} onConfirm={handleDamageConfirm} />
            </div>
          )}

          {(phase === 'tools-part2' || phase === 'adjuster-wait' || phase === 'done') && confirmedItems.length > 0 && (
            <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl px-4 py-3 mt-2">
              <p className="text-xs text-neutral-400 dark:text-neutral-600 mb-2">Confirmed damage ({confirmedItems.length} items)</p>
              <div className="flex flex-wrap gap-1.5">
                {confirmedItems.map(item => (
                  <span key={item.id} className={`text-xs rounded-full px-2.5 py-0.5 ${
                    item.severity === 'severe' ? 'text-red-700 dark:text-red-400 bg-red-50 dark:bg-red-400/10' :
                    item.severity === 'moderate' ? 'text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-400/10' :
                    'text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-400/10'
                  }`}>
                    {item.area} · {item.severity}
                  </span>
                ))}
              </div>
            </div>
          )}

          {(phase === 'adjuster-wait' || phase === 'done') && (
            <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-amber-500/20 rounded-xl p-4 mt-3">
              <div className="flex items-center gap-3 mb-3">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${
                  phase === 'done'
                    ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                    : 'bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400'
                }`}>
                  {phase === 'done' ? (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  )}
                </div>
                <div>
                  <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                    {phase === 'done' ? 'Adjuster review complete' : 'Senior Adjuster Review'}
                  </p>
                  <p className="text-xs text-neutral-400 dark:text-neutral-500">
                    {phase === 'done' ? 'A decision has been reached.' : 'Sending claim to a licensed adjuster…'}
                  </p>
                </div>
              </div>
              {phase === 'adjuster-wait' && (
                <div className="w-full bg-neutral-100 dark:bg-neutral-800 rounded-full h-1">
                  <div className="bg-amber-400 h-1 rounded-full transition-all duration-75" style={{ width: `${adjusterProgress}%` }} />
                </div>
              )}
            </div>
          )}

          {/* Verdict */}
          {phase === 'done' && outcome && (
            <div className="mt-3">
              {outcome.status === 'approved' ? (
                <div className="bg-white dark:bg-neutral-900 border border-emerald-200 dark:border-emerald-500/30 rounded-xl p-5 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-semibold text-neutral-900 dark:text-neutral-100">Claim Approved</p>
                      <p className="text-sm text-neutral-500">Your claim has been processed successfully.</p>
                    </div>
                  </div>

                  {/* Claim ID — larger */}
                  <div className="bg-neutral-50 dark:bg-neutral-800/60 rounded-lg px-4 py-3 flex items-center justify-between">
                    <div>
                      <p className="text-xs text-neutral-400 dark:text-neutral-600 mb-0.5">Claim ID</p>
                      <p className="text-2xl font-mono font-bold text-neutral-900 dark:text-neutral-100 tracking-wide">
                        {outcome.claimId}
                      </p>
                    </div>
                    <Badge variant="success">Approved</Badge>
                  </div>

                  {/* Repair shop section */}
                  {outcome.repairShop && (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                          Recommended Repair Shops
                        </p>
                        {!showAllShops && (
                          <button
                            onClick={() => setShowAllShops(true)}
                            className="text-xs text-violet-600 dark:text-violet-400 hover:underline cursor-pointer"
                          >
                            View all {MOCK_REPAIR_SHOPS.length} shops →
                          </button>
                        )}
                      </div>

                      {/* Preferred shop always shown */}
                      <div className="border border-violet-200 dark:border-violet-500/30 rounded-lg p-3 bg-violet-50/50 dark:bg-violet-500/5">
                        <div className="flex items-start justify-between gap-2 mb-1.5">
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">{outcome.repairShop.name}</p>
                              <Badge variant="info">Preferred</Badge>
                            </div>
                            <p className="text-xs text-neutral-500 mt-0.5">{outcome.repairShop.address}</p>
                          </div>
                          <p className="text-xs text-violet-600 dark:text-violet-400 shrink-0">{outcome.repairShop.phone}</p>
                        </div>
                        <div className="flex items-center justify-between">
                          <StarRating rating={4.8} />
                          <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">Tesla Certified · 0.8 mi</span>
                        </div>
                      </div>

                      {showAllShops && (
                        <div className="space-y-2">
                          {MOCK_REPAIR_SHOPS.slice(1).map(shop => (
                            <div key={shop.id} className={`border rounded-lg p-3 ${
                              shop.available
                                ? 'border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/60'
                                : 'border-neutral-100 dark:border-neutral-800/50 bg-neutral-50 dark:bg-neutral-900/30 opacity-60'
                            }`}>
                              <div className="flex items-start justify-between gap-2 mb-1.5">
                                <div>
                                  <div className="flex items-center gap-2">
                                    <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100">{shop.name}</p>
                                    {!shop.available && (
                                      <span className="text-xs text-neutral-400">Unavailable</span>
                                    )}
                                  </div>
                                  <p className="text-xs text-neutral-500 mt-0.5">{shop.address}</p>
                                </div>
                                <p className="text-xs text-violet-600 dark:text-violet-400 shrink-0">{shop.phone}</p>
                              </div>
                              <div className="flex items-center justify-between">
                                <StarRating rating={shop.rating} />
                                <span className="text-xs text-neutral-400">{shop.specialty} · {shop.distance}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  <p className="text-xs text-neutral-400">A confirmation has been sent to your email on file.</p>

                  <button
                    onClick={handleReturnToDashboard}
                    className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg border border-neutral-200 dark:border-neutral-700 text-sm text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-800 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors cursor-pointer"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                    Return to Dashboard
                  </button>
                </div>
              ) : (
                <div className="bg-white dark:bg-neutral-900 border border-amber-200 dark:border-amber-500/30 rounded-xl p-5 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-amber-50 dark:bg-amber-500/10 flex items-center justify-center text-amber-600 dark:text-amber-400 shrink-0">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-semibold text-neutral-900 dark:text-neutral-100">Pending Manual Review</p>
                      <p className="text-sm text-neutral-500">Your claim requires additional review.</p>
                    </div>
                  </div>

                  <div className="bg-neutral-50 dark:bg-neutral-800/60 rounded-lg px-4 py-3 flex items-center justify-between">
                    <div>
                      <p className="text-xs text-neutral-400 dark:text-neutral-600 mb-0.5">Claim ID</p>
                      <p className="text-2xl font-mono font-bold text-neutral-900 dark:text-neutral-100 tracking-wide">
                        {outcome.claimId}
                      </p>
                    </div>
                    <Badge variant="warning">Pending</Badge>
                  </div>

                  <p className="text-sm text-neutral-600 dark:text-neutral-400">{outcome.pendingReason}</p>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-neutral-50 dark:bg-neutral-800/40 rounded-lg p-3 text-center">
                      <p className="text-xs text-neutral-400 mb-1">Check status</p>
                      <p className="text-xs font-medium text-neutral-700 dark:text-neutral-300">In-app or email</p>
                    </div>
                    <div className="bg-neutral-50 dark:bg-neutral-800/40 rounded-lg p-3 text-center">
                      <p className="text-xs text-neutral-400 mb-1">Support line</p>
                      <p className="text-xs font-medium text-violet-600 dark:text-violet-400">1-800-555-0192</p>
                    </div>
                  </div>

                  <p className="text-xs text-neutral-400">Expected review window: 2–3 business days. You will be notified by email.</p>

                  <button
                    onClick={handleReturnToDashboard}
                    className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg border border-neutral-200 dark:border-neutral-700 text-sm text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-800 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors cursor-pointer"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                    Return to Dashboard
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Chat messages */}
          {chat.length > 0 && (
            <div className="mt-4 space-y-3">
              {chat.map(msg => (
                <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-xs px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-violet-600 text-white rounded-br-sm'
                      : 'bg-white dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-700 rounded-bl-sm'
                  }`}>
                    {renderMarkdown(msg.content)}
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="h-4" />
        </div>
      </div>

      <ChatInput onSend={handleChat} disabled={!allPart1Done} />
    </div>
  )
}

function renderMarkdown(text: string) {
  return text.split(/\*\*(.+?)\*\*/g).map((chunk, i) =>
    i % 2 === 1 ? <strong key={i}>{chunk}</strong> : chunk
  )
}
