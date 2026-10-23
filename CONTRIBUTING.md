# Contributing to the Jito docs

This guide covers how to update docs, from fixing a typo to adding a whole product.

## Setup

You need **Node 24** (the version in `.nvmrc`) and **Yarn 1**. With
[nvm](https://github.com/nvm-sh/nvm): `nvm install && nvm use` in the repo. For Yarn:
`corepack enable`, or `npm install -g yarn`. Then `yarn install` once.

## How a change goes live

1. **Branch** off `master` (e.g. `yourname/fullsend-auth-section`).
2. **Edit** Markdown files (see the layout below). Preview your Markdown in your editor or
   on GitHub.
3. **Check** locally: `yarn install && yarn validate` (needs Node 24 and Yarn 1; see
   [Setup](#setup)). It tells you exactly what's wrong and on
   which line.
4. **Open a PR.** CI runs the same check. Ask the product's owners to review the content.
5. **Merge.** CI validates `master` again, then redeploys the site that shows that product
   (jito.network or bam.dev). That takes about 5–10 minutes.
6. **Verify** the page live at `https://www.jito.network/docs/<product>/<path>/` (or bam.dev
   for `bam/`).

You need write access to `jito-foundation/jito-omnidocs`, and your commits must be
**signed** (GPG or SSH signing key, e.g. a YubiKey). Ask a maintainer of this repo if either is missing.

> **Content from private repos:** this repo is public, and **pushing a branch publishes
> it**, even before a PR is merged. If you're copying docs from a private repo, remove
> internal details first (infra, internal hostnames, config, API-key admin, architecture
> notes) and get the owning team's OK.

## Layout

Each product is a folder. Inside it, **every folder is a row in the left menu and every
`.md` file is a page**. The order of rows comes from `_meta.yml`, not from file names.

```
fullsend/
├── _meta.yml
├── overview.md
├── images/
│   └── flow.png
└── sending-transactions/
    ├── _meta.yml
    ├── send-transaction.md
    └── regional-direct.md
```

### `_meta.yml` (one in every folder)

```yaml
title: Sending Transactions          # the menu row's label
subtitle: Endpoints and examples     # optional
type: header                         # optional: header (non-collapsible group label) or expandable (default)
pages:                               # order of the rows inside, by file/folder name without .md
  - send-transaction
  - regional-direct
```

- The product's own `_meta.yml` (e.g. `fullsend/_meta.yml`) has `title`, `pages` and an
  optional `subtitle` (no `type`).
- `type: header` is only for folders directly inside the product.
- **Every** page and folder in the folder must be listed in `pages`, exactly once.

### Pages (`.md` files)

```markdown
---
title: sendTransaction
subtitle: Send a transaction with low latency   # optional, shown under the title
---

## Endpoint

Body in Markdown…
```

- `title` is required (it's the menu label and the page heading). `subtitle` is optional.
  `mermaid: true` is optional and marks pages with mermaid diagrams.
- No other frontmatter keys are allowed.
- File and folder names: lowercase words with dashes (`send-transaction.md`). The name is
  the URL: `fullsend/sending-transactions/send-transaction.md` is
  `/docs/fullsend/sending-transactions/send-transaction/`.

### Optional `index.md` in a dropdown folder

A dropdown row normally just expands. If the folder has an `index.md`, clicking the row
also opens that page. It still needs a frontmatter block (`---` lines), but `title` in it is
optional (it defaults to the folder's `_meta.yml` title). Product folders themselves can't have an `index.md`; use `overview.md`.

## Links and images

- **Link to another docs page** with its path from the product folder, starting with `/`,
  without `/docs` and without `.md`:

  ```markdown
  See [Regional Direct](/fullsend/sending-transactions/regional-direct).
  Jump to a section: [auth](/fullsend/sending-transactions/send-transaction#auth).
  ```

  This works across products too (`/jitosol/faqs/general-faqs`).
- **Link to anything else on a Jito site or elsewhere** with a full URL
  (`https://www.jito.network/stake/`).
- **Images** go in `<product>/images/` and are referenced the same way:

  ```markdown
  ![Transaction flow](/fullsend/images/flow.png)
  ```

  Allowed image types: png, jpg, jpeg, gif, webp, avif. Keep them reasonably small (under
  ~500 KB where possible).
- Relative links (`../other.md`, `./page`) and `.md` links are rejected by the check.

## Common tasks

**Add a page:** create `<folder>/<name>.md` with a `title`, then add `<name>` to that folder's
`_meta.yml` `pages` list, where you want it to appear.

**Add a dropdown:** create a folder with a `_meta.yml` (title + pages), put pages in it, and
add the folder name to the parent's `pages`.

**Reorder:** change the order of `pages` in `_meta.yml`. URLs don't change.

**Rename or move a page:** move the file and update `pages` lists. **The URL changes**, so
search the repo for links to the old path (`yarn validate` reports broken ones) and tell the
site owner, who can add a redirect for external links.

**Add a new product:** create `<product>/_meta.yml` and its pages. The site also has to
enable it: on jito.network that's a small site change (adding the product to the docs
product list and the hub). A product folder that isn't enabled is validated but not shown.

## When `yarn validate` complains

| Message | Fix |
|---|---|
| `not listed in …/_meta.yml "pages"` | Add the file/folder name to that `pages` list. |
| `"pages" lists "x" but neither x.md nor x/ exists` | Fix the name in `pages`, or create the page. |
| `unknown key "order"` (or any other key) | Remove it. Order comes from `_meta.yml`. |
| `relative link "…"` / `drop the /docs prefix` | Use `/product/path` (see Links above). |
| `link target "…" does not exist` | Check the path against the folders; fix the typo. |
| `file type not allowed` | Only `.md`, `_meta.yml` and raster images belong in content. |
| `link scheme "javascript:" is never allowed` | Remove it. |
| `link to the page URL, not the file` | Drop the `.md`: `/product/path`. |
| `image "…" does not exist` | Check the file is in `<product>/images/` and the name matches exactly. |
| `"…" is not a docs page; link to other site pages with a full https:// URL` | Use `https://www.jito.network/...` for non-docs pages. |
| `missing frontmatter` / `"title" is required` | Start the page with `---`, `title: ...`, `---`. |
| `invalid YAML` | Check the `_meta.yml` or frontmatter syntax (indentation, a `:` inside an unquoted value). |
| `folder is missing _meta.yml` | Every folder (and product) needs one; see Layout above. |
| `names starting with "_" are reserved` | Rename it; only `_meta.yml` may start with `_`. |

A page with a frontmatter error is left out, so links to it also report `link target "…"
does not exist`. Fix the frontmatter error first.

Raw HTML is allowed for simple formatting (`<u>`, `<small>`, `<figure>`, `<img>`, tables),
but the sites strip anything interactive or styled (scripts, iframes, forms, `style`
attributes). Prefer plain Markdown.

## How the sites build it

Writers can skip this. It's for people working on `tools/` or on a docs site.

`tools/` is the only implementation of the content format:

| File | What it does |
|---|---|
| `manifest-lib.mjs` | Parses and validates the layout, frontmatter, links, images and file types. |
| `build-manifest.mjs` | Its CLI; `--check` is what CI and `yarn validate` run. |
| `render.mjs` | Markdown to sanitized HTML, heading ids, code highlighting, mermaid placeholders. |
| `build-site-data.mjs` | Everything a site needs: nav, rendered pages, search index, `.md` exports, `llms.txt`, images. |
| `git-dates.mjs` | "Last updated" dates from git history (skips commits marked `[skip-dates]`). |

Each file's header documents its options and outputs. On every deploy, a site:

1. checks out this repo at the commit it publishes, with full history;
2. runs `git-dates.mjs`, then `build-site-data.mjs` for its own products (a product a site
   doesn't publish is still validated, just not shown). Any content error fails the build,
   so broken docs never deploy;
3. serves the prebuilt pages. Nothing is rendered or fetched at request time.

**Sites run a pinned copy of `tools/`.** Each site keeps a reviewed copy at an exact commit
of this repo and never runs tools from the content it's building, because content here is
public and comes from PRs. A change to `tools/` therefore reaches a site only when that site
re-syncs to a newer commit.

**Changing the tools:**

- Add or update tests in `tools/test/` and run `yarn test`.
- Keep the options and output layout backward compatible. If you can't, say so in the PR:
  every site has to re-sync and adapt.
- Change the content format and migrate the content in the same PR, so `master` always
  validates.
- After merging, re-sync each site to the merge commit and check its docs.
