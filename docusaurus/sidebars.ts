import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

/**
 * Creating a sidebar enables you to:
 - create an ordered group of docs
 - render a sidebar for each doc of that group
 - provide next/previous navigation

 The sidebars can be generated from the filesystem, or explicitly defined here.

 Create as many sidebars as you want.
 */
const sidebars: SidebarsConfig = {
  // Module-specific sidebars for the Physical AI Humanoid Textbook
  aiSystemsIntro: [
    {
      type: 'category',
      label: 'AI Systems Introduction',
      items: ['ai-systems-intro/intro', 'ai-systems-intro/fundamentals', 'ai-systems-intro/applications'],
      link: {
        type: 'generated-index',
        description: 'Introduction to AI systems concepts and fundamentals',
      },
    },
  ],

  ros2HumanoidControl: [
    {
      type: 'category',
      label: 'ROS2 Humanoid Control',
      items: ['ros2-humanoid-control/setup', 'ros2-humanoid-control/architecture', 'ros2-humanoid-control/examples'],
      link: {
        type: 'generated-index',
        description: 'ROS2 framework for humanoid robot control',
      },
    },
  ],

  digitalTwinSim: [
    {
      type: 'category',
      label: 'Digital Twin Simulation',
      items: ['digital-twin-sim/overview', 'digital-twin-sim/implementation', 'digital-twin-sim/validation'],
      link: {
        type: 'generated-index',
        description: 'Simulation and digital twin concepts for humanoid robots',
      },
    },
  ],

  aiRobotBrain: [
    {
      type: 'category',
      label: 'AI Robot Brain',
      items: ['ai-robot-brain/cognitive-arch', 'ai-robot-brain/learning-methods', 'ai-robot-brain/decision-making'],
      link: {
        type: 'generated-index',
        description: 'Cognitive architecture and decision-making for AI robots',
      },
    },
  ],

  // Additional sidebar for general documentation
  general: [
    'getting-started',
  ],
};

export default sidebars;
