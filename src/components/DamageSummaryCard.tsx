import type { DamageDecision } from '../types/claims'

interface Props {
  decisions: DamageDecision[]
}

export function DamageSummaryCard({ decisions }: Props) {
  const approvedCount = decisions.filter(d => d.approved).length
  const rejectedCount = decisions.length - approvedCount

  return (
    <div className="bg-white border border-neutral-200 rounded-xl overflow-hidden mt-3">
      <div className="px-4 py-3 border-b border-neutral-100 flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-neutral-900">Damage Coverage Decision</p>
          <p className="text-xs text-neutral-500 mt-0.5">
            {approvedCount} item{approvedCount !== 1 ? 's' : ''} covered
            {rejectedCount > 0 && (
              <span className="text-red-500"> · {rejectedCount} excluded</span>
            )}
          </p>
        </div>
        <div className="flex items-center gap-1.5">
          {approvedCount > 0 && (
            <span className="text-xs bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-full px-2 py-0.5">
              {approvedCount} covered
            </span>
          )}
          {rejectedCount > 0 && (
            <span className="text-xs bg-red-50 text-red-600 border border-red-100 rounded-full px-2 py-0.5">
              {rejectedCount} excluded
            </span>
          )}
        </div>
      </div>

      <div className="divide-y divide-neutral-50">
        {decisions.map(d => (
          <div key={d.itemId} className="px-4 py-3">
            <div className="flex items-start gap-3">
              <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                d.approved ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-500'
              }`}>
                {d.approved ? (
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm font-medium text-neutral-900">{d.area}</span>
                  <span className={`text-xs rounded-full px-2 py-0.5 ${
                    d.severity === 'severe' ? 'bg-red-50 text-red-600' :
                    d.severity === 'moderate' ? 'bg-amber-50 text-amber-600' :
                    'bg-neutral-100 text-neutral-500'
                  }`}>{d.severity}</span>
                </div>
                {!d.approved && d.rejectionReason && (
                  <div className="mt-1.5 space-y-0.5">
                    <p className="text-xs text-neutral-500 leading-relaxed">{d.rejectionReason}</p>
                    {d.policyClause && (
                      <p className="text-xs text-neutral-400 font-mono">{d.policyClause}</p>
                    )}
                  </div>
                )}
              </div>

              <span className={`text-xs font-medium shrink-0 mt-0.5 ${
                d.approved ? 'text-emerald-600' : 'text-red-500'
              }`}>
                {d.approved ? 'Covered' : 'Excluded'}
              </span>
            </div>
          </div>
        ))}
      </div>

      {rejectedCount > 0 && (
        <div className="px-4 py-2.5 bg-neutral-50 border-t border-neutral-100">
          <p className="text-xs text-neutral-400">
            Exclusions are based on your active policy terms. Contact support to dispute a coverage decision.
          </p>
        </div>
      )}
    </div>
  )
}
