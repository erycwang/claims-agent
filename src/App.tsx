import { useState } from 'react'
import type { AppStage, ClaimFormData, CompletedClaim, DemoOutcome } from './types/claims'
import { mockPolicy } from './mock/policyData'
import { Dashboard } from './components/Dashboard'
import { ClaimForm } from './components/ClaimForm'
import { ClaimSubmitTransition } from './components/ClaimSubmitTransition'
import { AgentWorkflow } from './components/AgentWorkflow'

export default function App() {
  const [stage, setStage] = useState<AppStage>('dashboard')
  const [demoOutcome, setDemoOutcome] = useState<DemoOutcome>('approved')
  const [claimData, setClaimData] = useState<ClaimFormData | null>(null)
  const [completedClaim, setCompletedClaim] = useState<CompletedClaim | null>(null)
  const goHome = () => setStage('dashboard')

  const handleFormSubmit = (data: ClaimFormData) => {
    setClaimData(data)
    setStage('submitting')
  }

  const handleClaimComplete = (claim: CompletedClaim) => {
    setCompletedClaim(claim)
    setStage('dashboard')
  }

  const wrapperCls = 'h-full bg-neutral-50'

  return (
    <div className={wrapperCls}>
      {stage === 'form' && (
        <ClaimForm onSubmit={handleFormSubmit} onCancel={goHome} onHome={goHome} />
      )}
      {stage === 'submitting' && (
        <ClaimSubmitTransition onComplete={() => setStage('agent')} />
      )}
      {stage === 'agent' && claimData && (
        <AgentWorkflow
          formData={claimData}
          demoOutcome={demoOutcome}
          vehicle={mockPolicy.vehicle}
          onHome={goHome}
          onClaimComplete={handleClaimComplete}
        />
      )}
      {stage === 'dashboard' && (
        <Dashboard
          demoOutcome={demoOutcome}
          onOutcomeChange={setDemoOutcome}
          onFileClaim={() => setStage('form')}
          recentClaim={completedClaim}
        />
      )}
    </div>
  )
}
