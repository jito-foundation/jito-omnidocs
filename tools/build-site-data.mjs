#!/usr/bin/env node
/**
 * Builds everything a docs site needs from a v2 omnidocs checkout, at build time:
 *
 *   node tools/build-site-data.mjs --root <content> --out <private dir> --public <public dir>
 *        --products jitosol,stakenet  --site-url https://www.jito.network
 *        [--site-name "Jito Docs"] [--site-description "..."] [--site-prefix /docs]
 *        [--asset-prefix /omnidocs] [--dates dates.json] [--ref <content sha>]
 *
 * <out>/manifest.json         nav trees, redirects for non-page rows, page list (published products)
 * <out>/pages/<p>/<path>.json  rendered page: html, headings, prev/next, breadcrumbs, dates
 * <out>/search-index.json      plain-text index of published pages
 * <public><site-prefix>/<p>/<path>.md   markdown for agents (absolute links)
 * <public>/llms.txt, llms-full.txt     (when --site-url is given)
 * <public><asset-prefix>/<p>/images/** product images (raster only)
 *
 * Fails (exit 1) on any content error, so a site never builds from invalid content.
 */
import fs from 'node:fs'
import path from 'node:path'
import { parseArgs } from 'node:util'
import { buildManifest, maskCode, splitFrontmatter, IMAGES_DIR } from './manifest-lib.mjs'
import { createRenderer, docsHref } from './render.mjs'

const IMAGE_EXTENSIONS = new Set(['.png', '.jpg', '.jpeg', '.gif', '.webp', '.avif'])

const { values: args } = parseArgs({
  options: {
    root: { type: 'string', default: '.' },
    out: { type: 'string' },
    public: { type: 'string' },
    products: { type: 'string' },
    'site-url': { type: 'string' },
    'site-name': { type: 'string', default: 'Docs' },
    'site-description': { type: 'string', default: '' },
    'site-prefix': { type: 'string', default: '/docs' },
    'asset-prefix': { type: 'string', default: '/omnidocs' },
    dates: { type: 'string' },
    ref: { type: 'string' },
  },
})
if (!args.out || !args.public) {
  console.error('Usage: build-site-data.mjs --root <content> --out <dir> --public <dir> [--products a,b] ...')
  process.exit(2)
}

const root = path.resolve(args.root)
const sitePrefix = args['site-prefix'].replace(/\/+$/, '')
const assetPrefix = args['asset-prefix'].replace(/\/+$/, '')
const siteUrl = args['site-url']?.replace(/\/+$/, '')
const dates = args.dates ? JSON.parse(fs.readFileSync(args.dates, 'utf8')) : null

const { manifest, errors } = buildManifest(root, { dates, ref: args.ref ?? null })
for (const e of errors) console.error(`error ${e.file}${e.line ? `:${e.line}` : ''}  ${e.message}`)
if (errors.length) process.exit(1)

const allProducts = Object.keys(manifest.products)
const published = args.products ? args.products.split(',').map((s) => s.trim()).filter(Boolean) : allProducts.filter((p) => manifest.products[p].format === 'v2')
for (const p of published) {
  if (manifest.products[p]?.format !== 'v2') {
    console.error(`error: product "${p}" is ${manifest.products[p] ? 'not in format v2' : 'not in the content'}`)
    process.exit(1)
  }
}

const renderer = await createRenderer({ products: allProducts, publishedProducts: published, sitePrefix, assetPrefix })
const outDir = path.resolve(args.out)
const publicDir = path.resolve(args.public)
const write = (file, content) => {
  fs.mkdirSync(path.dirname(file), { recursive: true })
  fs.writeFileSync(file, content)
}
const json = (value) => JSON.stringify(value) + '\n'

// Redirects for rows that aren't pages (headers, dropdowns without index.md) and products.
const redirects = {}
const breadcrumbs = {}
const firstPage = (node) => (node.isPage ? node.fullPath : node.children.map(firstPage).find(Boolean) ?? null)
const walk = (product, nodes, trail) => {
  for (const node of nodes) {
    const crumbs = [...trail, { title: node.title, urlPath: node.isPage ? node.fullPath : null }]
    if (node.isPage) breadcrumbs[`${product}/${node.fullPath}`] = crumbs
    else {
      const target = firstPage(node)
      if (target) redirects[`${product}/${node.fullPath}`] = `${product}/${target}`
    }
    walk(product, node.children, crumbs)
  }
}
for (const p of published) {
  walk(p, manifest.products[p].tree, [])
  if (manifest.products[p].firstPage) redirects[p] = `${p}/${manifest.products[p].firstPage}`
}

/** Markdown for agents: root-absolute docs links/images become absolute site URLs. */
function exportMarkdown(page, body) {
  const base = siteUrl ?? ''
  const masked = maskCode(body)
  const edits = []
  for (const m of masked.matchAll(/(!?)\[(?:[^[\]]|\[[^\]]*\])*\]\(\s*(\/[^\s)]*)/dg)) {
    const [start, end] = m.indices[2]
    const target = body.slice(start, end)
    const isImage = m[1] === '!' || target.split('/')[2] === IMAGES_DIR
    edits.push({ start, end, text: isImage ? `${base}${assetPrefix}${target}` : `${base}${docsHref(target, sitePrefix).replace(/\/(#|$)/, '.md$1')}` })
  }
  let out = body
  for (const e of edits.sort((a, b) => b.start - a.start)) out = out.slice(0, e.start) + e.text + out.slice(e.end)
  return `# ${page.title}\n\n${page.subtitle ? `> ${page.subtitle}\n\n` : ''}${out.trim()}\n`
}

const searchIndex = []
const llms = {}
const llmsFull = []
for (const p of published) {
  const pages = manifest.pages.filter((page) => page.product === p)
  pages.forEach((page, i) => {
    const source = fs.readFileSync(path.join(root, page.filePath), 'utf8')
    const { body } = splitFrontmatter(source)
    const { html, headings, text } = renderer.render(body)
    const neighbor = (n) => (n ? { urlPath: n.urlPath, title: n.title } : null)
    write(
      path.join(outDir, 'pages', p, `${page.urlPath}.json`),
      json({
        product: p,
        urlPath: page.urlPath,
        title: page.title,
        subtitle: page.subtitle,
        html,
        headings,
        mermaid: page.mermaid || html.includes('data-mermaid'),
        lastModified: page.lastModified,
        filePath: page.filePath,
        breadcrumbs: breadcrumbs[`${p}/${page.urlPath}`] ?? [],
        prev: neighbor(pages[i - 1]),
        next: neighbor(pages[i + 1]),
      }),
    )
    searchIndex.push({ product: p, urlPath: page.urlPath, title: page.title, subtitle: page.subtitle, headings: headings.map((h) => h.text), text })
    const md = exportMarkdown(page, body)
    write(path.join(publicDir, ...sitePrefix.split('/').filter(Boolean), p, `${page.urlPath}.md`), md)
    ;(llms[p] ??= []).push(page)
    llmsFull.push(md)
  })

  // Product images (raster only; the validator already rejects anything else).
  const imagesDir = path.join(root, p, IMAGES_DIR)
  if (fs.existsSync(imagesDir)) {
    for (const rel of fs.readdirSync(imagesDir, { recursive: true })) {
      const from = path.join(imagesDir, rel)
      if (!fs.lstatSync(from).isFile() || !IMAGE_EXTENSIONS.has(path.extname(rel).toLowerCase())) continue
      const to = path.join(publicDir, ...assetPrefix.split('/').filter(Boolean), p, IMAGES_DIR, rel)
      fs.mkdirSync(path.dirname(to), { recursive: true })
      fs.copyFileSync(from, to)
    }
  }
}
renderer.dispose()

const publishedManifest = {
  schemaVersion: manifest.schemaVersion,
  contentRef: manifest.contentRef,
  sitePrefix,
  products: Object.fromEntries(published.map((p) => [p, manifest.products[p]])),
  redirects,
  pages: manifest.pages.filter((page) => published.includes(page.product)),
}
write(path.join(outDir, 'manifest.json'), json(publishedManifest))
write(path.join(outDir, 'search-index.json'), json(searchIndex))

if (siteUrl) {
  const lines = [`# ${args['site-name']}`, '']
  if (args['site-description']) lines.push(`> ${args['site-description']}`, '')
  for (const p of published) {
    lines.push(`## ${manifest.products[p].title}`, '')
    for (const page of llms[p] ?? []) {
      const url = `${siteUrl}${sitePrefix}/${p}/${page.urlPath}.md`
      lines.push(`- [${page.title}](${url})${page.subtitle ? `: ${page.subtitle}` : ''}`)
    }
    lines.push('')
  }
  write(path.join(publicDir, 'llms.txt'), lines.join('\n'))
  write(path.join(publicDir, 'llms-full.txt'), llmsFull.join('\n---\n\n'))
}

console.log(
  `Built ${publishedManifest.pages.length} pages for ${published.join(', ')}` +
    `${manifest.contentRef ? ` from ${manifest.contentRef}` : ''} -> ${path.relative(process.cwd(), outDir) || '.'}`,
)
