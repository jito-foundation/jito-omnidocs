# Contributing to the Jito docs

This guide covers how to update docs, from fixing a typo to adding a whole product.

## How a change goes live

1. **Branch** off `master` (e.g. `yourname/fullsend-auth-section`).
2. **Edit** Markdown files (see the layout below). Preview your Markdown in your editor or
   on GitHub.
3. **Check** locally: `yarn install && yarn check`. It tells you exactly what's wrong and on
   which line.
4. **Open a PR.** CI runs the same check. Ask the product's owners to review the content.
5. **Merge.** CI validates `master` again, then redeploys the site that shows that product
   (jito.network or bam.dev). That takes about 5–10 minutes.
6. **Verify** the page live at `https://www.jito.network/docs/<product>/<path>/` (or bam.dev
   for `bam/`).

You need write access to `jito-foundation/jito-omnidocs`, and your commits must be
**signed** (GPG or SSH signing key, e.g. a YubiKey). Ask in #frontend if either is missing.

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

- The product's own `_meta.yml` (e.g. `fullsend/_meta.yml`) has `title` and `pages` only.
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
also opens that page. Its frontmatter `title` is optional (it defaults to the folder's
`_meta.yml` title). Product folders themselves can't have an `index.md`; use `overview.md`.

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
search the repo for links to the old path (`yarn check` reports broken ones) and tell the
site owner, who can add a redirect for external links.

**Add a new product:** create `<product>/_meta.yml` and its pages. The site also has to
enable it: on jito.network that's a small site change (adding the product to the docs
product list and the hub). A product folder that isn't enabled is validated but not shown.

## When `yarn check` complains

| Message | Fix |
|---|---|
| `not listed in …/_meta.yml "pages"` | Add the file/folder name to that `pages` list. |
| `"pages" lists "x" but neither x.md nor x/ exists` | Fix the name in `pages`, or create the page. |
| `unknown key "order"` (or any other key) | Remove it. Order comes from `_meta.yml`. |
| `relative link "…"` / `drop the /docs prefix` | Use `/product/path` (see Links above). |
| `link target "…" does not exist` | Check the path against the folders; fix the typo. |
| `file type not allowed` | Only `.md`, `_meta.yml` and raster images belong in content. |
| `link scheme "javascript:" is never allowed` | Remove it. |

Raw HTML is allowed for simple formatting (`<u>`, `<small>`, `<figure>`, `<img>`, tables),
but the sites strip anything interactive or styled (scripts, iframes, forms, `style`
attributes). Prefer plain Markdown.

## How it's built (for the curious)

`tools/build-site-data.mjs` validates the content, renders every page to HTML (with code
highlighting and heading anchors), and writes the search index, per-page `.md` files and
`llms.txt` for AI agents. Each site runs it on the exact commit it deploys, using a pinned
copy of `tools/`.
