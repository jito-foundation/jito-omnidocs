# Jito Documentation Monorepo

This repository contains all documentation for Jito's products and services, organized in a monorepo structure with separate sections for each documentation domain.

## Overview

The Jito Documentation Monorepo is built using:
- **Markdown/MDX files**: Stored in GitHub for version control and collaboration
- **Decap CMS**: Provides a user-friendly editing interface
- **Next.js**: Powers the documentation websites

## Repository Structure

The repository follows a structured approach compatible with Decap CMS's nested collections. **Note that each folder must contain an index.md file** as this is required for Decap CMS nested collections to work properly:

```
jito-omnidocs/
├── jito_network/                        # JitoSOL documentation
│   ├── introduction-to-jito/            # Introduction to Jito
│   │   └── index.md                     # Main introduction page
│   ├── jitosol-liquid-staking/          # JitoSOL liquid staking section
│   │   ├── index.md                     # Section overview
│   │   ├── liquid-staking-basic/        # Liquid staking basics
│   │   │   └── index.md                 # Liquid staking basics content
│   │   ├── maximum-extractable-value-basic/ # MEV basics
│   │   │   └── index.md                 # MEV basics content
│   │   └── stake-delegation/            # Stake delegation information
│   │       └── index.md                 # Stake delegation content
│   ├── get-started/                     # Getting started guides
│   │   ├── index.md                     # Getting started overview
│   │   ├── stake_sol_for_jitosol/       # Guide to stake SOL for JitoSOL
│   │   │   └── index.md                 # Staking guide content
│   │   └── buying_or_selling_jitosol/   # Guide to buy/sell JitoSOL
│   │       └── index.md                 # Buying/selling guide content
│   └── faqs/                            # Frequently asked questions
│       ├── index.md                     # FAQs overview
│       └── general-faqs/                # General FAQs
│           └── index.md                 # General FAQs content
├── stakenet/                            # StakeNet documentation
├── governance/                          # Governance documentation
└── shared/                              # Shared assets
    └── images/                          # Shared images
```

## Documentation File Format

Each documentation file uses markdown with frontmatter metadata:

```md
---
title: "Page Title"
description: '' #deprecated
subtitle: 'Brief description of the page content'
section_type: "page" # Options: page, header, expandable, meta
order: 10 # Controls display order in navigation
---

# Page Title

Content starts here...
```

## Section Types

- **page**: Regular content page
- **header**: Section header (typically without content)
- **expandable**: Page with its own content plus child pages
- **meta**: Meta information page

## Decap CMS Configuration

The repository uses Decap CMS's nested collections feature to manage the documentation hierarchy. The configuration looks like this:

```yaml
backend:
  name: github
  repo: jito-foundation/jito-omnidocs
  branch: master
  base_url: http://localhost:3001

local_backend: true

media_folder: "shared/images"
public_folder: "/shared/images"

collections:
  - name: "jito_network"
    label: "JitoSOL Documentation"
    label_singular: 'JitoSOL Doc'
    folder: "jito_network"
    create: true
    nested:
      depth: 100
      summary: '{{title}}'
      subfolders: false
    meta: { path: { widget: string, label: 'Path', index_file: 'index' } }
    fields:
      - {label: "Title", name: "title", widget: "string"}
      - {label: "Description", name: "description", widget: "string", hint: "Short description that will appear in navigation and search results"}
      - {label: "Section Type", name: "section_type", widget: "select", options: [
          {label: "Standard Page", value: "page"},
          {label: "Section Header", value: "header"},
          {label: "Expandable Section", value: "expandable"},
          {label: "Meta Page", value: "meta"}
        ], default: "page"}
      - {label: "Order", name: "order", widget: "number", value_type: "int", min: 0, max: 100}
      - {
          label: "Content", 
          name: "body", 
          widget: "markdown",
          editor_components: ["code-block"],
          buttons: [
            "bold", 
            "italic", 
            "code", 
            "link", 
            "heading-one", 
            "heading-two", 
            "heading-three", 
            "quote", 
            "bulleted-list", 
            "numbered-list"
          ],
          modes: ["rich_text", "raw"]
        }
```

## Adding New Documentation

### Manual Method

1. Create a markdown file in the appropriate directory
2. Add required frontmatter (title, description, section_type, order)
3. Write your content using markdown
4. Commit and push to GitHub

### Using Decap CMS

1. Go to your documentation site's admin panel (e.g., jito.network/admin)
2. Log in with GitHub
3. Navigate to the appropriate collection (e.g., JitoSOL Documentation)
4. Use the nested folder view to navigate to the correct location
5. Click "New..." and create your content
6. Fill out the form and use the rich text editor
7. Save and publish

## Important Notes on Folder Structure

- **Each folder MUST contain an `index.md` file** that serves as the main page for that section
- This index.md file requirement is critical for Decap CMS nested collections to work properly
- The CMS uses the `index_file: 'index'` setting in the meta configuration to identify which file represents each folder
- When adding a new section or subsection, always create an index.md file in that folder first
- The nested structure allows editors to move pages and entire sections through the CMS interface
- If a folder is missing its index.md file, it may not appear correctly in the CMS or in navigation

## Content Guidelines

- Use clear, concise language
- Include code examples where applicable
- Add screenshots or diagrams to illustrate complex concepts
- Use proper heading hierarchy (H1, H2, H3)
- Link related content between pages
- Prioritize up-to-date information

## Local Development

To run the documentation locally with Decap CMS:

```bash
# Clone the repository
git clone https://github.com/jito-foundation/jito-omnidocs.git
cd jito-omnidocs

# Run the local Decap CMS proxy server
npx decap-server

# In a separate terminal, run your frontend application
# Follow setup instructions in your frontend repository
```

## Integration with Next.js

The documentation is integrated into a Next.js application using one of two approaches:

1. **Direct API Calls**: Making GitHub API calls during build time (getStaticProps/getStaticPaths) to fetch content file by file.
   - Requires GitHub Personal Access Token for authentication
   - Higher rate limits (5,000 requests/hour) with proper authentication
   - Simple setup but may hit rate limits with many pages

2. **Full Repository Clone**: Pre-build step that clones or downloads the entire repository.
   - Uses `git clone --depth 1` or downloads a zip/tarball via GitHub API
   - Content accessed via standard Node.js file system operations
   - Reduces API calls and avoids rate limits
   - Faster for large documentation sites

The Admin page component initializes Decap CMS with custom preview styles:

```jsx
import { useEffect } from 'react'
import JitoPreview from './JitoPreview'

const AdminPage = () => {
  useEffect(() => {
    // Using a self-executing async function to load the CMS
    (async () => {
      // Import CMS dynamically as a global object
      const CMS = (await import('decap-cms-app')).default

      // Register preview styles from the CSS file in public directory
      CMS.registerPreviewStyle('/preview.css')

      // Register custom preview template
      CMS.registerPreviewTemplate('jito_network', JitoPreview)

      // Initialize the CMS
      CMS.init()
    })()
  }, [])

  return <div id="nc-root" />
}

export default AdminPage
```

## Deployment

Documentation changes are automatically deployed when merged to the master branch.

## Questions and Support

For questions about this documentation repository, please contact the Jito team.