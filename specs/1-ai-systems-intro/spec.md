# Feature Specification: Module 1: Introduction to AI Systems & Problem Framing

**Feature Branch**: `1-ai-systems-intro`
**Created**: 2025-12-05
**Status**: Draft
**Input**: User description: "Module 1 = Introduction to AI Systems & Problem Framing

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
- Submission of a problem statement with clear evaluation metrics"

## User Scenarios & Testing

### User Story 1 - Understand AI System Concepts (Priority: P1)

Students need to grasp the foundational concepts of AI systems, their types, and real-world applications to build a strong theoretical base for practical problem-solving.

**Why this priority**: This is foundational knowledge for the entire module and subsequent AI studies. Without it, practical application will lack context.

**Independent Test**: Can be fully tested by evaluating a student's ability to identify AI-solvable problems, describe system workflows, and categorize AI systems, demonstrating understanding of core concepts.

**Acceptance Scenarios**:

1.  **Given** a description of a real-world problem, **When** the student is asked to identify if it can be solved with AI, **Then** the student correctly classifies problems suitable for AI solutions.
2.  **Given** various AI applications, **When** the student is asked to describe the end-to-end workflow of an AI system, **Then** the student accurately outlines the input, processing, and output stages.
3.  **Given** a list of AI system types (e.g., vision, NLP, robotics), **When** the student is asked to provide examples of their use, **Then** the student offers relevant and distinct examples for each category.

---

### User Story 2 - Set Up ML Environment & Run Basic Script (Priority: P1)

Students must be able to set up a minimal machine learning environment and execute a basic "hello world" ML script to gain hands-on experience with AI tools.

**Why this priority**: Practical setup and execution are critical for reinforcing theoretical concepts and preparing students for future implementation tasks.

**Independent Test**: Can be fully tested by observing a student successfully installing Python and required libraries, then running a simple ML script (e.g., linear classifier or prediction) and demonstrating its output.

**Acceptance Scenarios**:

1.  **Given** instructions for environment setup, **When** the student attempts to install Python and basic ML libraries (scikit-learn, NumPy, Pandas), **Then** the student successfully sets up the environment without critical errors.
2.  **Given** a minimal "hello world" ML script, **When** the student executes the script in their environment, **Then** the script runs successfully and produces the expected output.
3.  **Given** an output from a basic ML script, **When** the student is asked to explain the script's basic functionality, **Then** the student provides a high-level explanation of the script's purpose and result.

---

### User Story 3 - Frame Problems & Define Success Metrics (Priority: P1)

Students need to develop the skill of translating real-world problems into structured AI problem statements and defining measurable success criteria for their solutions.

**Why this priority**: Problem framing is a crucial skill for any AI practitioner, ensuring that efforts are directed towards well-defined, measurable goals.

**Independent Test**: Can be fully tested by evaluating a student's submitted problem statement and success metrics against clarity, structure, and measurability, demonstrating their ability to frame an AI task.

**Acceptance Scenarios**:

1.  **Given** a complex real-world problem, **When** the student is asked to create a structured problem statement for an AI solution, **Then** the problem statement clearly articulates the objective, scope, and key components (data, model, evaluation).
2.  **Given** a problem statement, **When** the student is asked to define measurable success criteria, **Then** the student proposes at least two quantitative and one qualitative metric that are technology-agnostic and verifiable.
3.  **Given** different types of problems (classification, detection, prediction), **When** the student provides an example of framing each, **Then** the student accurately demonstrates the framing process for each problem type.

---

### Edge Cases

- What happens when a student's environment setup fails due to unexpected system configurations? (Guidance on common troubleshooting steps)
- How does the system handle input data that is malformed or outside expected ranges in the "hello world" script? (Basic error handling/data validation explanation)

## Requirements

### Functional Requirements

- **FR-001**: The module MUST equip students with foundational knowledge of AI-driven systems.
- **FR-002**: The module MUST enable students to identify and classify real-world problems solvable by AI.
- **FR-003**: The module MUST teach students to break problems into data, model, and evaluation components.
- **FR-004**: The module MUST provide an understanding of end-to-end AI system workflows (input → processing → output).
- **FR-005**: The module MUST describe key categories of AI systems (vision, language, robotics, planning).
- **FR-006**: The module MUST guide students in setting up a minimal environment for basic ML experiments.
- **FR-007**: The module MUST enable students to run a minimal "hello world" ML script (e.g., linear classifier or simple prediction).
- **FR-008**: The module MUST teach students to write a structured problem statement with measurable success criteria.
- **FR-009**: The module MUST focus on practical reasoning, data-to-model thinking, and system-level understanding over pure theory.
- **FR-010**: The module MUST introduce essential tools (Python, Jupyter/Colab, scikit-learn, NumPy, Pandas) and terminology.
- **FR-011**: The module MUST connect concepts to later stages of data collection, model training, and deployment.

## Success Criteria

### Measurable Outcomes

- **SC-001**: 90% of students will correctly identify AI-solvable problems from a given set of real-world scenarios in an assessment.
- **SC-002**: 85% of students will successfully set up the minimal ML environment and run a "hello world" script as demonstrated in a practical exercise.
- **SC-003**: 80% of students will be able to construct a problem statement for a new AI task, including at least two measurable success criteria, that meets defined structural and content guidelines.
- **SC-004**: Students will demonstrate a clear understanding of AI system flow and terminology through conceptual assessment with an average score of 85% or higher.
