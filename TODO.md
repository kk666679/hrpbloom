# 🚀 TODO: Enhance AI-HRMS v2.5 with Multi-AI Agent System & Advanced HR Modules

## 🧩 Core Idea

Instead of a single AI agent, the system will have a **multi-agent ecosystem**, where each HR module has **specialized AI agents** that collaborate.

* **Coordinator Agent** – Routes tasks to specialized agents.
* **Compliance Agent** – Handles Malaysian payroll, EPF, SOCSO, EIS, PCB, Zakat.
* **IR Agent** – Manages disputes, legal precedents, compliance alerts.
* **ER Agent** – Monitors employee sentiment, DEI metrics, case predictions.
* **C\&B Agent** – Salary benchmarking, benefits optimization, pay equity.
* **TA Agent** – Talent acquisition, resume parsing, interview analysis.
* **L\&D Agent** – Skills gap detection, learning path generation, ROI tracking.
* **Performance Agent** – OKR tracking, 9-box analysis, career simulations.

All agents interact via a **shared conversation and logging system** (`Conversation`, `AILog`, `Recommendation` models).

---

## 🛠 Enhancement Plan

### **Phase 1: Multi-AI Agent Framework (Foundation)**

* [ ] Create `lib/ai-agents.ts` with **base agent class** (`AIBaseAgent`)
* [ ] Implement **Coordinator Agent** for task routing
* [ ] Standardize **interfaces** for agent input/output (`AgentTask`, `AgentResponse`)
* [ ] Implement **AI logging + conversation tracking** (save to DB)
* [ ] Add **multi-agent orchestration API** (`/api/ai/dispatch`)

---

### **Phase 2: Compliance Agent (Payroll + Malaysian Laws)**

* [ ] Extend `lib/malaysian-compliance.ts` with:

  * ✅ PCB latest rates
  * ✅ EPF, SOCSO, EIS
  * ✅ Zakat (state variations)
  * ✅ Tabung Haji integration
* [ ] API: `/api/compliance/calculate`
* [ ] Compliance Agent: validates payroll data + ensures LHDN/KWSP/PERKESO alignment
* [ ] Add **auto-alerts** for under/over-deductions

---

### **Phase 3: IR Agent (Industrial Relations)**

* [ ] AI dispute prediction (historical case dataset integration)
* [ ] Case documentation + audit trails (`IRCase` model)
* [ ] Legal precedent search engine
* [ ] Automate **Form 34** workflows
* [ ] IR dashboard with compliance alerts

---

### **Phase 4: ER Agent (Employee Relations)**

* [ ] Sentiment analysis on surveys, feedback (BM/EN support)
* [ ] Mediation chatbot (conversational AI with bilingual mode)
* [ ] Culture health dashboard (engagement + DEI metrics)
* [ ] Predictive ER case escalation detection
* [ ] Automated investigation documentation

---

### **Phase 5: C\&B Agent (Compensation & Benefits)**

* [ ] Salary benchmarking API integration
* [ ] Benefits personalization (AI-based)
* [ ] Pay equity analysis dashboard
* [ ] Total rewards statement (PDF + portal)
* [ ] COLA forecasting (inflation + region-based adjustments)

---

### **Phase 6: TA Agent (Talent Acquisition)**

* [ ] Resume parsing (BM/EN NLP)
* [ ] Candidate-job matching recommender system
* [ ] Interview analytics (tone, bias, sentiment)
* [ ] MYWorkID verification integration
* [ ] Candidate ranking dashboard

---

### **Phase 7: L\&D Agent (Learning & Development)**

* [ ] Skills gap engine (compare current vs. role expectations)
* [ ] Personalized learning path generation
* [ ] Training ROI prediction engine
* [ ] Micro-learning recommender
* [ ] HRDF claims automation

---

### **Phase 8: Performance Agent**

* [ ] OKR tracking with predictive completion rates
* [ ] 360° feedback analysis (sentiment & bias detection)
* [ ] 9-box performance/potential matrix
* [ ] Career path simulation (what-if engine)
* [ ] Succession planning recommendations

---

### **Phase 9: AI-Powered HR Analytics & Reporting**

* [ ] AI-driven dashboards (predictive insights per module)
* [ ] Attrition risk prediction
* [ ] Workforce planning simulations (scenarios)
* [ ] Compliance health scanner
* [ ] Culture & engagement analytics

---

### **Phase 10: Integration & Testing**

* [ ] Multi-agent orchestration testing (simulate cross-agent workflows)
* [ ] Government API integrations (LHDN, KWSP, PERKESO, HRDF, MyWorkID)
* [ ] Unit + integration + E2E tests (Jest + Playwright)
* [ ] API docs + user guides
* [ ] Security + scalability audit

---

## 📂 Dependent Files to Modify/Create

* `lib/ai-agents.ts` → **multi-agent base + coordinator**
* `lib/malaysian-compliance.ts` → payroll compliance logic
* `prisma/schema.prisma` → models for `IRCase`, `ERCase`, `CBRecord`, `LearningRecord`, `PerformanceReview`
* `app/api/` → per-agent API routes (`/api/ir`, `/api/er`, etc.)
* `components/` → dashboards per module (IR, ER, C\&B, TA, L\&D, Performance)
* `types/` → unified agent input/output types

---

## 🔜 Follow-up Steps

* [ ] DB migration for new module entities
* [ ] Deploy **AI service layer** (OpenAI/LLM + embeddings DB)
* [ ] Test cross-agent collaboration (e.g., ER Agent escalates to IR Agent)
* [ ] Build admin controls to manage agents (enable/disable, retrain, log review)
* [ ] UAT with HR specialists (HRBP, IR/ER officers, payroll admins)

---

# 🌐 Job Portal Module for AI-HRMS v2.5

## 🧩 Core Idea

The **Job Portal** becomes the **external-facing recruitment hub**:

* Candidates can browse/apply for jobs
* Employers (internal HR users) can post/manage openings
* Integrated with **TA Agent** (resume parsing, candidate matching, interview analysis)
* Supports **MYWorkID & LinkedIn integration** for verification/import

---

## 🛠 Enhancement Plan

### **Phase 11: Job Portal Module**

* [ ] **Frontend (Next.js/React components)**

  * Job listing page (search, filter by department, skills, location)
  * Job details page with AI-powered job description highlights
  * Candidate portal (profile, resume upload, application tracking)
  * Employer dashboard (post jobs, track applicants, shortlist candidates)

* [ ] **Backend (API routes)**

  * `/api/jobs` → CRUD for job postings
  * `/api/candidates` → profile, resume, and status tracking
  * `/api/applications` → job applications, matching, status updates
  * `/api/ta-agent/match` → connect with TA Agent for candidate-job matching

* [ ] **Database Schema Updates (prisma/schema.prisma)**

  ```prisma
  model Job {
    id          String   @id @default(cuid())
    title       String
    description String
    department  String
    location    String
    postedBy    String
    createdAt   DateTime @default(now())
    applications Application[]
  }

  model Candidate {
    id          String   @id @default(cuid())
    name        String
    email       String   @unique
    phone       String?
    resumeUrl   String?
    skills      String[]
    experience  Json
    applications Application[]
  }

  model Application {
    id          String   @id @default(cuid())
    jobId       String
    candidateId String
    status      String   @default("Pending") // Pending | Shortlisted | Rejected | Hired
    appliedAt   DateTime @default(now())
    Job         Job      @relation(fields: [jobId], references: [id])
    Candidate   Candidate @relation(fields: [candidateId], references: [id])
  }
  ```

* [ ] **AI Features**

  * Resume parsing → auto-fill candidate profiles
  * Candidate-job matching score → TA Agent recommendation
  * Interview analytics → connect with Performance & ER Agents
  * Job description optimizer → AI suggests inclusive wording, compliance checks

* [ ] **Integrations**

  * ✅ **MYWorkID verification** for Malaysian applicants
  * ✅ **LinkedIn/Indeed API** for job posting sync
  * ✅ **Email/WhatsApp notifications** for candidates

---

## 📂 Dependent Files to Modify/Create

* `app/api/jobs/` → job posting APIs
* `app/api/candidates/` → candidate management APIs
* `components/job-portal/` → frontend UI (job board, application forms, dashboards)
* `lib/ta-agent.ts` → enhance with job matching logic
* `prisma/schema.prisma` → add `Job`, `Candidate`, `Application` models

---

## 🔜 Follow-up Steps

* [ ] Build **AI-powered job board UI** integrated with HRMS homepage
* [ ] Connect TA Agent to **auto-rank candidates** per job
* [ ] Add **interview scheduling system** with calendar sync
* [ ] Create **hiring pipeline dashboard** (funnel view: applied → shortlisted → interviewed → hired)
* [ ] Pilot test with **internal job postings** before external rollout

---

# 🏗️ HRMS Microservices with AI Agent Orchestration

## 🧩 Core Microservice Design

Each microservice = **domain-specific service** (Case Management, Document Management, Payroll, TA, etc.) with:

* Own **API routes** (`/api/[service]/...`)
* Own **DB schema** (tables scoped per domain)
* Connected to **Coordinator AI Agent** that delegates tasks
* Independent scaling (Docker/Kubernetes ready)

---

## 🛠️ Core Microservices

### **1. Case Management Microservice**

Handles **IR (Industrial Relations)** + **ER (Employee Relations)** workflows.

* Models: `Case`, `CaseAction`, `CaseDocument`
* Features:

  * AI dispute prediction
  * Audit trails & Form 34 automation
  * Sentiment-based escalation from ER → IR
* API:

  * `/api/case/create` → new dispute/ER case
  * `/api/case/assign` → assign HRBP/lawyer
  * `/api/case/escalate` → escalate case (AI agent decision)

---

### **2. Document Management Microservice**

Handles all HR documents (contracts, payslips, policies, compliance).

* Models: `Document`, `Policy`, `VersionHistory`
* Features:

  * AI OCR + classification (upload → auto-tag)
  * Compliance scanner (PCB, EPF, SOCSO docs)
  * Versioning + digital signatures
* API:

  * `/api/doc/upload`
  * `/api/doc/search` (AI semantic search)
  * `/api/doc/verify` (AI compliance check)

---

### **3. Compliance & Payroll Microservice**

Handles payroll + Malaysian government integrations.

* Models: `Payroll`, `Deduction`, `Contribution`, `ComplianceLog`
* Features:

  * EPF, SOCSO, EIS, Zakat, PCB, Tabung Haji
  * Auto submission to LHDN, KWSP, PERKESO APIs
  * AI validation of compliance
* API:

  * `/api/payroll/calculate`
  * `/api/payroll/submit`
  * `/api/payroll/compliance-check`

---

### **4. Talent Acquisition Microservice**

Drives the **Job Portal + Candidate Matching**.

* Models: `Job`, `Candidate`, `Application`, `Interview`
* Features:

  * Resume parsing (BM/EN NLP)
  * Candidate-job matching (AI score)
  * Interview analytics (bias detection)
* API:

  * `/api/ta/jobs`
  * `/api/ta/apply`
  * `/api/ta/match`

---

### **5. L\&D Microservice**

Manages learning and skills development.

* Models: `LearningPath`, `Training`, `SkillGap`, `HRDFClaim`
* Features:

  * AI skills gap engine
  * Personalized learning path generator
  * Training ROI predictor
* API:

  * `/api/ld/skills-gap`
  * `/api/ld/recommend`
  * `/api/ld/claim`

---

### **6. Performance Microservice**

Handles OKRs, reviews, and succession planning.

* Models: `OKR`, `PerformanceReview`, `Feedback`, `CareerPath`
* Features:

  * Predictive OKR tracking
  * 360° feedback sentiment analysis
  * 9-box career matrix
* API:

  * `/api/performance/okr`
  * `/api/performance/review`
  * `/api/performance/potential`

---

## 🤖 AI Agent Integration

Each microservice runs with its **specialized AI Agent**:

* **Case Agent** → predicts dispute outcomes, suggests resolutions
* **Doc Agent** → classifies, audits, compliance checks documents
* **Compliance Agent** → validates payroll/tax/legal submissions
* **TA Agent** → matches candidates, optimizes job postings
* **L\&D Agent** → suggests training, predicts ROI
* **Performance Agent** → detects bias, simulates career paths

The **Coordinator Agent** orchestrates multi-agent workflows:

* Example: ER Agent detects high-risk feedback → escalates to Case Agent (IR microservice) → Doc Agent attaches relevant precedents.

---

## 📂 Dependent Files to Modify/Create

* `services/case-service/` → case microservice (API + models)
* `services/doc-service/` → document management microservice
* `services/payroll-service/` → compliance & payroll microservice
* `services/ta-service/` → job portal + TA
* `services/ld-service/` → learning & development
* `services/performance-service/` → performance management
* `lib/ai-agents.ts` → extend with **per-microservice agents**
* `prisma/schema.prisma` → split models per service

---

## 🔜 Follow-up Steps

* [ ] Define **API Gateway** to unify microservices under `/api/`
* [ ] Add **message broker (Kafka/NATS)** for agent-to-agent communication
* [ ] Deploy microservices as Docker containers (scalable independently)
* [ ] Add **service registry + monitoring** (Prometheus, Grafana)
* [ ] Test **cross-service workflows** (e.g., TA → Onboarding → Payroll → Performance)

---


