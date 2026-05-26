import { useState } from 'react'
import type { CompletedClaim, DemoOutcome } from '../types/claims'
import { mockPolicy } from '../mock/policyData'
import { Button } from './ui/Button'
import { Badge } from './ui/Badge'
import { Card } from './ui/Card'
import { TabNav } from './ui/TabNav'

interface DashboardProps {
  demoOutcome: DemoOutcome
  onOutcomeChange: (o: DemoOutcome) => void
  onFileClaim: () => void
  recentClaim?: CompletedClaim | null
  onViewPrd: () => void
  onViewArchitecture: () => void
}

export function Dashboard({ demoOutcome, onOutcomeChange, onFileClaim, recentClaim, onViewPrd, onViewArchitecture }: DashboardProps) {
  const [expandedClaim, setExpandedClaim] = useState(false)

  const claimDate = recentClaim
    ? recentClaim.submittedAt.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    : null

  return (
    <div className="min-h-full bg-neutral-50 dark:bg-neutral-950 flex flex-col">
      <header className="border-b border-neutral-200 dark:border-neutral-800 px-6 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-6 h-6 bg-violet-600 rounded-md flex items-center justify-center">
            <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <span className="text-neutral-900 dark:text-neutral-100 font-medium text-sm tracking-tight">InsureCo</span>
        </div>
        <div className="flex items-center gap-4">
          <TabNav active="demo" onDemo={() => {}} onPrd={onViewPrd} onArchitecture={onViewArchitecture} />
          <div className="flex items-center gap-2">
            <span className="text-neutral-500 text-sm">{mockPolicy.holderName}</span>
            <div className="w-7 h-7 rounded-full bg-violet-100 flex items-center justify-center text-violet-700 text-xs font-semibold">
              {mockPolicy.holderName[0]}
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 px-6 py-10 max-w-xl mx-auto w-full space-y-5">
        <div>
          <h1 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">
            Good morning, {mockPolicy.holderName.split(' ')[0]}.
          </h1>
          <p className="text-neutral-500 text-sm mt-0.5">Your active policy is in good standing.</p>
        </div>

        <Card className="p-4 space-y-3.5">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs text-neutral-400 dark:text-neutral-600 uppercase tracking-wider mb-1">Active Policy</p>
              <p className="font-semibold text-neutral-900 dark:text-neutral-100">{mockPolicy.vehicle}</p>
              <p className="text-sm text-neutral-500">{mockPolicy.policyType}</p>
            </div>
            <Badge variant="success">Active</Badge>
          </div>
          <div className="grid grid-cols-3 gap-2 pt-3 border-t border-neutral-100 dark:border-neutral-800">
            <PolicyStat label="Coverage ID" value={mockPolicy.coverageId} />
            <PolicyStat label="Effective" value={mockPolicy.effectiveDate} />
            <PolicyStat label="Expires" value={mockPolicy.expirationDate} />
          </div>
        </Card>

        <div className="flex items-center justify-between py-4 border-y border-neutral-200 dark:border-neutral-800">
          <div>
            <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100">File a New Claim</p>
            <p className="text-xs text-neutral-500 mt-0.5">Start the agentic review process for your vehicle.</p>
          </div>
          <Button size="lg" onClick={onFileClaim}>File a Claim</Button>
        </div>

        {/* Recent Claims */}
        <div>
          <p className="text-xs text-neutral-400 dark:text-neutral-600 uppercase tracking-wider mb-3">Recent Claims</p>
          {recentClaim ? (
            <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl overflow-hidden">
              {/* Claim row */}
              <button
                type="button"
                onClick={() => setExpandedClaim(e => !e)}
                className="w-full flex items-center justify-between px-4 py-3.5 hover:bg-neutral-50 dark:hover:bg-neutral-800/60 transition-colors cursor-pointer text-left"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                    recentClaim.status === 'approved'
                      ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                      : 'bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400'
                  }`}>
                    {recentClaim.status === 'approved' ? (
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100 font-mono">
                      {recentClaim.claimId}
                    </p>
                    <p className="text-xs text-neutral-500">{recentClaim.vehicle} · {claimDate}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={recentClaim.status === 'approved' ? 'success' : 'warning'}>
                    {recentClaim.status === 'approved' ? 'Approved' : 'Pending'}
                  </Badge>
                  <svg
                    className={`w-4 h-4 text-neutral-400 transition-transform ${expandedClaim ? 'rotate-180' : ''}`}
                    fill="none" viewBox="0 0 24 24" stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </button>

              {/* Expanded details */}
              {expandedClaim && (
                <div className="border-t border-neutral-100 dark:border-neutral-800 px-4 py-4 space-y-3 bg-neutral-50/50 dark:bg-neutral-900/60">
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-xs text-neutral-400 dark:text-neutral-600 mb-0.5">Location</p>
                      <p className="text-neutral-700 dark:text-neutral-300">{recentClaim.location}</p>
                    </div>
                    <div>
                      <p className="text-xs text-neutral-400 dark:text-neutral-600 mb-0.5">Submitted</p>
                      <p className="text-neutral-700 dark:text-neutral-300">{claimDate}</p>
                    </div>
                  </div>
                  {recentClaim.status === 'approved' && recentClaim.repairShop && (
                    <div>
                      <p className="text-xs text-neutral-400 dark:text-neutral-600 mb-0.5">Approved Repair Shop</p>
                      <p className="text-sm font-medium text-neutral-800 dark:text-neutral-200">{recentClaim.repairShop.name}</p>
                      <p className="text-xs text-neutral-500">{recentClaim.repairShop.address}</p>
                      <p className="text-xs text-violet-600 dark:text-violet-400">{recentClaim.repairShop.phone}</p>
                    </div>
                  )}
                  {recentClaim.status === 'pending' && recentClaim.pendingReason && (
                    <div>
                      <p className="text-xs text-neutral-400 dark:text-neutral-600 mb-0.5">Review note</p>
                      <p className="text-sm text-neutral-600 dark:text-neutral-400">{recentClaim.pendingReason}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : (
            <p className="text-sm text-neutral-400 dark:text-neutral-600 py-5 text-center">No prior claims on record.</p>
          )}
        </div>

        {/* Demo toggle */}
        <div className="pt-1">
          <div className="flex items-center gap-3">
            <p className="text-xs text-neutral-400 dark:text-neutral-600">Demo outcome</p>
            <div className="flex rounded-lg overflow-hidden border border-neutral-200 dark:border-neutral-800 text-xs">
              {(['approved', 'pending'] as DemoOutcome[]).map(o => (
                <button
                  key={o}
                  type="button"
                  onClick={() => onOutcomeChange(o)}
                  className={`px-3 py-1.5 cursor-pointer transition-colors capitalize border-r last:border-0 border-neutral-200 dark:border-neutral-800 ${
                    demoOutcome === o
                      ? o === 'approved'
                        ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-400/10 dark:text-emerald-400'
                        : 'bg-amber-50 text-amber-700 dark:bg-amber-400/10 dark:text-amber-400'
                      : 'bg-transparent text-neutral-400 dark:text-neutral-600 hover:text-neutral-700 dark:hover:text-neutral-300'
                  }`}
                >
                  {o}
                </button>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

function PolicyStat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-neutral-400 dark:text-neutral-600 mb-0.5">{label}</p>
      <p className="text-sm text-neutral-700 dark:text-neutral-300 font-medium">{value}</p>
    </div>
  )
}
