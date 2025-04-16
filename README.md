# Jito Documentation Monorepo

This repository contains all documentation for Jito's products and services, organized in a monorepo structure with separate sections for each documentation domain.

## Overview

The Jito Documentation Monorepo is built using:
- **Markdown/MDX files**: Stored in GitHub for version control and collaboration
- **Decap CMS**: Provides a user-friendly editing interface
- **Next.js**: Powers the documentation websites

## Repository Structure

```
jito-omnidocs/
├── jitosol/                   # JitoSOL documentation (jito.network/docs/jitosol)
│   ├── _meta.json             # Navigation metadata
│   ├── introduction.md        # Introduction to Jito
│   ├── liquid-staking/        # JITOSOL LIQUID STAKING section
│   │   ├── _section.json      # Section metadata
│   │   ├── _index.md          # Landing page for section
│   │   └── ...                # Child pages
│   └── ...
├── governance/                # Governance documentation
│   └── ...
├── stakenet/                  # StakeNet documentation
│   └── ...
├── restaking/                 # Restaking documentation
│   └── ...
├── tiprouter/                 # Tip Router documentation
│   └── ...
└── shared/                    # Shared assets and components
    ├── images/                # Shared images
    └── ...
```

## Documentation File Format

Each documentation file uses markdown with frontmatter metadata:

```md
---
title: "Page Title"
description: "Brief description of the page content"
section_type: "page" # Options: page, header, expandable, parent_only
order: 10 # Controls display order in navigation
domain: "jitosol" # Which documentation domain this belongs to
---

# Page Title

Content starts here...
```

## Section Types

- **page**: Regular content page
- **header**: Section header (typically without content)
- **expandable**: Page with its own content plus child pages
- **parent_only**: Section that only displays children but has no content itself

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
4. Click "New..." and select the type of content
5. Fill out the form and use the rich text editor
6. Save and publish

## Content Guidelines

- Use clear, concise language
- Include code examples where applicable
- Add screenshots or diagrams to illustrate complex concepts
- Use proper heading hierarchy (H1, H2, H3)
- Link related content between pages
- Prioritize up-to-date information

## LLM Instructions for Creating Test Documentation

To populate this repository with test documentation:

1. Create the basic directory structure as shown above
2. For each domain, create an introduction page plus at least 3 content pages
3. Use the appropriate frontmatter format for each file
4. Generate realistic content that mimics the actual documentation
5. Organize content hierarchically with appropriate section types
6. Include sample images in the shared/images directory
7. Create cross-references between related pages

## Local Development

To run the documentation site locally:

```bash
# Clone the repository
git clone https://github.com/jito-foundation/jito-omnidocs.git
cd jito-omnidocs

# Set up the Next.js app (in a separate repository)
# Follow setup instructions in the documentation-frontend repository
```

## Deployment

Documentation changes are automatically deployed when merged to the main branch.

## Questions and Support

For questions about this documentation repository, please contact the Jito team.
