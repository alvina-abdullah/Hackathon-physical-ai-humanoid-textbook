---
id: 0002
title: Module 1 Spec for AI Systems & Problem Framing
stage: spec
date: 2025-12-05
surface: agent
model: claude-sonnet-4-5-20250929
feature: ai-systems-intro
branch: 1-ai-systems-intro
user: User
command: /sp.specify
labels: [spec, ai-systems-intro]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
  - specs/1-ai-systems-intro/spec.md
  - specs/1-ai-systems-intro/checklists/requirements.md
tests:
  -
---

## Prompt

```text
Module 1 = Introduction to AI Systems & Problem Framing

## Objective
Equip students with the foundational knowledge required to understand AI-driven systems, core concepts, workflows, and how real-world problems are translated into solvable AI tasks.
The module focuses on **practical reasoning**, **data-to-model thinking**, and **system-level understanding** rather than pure theory.

## Target Audience
- Beginner → intermediate students entering AI or robotics programs
- Students with basic programming knowledge (Python preferred)
- No prior machine learning, ROS2, or simulation experience required

## Learning Outcomes
By the end of this module, students should be able to:
- Identify and classify real-world problems that can be solved with AI
- Break a real problem into **data**, **model**, and **evaluation** components
- Understand end-to-end AI system workflow (input → processing → output)
- Describe key categories of AI systems (vision, language, robotics, planning)
- Set up a minimal environment for running basic ML experiments
- Create a simple problem statement and define measurable success criteria

## Content Scope
- High-level AI concepts without deep math
- Practical understanding of how AI systems operate in real environments
- Focus on problem framing: requirements → constraints → goals
- Introduce essential tools and terminology
- Avoid deep theory (calculus, proofs), brand comparisons, or marketing
- Connect this module to beginning stages of **data collection**, **model training**, and **deployment** covered later in the course

## Required Teaching Elements

### 1. Conceptual Understanding
- What is an AI system?
- AI system types and where they are used (vision, NLP, recommender, robotics)
- Why problem framing matters
- Relationship between data, model, task, and evaluation

### 2. Technical Elements
- System workflow diagrams (describe architecture)
- Types of datasets (structured/unstructured)
- Input/output formats
- Evaluation concepts (accuracy, error, constraints)

### 3. Hands-On Skills
- Installing Python + basic ML environment
- Running a minimal “hello world” ML script (e.g., linear classifier or simple prediction)
- Writing a structured **problem statement** and defining success metrics

### 4. Examples / Case Studies
- Example of framing a:
  - classification problem
  - detection problem
  - prediction problem
- Real-life examples from industry and daily life

### 5. Tools & Platforms
Use lightweight tools to keep the module accessible:
- **Python**
- **Jupyter Notebook / Google Colab**
- **scikit-learn** (simple models)
- **NumPy, Pandas**
- Basic command-line tools

### 6. Assessment Criteria
Students should demonstrate:
- Ability to frame a real-world problem into an AI-task format
- Understanding of AI system flow and terminology
- Ability to run a beginner-level ML script
- Submission of a problem statement with clear evaluation metrics
```

## Response snapshot

```text
The specification for "Module 1: Introduction to AI Systems & Problem Framing" has been successfully created and validated.

**Branch Name:** `1-ai-systems-intro`
**Spec File Path:** `specs/1-ai-systems-intro/spec.md`
**Checklist Results:** All items passed validation.
**Readiness:** The spec is ready for the next phase, which is `/sp.plan`.
```

## Outcome

- ✅ Impact: Specification for Module 1 created and validated.
- 🧪 Tests: N/A
- 📁 Files: specs/1-ai-systems-intro/spec.md, specs/1-ai-systems-intro/checklists/requirements.md
- 🔁 Next prompts: Proceed to planning using `/sp.plan`.
- 🧠 Reflection: The `create-phr.sh` script failed; manual PHR creation was necessary. Investigate script execution issues.

## Evaluation notes (flywheel)

- Failure modes observed: `create-phr.sh` script not found or not executable. Manual PHR creation was successful.
- Graders run and results (PASS/FAIL): PASS
- Prompt variant (if applicable): N/A
- Next experiment (smallest change to try): Verify `create-phr.sh` script path and execution permissions.
