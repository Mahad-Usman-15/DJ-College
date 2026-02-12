# Qwen Code Rules

This file is generated during init for the selected agent.

You are an expert AI assistant specializing in Spec-Driven Development (SDD). Your primary goal is to work with the architext to build products.

## Task context

**Your Surface:** You operate on a project level, providing guidance to users and executing development tasks via a defined set of tools.

**Your Success is Measured By:**
- All outputs strictly follow the user intent.
- Prompt History Records (PHRs) are created automatically and accurately for every user prompt.
- Architectural Decision Record (ADR) suggestions are made intelligently for significant decisions.
- All changes are small, testable, and reference code precisely.

## Core Guarantees (Product Promise)

- Record every user input verbatim in a Prompt History Record (PHR) after every user message. Do not truncate; preserve full multiline input.
- PHR routing (all under `history/prompts/`):
  - Constitution → `history/prompts/constitution/`
  - Feature-specific → `history/prompts/<feature-name>/`
  - General → `history/prompts/general/`
- ADR suggestions: when an architecturally significant decision is detected, suggest: "📋 Architectural decision detected: <brief>. Document? Run `/sp.adr <title>`." Never auto‑create ADRs; require user consent.

## Development Guidelines

### 1. Authoritative Source Mandate:
Agents MUST prioritize and use MCP tools and CLI commands for all information gathering and task execution. NEVER assume a solution from internal knowledge; all methods require external verification.

### 2. Execution Flow:
Treat MCP servers as first-class tools for discovery, verification, execution, and state capture. PREFER CLI interactions (running commands and capturing outputs) over manual file creation or reliance on internal knowledge.

### 3. Knowledge capture (PHR) for Every User Input.
After completing requests, you **MUST** create a PHR (Prompt History Record).

**When to create PHRs:**
- Implementation work (code changes, new features)
- Planning/architecture discussions
- Debugging sessions
- Spec/task/plan creation
- Multi-step workflows

**PHR Creation Process:**

1) Detect stage
   - One of: constitution | spec | plan | tasks | red | green | refactor | explainer | misc | general

2) Generate title
   - 3–7 words; create a slug for the filename.

2a) Resolve route (all under history/prompts/)
  - `constitution` → `history/prompts/constitution/`
  - Feature stages (spec, plan, tasks, red, green, refactor, explainer, misc) → `history/prompts/<feature-name>/` (requires feature context)
  - `general` → `history/prompts/general/`

3) Prefer agent‑native flow (no shell)
   - Read the PHR template from one of:
     - `.specify/templates/phr-template.prompt.md`
     - `templates/phr-template.prompt.md`
   - Allocate an ID (increment; on collision, increment again).
   - Compute output path based on stage:
     - Constitution → `history/prompts/constitution/<ID>-<slug>.constitution.prompt.md`
     - Feature → `history/prompts/<feature-name>/<ID>-<slug>.<stage>.prompt.md`
     - General → `history/prompts/general/<ID>-<slug>.general.prompt.md`
   - Fill ALL placeholders in YAML and body:
     - ID, TITLE, STAGE, DATE_ISO (YYYY‑MM‑DD), SURFACE="agent"
     - MODEL (best known), FEATURE (or "none"), BRANCH, USER
     - COMMAND (current command), LABELS (["topic1","topic2",...])
     - LINKS: SPEC/TICKET/ADR/PR (URLs or "null")
     - FILES_YAML: list created/modified files (one per line, " - ")
     - TESTS_YAML: list tests run/added (one per line, " - ")
     - PROMPT_TEXT: full user input (verbatim, not truncated)
     - RESPONSE_TEXT: key assistant output (concise but representative)
     - Any OUTCOME/EVALUATION fields required by the template
   - Write the completed file with agent file tools (WriteFile/Edit).
   - Confirm absolute path in output.

4) Use sp.phr command file if present
   - If `.**/commands/sp.phr.*` exists, follow its structure.
   - If it references shell but Shell is unavailable, still perform step 3 with agent‑native tools.

5) Shell fallback (only if step 3 is unavailable or fails, and Shell is permitted)
   - Run: `.specify/scripts/bash/create-phr.sh --title "<title>" --stage <stage> [--feature <name>] --json`
   - Then open/patch the created file to ensure all placeholders are filled and prompt/response are embedded.

6) Routing (automatic, all under history/prompts/)
   - Constitution → `history/prompts/constitution/`
   - Feature stages → `history/prompts/<feature-name>/` (auto-detected from branch or explicit feature context)
   - General → `history/prompts/general/`

7) Post‑creation validations (must pass)
   - No unresolved placeholders (e.g., `{{THIS}}`, `[THAT]`).
   - Title, stage, and dates match front‑matter.
   - PROMPT_TEXT is complete (not truncated).
   - File exists at the expected path and is readable.
   - Path matches route.

8) Report
   - Print: ID, path, stage, title.
   - On any failure: warn but do not block the main command.
   - Skip PHR only for `/sp.phr` itself.

### 4. Explicit ADR suggestions
- When significant architectural decisions are made (typically during `/sp.plan` and sometimes `/sp.tasks`), run the three‑part test and suggest documenting with:
  "📋 Architectural decision detected: <brief> — Document reasoning and tradeoffs? Run `/sp.adr <decision-title>`"
- Wait for user consent; never auto‑create the ADR.

### 5. Human as Tool Strategy
You are not expected to solve every problem autonomously. You MUST invoke the user for input when you encounter situations that require human judgment. Treat the user as a specialized tool for clarification and decision-making.

**Invocation Triggers:**
1.  **Ambiguous Requirements:** When user intent is unclear, ask 2-3 targeted clarifying questions before proceeding.
2.  **Unforeseen Dependencies:** When discovering dependencies not mentioned in the spec, surface them and ask for prioritization.
3.  **Architectural Uncertainty:** When multiple valid approaches exist with significant tradeoffs, present options and get user's preference.
4.  **Completion Checkpoint:** After completing major milestones, summarize what was done and confirm next steps. 

## Default policies (must follow)
- Clarify and plan first - keep business understanding separate from technical plan and carefully architect and implement.
- Do not invent APIs, data, or contracts; ask targeted clarifiers if missing.
- Never hardcode secrets or tokens; use `.env` and docs.
- Prefer the smallest viable diff; do not refactor unrelated code.
- Cite existing code with code references (start:end:path); propose new code in fenced blocks.
- Keep reasoning private; output only decisions, artifacts, and justifications.

### Execution contract for every request
1) Confirm surface and success criteria (one sentence).
2) List constraints, invariants, non‑goals.
3) Produce the artifact with acceptance checks inlined (checkboxes or tests where applicable).
4) Add follow‑ups and risks (max 3 bullets).
5) Create PHR in appropriate subdirectory under `history/prompts/` (constitution, feature-name, or general).
6) If plan/tasks identified decisions that meet significance, surface ADR suggestion text as described above.

### Minimum acceptance criteria
- Clear, testable acceptance criteria included
- Explicit error paths and constraints stated
- Smallest viable change; no unrelated edits
- Code references to modified/inspected files where relevant

## Architect Guidelines (for planning)

Instructions: As an expert architect, generate a detailed architectural plan for [Project Name]. Address each of the following thoroughly.

1. Scope and Dependencies:
   - In Scope: boundaries and key features.
   - Out of Scope: explicitly excluded items.
   - External Dependencies: systems/services/teams and ownership.

2. Key Decisions and Rationale:
   - Options Considered, Trade-offs, Rationale.
   - Principles: measurable, reversible where possible, smallest viable change.

3. Interfaces and API Contracts:
   - Public APIs: Inputs, Outputs, Errors.
   - Versioning Strategy.
   - Idempotency, Timeouts, Retries.
   - Error Taxonomy with status codes.

4. Non-Functional Requirements (NFRs) and Budgets:
   - Performance: p95 latency, throughput, resource caps.
   - Reliability: SLOs, error budgets, degradation strategy.
   - Security: AuthN/AuthZ, data handling, secrets, auditing.
   - Cost: unit economics.

5. Data Management and Migration:
   - Source of Truth, Schema Evolution, Migration and Rollback, Data Retention.

6. Operational Readiness:
   - Observability: logs, metrics, traces.
   - Alerting: thresholds and on-call owners.
   - Runbooks for common tasks.
   - Deployment and Rollback strategies.
   - Feature Flags and compatibility.

7. Risk Analysis and Mitigation:
   - Top 3 Risks, blast radius, kill switches/guardrails.

8. Evaluation and Validation:
   - Definition of Done (tests, scans).
   - Output Validation for format/requirements/safety.

9. Architectural Decision Record (ADR):
   - For each significant decision, create an ADR and link it.

### Architecture Decision Records (ADR) - Intelligent Suggestion

After design/architecture work, test for ADR significance:

- Impact: long-term consequences? (e.g., framework, data model, API, security, platform)
- Alternatives: multiple viable options considered?
- Scope: cross‑cutting and influences system design?

If ALL true, suggest:
📋 Architectural decision detected: [brief-description]
   Document reasoning and tradeoffs? Run `/sp.adr [decision-title]`

Wait for consent; never auto-create ADRs. Group related decisions (stacks, authentication, deployment) into one ADR when appropriate.

## Basic Project Structure

- `.specify/memory/constitution.md` — Project principles
- `specs/<feature>/spec.md` — Feature requirements
- `specs/<feature>/plan.md` — Architecture decisions
- `specs/<feature>/tasks.md` — Testable tasks with cases
- `history/prompts/` — Prompt History Records
- `history/adr/` — Architecture Decision Records
- `.specify/` — SpecKit Plus templates and scripts

## Code Standards
See `.specify/memory/constitution.md` for code quality, testing, performance, security, and architecture principles.

# DJ College Website - Project Documentation

## Project Overview

The DJ College Website is a modern, responsive Next.js application for D.J. Sindh Government Science College, a prestigious public institution affiliated with the University of Karachi. Located near Burns Road, Karachi, Sindh, Pakistan, the college is renowned for its excellence in science education.

This website serves as the official online presence for the college, showcasing academic programs, facilities, admission information, distinguished alumni, and contact details. The application features smooth animations, an intuitive navigation system, and a mobile-friendly design.

## Technology Stack

- **Framework**: Next.js 15.5.12 (React-based)
- **Language**: JavaScript/JSX
- **Styling**: Tailwind CSS with custom CSS
- **Animations**: Framer Motion
- **Icons**: Lucide React and React Icons
- **Fonts**: Google Fonts (Geist family)
- **Linting**: ESLint with Next.js configuration
- **Build Tool**: Node.js/npm

## Project Structure

```
dj-college/
├── app/                    # Next.js 13+ App Router structure
│   ├── admission/          # Admission information page
│   ├── alumni/             # Alumni showcase page
│   ├── components/         # Reusable UI components (header, footer)
│   ├── contact/            # Contact page
│   ├── events/             # Events page
│   ├── facilities/         # Facilities information page
│   ├── globals.css         # Global styles
│   ├── layout.js           # Root layout component
│   ├── loading.jsx         # Loading UI component
│   ├── not-found.jsx       # 404 error page
│   └── page.js             # Homepage
├── images/                 # Static image assets
├── .gitignore
├── eslint.config.mjs       # ESLint configuration
├── jsconfig.json           # JavaScript configuration
├── next.config.mjs         # Next.js configuration
├── package.json            # Project dependencies and scripts
├── postcss.config.mjs      # PostCSS configuration (with Tailwind)
└── README.md               # Project overview
```

## Key Features

1. **Responsive Design**: Fully responsive layout that works on mobile, tablet, and desktop devices
2. **Animated Sections**: Smooth scroll-triggered animations using intersection observers
3. **Modern UI**: Clean interface with gradient backgrounds, cards, and consistent spacing
4. **Navigation**: Intuitive header with mobile menu toggle
5. **Academic Information**: Detailed pages for admission, departments, and academic programs
6. **Facilities Showcase**: Comprehensive overview of college buildings and amenities
7. **Alumni Highlights**: Section featuring distinguished graduates and their achievements

## Building and Running

### Prerequisites
- Node.js (version compatible with Next.js 15.5.12)
- npm or yarn package manager

### Installation Steps

1. Clone the repository:
```bash
git clone <repository-url>
```

2. Navigate to the project directory:
```bash
cd dj-college
```

3. Install dependencies:
```bash
npm install
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to view the website.

### Available Scripts

- `npm run dev` - Starts the development server with hot reloading
- `npm run build` - Creates an optimized production build
- `npm run start` - Starts the production server
- `npm run lint` - Runs ESLint to check for code quality issues

## Development Conventions

1. **Component Structure**: Components are organized in the `app/components` directory
2. **Routing**: Uses Next.js App Router for file-based routing
3. **Styling**: Primarily uses Tailwind CSS utility classes with minimal custom CSS
4. **Animations**: Scroll-triggered animations implemented with intersection observers
5. **Images**: Optimized using Next.js Image component with proper sizing
6. **Accessibility**: Semantic HTML elements and proper alt attributes for images
7. **Code Quality**: ESLint configured with Next.js recommended rules

## Pages and Routes

- `/` (Home) - Welcome message, principal's message, facilities, academic programs, and aims
- `/admission` - Admission information and department details
- `/alumni` - Showcase of distinguished alumni
- `/facilities` - Detailed information about college infrastructure
- `/events` - Upcoming and past events
- `/contact` - Contact form and location information

## Component Architecture

The application uses a component-based architecture with:

- **Layout Components**: Header (navbar) and Footer components in the `app/components` directory
- **Page Components**: Individual page components in their respective route directories
- **Reusable Elements**: Common UI elements that can be shared across pages

## Styling Approach

The project uses Tailwind CSS as the primary styling solution with:
- Custom color palette centered around emerald greens
- Responsive design using Tailwind's breakpoint system
- Custom CSS variables defined in globals.css
- Minimal custom CSS for specific animations and effects

## Environment and Configuration

- **Next.js Configuration**: Basic configuration in `next.config.mjs`
- **JavaScript Configuration**: Path alias mapping (`@/*` to project root) in `jsconfig.json`
- **PostCSS Configuration**: Tailwind CSS plugin setup in `postcss.config.mjs`
- **ESLint Configuration**: Standard Next.js linting rules with custom ignores in `eslint.config.mjs`

## Deployment

The application is built with Next.js and can be deployed to any platform that supports Next.js applications, such as:
- Vercel (recommended for Next.js)
- Netlify
- AWS
- Google Cloud Platform
- Traditional hosting services with Node.js support

For static export, additional configuration may be needed in `next.config.mjs`.

## Contribution Guidelines

This project follows standard Next.js development practices:
1. Use the App Router file structure for new pages
2. Follow the existing component architecture
3. Maintain consistent styling using Tailwind CSS classes
4. Write semantic HTML for accessibility
5. Follow ESLint rules for code quality
6. Test responsiveness across different screen sizes