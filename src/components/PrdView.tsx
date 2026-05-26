import { TabNav } from './ui/TabNav'

interface PrdViewProps {
  onBack: () => void
  onViewArchitecture: () => void
}

function P0() {
  return (
    <span className="inline-flex items-center gap-1 text-xs font-semibold text-red-600 bg-red-50 border border-red-200 rounded px-1.5 py-0.5 mr-2 align-middle">
      P0
    </span>
  )
}

export function PrdView({ onBack, onViewArchitecture }: PrdViewProps) {
  return (
    <div className="h-full flex flex-col bg-white">
      <header className="shrink-0 border-b border-neutral-200 px-6 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-6 h-6 bg-violet-600 rounded-md flex items-center justify-center">
            <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <span className="text-neutral-900 font-medium text-sm tracking-tight">InsureCo</span>
        </div>
        <TabNav active="prd" onDemo={onBack} onPrd={() => {}} onArchitecture={onViewArchitecture} />
      </header>

      <div className="flex-1 overflow-y-auto">
        <div className="max-w-2xl mx-auto px-8 py-12 space-y-10">

          {/* Title */}
          <div className="border-b border-neutral-100 pb-8">
            <h1 className="text-3xl font-bold text-neutral-900 mb-2">PRD: Car Insurance Claims Agent</h1>
            <p className="text-sm text-neutral-500"><span className="font-medium text-neutral-700">Author:</span> Eric Wang</p>
          </div>

          {/* Context & Vision */}
          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-neutral-900">Context &amp; Vision</h2>
            <p className="text-sm text-neutral-600 leading-relaxed">
              We are working with a leading car insurance company to help them improve their claims process through an agentic workflow that increases accuracy and reduces costs.
            </p>
            <p className="text-sm text-neutral-600 leading-relaxed">
              Approximately 40 million auto insurance claims are reported and processed in the United States every year. By some reports, it represents 70–80% of the operating cost of vehicle insurance companies, which have an aggregate market of $2.27 trillion globally. Solutions for this flow are costly for this space as well, with the global market for claims processing software estimated at about $47B. The size of this market alone and the scale of our customer creates the opportunity for significant impact.
            </p>
            <div className="bg-violet-50 border border-violet-100 rounded-lg px-4 py-3">
              <p className="text-sm text-neutral-700 leading-relaxed">
                Our vision is to <strong>redefine the claims experience for the agentic era</strong> by delivering more human claims experiences and increasing the speed, accuracy, and efficiency of the claim management process.
              </p>
            </div>
          </section>

          {/* Objectives & Metrics */}
          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-neutral-900">Objectives &amp; Metrics</h2>
            <p className="text-sm text-neutral-600 leading-relaxed">
              Our objectives are to increase the efficiency of claims processing and deliver better customer results, as measured by:
            </p>
            <ol className="space-y-2 ml-4">
              {[
                ['Time-to-Resolution', 'the average time it takes to close a claim'],
                ['Number of Claims Processed', null],
                ['Cost per Claim Processed', null],
                ['NPS', 'of customers submitting claims'],
              ].map(([label, desc], i) => (
                <li key={i} className="flex items-baseline gap-2 text-sm text-neutral-600">
                  <span className="text-neutral-400 shrink-0">{i + 1}.</span>
                  <span><strong className="text-neutral-800">{label}</strong>{desc ? `: ${desc}` : ''}</span>
                </li>
              ))}
            </ol>
            <p className="text-sm text-neutral-600 leading-relaxed">
              We can also measure a <strong>series of evals</strong> on the agent, including latency, hallucination rate, linting for structured responses, and accuracy of tool calls.
            </p>
          </section>

          {/* Risks & Ethics */}
          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-neutral-500">Risks &amp; Ethics</h2>
            <p className="text-sm text-neutral-600 leading-relaxed">
              While we are measuring positive improvements to the claims process, we have to keep in mind a few trade-offs when implementing agentic systems:
            </p>
            <ol className="space-y-3 ml-4">
              {[
                ['Abuse or fraud', "It's possible for bad actors to abuse an autonomous system for insurance fraud; these claims should be denied before reaching an adjuster."],
                ['Risk of "unreasonable investigations" or bias', 'At the same time, insurers cannot deny a car insurance claim arbitrarily. It will be important to monitor potential systematic (e.g., regional or economic) biases in our agent.'],
                ['False positives or errors increasing burden on senior claims adjusters', null],
                ['Economic displacement of frontline claims adjusters', 'We can consider how our agent could upskill frontline adjusters to be more effective reviewers of claims.'],
              ].map(([label, desc], i) => (
                <li key={i} className="flex items-baseline gap-2 text-sm text-neutral-600">
                  <span className="text-neutral-400 shrink-0">{i + 1}.</span>
                  <span><strong className="text-neutral-800">{label}</strong>{desc ? `: ${desc}` : ''}</span>
                </li>
              ))}
            </ol>
          </section>

          {/* Persona */}
          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-neutral-900">Persona</h2>
            <p className="text-sm text-neutral-600 leading-relaxed">
              For our initial MVP, we'll focus on building an agent to process personal auto insurance claims because they represent the vast majority of claims in the US. We'll also focus exclusively on collision claims (damage to the vehicle) vs. other types of claims (e.g., liability or bodily injury).
            </p>
          </section>

          {/* User Stories */}
          <section className="space-y-5">
            <h2 className="text-xl font-semibold text-neutral-900">User Stories / Requirements</h2>

            <div className="space-y-4">
              <Requirement>
                <P0 />Users can initiate a claim from a logged-in session.
              </Requirement>

              <Requirement>
                <P0 />Users can input required information for insurance claims in deterministically captured fields:
                <ul className="mt-2 ml-4 space-y-1">
                  <li className="text-sm text-neutral-600 list-disc list-inside">Date, location, description of the accident, police department, opposite party</li>
                  <li className="text-sm text-neutral-600 list-disc list-inside">Fields should be validated if they are critical components to the claims process</li>
                </ul>
              </Requirement>

              <Requirement>
                <P0 />Users can upload documents related to the claim:
                <ul className="mt-2 ml-4 space-y-1">
                  <li className="text-sm text-neutral-600 list-disc list-inside">Images of Damage</li>
                  <li className="text-sm text-neutral-600 list-disc list-inside">Police Report Information</li>
                </ul>
              </Requirement>

              <Requirement>
                <P0 />After submitting initial claim information, users are presented with a chat interface to interact with the agent and view initial results. The <strong>agent architecture</strong> should include:
                <ul className="mt-2 ml-4 space-y-1.5">
                  {[
                    ['An Orchestrator', 'that reasons and routes tool calls; gauges intent and constrains action and responses to the claims process'],
                    ['A Damage Assessment tool', 'that calls a computer vision tool to review the documents and images, and returns structured output'],
                    ['An Anti-fraud Reviewer', null],
                    ['A Policy RAG & Coverage tool', 'that retrieves relevant policy clauses and determines coverage eligibility per damage item'],
                    ['An Estimate Calculator', 'that takes the structured output of the Damage Assessment and provides a potential estimate for the claim'],
                    ['A Repair Shop Tool', 'to provide the user with actionable next steps following their claim'],
                  ].map(([label, desc], i) => (
                    <li key={i} className="text-sm text-neutral-600 list-disc list-inside">
                      <strong>{label}</strong>{desc ? ` — ${desc}` : ''}
                    </li>
                  ))}
                </ul>
              </Requirement>

              <Requirement>
                <P0 /><strong>Human in the loop:</strong> After submitting initial claim information, users should validate the initial damage assessment provided by the agent.
              </Requirement>

              <Requirement>
                <P0 />After submitting the information the user should be asked to wait while a senior claims adjuster reviews the claim.
              </Requirement>

              <Requirement>
                <P0 />If approved, the user is given a claim number as well as an insurer approved repair shop in the user's location.
              </Requirement>

              <Requirement>
                <P0 />Guardrails (e.g., another agent) are used to ensure the agent stays on task:
                <ul className="mt-2 ml-4 space-y-1.5">
                  <li className="text-sm text-neutral-600 list-disc list-inside"><strong>Fraud:</strong> Another agent should monitor the claim for potential fraud and flag to the senior claims adjuster or deny outright</li>
                  <li className="text-sm text-neutral-600 list-disc list-inside"><strong>A task guardrail</strong> to ensure that the agent stays within the claims process and does not answer unrelated queries</li>
                </ul>
              </Requirement>

              <Requirement>
                <P0 />If not approved, or pending further review, users are notified that their claim is still pending. Users are asked to check status of their claim on a dashboard or reach out to support.
              </Requirement>
            </div>
          </section>

          {/* Design Principles */}
          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-neutral-900">Design Principles</h2>
            <ul className="space-y-3">
              {[
                'The intake of initial details is formal (and not chat-based) due to the need for robust data input and the cost of LLM iterating to select key information',
                'We anchored on clarity of tool calls in the chat interface to illustrate progress',
                'Embedded in the chat UX is the ability for the user to validate the agent\'s damage outputs in order to build more trust in the agent and give a sense of control',
                'When final approval is confirmed by the adjuster, an explanation of what was approved is presented to the user for information clarity',
              ].map((p, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-neutral-600">
                  <div className="w-1.5 h-1.5 rounded-full bg-violet-400 mt-1.5 shrink-0" />
                  {p}
                </li>
              ))}
            </ul>
          </section>

          {/* Notes on Prioritization */}
          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-neutral-900">Notes on Prioritization</h2>
            <div className="space-y-3">
              {[
                'Guardrails were included as P0 in the PRD due to enterprise risk of non-deterministic systems',
                'We\'ve deprioritized commercial insurance claims, reducing complexity. We also deprioritized other claim types (e.g., Liability, bodily injury)',
                'We deprioritized an assistant for the claims adjuster, but this information would be similarly useful for an agentic pair-adjuster for the human-in-the-loop',
                'We deprioritized authentication in the agentic experience by assuming the user is logged in when filing their claim',
              ].map((note, i) => (
                <div key={i} className="flex items-start gap-3 text-sm text-neutral-600 bg-neutral-50 border border-neutral-100 rounded-lg px-4 py-3">
                  <span className="text-neutral-400 shrink-0 font-medium">{i + 1}.</span>
                  {note}
                </div>
              ))}
            </div>
          </section>

          <div className="h-8" />
        </div>
      </div>
    </div>
  )
}

function Requirement({ children }: { children: React.ReactNode }) {
  return (
    <div className="border border-neutral-200 rounded-lg px-4 py-3.5 text-sm text-neutral-700 leading-relaxed">
      {children}
    </div>
  )
}
