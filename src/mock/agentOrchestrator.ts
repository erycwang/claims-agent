import type { ClaimFormData, DamageDecision, DamageItem, ClaimOutcome, ToolResult } from '../types/claims'

const delay = (ms: number) => new Promise(res => setTimeout(res, ms))

const DAMAGE_ITEMS: DamageItem[] = [
  { id: 'd1', area: 'Front bumper', severity: 'severe' },
  { id: 'd2', area: 'Hood', severity: 'moderate' },
  { id: 'd3', area: 'Driver-side headlight', severity: 'severe' },
  { id: 'd4', area: 'Front quarter panel (driver)', severity: 'minor' },
]

export async function* runAgentPipeline(
  _formData: ClaimFormData,
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
    output: `**Collision claim** confirmed. Third-party coverage verified.`,
  }

  // Tool 2 — Damage Assessment
  yield { id: 2, name: 'Damage Assessment & Categorization', description: 'Analyzing uploaded images and incident description', status: 'running' }
  await delay(1800)
  yield {
    id: 2,
    name: 'Damage Assessment & Categorization',
    description: 'Analyzing uploaded images and incident description',
    status: 'complete',
    output: `**${DAMAGE_ITEMS.length} damage areas** detected. Review required before proceeding.`,
    pauseForReview: true,
    damageItems: DAMAGE_ITEMS,
  }
}

export async function* runAgentPipelinePart2(
  _formData: ClaimFormData,
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
      ? `No anomalies detected. Fraud risk score: **2/100 (Low)**.`
      : `Fraud risk score: **61/100 (Elevated)**. Flagged for adjuster review.`,
  }

  // Tool 4 — Policy RAG & Coverage Checker
  yield { id: 4, name: 'Policy RAG & Coverage Checker', description: 'Matching damage items against active policy terms', status: 'running' }
  await delay(1400)
  const inPolicyCount = confirmedItems.filter(i => i.severity !== 'minor' && !(i.severity === 'moderate' && outcome === 'pending')).length
  yield {
    id: 4,
    name: 'Policy RAG & Coverage Checker',
    description: 'Matching damage items against active policy terms',
    status: 'complete',
    output: outcome === 'approved'
      ? `**${inPolicyCount} of ${confirmedItems.length} items** within policy coverage limits.`
      : `**${inPolicyCount} of ${confirmedItems.length} items** within policy coverage limits. Causation verification required.`,
  }

  // Tool 5 — Estimate Calculator
  yield { id: 5, name: 'Estimate Calculator', description: 'Computing preliminary repair cost estimate', status: 'running' }
  await delay(1600)
  yield {
    id: 5,
    name: 'Estimate Calculator',
    description: 'Computing preliminary repair cost estimate',
    status: 'complete',
    output: `Repair estimate: **$${estimateLow.toLocaleString()}–$${estimateHigh.toLocaleString()}** across ${confirmedItems.length} damage areas.`,
  }

  // Tool 6 — Repair Shop & Claim ID
  yield { id: 6, name: 'Repair Shop & Claim ID Provider', description: 'Assigning claim ID and locating approved repair facilities', status: 'running' }
  await delay(1300)
  const claimId = `CLM-${Math.floor(10000 + Math.random() * 90000)}`
  yield {
    id: 6,
    name: 'Repair Shop & Claim ID Provider',
    description: 'Assigning claim ID and locating approved repair facilities',
    status: 'complete',
    output: outcome === 'approved'
      ? `Claim **${claimId}** assigned. Nearest shop: **Greenway Auto Body**, 0.8 mi.`
      : `Claim **${claimId}** tentatively assigned. Shop assignment on hold.`,
  }
}

export const SCRIPTED_RESPONSES: Record<string, string> = {
  "What's the status of my claim?":
    "Your claim is currently being processed by our review team. All automated checks have completed. You'll receive an email confirmation within 24 hours once a final decision is made.",
  "I have additional damage to report":
    "To add additional damage, please contact your assigned adjuster directly or call our claims line at 1-800-555-0192. Reference your claim ID when you call.",
  "What does this estimate cover?":
    "The preliminary estimate covers parts and labor for all confirmed damage areas based on manufacturer pricing and regional labor rates. It does not include rental coverage or diminished value — those are assessed separately.",
  "How do I contact support?":
    "You can reach our claims support team at **1-800-555-0192** (Mon–Fri, 8am–8pm) or email **claims@insureco.com**. Your claim ID is required for faster service.",
}

function buildDamageDecisions(items: DamageItem[], outcome: 'approved' | 'pending'): DamageDecision[] {
  return items.map(item => {
    if (item.severity === 'minor') {
      return {
        itemId: item.id, area: item.area, severity: item.severity,
        approved: false,
        rejectionReason: 'Surface-level cosmetic damage is excluded from collision coverage. Only structural or safety-related damage qualifies.',
        policyClause: '§4.3.1 — Cosmetic & Appearance Exclusion',
      }
    }
    if (item.severity === 'moderate' && outcome === 'pending') {
      return {
        itemId: item.id, area: item.area, severity: item.severity,
        approved: false,
        rejectionReason: 'Damage causation could not be conclusively attributed to the reported incident. Manual adjuster verification is required before coverage can be confirmed.',
        policyClause: '§3.1 — Incident Causation Requirement',
      }
    }
    return { itemId: item.id, area: item.area, severity: item.severity, approved: true }
  })
}

export function buildOutcome(
  formData: ClaimFormData,
  outcome: 'approved' | 'pending',
  confirmedItems: DamageItem[]
): ClaimOutcome {
  const severeCount = confirmedItems.filter(i => i.severity === 'severe').length
  const claimId = `CLM-${Math.floor(10000 + Math.random() * 90000)}`
  const damageDecisions = buildDamageDecisions(confirmedItems, outcome)

  if (outcome === 'approved') {
    return {
      status: 'approved',
      claimId,
      damageDecisions,
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
    damageDecisions,
    pendingReason:
      severeCount > 1
        ? 'Claim requires senior adjuster review due to elevated fraud risk score and severity of reported damages.'
        : 'Claim flagged for manual review. A licensed adjuster will contact you within 2–3 business days.',
  }
}
