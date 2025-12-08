---
id: 0003
title: Module 2 Spec for The Robotic Nervous System (ROS 2)
stage: spec
date: 2025-12-05
surface: agent
model: claude-sonnet-4-5-20250929
feature: ros2-humanoid-control
branch: 2-ros2-humanoid-control
user: User
command: /sp.specify
labels: [spec, ros2-humanoid-control]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
  - specs/2-ros2-humanoid-control/spec.md
  - specs/2-ros2-humanoid-control/checklists/requirements.md
tests:
  -
---

## Prompt

```text
Module 2 = The Robotic Nervous System (ROS 2)

## Objective
Teach students how to control humanoid robots using **ROS 2**, bridging the gap between Python agents and real-world robot systems.
Focus on **middleware architecture**, **nodes, topics, and services**, and **robot description formats** for practical humanoid control.

## Target Audience
- Beginner → intermediate students in robotics or AI
- Students familiar with Python programming
- No prior ROS 2, Isaac Sim, or robot hardware experience required

## Learning Outcomes
By the end of this module, students should be able to:
- Understand ROS 2 architecture, nodes, topics, services, and actions
- Build and launch ROS 2 packages using Python (`rclpy`)
- Bridge AI agents to ROS 2 controllers
- Create and visualize a **URDF** (Unified Robot Description Format) model for a humanoid
- Simulate robot components and verify communication pipelines
- Debug simple ROS 2 nodes and identify common errors

## Content Scope
- Core ROS 2 concepts for humanoid robotics
- Node, topic, service, and action workflows
- Python-based agent integration
- URDF modeling for humanoid robots
- Avoid ROS 1 tutorials, hardware-only solutions, or marketing comparisons
- Focus on **practical, hands-on exercises** and **simulation-ready skills**

## Required Teaching Elements

### 1. Conceptual Understanding
- ROS 2 middleware architecture and communication patterns
- Difference between nodes, topics, services, and actions
- Why URDF is critical for humanoid robot modeling

### 2. Technical Elements
- Installing ROS 2 Humble/Iron on Ubuntu 22.04
- Creating ROS 2 workspaces and packages
- Launch files and parameter configuration
- Publishing and subscribing to topics
- Writing Python nodes with `rclpy`

### 3. Hands-On Skills
- Build a minimal humanoid URDF model
- Simulate a joint or sensor in Gazebo
- Connect a Python agent to control a robot’s limb via ROS 2
- Debug communication pipelines

### 4. Examples / Case Studies
- Simple two-joint robotic arm controlled via ROS 2
- Simulated humanoid walking or arm movement
- Debugging a failed topic subscription

### 5. Tools & Platforms
- **Ubuntu 22.04 LTS**
- **ROS 2 Humble/Iron**
- **Gazebo / Ignition**
- **Python 3.10+**
- **URDF/SDF editors**
- **rclpy Python client library**

### 6. Assessment Criteria
Students should demonstrate:
- Ability to create ROS 2 packages and nodes
- Successful communication between Python agents and robot nodes
- Correctly modeled URDF for a humanoid limb
- Simulated basic robot action in Gazebo or Unity
- Debugging of simple communication issues
```

## Response snapshot

```text
The specification for "Module 2: The Robotic Nervous System (ROS 2)" has been successfully created and validated.

**Branch Name:** `2-ros2-humanoid-control`
**Spec File Path:** `specs/2-ros2-humanoid-control/spec.md`
**Checklist Results:** All items passed validation.
**Readiness:** The spec is ready for the next phase, which is `/sp.plan`.
```

## Outcome

- ✅ Impact: Specification for Module 2 created and validated.
- 🧪 Tests: N/A
- 📁 Files: specs/2-ros2-humanoid-control/spec.md, specs/2-ros2-humanoid-control/checklists/requirements.md
- 🔁 Next prompts: Proceed to planning using `/sp.plan`.
- 🧠 Reflection: The `create-phr.sh` script failed; manual PHR creation was necessary. Investigate script execution issues.

## Evaluation notes (flywheel)

- Failure modes observed: `create-phr.sh` script not found or not executable. Manual PHR creation was successful.
- Graders run and results (PASS/FAIL): PASS
- Prompt variant (if applicable): N/A
- Next experiment (smallest change to try): Verify `create-phr.sh` script path and execution permissions.
