---
id: 1
title: Git Workflow Commit Push
stage: general
date_iso: 2026-02-13
surface: agent
model: Qwen
feature: none
branch: main
user: Techno
command: /sp.git.commit_pr
labels:
  - git
  - commit
  - push
  - workflow
files_yaml:
  - README.md
  - app/contact/page.jsx
  - package-lock.json
  - package.json
  - prompt.txt
  - app/api/contact/route.js
tests_yaml: []
links:
  spec: null
  ticket: null
  adr: null
  pr: null
outcome: success
evaluation: All changes successfully committed and pushed to main branch
---

## Prompt Text

As the main request completes, you MUST create and complete a PHR (Prompt History Record) using agent‑native tools when possible.

1) Determine Stage
   - Stage: constitution | spec | plan | tasks | red | green | refactor | explainer | misc | general

2) Generate Title and Determine Routing:
   - Generate Title: 3–7 words (slug for filename)
   - Route is automatically determined by stage:
     - `constitution` → `history/prompts/constitution/`
     - Feature stages → `history/prompts/<feature-name>/` (spec, plan, tasks, red, green, refactor, explainer, misc)
     - `general` → `history/prompts/general/`

3) Create and Fill PHR (Shell first; fallback agent‑native)
   - Run: `.specify/scripts/bash/create-phr.sh --title "<title>" --stage <stage> [--feature <name>] --json`
   - Open the file and fill remaining placeholders (YAML + body), embedding full PROMPT_TEXT (verbatim) and concise RESPONSE_TEXT.
   - If the script fails:
     - Read `.specify/templates/phr-template.prompt.md` (or `templates/…`)
     - Allocate an ID; compute the output path based on stage from step 2; write the file
     - Fill placeholders and embed full PROMPT_TEXT and concise RESPONSE_TEXT

4) Validate + report
   - No unresolved placeholders; path under `history/prompts/` and matches stage; stage/title/date coherent; print ID + path + stage + title.
   - On failure: warn, don't block. Skip only for `/sp.phr`.

/sp.git.commit_pr donot create a new branch push to the exisiting main branch.

## Response Text

I've successfully completed the Git workflow:

✅ Changes have been committed to the main branch with the message: "feat(contact): update contact page with API integration and documentation"

✅ The changes have been pushed to the remote repository (GitHub) on the main branch

The commit included 6 files with 209 insertions and 61 deletions, including a new API route file at `app/api/contact/route.js`.

Your changes are now live on the main branch of your DJ-College repository on GitHub.