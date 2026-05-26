export type AppStage = 'dashboard' | 'form' | 'submitting' | 'agent' | 'prd' | 'architecture'

export type DemoOutcome = 'approved' | 'pending'

export interface FileMetadata {
  name: string
  size: number
  type: string
  previewUrl?: string
}

export interface ClaimFormData {
  claimType: string
  dateTime: string
  location: string
  description: string
  policeDepartment: string
  opposingPartyName: string
  opposingPolicyNumber: string
  damageImages: FileMetadata[]
  policeReport: FileMetadata[]
}

export type ToolStatus = 'waiting' | 'running' | 'complete'

export interface ToolResult {
  id: number
  name: string
  description: string
  status: ToolStatus
  output?: string
  pauseForReview?: boolean
  damageItems?: DamageItem[]
}

export interface DamageItem {
  id: string
  area: string
  severity: 'minor' | 'moderate' | 'severe'
}

export interface DamageDecision {
  itemId: string
  area: string
  severity: 'minor' | 'moderate' | 'severe'
  approved: boolean
  rejectionReason?: string
  policyClause?: string
}

export interface ClaimOutcome {
  status: 'approved' | 'pending'
  claimId?: string
  repairShop?: {
    name: string
    address: string
    phone: string
  }
  pendingReason?: string
  damageDecisions?: DamageDecision[]
}

export interface CompletedClaim {
  claimId: string
  status: 'approved' | 'pending'
  vehicle: string
  location: string
  submittedAt: Date
  repairShop?: { name: string; address: string; phone: string }
  pendingReason?: string
}

export interface ChatMessage {
  id: string
  role: 'agent' | 'user'
  content: string
  timestamp: Date
}
