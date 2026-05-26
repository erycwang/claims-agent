import { useState } from 'react'
import type { ClaimFormData } from '../types/claims'
import { Button } from './ui/Button'
import { FileUploadZone } from './FileUploadZone'

interface ClaimFormProps {
  onSubmit: (data: ClaimFormData) => void
  onCancel: () => void
  onHome: () => void
}

type Step = 1 | 2 | 3 | 4

const empty: ClaimFormData = {
  claimType: '',
  dateTime: '',
  location: '',
  description: '',
  policeDepartment: '',
  opposingPartyName: '',
  opposingPolicyNumber: '',
  damageImages: [],
  policeReport: [],
}

const STEP_LABELS = ['Claim Type', 'Accident Details', 'Opposing Party', 'Documents']

const CLAIM_TYPES = [
  {
    id: 'collision',
    label: 'Collision',
    description: 'Covers damage to your vehicle resulting from a collision with another car or object.',
    available: true,
  },
  {
    id: 'liability',
    label: 'Liability',
    description: 'Covers damage or injury you cause to another person or their property.',
    available: false,
  },
  {
    id: 'bodily_injury',
    label: 'Bodily Injury',
    description: 'Covers medical expenses and related costs for injuries sustained in an accident.',
    available: false,
  },
]

export function ClaimForm({ onSubmit, onHome }: ClaimFormProps) {
  const [step, setStep] = useState<Step>(1)
  const [form, setForm] = useState<ClaimFormData>(empty)
  const [errors, setErrors] = useState<Partial<Record<keyof ClaimFormData, string>>>({})

  const set = (field: keyof ClaimFormData, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }))
    setErrors(prev => ({ ...prev, [field]: undefined }))
  }

  const validateStep1 = () => {
    const e: typeof errors = {}
    if (!form.claimType) e.claimType = 'Please select a claim type'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const validateStep2 = () => {
    const e: typeof errors = {}
    if (!form.dateTime) e.dateTime = 'Required'
    if (!form.location.trim()) e.location = 'Required'
    if (!form.description.trim()) e.description = 'Required'
    if (!form.policeDepartment.trim()) e.policeDepartment = 'Required'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const validateStep3 = () => {
    const e: typeof errors = {}
    if (!form.opposingPartyName.trim()) e.opposingPartyName = 'Required'
    if (!form.opposingPolicyNumber.trim()) e.opposingPolicyNumber = 'Required'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleNext = () => {
    if (step === 1 && validateStep1()) setStep(2)
    else if (step === 2 && validateStep2()) setStep(3)
    else if (step === 3 && validateStep3()) setStep(4)
  }

  const handleBack = () => {
    if (step > 1) setStep(s => (s - 1) as Step)
  }

  const handleSubmit = () => onSubmit(form)

  const selectedType = CLAIM_TYPES.find(t => t.id === form.claimType)

  return (
    <div className="min-h-full bg-neutral-50 dark:bg-neutral-950 flex flex-col">
      <header className="border-b border-neutral-200 dark:border-neutral-800 px-6 py-3.5 flex items-center gap-3">
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
          <h1 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">File a New Claim</h1>
          <p className="text-xs text-neutral-400 dark:text-neutral-600">{STEP_LABELS[step - 1]} — Step {step} of 4</p>
        </div>
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4].map(s => (
            <div
              key={s}
              className={`h-1 w-6 rounded-full transition-colors ${s <= step ? 'bg-violet-500' : 'bg-neutral-200 dark:bg-neutral-800'}`}
            />
          ))}
        </div>
      </header>

      <main className="flex-1 flex justify-center px-6 py-10">
        <div className="w-full max-w-md">
          {step === 1 && (
            <div className="space-y-5">
              <div>
                <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">What type of claim are you filing?</h2>
                <p className="text-sm text-neutral-500 mt-0.5">Select the category that best describes your situation.</p>
              </div>

              <div className="space-y-3">
                {CLAIM_TYPES.map(type => {
                  const isSelected = form.claimType === type.id
                  return (
                    <button
                      key={type.id}
                      type="button"
                      disabled={!type.available}
                      onClick={() => type.available && set('claimType', type.id)}
                      className={`w-full text-left p-4 rounded-xl border transition-all ${
                        !type.available
                          ? 'border-neutral-200 bg-neutral-50 cursor-not-allowed opacity-50'
                          : isSelected
                            ? 'border-violet-500 bg-violet-50 cursor-pointer'
                            : 'border-neutral-200 bg-white hover:border-neutral-300 cursor-pointer'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center mt-0.5 shrink-0 transition-colors ${
                          isSelected ? 'border-violet-500' : 'border-neutral-300'
                        }`}>
                          {isSelected && <div className="w-2 h-2 rounded-full bg-violet-500" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className={`text-sm font-medium ${!type.available ? 'text-neutral-400' : 'text-neutral-900'}`}>
                              {type.label}
                            </span>
                            {!type.available && (
                              <span className="text-xs text-neutral-400 bg-neutral-100 rounded-full px-2 py-0.5">
                                Not available in demo
                              </span>
                            )}
                          </div>
                          <p className={`text-xs mt-0.5 leading-relaxed ${!type.available ? 'text-neutral-400' : 'text-neutral-500'}`}>
                            {type.description}
                          </p>
                        </div>
                      </div>
                    </button>
                  )
                })}
              </div>

              {errors.claimType && <p className="text-xs text-red-500">{errors.claimType}</p>}

              <div className="flex justify-end pt-1">
                <Button size="lg" onClick={handleNext}>Continue</Button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-5">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">Accident Details</h2>
                  {selectedType && (
                    <span className="text-xs bg-violet-100 text-violet-700 rounded-full px-2 py-0.5 font-medium">
                      {selectedType.label}
                    </span>
                  )}
                </div>
                <p className="text-sm text-neutral-500">Tell us what happened.</p>
              </div>

              <Field label="Date of Accident" error={errors.dateTime}>
                <input
                  type="date"
                  value={form.dateTime}
                  onChange={e => set('dateTime', e.target.value)}
                  onClick={e => (e.target as HTMLInputElement).showPicker?.()}
                  className={inputCls(!!errors.dateTime)}
                />
              </Field>

              <Field label="Location" error={errors.location}>
                <input
                  type="text"
                  placeholder="e.g. Main St & 5th Ave, San Francisco, CA"
                  value={form.location}
                  onChange={e => set('location', e.target.value)}
                  className={inputCls(!!errors.location)}
                />
              </Field>

              <Field label="Description of What Happened" error={errors.description}>
                <textarea
                  rows={4}
                  placeholder="Describe the accident in as much detail as possible…"
                  value={form.description}
                  onChange={e => set('description', e.target.value)}
                  className={`${inputCls(!!errors.description)} resize-none`}
                />
              </Field>

              <Field label="Responding Police Department" error={errors.policeDepartment}>
                <input
                  type="text"
                  placeholder="e.g. SFPD — Mission District Station"
                  value={form.policeDepartment}
                  onChange={e => set('policeDepartment', e.target.value)}
                  className={inputCls(!!errors.policeDepartment)}
                />
              </Field>

              <div className="flex justify-between pt-1">
                <Button variant="ghost" size="lg" onClick={handleBack}>Back</Button>
                <Button size="lg" onClick={handleNext}>Continue</Button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-5">
              <div>
                <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">Opposing Party</h2>
                <p className="text-sm text-neutral-500 mt-0.5">Provide the other driver's information.</p>
              </div>

              <Field label="Full Name" error={errors.opposingPartyName}>
                <input
                  type="text"
                  placeholder="Other driver's full name"
                  value={form.opposingPartyName}
                  onChange={e => set('opposingPartyName', e.target.value)}
                  className={inputCls(!!errors.opposingPartyName)}
                />
              </Field>

              <Field label="Insurance Policy Number" error={errors.opposingPolicyNumber}>
                <input
                  type="text"
                  placeholder="e.g. INS-442901"
                  value={form.opposingPolicyNumber}
                  onChange={e => set('opposingPolicyNumber', e.target.value)}
                  className={inputCls(!!errors.opposingPolicyNumber)}
                />
              </Field>

              <div className="flex justify-between pt-1">
                <Button variant="ghost" size="lg" onClick={handleBack}>Back</Button>
                <Button size="lg" onClick={handleNext}>Continue</Button>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-5">
              <div>
                <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">Supporting Documents</h2>
                <p className="text-sm text-neutral-500 mt-0.5">Upload any photos or reports. Both fields are optional.</p>
              </div>

              <FileUploadZone
                label="Images of Damage"
                accept="image/*"
                files={form.damageImages}
                onChange={files => setForm(prev => ({ ...prev, damageImages: files }))}
              />

              <FileUploadZone
                label="Police Report"
                accept="image/*,application/pdf"
                files={form.policeReport}
                onChange={files => setForm(prev => ({ ...prev, policeReport: files }))}
              />

              <div className="flex justify-between pt-1">
                <Button variant="ghost" size="lg" onClick={handleBack}>Back</Button>
                <Button size="lg" onClick={handleSubmit}>Submit Claim</Button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">{label}</label>
      {children}
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  )
}

function inputCls(hasError: boolean) {
  return `w-full bg-white dark:bg-neutral-900 border ${hasError ? 'border-red-400' : 'border-neutral-200 dark:border-neutral-700'} rounded-lg px-3 py-2.5 text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 dark:placeholder-neutral-600 text-sm focus:outline-none focus:border-violet-500 transition-colors`
}
