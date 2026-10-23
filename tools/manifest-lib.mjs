/**
 * Omnidocs content parser and validator (format v2).
 *
 * This is the only implementation of the content format. Docs sites vendor a copy of tools/
 * pinned to an omnidocs commit (never code from the content they are building), and CI runs
 * it with --check. See build-manifest.mjs for the CLI.
 *
 * Format v2, per product:
 *   <product>/_meta.yml          product title + ordered top-level `pages`
 *   <product>/<slug>.md          a page
 *   <product>/<dir>/_meta.yml    a dropdown (or top-level header) row + ordered `pages`
 *   <product>/<dir>/index.md     optional: makes the dropdown row itself a page
 *   <product>/images/            assets only
 * Every top-level folder except tools/ is a product and must have <product>/_meta.yml.
 */
import fs from 'node:fs'
import path from 'node:path'
import { execFileSync } from 'node:child_process'
import { parseFragment } from 'parse5'
import { parse as parseYaml } from 'yaml'

export const SCHEMA_VERSION = 2
export const META_FILE = '_meta.yml'
export const IMAGES_DIR = 'images'

// Top-level directories that are never products.
const RESERVED_ROOT_DIRS = new Set(['tools', 'node_modules'])
const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/
const ALLOWED_EXTENSIONS = new Set(['md', 'yml', 'png', 'jpg', 'jpeg', 'gif', 'webp', 'avif'])
const ALLOWED_SCHEMES = new Set(['http:', 'https:', 'mailto:', 'tel:'])
// Named in their own error message: these can execute script when rendered.
const DANGEROUS_SCHEMES = new Set(['javascript:', 'vbscript:', 'data:'])

const ROOT_META_KEYS = { title: 'string', subtitle: 'string', pages: 'array' }
const FOLDER_META_KEYS = { ...ROOT_META_KEYS, type: 'string' }
const FOLDER_TYPES = new Set(['expandable', 'header'])
const PAGE_KEYS = { title: 'string', subtitle: 'string', mermaid: 'boolean' }

const isHidden = (name) => name.startsWith('.') || name.startsWith('_')
const toPosix = (p) => p.split(path.sep).join('/')

/** Splits YAML frontmatter from a markdown source. `data` is null when there is none. */
export function splitFrontmatter(source) {
  const match = source.match(
    /^\uFEFF?---[ \t]*\r?\n(?:([\s\S]*?)\r?\n)?---[ \t]*(?:\r?\n|$)/,
  )
  if (!match) return { data: null, body: source, bodyLine: 1 }
  const data = match[1] ? parseYaml(match[1]) : {}
  const bodyLine = match[0].split('\n').length - (match[0].endsWith('\n') ? 0 : 1)
  return { data: data ?? {}, body: source.slice(match[0].length), bodyLine }
}

/**
 * Git doesn't track folders, so a folder whose files were moved away (e.g. by a pull) can
 * linger on someone's machine holding only a .DS_Store. It isn't part of the content.
 */
function isEffectivelyEmpty(dir) {
  return fs
    .readdirSync(dir, { withFileTypes: true })
    .every(
      (e) =>
        e.name === '.DS_Store' ||
        (e.isDirectory() && !e.isSymbolicLink() && isEffectivelyEmpty(path.join(dir, e.name))),
    )
}

/** Lists the top-level product folders. */
export function discoverProducts(root) {
  return fs
    .readdirSync(root, { withFileTypes: true })
    .filter(
      (e) =>
        e.isDirectory() &&
        !isHidden(e.name) &&
        !RESERVED_ROOT_DIRS.has(e.name) &&
        !isEffectivelyEmpty(path.join(root, e.name)),
    )
    .map((e) => ({ name: e.name }))
    .sort((a, b) => a.name.localeCompare(b.name))
}

class Reporter {
  constructor(root) {
    this.root = root
    this.errors = []
    this.warnings = []
  }
  #push(list, file, message, line) {
    list.push({ file: file ? toPosix(path.relative(this.root, file)) : '', line, message })
  }
  error(file, message, line) {
    this.#push(this.errors, file, message, line)
  }
  warn(file, message, line) {
    this.#push(this.warnings, file, message, line)
  }
}

function checkKeys(data, schema, file, report, { required = [] } = {}) {
  if (data === null || typeof data !== 'object' || Array.isArray(data)) {
    report.error(file, 'expected a YAML mapping (key: value pairs)')
    return false
  }
  let ok = true
  for (const [key, value] of Object.entries(data)) {
    const expected = schema[key]
    if (!expected) {
      report.error(file, `unknown key "${key}" (allowed: ${Object.keys(schema).join(', ')})`)
      ok = false
      continue
    }
    const actual = Array.isArray(value) ? 'array' : typeof value
    if (actual !== expected) {
      report.error(file, `"${key}" must be a ${expected}, got ${value === null ? 'null' : actual}`)
      ok = false
    }
  }
  for (const key of required) {
    const value = data[key]
    // Wrong types were already reported above; only report missing/blank here.
    if (value === undefined || value === null || (typeof value === 'string' && !value.trim())) {
      report.error(file, `"${key}" is required`)
      ok = false
    }
  }
  return ok
}

function readYamlFile(file, report) {
  try {
    return parseYaml(fs.readFileSync(file, 'utf8')) ?? {}
  } catch (err) {
    report.error(file, `invalid YAML: ${err.message.split('\n')[0]}`)
    return null
  }
}

function readMeta(dir, { isProductRoot }, report) {
  const file = path.join(dir, META_FILE)
  if (!fs.existsSync(file) || !fs.lstatSync(file).isFile()) {
    report.error(dir, `folder is missing ${META_FILE}`)
    return null
  }
  const data = readYamlFile(file, report)
  if (data === null) return null
  const schema = isProductRoot ? ROOT_META_KEYS : FOLDER_META_KEYS
  if (!checkKeys(data, schema, file, report, { required: ['title'] })) return null
  if (!Array.isArray(data.pages) || data.pages.length === 0) {
    report.error(file, '"pages" is required and must list at least one page or folder')
    return null
  }
  if (data.type !== undefined && !FOLDER_TYPES.has(data.type)) {
    report.error(file, `"type" must be one of: ${[...FOLDER_TYPES].join(', ')}`)
    return null
  }
  return { file, ...data }
}

function readPage(file, { isIndex }, report) {
  const source = fs.readFileSync(file, 'utf8')
  let parsed
  try {
    parsed = splitFrontmatter(source)
  } catch (err) {
    report.error(file, `invalid frontmatter YAML: ${err.message.split('\n')[0]}`)
    return null
  }
  if (parsed.data === null) {
    report.error(file, 'missing frontmatter (--- title: ... ---)')
    return null
  }
  const required = isIndex ? [] : ['title']
  if (!checkKeys(parsed.data, PAGE_KEYS, file, report, { required })) return null
  if (!parsed.body.trim()) {
    report.error(file, 'page has no content')
    return null
  }
  return { ...parsed.data, body: parsed.body, bodyLine: parsed.bodyLine }
}

/**
 * Walks one folder's `pages` list. Returns the child nodes, in order.
 * `relDir` is the folder path relative to the product root ('' for the root).
 */
function buildFolderChildren(ctx, absDir, relDir, meta, depth) {
  const { product, report } = ctx
  const isProductRoot = depth === 0
  const entries = fs.readdirSync(absDir, { withFileTypes: true })
  const listed = new Set()
  const children = []

  // Everything on disk must be listed (or be a reserved/ignored name).
  for (const entry of entries) {
    const abs = path.join(absDir, entry.name)
    if (entry.isSymbolicLink()) continue // reported by checkFileTypes
    if (isHidden(entry.name)) continue
    if (entry.isDirectory() && isEffectivelyEmpty(abs)) continue
    if (entry.name === 'index.md') {
      if (!entry.isFile()) {
        report.error(abs, 'index.md must be a file')
      } else if (isProductRoot) {
        report.error(abs, 'a product root cannot have index.md; rename it (e.g. overview.md) and list it in pages')
      }
      continue
    }
    if (entry.name === IMAGES_DIR && entry.isDirectory()) {
      if (!isProductRoot) report.error(abs, `${IMAGES_DIR}/ is only allowed directly under the product folder`)
      continue
    }
    const slug = entry.isDirectory() ? entry.name : entry.name.replace(/\.md$/, '')
    if (entry.isFile() && !entry.name.endsWith('.md')) {
      report.error(abs, `only .md files and folders belong here; put assets in ${product}/${IMAGES_DIR}/`)
      continue
    }
    if (!meta.pages.includes(slug)) {
      report.error(abs, `not listed in ${toPosix(path.join(relDir, META_FILE)) || META_FILE} "pages"`)
    }
  }

  meta.pages.forEach((slug, i) => {
    if (typeof slug !== 'string' || !SLUG_RE.test(slug)) {
      report.error(meta.file, `"pages" entry ${JSON.stringify(slug)} must be a lowercase-kebab-case slug`)
      return
    }
    if (slug === 'index' || slug === IMAGES_DIR) {
      report.error(meta.file, `"${slug}" is reserved and cannot be listed in "pages"`)
      return
    }
    if (listed.has(slug)) {
      report.error(meta.file, `"${slug}" is listed more than once in "pages"`)
      return
    }
    listed.add(slug)

    const rel = relDir ? `${relDir}/${slug}` : slug
    const fileAbs = path.join(absDir, `${slug}.md`)
    const dirAbs = path.join(absDir, slug)
    const hasFile = fs.existsSync(fileAbs) && fs.lstatSync(fileAbs).isFile()
    const hasDir =
      fs.existsSync(dirAbs) && fs.lstatSync(dirAbs).isDirectory() && !isEffectivelyEmpty(dirAbs)
    if (hasFile && hasDir) {
      report.error(dirAbs, `both ${slug}.md and ${slug}/ exist; they would have the same URL`)
      return
    }
    if (!hasFile && !hasDir) {
      report.error(meta.file, `"pages" lists "${slug}" but neither ${slug}.md nor ${slug}/ exists`)
      return
    }
    const node = hasFile
      ? buildPageNode(ctx, fileAbs, rel, slug)
      : buildFolderNode(ctx, dirAbs, rel, slug, depth + 1)
    if (node) {
      node.order = i + 1
      children.push(node)
    }
  })
  return children
}

function baseNode(ctx, { title, subtitle, slug, rel, sectionType, filePath }) {
  return {
    title,
    subtitle: subtitle ?? '',
    slug,
    order: 0,
    section_type: sectionType,
    children: [],
    hasContent: Boolean(filePath),
    isPage: Boolean(filePath),
    domain: ctx.product,
    path: `${ctx.product}/${rel}`,
    fullPath: rel,
    filePath: filePath ?? null,
  }
}

function registerPage(ctx, node, page) {
  ctx.pages.push({
    product: ctx.product,
    urlPath: node.fullPath,
    filePath: node.filePath,
    title: node.title,
    subtitle: node.subtitle,
    mermaid: page.mermaid === true,
    lastModified: ctx.dates?.[node.filePath] ?? null,
  })
  ctx.bodies.push({ product: ctx.product, file: path.join(ctx.root, node.filePath), body: page.body, bodyLine: page.bodyLine })
}

function buildPageNode(ctx, fileAbs, rel, slug) {
  const page = readPage(fileAbs, { isIndex: false }, ctx.report)
  if (!page) return null
  const node = baseNode(ctx, {
    title: page.title,
    subtitle: page.subtitle,
    slug,
    rel,
    sectionType: 'page',
    filePath: toPosix(path.relative(ctx.root, fileAbs)),
  })
  registerPage(ctx, node, page)
  return node
}

function buildFolderNode(ctx, dirAbs, rel, slug, depth) {
  const meta = readMeta(dirAbs, { isProductRoot: false }, ctx.report)
  if (!meta) return null
  const type = meta.type ?? 'expandable'
  if (type === 'header' && depth > 1) {
    ctx.report.error(meta.file, '"type: header" is only allowed for folders directly under the product')
  }
  const indexAbs = path.join(dirAbs, 'index.md')
  const hasIndex = fs.existsSync(indexAbs) && fs.lstatSync(indexAbs).isFile()
  if (hasIndex && type === 'header') {
    ctx.report.error(indexAbs, 'header rows cannot be pages; remove index.md or use type: expandable')
  }
  const indexPage = hasIndex && type !== 'header' ? readPage(indexAbs, { isIndex: true }, ctx.report) : null
  const node = baseNode(ctx, {
    title: meta.title,
    subtitle: meta.subtitle,
    slug,
    rel,
    sectionType: type,
    filePath: indexPage ? toPosix(path.relative(ctx.root, indexAbs)) : null,
  })
  if (indexPage) {
    registerPage(ctx, { ...node, title: indexPage.title || meta.title, subtitle: indexPage.subtitle ?? node.subtitle }, indexPage)
  }
  node.children = buildFolderChildren(ctx, dirAbs, rel, meta, depth)
  return node
}

function firstPagePath(nodes) {
  for (const node of nodes) {
    if (node.isPage) return node.fullPath
    const inner = firstPagePath(node.children)
    if (inner !== null) return inner
  }
  return null
}

function collectNodePaths(nodes, out = new Set()) {
  for (const node of nodes) {
    out.add(node.fullPath)
    collectNodePaths(node.children, out)
  }
  return out
}

/**
 * Blanks out fenced code blocks, inline code and HTML comments (same length, newlines kept)
 * so link scanning ignores them and offsets still map to source lines.
 * Inline code and inline comments never cross a blank line (a paragraph break), matching
 * markdown; otherwise two stray backticks could hide a real link between them.
 */
export function maskCode(body) {
  const blank = (s) => s.replace(/[^\n]/g, ' ')
  const lines = body.split('\n')
  let fence = null
  const masked = lines.map((line) => {
    const open = line.match(/^ {0,3}(`{3,}|~{3,})/)
    if (fence) {
      if (open && open[1][0] === fence[0] && open[1].length >= fence.length && !line.trim().slice(open[1].length).trim()) {
        fence = null
      }
      return blank(line)
    }
    if (open) {
      fence = open[1]
      return blank(line)
    }
    return line
  })
  const noBlankLine = (s) => !/\n[ \t]*\n/.test(s)
  return masked
    .join('\n')
    .replace(/<!--[\s\S]*?-->/g, (m, offset, all) => {
      // An HTML block comment (starting a line) may span paragraphs; an inline one may not.
      const startsLine = /(^|\n) {0,3}$/.test(all.slice(Math.max(0, offset - 4), offset))
      return startsLine || noBlankLine(m) ? blank(m) : m
    })
    .replace(/(`+)(?:(?!\n[ \t]*\n)[\s\S])*?\1/g, blank)
}

/** Finds link and image targets in markdown/HTML, ignoring code. */
export function extractLinks(body) {
  const text = maskCode(body)
  const found = []
  const add = (kind, target, index) => {
    const line = text.slice(0, index).split('\n').length
    found.push({ kind, target: target.trim(), line })
  }
  const inline = /(!?)\[(?:[^[\]]|\[[^\]]*\])*\]\(\s*(<[^>]*>|[^\s)]+)(?:\s+(?:"[^"]*"|'[^']*'|\([^)]*\)))?\s*\)/g
  for (const m of text.matchAll(inline)) {
    add(m[1] ? 'image' : 'link', m[2].replace(/^<|>$/g, ''), m.index)
  }
  for (const m of text.matchAll(/^ {0,3}\[[^\]]+\]:\s*(<[^>]*>|\S+)/gm)) {
    add('link', m[1].replace(/^<|>$/g, ''), m.index)
  }
  // Raw HTML is parsed with a spec-compliant parser (the same one rehype uses), so attribute
  // values are read exactly as a browser reads them: quoting, entities and all. Only
  // <a href> and <img src> are resolved as links/images; other URL attributes just get the
  // scheme check.
  const walk = (node) => {
    for (const attr of node.attrs ?? []) {
      const name = attr.name.toLowerCase()
      if (!URL_ATTRIBUTES.has(name)) continue
      const tag = node.tagName
      const kind = tag === 'a' && name === 'href' ? 'link' : tag === 'img' && name === 'src' ? 'image' : 'attribute'
      const loc = node.sourceCodeLocation
      const line = loc?.attrs?.[attr.prefix ? `${attr.prefix}:${attr.name}` : attr.name]?.startLine ?? loc?.startLine ?? 1
      found.push({ kind, target: attr.value.trim(), line })
    }
    for (const child of node.childNodes ?? []) walk(child)
    if (node.content) walk(node.content) // <template>
  }
  walk(parseFragment(text, { sourceCodeLocationInfo: true }))
  return found.sort((a, b) => a.line - b.line)
}

const URL_ATTRIBUTES = new Set(['href', 'src', 'action', 'formaction', 'poster', 'data'])

const NAMED_ENTITIES = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", colon: ':', tab: '\t', newline: '\n', sol: '/', period: '.', lpar: '(', rpar: ')' }

/** Decodes HTML character references the way a browser would before using a URL. */
export function decodeEntities(value) {
  return value.replace(/&(#x[0-9a-f]+|#[0-9]+|[a-z]+);?/gi, (match, ref) => {
    if (ref[0] === '#') {
      const code = ref[1] === 'x' || ref[1] === 'X' ? parseInt(ref.slice(2), 16) : parseInt(ref.slice(1), 10)
      return Number.isFinite(code) && code <= 0x10ffff ? String.fromCodePoint(code) : match
    }
    return NAMED_ENTITIES[ref.toLowerCase()] ?? match
  })
}

/** The URL scheme a browser would see: entities decoded, controls and whitespace removed. */
export function urlScheme(target) {
  // eslint-disable-next-line no-control-regex
  const normalized = decodeEntities(target).replace(/[\u0000-\u0020\u007f]/g, '')
  return normalized.match(/^([a-z][a-z0-9+.-]*:)/i)?.[1]?.toLowerCase() ?? null
}

function checkLinks(root, products, bodies, report) {
  const byName = new Map(products.map((p) => [p.name, p]))
  for (const { product, file, body, bodyLine } of bodies) {
    const problem = (msg, line) => report.error(file, msg, line)

    for (const { kind, target, line: rawLine } of extractLinks(body)) {
      const line = rawLine + bodyLine - 1
      if (!target || target.startsWith('#')) continue
      const scheme = urlScheme(target)
      if (scheme) {
        if (DANGEROUS_SCHEMES.has(scheme)) {
          report.error(file, `link scheme "${scheme}" is never allowed`, line)
        } else if (!ALLOWED_SCHEMES.has(scheme)) {
          problem(`link scheme "${scheme}" is not allowed: ${target}`, line)
        }
        continue
      }
      if (kind === 'attribute' || target.startsWith('//')) continue
      if (!target.startsWith('/')) {
        problem(`relative ${kind} "${target}"; use a root-absolute path like /${product}/...`, line)
        continue
      }
      let pathname = target.split(/[?#]/)[0]
      try {
        pathname = decodeURI(pathname)
      } catch {
        problem(`malformed ${kind} "${target}"`, line)
        continue
      }
      pathname = pathname.replace(/\/+$/, '')
      const segments = pathname.split('/').filter(Boolean)
      const isAsset =
        kind === 'image' || (/\.[a-z0-9]+$/i.test(segments.at(-1) ?? '') && !pathname.endsWith('.md'))

      if (isAsset) {
        const abs = path.join(root, ...segments)
        if (segments.includes('..') || !fs.existsSync(abs) || !fs.lstatSync(abs).isFile()) {
          problem(`${kind} "${target}" does not exist`, line)
        } else if (!(segments[1] === IMAGES_DIR && byName.has(segments[0]))) {
          report.error(file, `${kind} "${target}" must live under /<product>/${IMAGES_DIR}/`, line)
        }
        continue
      }
      if (segments[0] === 'docs') {
        problem(`drop the /docs prefix: use "${target.replace(/^\/docs/, '')}"`, line)
        continue
      }
      if (pathname.endsWith('.md')) {
        problem(`link to the page URL, not the file: "${target}"`, line)
        continue
      }
      const targetProduct = byName.get(segments[0])
      if (!targetProduct) {
        problem(`"${target}" is not a docs page; link to other site pages with a full https:// URL`, line)
        continue
      }
      const rest = segments.slice(1).join('/')
      if (rest !== '' && !targetProduct.nodePaths.has(rest)) problem(`link target "${target}" does not exist`, line)
    }
  }
}

/** Files the docs sites would publish: tracked and new (not ignored) files, or every file outside git. */
function listFiles(root) {
  try {
    // Tracked files plus new ones not yet added (but not ignored ones), so `yarn validate`
    // before `git add` sees the same files CI will.
    const out = execFileSync('git', ['-C', root, 'ls-files', '-z', '--cached', '--others', '--exclude-standard'], {
      stdio: ['ignore', 'pipe', 'ignore'],
    })
    const prefix = execFileSync('git', ['-C', root, 'rev-parse', '--show-prefix']).toString().trim()
    if (prefix === '') return out.toString().split('\0').filter(Boolean)
  } catch {
    // Not a git checkout (tests, or a site build after .git was removed).
  }
  const files = []
  const walk = (dir, rel) => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      if (rel === '' && (entry.name === '.git' || entry.name === 'node_modules')) continue
      const relPath = rel ? `${rel}/${entry.name}` : entry.name
      if (entry.isDirectory() && !entry.isSymbolicLink()) walk(path.join(dir, entry.name), relPath)
      else files.push(relPath)
    }
  }
  walk(root, '')
  return files
}

const ROOT_FILES = new Set([
  'README.md', 'CONTRIBUTING.md', 'AGENTS.md', 'CLAUDE.md', 'package.json', 'yarn.lock', '.gitignore', '.nvmrc',
])
const TOOL_EXTENSIONS = new Set(['mjs', 'js', 'json', 'txt'])

/**
 * Content may only contain markdown, _meta.yml and raster images. The sites publish product
 * images from their own origin, and an .svg or .html there could run script. Tooling and
 * workflow files are allowed only in their own places.
 */
function checkFileTypes(root, report) {
  for (const rel of listFiles(root)) {
    const abs = path.join(root, rel)
    const name = path.basename(rel)
    if (name === '.DS_Store') continue
    let stat
    try {
      stat = fs.lstatSync(abs)
    } catch {
      continue // tracked but deleted in the working tree
    }
    if (stat.isSymbolicLink()) {
      report.error(abs, 'symbolic links are not allowed')
      continue
    }
    const ext = path.extname(name).slice(1).toLowerCase()
    const [top] = rel.split('/')
    if (!rel.includes('/')) {
      if (!ROOT_FILES.has(rel)) report.error(abs, 'unexpected file at the repo root')
    } else if (top === '.github') {
      if (ext !== 'yml' && ext !== 'yaml') report.error(abs, '.github/ may only contain workflow YAML')
    } else if (top === 'tools') {
      if (!TOOL_EXTENSIONS.has(ext)) report.error(abs, `tools/ may only contain ${[...TOOL_EXTENSIONS].join(', ')} files`)
    } else if (rel.split('/').some((part) => part.startsWith('.'))) {
      report.error(abs, 'hidden files and folders are not allowed in content')
    } else if (rel.split('/').some((part) => part.startsWith('_') && part !== META_FILE)) {
      // These would be skipped (not listed, not published), so a typo would vanish silently.
      report.error(abs, `names starting with "_" are reserved for ${META_FILE}`)
    } else if (!ALLOWED_EXTENSIONS.has(ext) || (ext === 'yml' && name !== META_FILE)) {
      report.error(
        abs,
        `file type not allowed; content may only contain ${[...ALLOWED_EXTENSIONS].join(', ')} (yml only as ${META_FILE})`,
      )
    }
  }
}

/**
 * Parses and validates the content tree.
 * Returns { manifest, errors, warnings }. The manifest is only trustworthy when errors is empty.
 */
export function buildManifest(root, { dates = null, ref = null } = {}) {
  root = path.resolve(root)
  const report = new Reporter(root)
  const products = discoverProducts(root)

  const manifest = { schemaVersion: SCHEMA_VERSION, contentRef: ref, products: {}, pages: [] }
  const bodies = []

  for (const product of products) {
    const dir = path.join(root, product.name)
    if (!SLUG_RE.test(product.name)) {
      report.error(dir, 'product folder names must be lowercase-kebab-case (they are the URL)')
    }
    const ctx = { root, product: product.name, report, dates, pages: manifest.pages, bodies }
    const meta = readMeta(dir, { isProductRoot: true }, report)
    const tree = meta ? buildFolderChildren(ctx, dir, '', meta, 0) : []
    product.nodePaths = collectNodePaths(tree)
    manifest.products[product.name] = {
      format: 'v2',
      title: meta?.title ?? product.name,
      subtitle: meta?.subtitle ?? '',
      firstPage: firstPagePath(tree),
      tree,
    }
  }

  checkFileTypes(root, report)
  checkLinks(root, products, bodies, report)
  return { manifest, errors: report.errors, warnings: report.warnings }
}
