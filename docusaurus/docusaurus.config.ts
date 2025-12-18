import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const config: Config = {
  title: 'Physical AI Humanoid Textbook',
  tagline: 'Comprehensive Guide to AI Humanoid Development',
  favicon: 'img/favicon.ico',

  // Future flags, see https://docusaurus.io/docs/api/docusaurus-config#future
  future: {
    v4: true, // Improve compatibility with the upcoming Docusaurus v4
  },

  // Set the production url of your site here
  url: 'https://Hackathon-physical-ai-humanoid-textbook',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: 'https://Hackathon-physical-ai-humanoid-textbook',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'alvina-abdullah', // Usually your GitHub org/user name.
  projectName: 'Hackathon-physical-ai-humanoid-textbook', // Usually your repo name.

  onBrokenLinks: 'throw',

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            'https://github.com/your-username/physical-ai-humanoid-textbook',
        },
        blog: {
          showReadingTime: true,
          feedOptions: {
            type: ['rss', 'atom'],
            xslt: true,
          },
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            'https://github.com/your-username/physical-ai-humanoid-textbook',
          // Useful options to enforce blogging best practices
          onInlineTags: 'warn',
          onInlineAuthors: 'warn',
          onUntruncatedBlogPosts: 'warn',
        },
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

 
  themeConfig: {
    // Replace with your project's social card
    image: 'img/docusaurus-social-card.jpg',

    // SEO and social metadata
    metadata: [
      {
        name: 'keywords',
        content: 'ai, robotics, humanoid, artificial intelligence, machine learning, ros2, digital twin, cognitive architecture, robot control, humanoid development'
      },
      {
        name: 'description',
        content: 'Comprehensive textbook on AI-powered humanoid robotics development covering AI systems, ROS2 control, digital twin simulation, and cognitive architectures.'
      },
      {
        name: 'og:title',
        content: 'Physical AI Humanoid Textbook'
      },
      {
        name: 'og:description',
        content: 'Complete guide to developing AI-powered humanoid robots with modern techniques and best practices.'
      },
      {
        name: 'og:type',
        content: 'website'
      },
      {
        name: 'og:url',
        content: 'https://your-username.github.io/physical-ai-humanoid-textbook'
      },
      {
        name: 'og:image',
        content: 'img/docusaurus-social-card.jpg'
      },
      {
        name: 'twitter:card',
        content: 'summary_large_image'
      },
      {
        name: 'twitter:title',
        content: 'Physical AI Humanoid Textbook'
      },
      {
        name: 'twitter:description',
        content: 'Complete guide to developing AI-powered humanoid robots with modern techniques and best practices.'
      },
      {
        name: 'twitter:image',
        content: 'img/docusaurus-social-card.jpg'
      }
    ],
    colorMode: {
      respectPrefersColorScheme: true,
    },
    navbar: {
      title: 'Physical AI Humanoid',
      logo: {
        alt: 'Physical AI Humanoid Logo',
        src: 'img/logo.svg',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'aiSystemsIntro',
          position: 'left',
          label: 'AI Systems',
        },
        {
          type: 'docSidebar',
          sidebarId: 'ros2HumanoidControl',
          position: 'left',
          label: 'ROS2 Control',
        },
        {
          type: 'docSidebar',
          sidebarId: 'digitalTwinSim',
          position: 'left',
          label: 'Digital Twin',
        },
        {
          type: 'docSidebar',
          sidebarId: 'aiRobotBrain',
          position: 'left',
          label: 'AI Brain',
        },
        {to: '/blog', label: 'Blog', position: 'left'},
        {
          href: 'https://github.com/alvina-abdullah/Hackathon-physical-ai-humanoid-textbook',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Modules',
          items: [
            {
              label: 'AI Systems Introduction',
              to: '/docs/ai-systems-intro/intro',
            },
            {
              label: 'ROS2 Humanoid Control',
              to: '/docs/ros2-humanoid-control/setup',
            },
            {
              label: 'Digital Twin Simulation',
              to: '/docs/digital-twin-sim/overview',
            },
            {
              label: 'AI Robot Brain',
              to: '/docs/ai-robot-brain/cognitive-arch',
            },
          ],
        },
        {
          title: 'Community',
          items: [
            {
              label: 'Stack Overflow',
              href: 'https://stackoverflow.com/questions/tagged/ai-humanoid',
            },
            {
              label: 'Discord',
              href: 'https://discordapp.com/invite/ai-humanoid',
            },
            {
              label: 'X',
              href: 'https://x.com/ai_humanoid',
            },
          ],
        },
        {
          title: 'More',
          items: [
            {
              label: 'Blog',
              to: '/blog',
            },
            {
              label: 'GitHub',
              href: 'https://github.com/your-username/physical-ai-humanoid-textbook',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Physical AI Humanoid Project. Built with Docusaurus.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
