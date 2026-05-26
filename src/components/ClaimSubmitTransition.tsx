import { useEffect, useState } from 'react'

interface Props {
  onComplete: () => void
}

type Phase = 'loading' | 'success' | 'exiting'

export function ClaimSubmitTransition({ onComplete }: Props) {
  const [phase, setPhase] = useState<Phase>('loading')

  useEffect(() => {
    const t1 = setTimeout(() => setPhase('success'), 1400)
    const t2 = setTimeout(() => setPhase('exiting'), 2700)
    const t3 = setTimeout(onComplete, 3200)
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3) }
  }, [onComplete])

  return (
    <div
      className={`h-full bg-neutral-50 dark:bg-neutral-950 flex flex-col items-center justify-center transition-all duration-500 ease-in-out ${
        phase === 'exiting' ? 'opacity-0 -translate-y-6' : 'opacity-100 translate-y-0'
      }`}
    >
      <div className="flex flex-col items-center gap-6 text-center px-6">
        {/* Icon */}
        <div className="relative w-20 h-20">
          {phase === 'loading' ? (
            <div className="w-20 h-20 border-4 border-neutral-200 dark:border-neutral-800 border-t-violet-500 rounded-full animate-spin" />
          ) : (
            <div
              className="w-20 h-20 rounded-full bg-emerald-100 dark:bg-emerald-500/20 flex items-center justify-center"
              style={{ animation: 'scaleIn 0.3s ease-out forwards' }}
            >
              <svg
                className="w-10 h-10 text-emerald-600 dark:text-emerald-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
                style={{ animation: 'drawCheck 0.35s ease-out 0.1s forwards', opacity: 0 }}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
          )}
        </div>

        {/* Text */}
        <div
          className="transition-all duration-300"
          style={{ opacity: phase === 'loading' ? 1 : 1 }}
        >
          {phase === 'loading' ? (
            <>
              <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
                Submitting your claim
              </h2>
              <p className="text-sm text-neutral-500 mt-1">
                Recording your information…
              </p>
            </>
          ) : (
            <div style={{ animation: 'fadeUp 0.3s ease-out forwards' }}>
              <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
                Claim submitted successfully
              </h2>
              <p className="text-sm text-neutral-500 mt-1.5 max-w-xs">
                We're now running automated checks and preparing your claim review.
              </p>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes scaleIn {
          from { transform: scale(0.5); opacity: 0; }
          to   { transform: scale(1);   opacity: 1; }
        }
        @keyframes drawCheck {
          from { opacity: 0; transform: scale(0.7); }
          to   { opacity: 1; transform: scale(1); }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  )
}
