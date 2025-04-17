# Jito Documentation Monorepo

This repository contains all documentation for Jito's products and services, organized in a monorepo structure with separate sections for each documentation domain.

## Overview

The Jito Documentation Monorepo is built using:
- **Markdown/MDX files**: Stored in GitHub for version control and collaboration
- **Decap CMS**: Provides a user-friendly editing interface
- **Next.js**: Powers the documentation websites

## Repository Structure

The repository follows a structured approach compatible with Decap CMS's nested collections:

```
jito-omnidocs/
├── jitosol/                   # JitoSOL documentation
│   ├── index.md               # Main introduction to JitoSOL
│   ├── liquid-staking/        # Liquid staking section
│   │   ├── index.md           # Section overview
│   │   ├── overview.md        # Detailed overview
│   │   └── faq.md             # Frequently asked questions
│   └── mev/                   # MEV section
│       ├── index.md           # Section overview
│       ├── block-engine.md    # Block engine documentation
│       └── searcher-api.md    # Searcher API documentation
├── governance/                # Governance documentation
│   ├── index.md               # Introduction to governance
│   ├── council/               # Council section
│   │   ├── index.md           # Council overview
│   │   └── members.md         # Council members information
│   └── proposals/             # Proposals section
│       ├── index.md           # Proposals overview
│       ├── submission-process.md # How to submit proposals
│       └── voting.md          # How voting works
├── stakenet/                  # StakeNet documentation
│   ├── index.md               # Introduction to StakeNet
│   └── validators/            # Validators section
│       ├── index.md           # Validators overview
│       ├── requirements.md    # Validator requirements
│       └── setup.md           # Validator setup guide
└── shared/                    # Shared assets
    └── images/                # Shared images
        └── placeholder.png    # Placeholder image
```

## Documentation File Format

Each documentation file uses markdown with frontmatter metadata:

```md
---
title: "Page Title"
description: "Brief description of the page content"
section_type: "page" # Options: page, header, expandable, parent_only, section_meta
order: 10 # Controls display order in navigation
# domain: jitosol # Which documentation domain this belongs to
---

# Page Title

Content starts here...
```

## Section Types

- **page**: Regular content page
- **header**: Section header (typically without content)
- **expandable**: Page with its own content plus child pages
- **parent_only**: Section that only displays children but has no content itself

## Decap CMS Configuration

The repository uses Decap CMS's nested collections feature to manage the documentation hierarchy. The configuration looks like this:

```yaml
collections:
  - name: "jitosol"
    label: "JitoSOL Documentation"
    folder: "jitosol"
    create: true
    nested:
      depth: 100
      summary: '{{title}}'
    meta: 
      path: 
        widget: string
        label: 'Path'
        index_file: 'index'
    fields:
      - {label: "Title", name: "title", widget: "string"}
      - {label: "Description", name: "description", widget: "string"}
      - {label: "Section Type", name: "section_type", widget: "select", options: ["page", "header", "expandable", "parent_only"], default: "page"}
      - {label: "Order", name: "order", widget: "number"}
      - {label: "Domain", name: "domain", widget: "hidden", default: "jitosol"}
      - {label: "Content", name: "body", widget: "markdown"}
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

- Each folder must contain an `index.md` file that serves as the main page for that section
- The CMS uses the `index_file: 'index'` setting to know which file represents each folder
- When adding a new section, always create an index.md file for that section
- The nested structure allows editors to move pages and entire sections through the CMS interface

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

## Deployment

Documentation changes are automatically deployed when merged to the main branch.

## Questions and Support

For questions about this documentation repository, please contact the Jito team.