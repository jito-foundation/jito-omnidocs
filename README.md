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

Needs Node 24 (`.nvmrc`) and Yarn 1; see [Setup](CONTRIBUTING.md#setup).

```bash
yarn install
yarn validate   # validates structure, frontmatter, links, images and file types
yarn test       # tests for the tooling in tools/
```

`tools/` holds the parser/validator and the renderer the sites use. The sites vendor a
pinned copy, so a change in `tools/` only reaches a site when that site re-syncs it. See
[How the sites build it](CONTRIBUTING.md#how-the-sites-build-it).

## Where did my file go?

In October 2026 the docs moved to a flatter layout, so old GitHub links to files may 404
(links to the docs sites and to product folders still work):

- Pages: `<folder>/index.md` is now `<folder>.md`, e.g. `jitosol/faqs/general-faqs/index.md`
  → `jitosol/faqs/general-faqs.md`.
- Images: `shared/images/<product>/<file>` is now `<product>/images/<file>`.
