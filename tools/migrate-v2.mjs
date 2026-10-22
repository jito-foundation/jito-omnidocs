#!/usr/bin/env node
/**
 * One-time codemod: converts legacy (folder-per-page index.md) products to format v2.
 *
 *   node tools/migrate-v2.mjs [--root .] [--dry-run]
 *
 * For every legacy product (no <product>/_meta.yml):
 *   - x/index.md with section_type page   -> x.md (frontmatter: title, subtitle, mermaid)
 *   - x/index.md with header/expandable   -> x/_meta.yml (pages ordered by old `order`)
 *   - shared/images/<product>/**          -> <product>/images/**
 *   - links/images rewritten to root-absolute v2 form (/product/path, /product/images/x)
 * Page bodies are otherwise untouched. Links it can't resolve are left as-is and listed in
 * the report for a human to decide. Idempotent: v2 products are skipped.
 * Commit the result with [skip-dates] in the message so "last updated" dates survive.
 * Delete this file once the migration has landed.
 */
import fs from 'node:fs'
import path from 'node:path'
import { parseArgs } from 'node:util'
import { pathToFileURL } from 'node:url'
import { stringify as stringifyYaml } from 'yaml'
import { META_FILE, IMAGES_DIR, discoverProducts, maskCode, splitFrontmatter, urlScheme } from './manifest-lib.mjs'

// Product titles (from the jito.network docs hub). New products get theirs by hand.
export const PRODUCT_TITLES = {
  bam: 'BAM',
  governance: 'Governance',
  jitosol: 'JitoSOL',
  restaking: 'Restaking',
  stakenet: 'StakeNet',
  tiprouter: 'TipRouter',
}

const yaml = (data) => stringifyYaml(data, { lineWidth: 0 })

function readLegacy(file) {
  const { data, body } = splitFrontmatter(fs.readFileSync(file, 'utf8'))
  return { data: data ?? {}, body }
}

/** Builds the legacy tree: { slug, rel, type, order, data, body, children } */
function readTree(root, product) {
  const walk = (absDir, relDir) =>
    fs
      .readdirSync(absDir, { withFileTypes: true })
      .filter((e) => e.isDirectory() && !e.name.startsWith('.'))
      .filter((e) => fs.existsSync(path.join(absDir, e.name, 'index.md')))
      .map((e) => {
        const rel = relDir ? `${relDir}/${e.name}` : e.name
        const { data, body } = readLegacy(path.join(absDir, e.name, 'index.md'))
        return {
          slug: e.name,
          rel,
          type: data.section_type || 'page',
          order: Number.isFinite(data.order) ? data.order : Number.MAX_SAFE_INTEGER,
          data,
          body,
          children: walk(path.join(absDir, e.name), rel),
        }
      })
      .sort((a, b) => a.order - b.order || a.slug.localeCompare(b.slug))
  return walk(path.join(root, product), '')
}

function pageFrontmatter(data) {
  const out = { title: String(data.title ?? '').trim() }
  if (typeof data.subtitle === 'string' && data.subtitle.trim()) out.subtitle = data.subtitle.trim()
  if (data.mermaid === true) out.mermaid = true
  return out
}

/**
 * Rewrites one link/image target to v2 form. Returns { target } (possibly unchanged) or
 * { target, problem } when it can't be resolved. `urls` is the set of /product/path URLs
 * that will exist after migration; `pageDir` is the page's URL ("/jitosol/a/b").
 */
export function rewriteTarget(raw, { kind, pageUrl, products, urls, imageExists }) {
  const target = raw.trim().replace(/^<|>$/g, '')
  if (!target || target.startsWith('#') || target.startsWith('//')) return { target: raw }
  const scheme = urlScheme(target)
  if (scheme) {
    return ['http:', 'https:', 'mailto:', 'tel:'].includes(scheme)
      ? { target: raw }
      : { target: raw, problem: `unsupported link scheme ${scheme}` }
  }
  const cut = target.search(/[?#]/)
  let pathname = cut === -1 ? target : target.slice(0, cut)
  const suffix = cut === -1 ? '' : target.slice(cut)
  const trailingSlash = pathname.endsWith('/')

  if (!pathname.startsWith('/')) {
    const first = pathname.replace(/^\.\//, '').split('/')[0]
    pathname = products.has(first)
      ? `/${pathname.replace(/^\.\//, '')}` // "jitosol/faqs/x" meant root-absolute
      : path.posix.resolve(`${pageUrl}/`, pathname) // relative to the page URL
  }
  pathname = pathname.replace(/^\/docs(?=\/)/, '')
  const shared = pathname.match(/^\/shared\/images\/([^/]+)\/(.+)$/)
  if (shared) pathname = `/${shared[1]}/${IMAGES_DIR}/${shared[2]}`

  const isAsset = kind === 'image' || (/\.[a-z0-9]+$/i.test(pathname) && !/\.md$/i.test(pathname))
  if (isAsset) {
    const rewritten = pathname + suffix
    return imageExists(pathname) ? { target: rewritten } : { target: rewritten, problem: 'image not found' }
  }
  pathname = pathname.replace(/\/index\.md$/i, '').replace(/\.md$/i, '').replace(/\/+$/, '')
  const rewritten = (pathname || '/') + (trailingSlash && pathname ? '/' : '') + suffix
  const [, product] = pathname.split('/')
  if (!products.has(product)) return { target: rewritten, problem: 'not a docs page' }
  if (pathname !== `/${product}` && !urls.has(pathname)) return { target: rewritten, problem: 'link target does not exist' }
  return { target: rewritten }
}

/** Applies rewriteTarget to every markdown/HTML link and image in a body, outside code. */
export function rewriteBody(body, ctx, report) {
  const masked = maskCode(body)
  const edits = []
  const visit = (kind, start, end) => {
    const raw = body.slice(start, end)
    const { target, problem } = rewriteTarget(raw, { ...ctx, kind })
    if (problem) report.push({ page: ctx.file, target: raw.trim(), problem })
    if (target !== raw) edits.push({ start, end, text: target })
  }
  const inline = /(!?)\[(?:[^[\]]|\[[^\]]*\])*\]\(\s*(<[^>]*>|[^\s)]+)/dg
  for (const m of masked.matchAll(inline)) visit(m[1] ? 'image' : 'link', ...m.indices[2])
  for (const m of masked.matchAll(/^ {0,3}\[[^\]]+\]:\s*(<[^>]*>|\S+)/dgm)) visit('link', ...m.indices[1])
  const attr = /<(a|img)\b[^>]*?\s(href|src)\s*=\s*(?:"([^"]*)"|'([^']*)')/dgi
  for (const m of masked.matchAll(attr)) {
    const group = m[3] !== undefined ? 3 : 4
    visit(m[1].toLowerCase() === 'img' ? 'image' : 'link', ...m.indices[group])
  }
  let out = body
  for (const e of edits.sort((a, b) => b.start - a.start)) out = out.slice(0, e.start) + e.text + out.slice(e.end)
  return out
}

export function migrate(root, { dryRun = false, log = console.log } = {}) {
  root = path.resolve(root)
  const legacy = discoverProducts(root).filter((p) => p.format === 'legacy').map((p) => p.name)
  const allProducts = new Set(discoverProducts(root).map((p) => p.name))
  const report = []
  const trees = Object.fromEntries(legacy.map((p) => [p, readTree(root, p)]))

  // Every URL that exists after migration (legacy paths are preserved), for link checks.
  const urls = new Set()
  const addUrls = (product, nodes) =>
    nodes.forEach((n) => {
      urls.add(`/${product}/${n.rel}`)
      addUrls(product, n.children)
    })
  for (const [product, nodes] of Object.entries(trees)) addUrls(product, nodes)
  for (const p of discoverProducts(root).filter((x) => x.format === 'v2')) {
    // Links into already-migrated products: trust their folders.
    const walk = (dir, rel) =>
      fs.readdirSync(dir, { withFileTypes: true }).forEach((e) => {
        if (e.name.startsWith('.') || e.name.startsWith('_') || e.name === IMAGES_DIR) return
        const slug = e.name.replace(/\.md$/, '')
        if (slug === 'index') return
        urls.add(`/${p.name}/${rel ? `${rel}/` : ''}${slug}`)
        if (e.isDirectory()) walk(path.join(dir, e.name), rel ? `${rel}/${slug}` : slug)
      })
    walk(path.join(root, p.name), '')
  }
  const imageExists = (pathname) => {
    const [, product, dir, ...rest] = pathname.split('/')
    if (dir !== IMAGES_DIR) return false
    return (
      fs.existsSync(path.join(root, product, IMAGES_DIR, ...rest)) ||
      fs.existsSync(path.join(root, 'shared', 'images', product, ...rest))
    )
  }

  const writes = []
  const removals = []
  for (const product of legacy) {
    const write = (rel, content) => writes.push({ file: path.join(root, product, rel), content })
    const emit = (nodes, relDir) => {
      for (const n of nodes) {
        const legacyFile = `${product}/${n.rel}/index.md`
        const pageUrl = `/${product}/${n.rel}`
        const body = () =>
          rewriteBody(n.body, { file: legacyFile, pageUrl, products: allProducts, urls, imageExists }, report)
        if (n.type === 'page') {
          if (n.children.length) report.push({ page: legacyFile, problem: 'page has sub-pages; migrate by hand' })
          write(`${n.rel}.md`, `---\n${yaml(pageFrontmatter(n.data))}---\n${body()}`)
        } else {
          const meta = { title: String(n.data.title ?? n.slug).trim() }
          if (typeof n.data.subtitle === 'string' && n.data.subtitle.trim()) meta.subtitle = n.data.subtitle.trim()
          if (n.type === 'header') meta.type = 'header'
          meta.pages = n.children.map((c) => c.slug)
          write(`${n.rel}/${META_FILE}`, yaml(meta))
          if (n.body.trim()) {
            // An expandable with its own content keeps it as the dropdown's page.
            write(`${n.rel}/index.md`, `---\n${yaml(pageFrontmatter(n.data))}---\n${body()}`)
            if (n.type === 'header') report.push({ page: legacyFile, problem: 'header has content; headers cannot be pages' })
          }
          emit(n.children, n.rel)
        }
        removals.push(path.join(root, product, n.rel, 'index.md'))
      }
    }
    emit(trees[product], '')
    write(
      META_FILE,
      yaml({ title: PRODUCT_TITLES[product] ?? product, pages: trees[product].map((n) => n.slug) }),
    )
    if (!PRODUCT_TITLES[product]) report.push({ page: product, problem: 'no product title; set it in _meta.yml' })
  }

  // Images: shared/images/<product>/** -> <product>/images/**
  const moves = []
  const sharedImages = path.join(root, 'shared', 'images')
  if (fs.existsSync(sharedImages)) {
    for (const product of fs.readdirSync(sharedImages)) {
      const from = path.join(sharedImages, product)
      if (!fs.statSync(from).isDirectory()) continue
      if (!allProducts.has(product)) {
        report.push({ page: `shared/images/${product}`, problem: 'no such product; move by hand' })
        continue
      }
      moves.push({ from, to: path.join(root, product, IMAGES_DIR) })
    }
  }

  log(`Legacy products: ${legacy.join(', ') || 'none'}`)
  log(`Files to write: ${writes.length}, legacy index.md to remove: ${removals.length}, image dirs to move: ${moves.length}`)
  if (!dryRun) {
    for (const f of removals) fs.rmSync(f)
    for (const { file, content } of writes) {
      fs.mkdirSync(path.dirname(file), { recursive: true })
      fs.writeFileSync(file, content)
    }
    for (const { from, to } of moves) {
      fs.mkdirSync(path.dirname(to), { recursive: true })
      if (fs.existsSync(to)) {
        report.push({ page: path.relative(root, to), problem: 'images/ already exists; merge by hand' })
        continue
      }
      fs.renameSync(from, to)
    }
    // Remove now-empty legacy directories (and shared/ if nothing is left in it).
    const prune = (dir) => {
      if (!fs.existsSync(dir)) return
      for (const e of fs.readdirSync(dir, { withFileTypes: true })) if (e.isDirectory()) prune(path.join(dir, e.name))
      const left = fs.readdirSync(dir).filter((n) => n !== '.DS_Store')
      if (!left.length) fs.rmSync(dir, { recursive: true, force: true })
    }
    for (const product of legacy) prune(path.join(root, product))
    prune(path.join(root, 'shared'))
  }
  return { report }
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  const { values } = parseArgs({ options: { root: { type: 'string', default: '.' }, 'dry-run': { type: 'boolean', default: false } } })
  const { report } = migrate(values.root, { dryRun: values['dry-run'] })
  if (report.length) {
    console.log(`\n${report.length} item(s) need a human decision:`)
    for (const r of report) console.log(`  ${r.page}${r.target ? `  ${r.target}` : ''}  (${r.problem})`)
  } else {
    console.log('\nNothing needs a human decision.')
  }
}
