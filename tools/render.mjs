/**
 * Renders one v2 docs page (markdown body) to sanitized HTML for the docs sites.
 *
 *   const renderer = await createRenderer({ products, sitePrefix: '/docs', assetPrefix: '/omnidocs' })
 *   const { html, headings, text } = renderer.render(markdownBody)
 *
 * Pipeline: markdown (GFM) -> HTML tree with raw HTML parsed -> sanitize (the trust
 * boundary: content comes from a public repo) -> trusted transforms on the clean tree:
 * link/image URLs for the site, heading ids, Shiki highlighting, mermaid placeholders.
 * Runs at build time only, so sites never execute it inside server functions.
 */
import GithubSlugger from 'github-slugger'
import { toString } from 'hast-util-to-string'
import rehypeRaw from 'rehype-raw'
import rehypeSanitize from 'rehype-sanitize'
import rehypeStringify from 'rehype-stringify'
import remarkGfm from 'remark-gfm'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import { createHighlighter } from 'shiki'
import { unified } from 'unified'
import { IMAGES_DIR } from './manifest-lib.mjs'

// Everything current docs use, plus a few common markdown tags. Anything else (script,
// iframe, form, style, meta, event handlers, inline styles, javascript: URLs) is removed.
export const SANITIZE_SCHEMA = {
  tagNames: [
    'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'br', 'hr', 'blockquote', 'pre', 'code',
    'ul', 'ol', 'li', 'a', 'img', 'figure', 'figcaption', 'strong', 'b', 'em', 'i', 'u',
    's', 'del', 'small', 'sup', 'sub', 'kbd', 'table', 'thead', 'tbody', 'tfoot', 'tr',
    'th', 'td', 'details', 'summary',
  ],
  attributes: {
    a: ['href', 'title'],
    img: ['src', 'alt', 'title', 'width', 'height'],
    ol: ['start'],
    th: ['align'],
    td: ['align'],
    code: [['className', /^language-./]],
  },
  protocols: { href: ['http', 'https', 'mailto'] },
  strip: ['script', 'style', 'template', 'textarea', 'noscript', 'iframe', 'svg', 'math'],
  clobber: [],
  required: {},
}

// Languages highlighted at build time (aliases like js/ts/sh resolve automatically).
const LANGUAGES = [
  'bash', 'shell', 'javascript', 'typescript', 'tsx', 'jsx', 'json', 'jsonc', 'rust',
  'toml', 'yaml', 'python', 'go', 'diff', 'sql', 'html', 'css', 'markdown', 'solidity',
]
const THEMES = { light: 'github-light', dark: 'github-dark' }

const isElement = (node, tag) => node?.type === 'element' && (!tag || node.tagName === tag)

function visit(node, fn, parent = null, index = null) {
  fn(node, parent, index)
  if (node.children) {
    // Copy: fn may replace children.
    ;[...node.children].forEach((child, i) => visit(child, fn, node, i))
  }
}

const hasScheme = (value) =>
  // eslint-disable-next-line no-control-regex
  /^[a-z][a-z0-9+.-]*:/i.test(value.replace(/[\u0000- \u007f]/g, ''))
const isProtocolRelative = (value) => /^\s*[/\\]{2}/.test(value)

/** Docs path ("/jitosol/faqs#q") -> site URL ("/docs/jitosol/faqs/#q"). */
export function docsHref(target, sitePrefix) {
  const cut = target.search(/[?#]/)
  const pathname = (cut === -1 ? target : target.slice(0, cut)).replace(/\/+$/, '')
  const suffix = cut === -1 ? '' : target.slice(cut)
  return `${sitePrefix}${pathname}/${suffix}`
}

function transformTree(tree, { products, publishedProducts, sitePrefix, assetPrefix, highlighter }) {
  const slugger = new GithubSlugger()
  const headings = []

  visit(tree, (node, parent, index) => {
    if (!isElement(node)) return
    const props = node.properties ?? (node.properties = {})

    if (node.tagName === 'a' && typeof props.href === 'string') {
      const href = props.href
      if (isProtocolRelative(href)) {
        delete props.href
      } else if (href.startsWith('/')) {
        const product = href.split(/[/?#]/)[1]
        if (!products.has(product)) delete props.href
        else if (!publishedProducts.has(product)) delete props.href // not live on this site
        else props.href = docsHref(href, sitePrefix)
      } else if (/^https?:/i.test(href)) {
        props.target = '_blank'
        props.rel = ['noopener', 'noreferrer']
      }
    }

    if (node.tagName === 'img') {
      const src = typeof props.src === 'string' ? props.src : ''
      const [, product, dir] = src.split('/')
      if (!src.startsWith('/') || isProtocolRelative(src) || hasScheme(src) || dir !== IMAGES_DIR || !products.has(product)) {
        delete props.src // images must be the docs' own /<product>/images/...
      } else {
        props.src = `${assetPrefix}${src}`
      }
      props.loading = 'lazy'
      props.decoding = 'async'
    }

    if (/^h[1-6]$/.test(node.tagName)) {
      const text = toString(node).trim()
      props.id = slugger.slug(text)
      const depth = Number(node.tagName[1])
      if (depth >= 2 && depth <= 4) headings.push({ depth, text, id: props.id })
    }

    if (node.tagName === 'pre' && parent && isElement(node.children?.[0], 'code')) {
      const code = node.children[0]
      const className = [code.properties?.className ?? []].flat().find((c) => String(c).startsWith('language-'))
      const lang = className ? String(className).slice('language-'.length) : ''
      const source = toString(code).replace(/\n$/, '')
      let replacement = null
      if (lang === 'mermaid') {
        // Rendered client-side by the site's mermaid island (securityLevel: 'strict').
        replacement = { type: 'element', tagName: 'div', properties: { dataMermaid: '' }, children: [{ type: 'text', value: source }] }
      } else if (lang && highlighter.getLoadedLanguages().includes(lang)) {
        const highlighted = highlighter.codeToHast(source, { lang, themes: THEMES, defaultColor: 'light' })
        replacement = highlighted.children[0]
        replacement.properties.dataLanguage = lang
      }
      if (replacement) parent.children[index] = replacement
    }
  })
  return headings
}

const INLINE = new Set(['a', 'b', 'strong', 'em', 'i', 'u', 's', 'del', 'small', 'sup', 'sub', 'kbd', 'code', 'br'])

/** Plain text for search: no code blocks or diagrams, block elements separated by spaces. */
function searchText(tree) {
  const walk = (node) => {
    if (node.type === 'text') return node.value
    if (isElement(node, 'pre') || (isElement(node, 'div') && node.properties?.dataMermaid !== undefined)) return ' '
    const inner = (node.children ?? []).map(walk).join('')
    return isElement(node) && !INLINE.has(node.tagName) ? ` ${inner} ` : inner
  }
  return walk(tree).replace(/\s+/g, ' ').trim()
}

/**
 * @param {object} options
 * @param {Iterable<string>} options.products all docs products (for link validation)
 * @param {Iterable<string>} [options.publishedProducts] products live on this site (default: all)
 * @param {string} [options.sitePrefix] route prefix for docs pages, e.g. '/docs'
 * @param {string} [options.assetPrefix] URL prefix for /<product>/images/..., e.g. '/omnidocs'
 */
export async function createRenderer({ products, publishedProducts, sitePrefix = '/docs', assetPrefix = '' }) {
  const highlighter = await createHighlighter({ themes: Object.values(THEMES), langs: LANGUAGES })
  const ctx = {
    products: new Set(products),
    publishedProducts: new Set(publishedProducts ?? products),
    sitePrefix,
    assetPrefix,
    highlighter,
  }

  const parse = unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeRaw)
    .use(rehypeSanitize, SANITIZE_SCHEMA)
  const stringify = unified().use(rehypeStringify, { characterReferences: { useNamedReferences: true } })

  return {
    render(markdown) {
      const tree = parse.runSync(parse.parse(markdown))
      const headings = transformTree(tree, ctx)
      const text = searchText(tree)
      return { html: stringify.stringify(tree), headings, text }
    },
    dispose() {
      highlighter.dispose()
    },
  }
}
