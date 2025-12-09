# Data Model: Physical AI Humanoid Textbook Documentation

## Content Entities

### Module
- **name**: string - Module name (e.g., "AI Systems Introduction", "ROS2 Humanoid Control")
- **description**: string - Brief description of the module
- **order**: number - Sequential order of the module in the textbook
- **status**: enum(PENDING, DRAFT, REVIEW, PUBLISHED) - Publication status
- **lastUpdated**: datetime - Timestamp of last modification
- **relatedModules**: array - List of related module IDs for cross-referencing

### Document
- **id**: string - Unique identifier for the document
- **title**: string - Document title
- **module**: string - Reference to parent module
- **contentType**: enum(CONCEPTUAL, REFERENCE, TUTORIAL, EXAMPLE) - Type of content
- **path**: string - File path relative to docs directory
- **authors**: array - List of author names
- **tags**: array - Content tags for search and categorization
- **status**: enum(DRAFT, REVIEW, PUBLISHED) - Publication status
- **version**: string - Version identifier
- **relatedDocuments**: array - List of related document IDs

### NavigationItem
- **id**: string - Unique identifier for navigation item
- **title**: string - Display title
- **path**: string - URL path or file path
- **parent**: string - Reference to parent navigation item (null for top-level)
- **order**: number - Display order within parent
- **type**: enum(MODULE, CATEGORY, DOCUMENT, EXTERNAL) - Type of navigation item
- **isVisible**: boolean - Whether item appears in navigation

### SearchIndex
- **id**: string - Unique identifier
- **title**: string - Title of indexed content
- **content**: string - Processed content for search
- **path**: string - Path to the content
- **module**: string - Associated module
- **tags**: array - Associated tags
- **lastIndexed**: datetime - Timestamp of last indexing

## Relationships

### Module → Document
- One-to-many: A module contains multiple documents
- Documents are organized hierarchically within modules

### Document → Document (Related)
- Many-to-many: Documents can reference related documents across modules
- Enables cross-module linking and concept connections

### Module → NavigationItem
- One-to-many: A module may have multiple navigation items
- Supports complex navigation structures within modules

## Content Architecture

### Markdown/MDX Structure
Documents follow Docusaurus's MDX format with frontmatter metadata:

```yaml
---
title: Document Title
description: Brief description of content
sidebar_position: 1
tags: [tag1, tag2, tag3]
---

# Main Content
```

### File Organization
```
docs/
├── module-name/
│   ├── _category_.json    # Category configuration
│   ├── document1.md       # Content document
│   ├── document2.mdx      # Content with React components
│   └── subcategory/
│       ├── _category_.json
│       └── document3.md
```

### Category Configuration
The `_category_.json` files define sidebar organization:

```json
{
  "label": "Category Name",
  "position": 2,
  "link": {
    "type": "generated-index",
    "description": "Brief description of the category"
  }
}
```

## Static Assets Model

### ImageAsset
- **id**: string - Unique identifier
- **filename**: string - Original file name
- **path**: string - Path in static directory
- **altText**: string - Alternative text for accessibility
- **contentType**: string - MIME type
- **dimensions**: object - Width and height for optimization

### DownloadableFile
- **id**: string - Unique identifier
- **filename**: string - Original file name
- **path**: string - Path in static directory
- **size**: number - File size in bytes
- **contentType**: string - MIME type
- **description**: string - Brief description of content