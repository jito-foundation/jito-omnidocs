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
├── jitosol/                        # JitoSOL documentation
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
├── governance/                          # Governance documentation
└── shared/                              # Shared assets
    └── images/                          # Shared images
        ├── governance/                  # Governance-specific images
        ├── jitosol/                     # JitoSOL-specific images
        ├── restaking/                   # Restaking-specific images
        └── tiprouter/                   # TipRouter-specific images
```

## Documentation File Format

Each documentation file uses markdown with frontmatter metadata:

```md
---
title: "Page Title"
subtitle: "Optional short description of the page content" # Optional
section_type: "page" # Options: page, header, expandable
order: 10 # Controls display order in navigation (0-100)
mermaid: false # Optional, set to true if the page uses Mermaid diagrams
---

# Page Title

Content starts here...
```

## Section Types

- **page**: Regular content page
- **header**: Section header (typically without content)
- **expandable**: Page with its own content plus child pages

## Decap CMS Configuration

The repository uses Decap CMS's nested collections feature to manage the documentation hierarchy. Each documentation section has its own collection with appropriate media folders. The configuration looks like this:

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
  - name: "jitosol"
    label: "JitoSOL Documentation"
    label_singular: 'JitoSOL Doc'
    folder: "jitosol"
    create: true
    nested:
      depth: 100
      summary: '{{title}}'
      subfolders: false
    meta: { path: { widget: string, label: 'Path', index_file: 'index' } }
    fields:
      - {label: "Title", name: "title", widget: "string"}
      - {label: "Subtitle", name: "subtitle", widget: "string", hint: "Short optional subtitle"}
      - {label: "Section Type", name: "section_type", widget: "select", options: [
          {label: "Standard Page", value: "page"},
          {label: "Section Header", value: "header"},
          {label: "Expandable Section", value: "expandable"}
        ], default: "page"}
      - {label: "Order", name: "order", widget: "number", value_type: "int", min: 0, max: 100}
      - {label: "Mermaid Diagram?", name: "mermaid", widget: "boolean", required: false, default: false}
      - {label: "Body", name: "body", widget: "markdown"}
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

## Embedding Code

#### Full-width Code Blocks

<!-- Method 1: Triple backticks in markdown -->
To use triple backticks:
```text
```javascript
const data = { example: "value" };
```

<!-- Method 2: HTML with code tag + class -->
To use an HTML `code` tag with a class:
```text
<code class="block" data-language="javascript">
const data = { example: "value" };
</code>
```

<!-- Method 3: HTML pre/code combination -->
To use an HTML `pre` and `code` tag combination:
```text
<pre><code>
function example() {
  return true;
}
</code></pre>
```

#### Inline Code

<!-- Method 1: Single backticks in markdown -->
To use single backticks for inline code, like `Use \`inline code\` for variables`:
```text
Use `inline code` for variables
```

<!-- Method 2: HTML with code tag -->
To use an HTML `code` tag for inline code, like `Use <code>inline code</code> or <code class="inline">forced inline</code>`:
```text
Use <code>inline code</code> or <code class="inline">forced inline</code>
```

## Creating Tables

```html
<!-- Standard markdown table -->
| Header 1 | Header 2 |
|----------|----------|
| Cell 1   | Cell 2   |
| Cell 3   | Cell 4   |

<!-- HTML table -->
<table>
  <tr>
    <th>Header 1</th>
    <th>Header 2</th>
  </tr>
  <tr>
    <td>Cell 1</td>
    <td>Cell 2</td>
  </tr>
</table>
```

All tables are automatically wrapped in responsive containers when rendered.

## Local Development

To run the documentation locally with Decap CMS:

```bash
# Clone the repository
git clone https://github.com/jito-foundation/jito-omnidocs.git
cd jito-omnidocs

# Run the local Decap CMS proxy server
npx decap-server

# In a separate terminal, run your frontend application
```

## Deployment

Documentation changes are automatically deployed when merged to the master branch.

### Automatic Deployment with GitHub Actions

This repository is configured with a GitHub Actions workflow that automatically triggers a Vercel deployment whenever changes are pushed to the master branch. The workflow:

1. Sends a request to the Vercel Deploy Hook
2. Initiates a new build and deployment of the documentation site
3. No manual intervention is required

You can also manually trigger a deployment from the GitHub Actions tab by running the "Redeploy Vercel" workflow.

## Questions and Support

For questions about this documentation repository, please contact the Jito team.

## Image Storage and Organization

Images should be stored in the appropriate subdirectory within the `shared/images` folder based on the documentation section they belong to:

- Governance documentation images → `shared/images/governance/`
- JitoSOL documentation images → `shared/images/jitosol/`
- Restaking documentation images → `shared/images/restaking/`
- TipRouter documentation images → `shared/images/tiprouter/`

Always place new images in the directory corresponding to their documentation section rather than in the root `shared/images/` folder. This helps maintain organization as the documentation grows.

When referencing images in markdown files, use paths relative to the root:

```md
![Image description](/shared/images/jitosol/example-image.png)
```
