# Quickstart Guide: Physical AI Humanoid Textbook Documentation

## Prerequisites

- Node.js version 18 or higher
- npm or yarn package manager
- Git for version control
- A GitHub account for deployment

## Local Development Setup

### 1. Clone the Repository
```bash
git clone https://github.com/[your-username]/physical-ai-humanoid-textbook.git
cd physical-ai-humanoid-textbook
```

### 2. Navigate to Docusaurus Directory
```bash
cd docusaurus
```

### 3. Install Dependencies
```bash
npm install
# or
yarn install
```

### 4. Start Local Development Server
```bash
npm run start
# or
yarn start
```

This command starts a local development server and opens the documentation site in your browser at `http://localhost:3000`. Most changes are reflected live without having to restart the server.

## Project Structure Overview

```
docusaurus/
├── blog/              # Blog posts directory
├── docs/              # Main documentation content
│   ├── ai-systems-intro/      # Module 1
│   ├── ros2-humanoid-control/ # Module 2
│   ├── digital-twin-sim/      # Module 3
│   └── ai-robot-brain/        # Module 4
├── src/               # Custom React components
├── static/            # Static assets (images, files)
├── docusaurus.config.ts  # Site configuration
├── sidebars.ts        # Sidebar navigation
└── package.json       # Dependencies and scripts
```

## Adding New Content

### 1. Create a New Document
Add a new Markdown file in the appropriate module directory:

```bash
# Example: Adding content to the AI Systems Introduction module
touch docs/ai-systems-intro/new-topic.md
```

### 2. Add Frontmatter
Include required metadata at the top of your document:

```markdown
---
title: Title of Your Document
description: Brief description of the content
sidebar_position: 3  # Position in sidebar
tags: [ai, fundamentals, introduction]
---

# Your Document Title

Your content here...
```

### 3. Update Sidebar Configuration
Add your document to `sidebars.ts` to make it appear in navigation:

```typescript
// In sidebars.ts
module.exports = {
  aiSystemsIntro: [
    'ai-systems-intro/intro',
    'ai-systems-intro/fundamentals',
    'ai-systems-intro/new-topic',  // Add your document here
    'ai-systems-intro/applications',
  ],
  // ... other modules
};
```

## Building and Deployment

### 1. Build Static Files
```bash
npm run build
# or
yarn build
```

The built files will be in the `build/` directory and are ready to be deployed to any static hosting service.

### 2. Preview Build Locally
```bash
npm run serve
# or
yarn serve
```

### 3. Deploy to GitHub Pages
The site is configured to deploy automatically via GitHub Actions when changes are pushed to the main branch. Ensure your `docusaurus.config.ts` has the correct GitHub settings:

```typescript
// In docusaurus.config.ts
{
  organizationName: 'your-github-username',
  projectName: 'your-repository-name',
  deploymentBranch: 'gh-pages',
}
```

## Custom Components

### Using MDX Components
You can use React components directly in your Markdown files:

```mdx
import MyComponent from '@site/src/components/MyComponent';

# My Documentation

<MyComponent />

## More content here
```

### Creating a New Component
1. Create a new component in `src/components/`
2. Use TypeScript with proper typing
3. Import and use in your MDX files

## Theming and Styling

### Custom CSS
Add custom styles to `src/css/custom.css`. The file already includes CSS variable overrides:

```css
:root {
  --ifm-color-primary: #2e8555;
  --ifm-color-primary-dark: #29784c;
  --ifm-color-primary-darker: #277148;
  --ifm-color-primary-darkest: #205d3b;
  --ifm-color-primary-light: #33925d;
  --ifm-color-primary-lighter: #359962;
  --ifm-color-primary-lightest: #3cad6e;
  --ifm-code-font-size: 95%;
  --docusaurus-highlighted-code-line-bg: rgba(0, 0, 0, 0.1);
}
```

### Dark Mode
The theme supports automatic dark mode. You can customize dark mode styles by adding:

```css
[data-theme='dark'] {
  --ifm-color-primary: #25c2a0;
  --docusaurus-highlighted-code-line-bg: rgba(0, 0, 0, 0.3);
}
```

## Testing and Validation

### 1. Check for Broken Links
```bash
npm run docusaurus check-links
# or
yarn docusaurus check-links
```

### 2. Type Checking
```bash
npm run typecheck
# or
yarn typecheck
```

### 3. Build Validation
```bash
npm run build
# or
yarn build
```

## Common Tasks

### Update Documentation
1. Make changes to Markdown files in the `docs/` directory
2. Verify changes locally with `npm run start`
3. Commit and push changes to GitHub
4. GitHub Actions will automatically deploy to GitHub Pages

### Add New Module
1. Create a new directory in `docs/` for the module
2. Add an introductory document with frontmatter
3. Create a `_category_.json` file in the module directory
4. Update `sidebars.ts` to include the new module

### Customize Navigation
1. Edit `docusaurus.config.ts` to modify top-level navigation
2. Update `sidebars.ts` to modify sidebar navigation
3. Use `_category_.json` files to organize content within modules

## Troubleshooting

### Common Issues

**Port Already in Use**
```bash
# Kill the process using port 3000
lsof -ti:3000 | xargs kill -9  # On macOS/Linux
# or
netstat -ano | findstr :3000   # On Windows to find PID, then kill the process
```

**Dependency Issues**
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

**Build Failures**
- Check for syntax errors in Markdown files
- Verify all linked files exist
- Ensure all required frontmatter is present in new documents