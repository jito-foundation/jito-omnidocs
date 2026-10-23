# Notes for AI assistants working in this repo

Public Markdown source for Jito's docs (jito.network/docs, bam.dev/docs). Read
CONTRIBUTING.md for the full guide; these are the rules that matter most.

- **Layout (format v2):** `<product>/_meta.yml` + pages as `<slug>.md`; every subfolder is a
  menu row with its own `_meta.yml` (`title`, optional `subtitle`, optional
  `type: header|expandable`, required ordered `pages`). An optional `index.md` in a subfolder
  makes that row a page. No `index.md` at a product root.
- **Every** file/folder must be listed exactly once in its folder's `_meta.yml` `pages`.
  Adding, removing or renaming a page means editing `pages` too.
- **Frontmatter:** `title` (required), `subtitle`, `mermaid: true`. Nothing else
  (no `order`, no `section_type`).
- **Names:** lowercase kebab-case. The path is the URL.
- **Links:** root-absolute docs paths without `/docs` or `.md` (`/jitosol/faqs/general-faqs#q`);
  full `https://` URLs for anything else. Never relative links.
- **Images:** `<product>/images/…`, referenced as `/<product>/images/…`; raster only.
- **Only** `.md`, `_meta.yml` and raster images in content folders. No SVG/HTML/JS.
- **This repo is public.** Pushing a branch publishes it. Don't bring in internal details
  from private repos (infra, internal hostnames, config, keys, architecture notes).
- Prefer Markdown over raw HTML; the sites strip scripts, iframes, forms and inline styles.
- Before finishing: `yarn validate` must report 0 errors. For tooling changes, `yarn test`.
- Don't edit `tools/` for content work. Sites vendor a pinned copy of it.
- Commits must be signed; leave committing and pushing to the human unless asked.
