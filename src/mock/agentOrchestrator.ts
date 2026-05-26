import type { ClaimFormData, ToolResult, DamageItem, ClaimOutcome } from '../types/claims'

const delay = (ms: number) => new Promise(res => setTimeout(res, ms))

const DAMAGE_ITEMS: DamageItem[] = [
  { id: 'd1', area: 'Front bumper', severity: 'severe' },
  { id: 'd2', area: 'Hood', severity: 'moderate' },
  { id: 'd3', area: 'Driver-side headlight', severity: 'severe' },
  { id: 'd4', area: 'Front quarter panel (driver)', severity: 'minor' },
]

export async function* runAgentPipeline(
  formData: ClaimFormData,
  _outcome: 'approved' | 'pending',
  _confirmedDamageItems?: DamageItem[]
): AsyncGenerator<ToolResult> {

  // Tool 1 — Intent Classifier
  yield { id: 1, name: 'Intent Classifier', description: 'Validating request intent and claim type', status: 'running' }
  await delay(1200)
  yield {
    id: 1,
    name: 'Intent Classifier',
    description: 'Validating request intent and claim type',
    status: 'complete',
    output: `Claim type identified: **Collision**. Policy ${formData.opposingPolicyNumber ? 'includes' : 'requires verification of'} third-party coverage. Proceeding to damage analysis.`,
  }

  // Tool 2 — Damage Assessment
  yield { id: 2, name: 'Damage Assessment & Categorization', description: 'Analyzing uploaded images and incident description', status: 'running' }
  await delay(1800)
  yield {
    id: 2,
    name: 'Damage Assessment & Categorization',
    description: 'Analyzing uploaded images and incident description',
    status: 'complete',
    output: `Detected ${DAMAGE_ITEMS.length} damage areas. Severity classification complete. **Human review required** before proceeding.`,
    pauseForReview: true,
    damageItems: DAMAGE_ITEMS,
  }
}

export async function* runAgentPipelinePart2(
  formData: ClaimFormData,
  outcome: 'approved' | 'pending',
  confirmedItems: DamageItem[]
): AsyncGenerator<ToolResult> {
  const severeCount = confirmedItems.filter(i => i.severity === 'severe').length
  const estimateLow = 1800 + severeCount * 600
  const estimateHigh = estimateLow + 700

  // Tool 3 — Anti-fraud Reviewer
  yield { id: 3, name: 'Anti-fraud Reviewer', description: 'Checking claim anomalies and policy history', status: 'running' }
  await delay(1500)
  yield {
    id: 3,
    name: 'Anti-fraud Reviewer',
    description: 'Checking claim anomalies and policy history',
    status: 'complete',
    output: outcome === 'approved'
      ? `No anomalies detected. Policy in good standing — 0 prior claims in 36 months. Fraud risk score: **2/100 (Low)**.`
      : `Flagged for review: claim submitted within 30 days of policy renewal. Fraud risk score: **61/100 (Elevated)**. Escalation recommended.`,
  }

  // Tool 4 — Estimate Calculator
  yield { id: 4, name: 'Estimate Calculator', description: 'Computing preliminary repair cost estimate', status: 'running' }
  await delay(1600)
  yield {
    id: 4,
    name: 'Estimate Calculator',
    description: 'Computing preliminary repair cost estimate',
    status: 'complete',
    output: `Preliminary estimate: **$${estimateLow.toLocaleString()}–$${estimateHigh.toLocaleString()}**. Based on ${confirmedItems.length} damage areas, 2022 Tesla Model 3 parts pricing, and regional labor rates in ${formData.location || 'your area'}.`,
  }

  // Tool 5 — Repair Shop & Claim ID
  yield { id: 5, name: 'Repair Shop & Claim ID Provider', description: 'Assigning claim ID and locating approved repair facilities', status: 'running' }
  await delay(1300)
  const claimId = `CLM-${Math.floor(10000 + Math.random() * 90000)}`
  yield {
    id: 5,
    name: 'Repair Shop & Claim ID Provider',
    description: 'Assigning claim ID and locating approved repair facilities',
    status: 'complete',
    output: outcome === 'approved'
      ? `Claim ID assigned: **${claimId}**. Nearest approved facility: **Greenway Auto Body** — 1482 Oak Street, ${formData.location || 'your city'}. Certified Tesla repair center.`
      : `Claim ID tentatively assigned: **${claimId}** (pending adjuster approval). Shop assignment on hold pending review.`,
  }

  // Tool 6 — Escalation & Documentation
  yield { id: 6, name: 'Escalation & Documentation Provider', description: 'Generating claim summary and escalation routing', status: 'running' }
  await delay(1400)
  yield {
    id: 6,
    name: 'Escalation & Documentation Provider',
    description: 'Generating claim summary and escalation routing',
    status: 'complete',
    output: outcome === 'approved'
      ? `Documentation package generated. Claim summary emailed to alex.johnson@email.com. No escalation required.`
      : `Claim routed to senior adjuster queue. Expected review window: 2–3 business days. Documentation package created and flagged for manual review.`,
  }
}

export const SCRIPTED_RESPONSES: Record<string, string> = {
  "What's the status of my claim?":
    "Your claim is currently being processed by our review team. All 6 automated checks have completed. You'll receive an email confirmation within 24 hours once a final decision is made.",
  "I have additional damage to report":
    "To add additional damage, please contact your assigned adjuster directly or call our claims line at 1-800-555-0192. Reference your claim ID when you call.",
  "What does this estimate cover?":
    "The preliminary estimate covers parts and labor for all confirmed damage areas based on manufacturer pricing and regional labor rates. It does not include rental coverage or diminished value — those are assessed separately.",
  "How do I contact support?":
    "You can reach our claims support team at **1-800-555-0192** (Mon–Fri, 8am–8pm) or email **claims@insureco.com**. Your claim ID is required for faster service.",
}

export function buildOutcome(
  formData: ClaimFormData,
  outcome: 'approved' | 'pending',
  confirmedItems: DamageItem[]
): ClaimOutcome {
  const severeCount = confirmedItems.filter(i => i.severity === 'severe').length
  const claimId = `CLM-${Math.floor(10000 + Math.random() * 90000)}`

  if (outcome === 'approved') {
    return {
      status: 'approved',
      claimId,
      repairShop: {
        name: 'Greenway Auto Body',
        address: `1482 Oak Street, ${formData.location || 'your city'}`,
        phone: '(555) 204-8833',
      },
    }
  }
  return {
    status: 'pending',
    claimId,
    pendingReason:
      severeCount > 1
        ? 'Claim requires senior adjuster review due to elevated fraud risk score and severity of reported damages.'
        : 'Claim flagged for manual review. A licensed adjuster will contact you within 2–3 business days.',
  }
}
