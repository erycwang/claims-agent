# Car Insurance Claims Agent

An AI-powered prototype that automates the manual review and assessment stage of the auto insurance claims process — reducing cost per claim, improving turnaround time, and delivering a clearer experience for policyholders.

**Live prototype:** https://claims-agent.vercel.app/

---

## Overview

Today, claims agents spend the majority of their time manually reviewing damage photos, estimating repair costs, and cross-referencing policy documents — a slow, expensive, and inconsistent process. This prototype replaces that manual workflow with an agentic pipeline that handles intake, damage assessment, fraud screening, policy matching, and repair routing automatically, while keeping a human in the loop for validation.

The agent focuses on **personal auto collision claims**, which represent the vast majority of US auto claims and the highest share of insurer operating costs (~70–80%).

---

## User Flow

```
Dashboard  →  Claim Intake Form  →  Agent Pipeline  →  Outcome
```

1. **Dashboard** — Policyholder views their active policy and initiates a new claim.
2. **Claim Intake Form** — Structured fields capture the date, location, accident description, police report details, and opposing party. Damage photos are uploaded here.
3. **Agent Pipeline** — Six tools run sequentially. The policyholder sees each tool's status and output in real time, with one explicit pause for human validation.
4. **Outcome** — Approved claims receive a claim ID, per-item coverage decision with policy citations, and a nearby approved repair shop. Pending claims are routed to a senior adjuster with context attached.

---

## Agent Architecture

The orchestrator routes each claim through six tools in sequence:

| Tool | What it does |
|---|---|
| **Intent Classifier** | Validates the request is a collision claim and confirms coverage type |
| **Damage Assessment** | Analyzes uploaded images and incident description; returns structured damage items by area and severity |
| **Anti-fraud Reviewer** | Scores the claim against anomaly signals and policy history; flags high-risk claims for adjuster review |
| **Policy RAG & Coverage Checker** | Retrieves the active policy and maps each damage item to coverage terms |
| **Estimate Calculator** | Computes a preliminary repair cost range based on confirmed damage items and regional labor rates |
| **Repair Shop & Claim ID Provider** | Assigns a claim ID and locates the nearest insurer-approved repair facility |

### Human in the Loop

After the Damage Assessment runs, the pipeline pauses and surfaces each detected damage item for the policyholder to confirm or reject before proceeding. This gives the user agency, improves accuracy on edge cases, and builds trust in the agent's outputs — a deliberate design choice to avoid fully autonomous claim decisions.

---

## Key Design Decisions

**Structured intake, not a chat interface** — Initial claim details are captured via a form rather than a conversation. This reduces LLM latency on structured data extraction and ensures consistent, validated inputs for downstream tools.

**Transparent tool execution** — Each tool's name, status, and output is shown in the UI as it runs. Policyholders understand what's happening and why, rather than waiting for a black-box result.

**Guardrails as P0** — Fraud detection and intent classification are treated as non-negotiable in an agentic system. The fraud reviewer can flag claims before they reach an adjuster; the intent classifier prevents the agent from responding to out-of-scope queries.

**Per-item coverage decisions with policy citations** — Rather than a binary approved/denied outcome, the final result shows exactly which damage items are covered, which are excluded, and the specific policy clause behind each exclusion. This reduces adjuster follow-up calls and policyholder confusion.

---

## Tech Stack

- **React 19 + TypeScript** — UI and state management
- **Vite + Tailwind CSS v4** — Build tooling and styling
- **Built with Claude Code** — AI coding assistant used throughout development

---

## Getting Started

```bash
npm install
npm run dev
```

The app runs at `http://localhost:5173`.

### Demo Mode

The dashboard includes an **outcome toggle** (Approved / Pending) so you can walk through both claim resolution paths. All agent tool calls are simulated with realistic timing and structured outputs.
