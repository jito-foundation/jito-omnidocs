# Jito docs content (omnidocs)

The Markdown source for Jito's product documentation. Every product has its own top-level
folder. The docs sites build from this repo:

| Product folder | Published at |
|---|---|
| `jitosol/`, `governance/`, `stakenet/`, `tiprouter/`, `restaking/` | `jito.network/docs/<product>/…` |
| `bam/` | `bam.dev/docs/bam/…` |

Merging to `master` redeploys the affected site(s) automatically after CI validates the
content.

- **Writing or changing docs:** see [CONTRIBUTING.md](CONTRIBUTING.md).
- **AI assistants:** see [AGENTS.md](AGENTS.md).

## Layout in one picture

```
<product>/
├── _meta.yml            # product title + the order of its top-level rows
├── overview.md          # a page: /docs/<product>/overview
├── images/              # this product's images
└── how-to/              # a dropdown (or a section header)
    ├── _meta.yml        # its title + the order of the pages inside it
    ├── index.md         # optional: makes the dropdown row itself a page
    └── step-1.md        # /docs/<product>/how-to/step-1
```

## Checks

```bash
yarn install
yarn check   # validates structure, frontmatter, links, images and file types
yarn test    # tests for the tooling in tools/
```

`tools/` holds the parser/validator and the renderer the sites use. The sites vendor a
pinned copy, so a change in `tools/` only reaches a site when that site re-syncs it.
