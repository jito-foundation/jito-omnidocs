import { test } from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { buildManifest, splitFrontmatter, extractLinks, urlScheme } from '../manifest-lib.mjs'
import { writeTree, page, meta, validProduct, messages } from './helpers.mjs'

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..')

const build = (files, opts) => buildManifest(writeTree(files), opts)
const expectError = (files, pattern) => {
  const { errors } = build(files)
  assert.ok(
    errors.some((e) => pattern.test(`${e.file}: ${e.message}`)),
    `expected an error matching ${pattern}, got:\n${messages(errors).join('\n') || '(none)'}`,
  )
}

test('valid v2 product builds the expected tree and page list', () => {
  const { manifest, errors, warnings } = build(validProduct(), {
    dates: { 'fullsend/overview.md': '2026-01-02T00:00:00Z' },
    ref: 'abc123',
  })
  assert.deepEqual(messages(errors), [])
  assert.deepEqual(messages(warnings), [])
  assert.equal(manifest.schemaVersion, 2)
  assert.equal(manifest.contentRef, 'abc123')

  const product = manifest.products.fullsend
  assert.equal(product.format, 'v2')
  assert.equal(product.title, 'FullSend')
  assert.equal(product.firstPage, 'overview')
  assert.deepEqual(
    product.tree.map((n) => [n.slug, n.section_type, n.order, n.isPage]),
    [
      ['overview', 'page', 1, true],
      ['sending', 'header', 2, false],
      ['how-to', 'expandable', 3, true],
    ],
  )
  const howTo = product.tree[2]
  assert.equal(howTo.filePath, 'fullsend/how-to/index.md')
  assert.equal(howTo.hasContent, true)
  assert.deepEqual(howTo.children.map((n) => n.fullPath), ['how-to/step-1', 'how-to/on-android'])
  assert.deepEqual(howTo.children[1].children.map((n) => n.path), ['fullsend/how-to/on-android/setup'])

  // Page list is in navigation order, with the folder's index page before its children.
  assert.deepEqual(
    manifest.pages.map((p) => p.urlPath),
    ['overview', 'sending/send-transaction', 'how-to', 'how-to/step-1', 'how-to/on-android/setup'],
  )
  const howToPage = manifest.pages.find((p) => p.urlPath === 'how-to')
  assert.equal(howToPage.title, 'How To') // falls back to _meta.yml title
  assert.equal(howToPage.subtitle, 'Intro')
  assert.equal(manifest.pages[0].lastModified, '2026-01-02T00:00:00Z')
  assert.equal(manifest.pages[1].lastModified, null)
})

test('first page skips non-page rows', () => {
  const files = {
    'p/_meta.yml': meta('P', ['group']),
    'p/group/_meta.yml': meta('Group', ['a'], 'type: header\n'),
    'p/group/a.md': page('A'),
  }
  assert.equal(build(files).manifest.products.p.firstPage, 'group/a')
})

test('a product folder without _meta.yml is an error, not skipped', () => {
  // Regression: products without root metadata used to be treated as an older format and
  // skipped, so CI passed while the sites' builds failed.
  const files = { ...validProduct(), 'jitosol/intro.md': page('Intro') }
  assert.deepEqual(messages(build(files).errors), ['jitosol: folder is missing _meta.yml'])
  const noRootMeta = validProduct()
  delete noRootMeta['fullsend/_meta.yml']
  expectError(noRootMeta, /^fullsend: folder is missing _meta\.yml/)
})

test('names starting with _ (other than _meta.yml) and non-slug product folders are errors', () => {
  // Folders and files starting with _ are skipped, so without this they'd vanish silently.
  expectError({ ...validProduct(), '_bam/_meta.yml': meta('B', ['a']), '_bam/a.md': page('A') }, /_bam\/a\.md: names starting with "_" are reserved/)
  expectError({ ...validProduct(), 'fullsend/_drafts/x.md': page('X') }, /_drafts\/x\.md: names starting with "_" are reserved/)
  expectError({ ...validProduct(), 'fullsend/_x.md': page('X') }, /_x\.md: names starting with "_" are reserved/)
  expectError({ 'Bam Docs/_meta.yml': meta('B', ['a']), 'Bam Docs/a.md': page('A') }, /Bam Docs: product folder names must be lowercase-kebab-case/)
})

test('tools/ and hidden folders are not products', () => {
  const { manifest, errors } = build({ ...validProduct(), 'tools/x.mjs': '', '.github/workflows/x.yml': '' })
  assert.deepEqual(messages(errors), [])
  assert.deepEqual(Object.keys(manifest.products), ['fullsend'])
})

test('folders left holding only .DS_Store are ignored', () => {
  // Git doesn't track folders, so a pull that moves a folder's files can leave it behind
  // locally with just Finder's .DS_Store in it.
  const { manifest, errors } = build({
    ...validProduct(),
    'shared/images/.DS_Store': '',
    'fullsend/old-page/.DS_Store': '',
    'fullsend/overview/.DS_Store': '', // next to overview.md: not "both overview.md and overview/"
    'fullsend/how-to/gone/deeper/.DS_Store': '',
    'fullsend/how-to/empty/': null,
  })
  assert.deepEqual(messages(errors), [])
  assert.deepEqual(Object.keys(manifest.products), ['fullsend'])
})

test('every file and folder must be listed, and every listed slug must exist', () => {
  expectError({ ...validProduct(), 'fullsend/extra.md': page('Extra') }, /fullsend\/extra\.md: not listed/)
  expectError({ ...validProduct(), 'fullsend/how-to/more/_meta.yml': meta('More', ['x']), 'fullsend/how-to/more/x.md': page('X') }, /how-to\/more: not listed/)
  expectError(
    { ...validProduct(), 'fullsend/_meta.yml': meta('FullSend', ['overview', 'sending', 'how-to', 'missing']) },
    /neither missing\.md nor missing\/ exists/,
  )
})

test('pages list rules: duplicates, reserved names, slug format', () => {
  expectError({ ...validProduct(), 'fullsend/_meta.yml': meta('F', ['overview', 'overview', 'sending', 'how-to']) }, /listed more than once/)
  expectError({ ...validProduct(), 'fullsend/how-to/_meta.yml': meta('How To', ['index', 'step-1', 'on-android']) }, /"index" is reserved/)
  expectError({ ...validProduct(), 'fullsend/_meta.yml': meta('F', ['overview', 'sending', 'how-to', 'images']) }, /"images" is reserved/)
  expectError({ ...validProduct(), 'fullsend/Bad_Name.md': page('Bad'), 'fullsend/_meta.yml': meta('F', ['overview', 'sending', 'how-to', 'Bad_Name']) }, /lowercase-kebab-case/)
})

test('foo.md and foo/ cannot both exist', () => {
  expectError(
    { ...validProduct(), 'fullsend/overview/_meta.yml': meta('O', ['a']), 'fullsend/overview/a.md': page('A') },
    /both overview\.md and overview\/ exist/,
  )
})

test('_meta.yml schema', () => {
  expectError({ ...validProduct(), 'fullsend/how-to/_meta.yml': 'title: How To\npages: [step-1, on-android]\norder: 3\n' }, /unknown key "order"/)
  expectError({ ...validProduct(), 'fullsend/how-to/_meta.yml': 'pages: [step-1, on-android]\n' }, /"title" is required/)
  expectError({ ...validProduct(), 'fullsend/how-to/_meta.yml': 'title: How To\npages: []\n' }, /"pages" is required/)
  expectError({ ...validProduct(), 'fullsend/how-to/_meta.yml': meta('How To', ['step-1', 'on-android'], 'type: dropdown\n') }, /"type" must be one of/)
  expectError({ ...validProduct(), 'fullsend/_meta.yml': meta('F', ['overview', 'sending', 'how-to'], 'type: header\n') }, /unknown key "type"/)
  expectError({ ...validProduct(), 'fullsend/how-to/_meta.yml': 'title: [unclosed\n' }, /invalid YAML/)
  const noMeta = validProduct()
  delete noMeta['fullsend/how-to/on-android/_meta.yml']
  expectError(noMeta, /on-android: folder is missing _meta\.yml/)
})

test('page frontmatter schema', () => {
  expectError({ ...validProduct(), 'fullsend/overview.md': page('Overview', 'x', 'order: 1\n') }, /unknown key "order"/)
  expectError({ ...validProduct(), 'fullsend/overview.md': page('Overview', 'x', 'mermaid: yes-please\n') }, /"mermaid" must be a boolean/)
  expectError({ ...validProduct(), 'fullsend/overview.md': '---\nsubtitle: x\n---\n\nbody\n' }, /overview\.md: "title" is required/)
  expectError({ ...validProduct(), 'fullsend/overview.md': 'no frontmatter\n' }, /missing frontmatter/)
  expectError({ ...validProduct(), 'fullsend/overview.md': page('Overview', '   ') }, /page has no content/)
  const { errors } = build({ ...validProduct(), 'fullsend/overview.md': page('Overview', 'x', 'mermaid: true\n') })
  assert.deepEqual(messages(errors), [])
})

test('index.md and header rules', () => {
  expectError({ ...validProduct(), 'fullsend/index.md': page('Root') }, /product root cannot have index\.md/)
  expectError({ ...validProduct(), 'fullsend/sending/index.md': page('S') }, /header rows cannot be pages/)
  expectError(
    { ...validProduct(), 'fullsend/how-to/on-android/_meta.yml': meta('On Android', ['setup'], 'type: header\n') },
    /only allowed for folders directly under the product/,
  )
})

test('assets: images/ only at product root, no stray files, no symlinks', () => {
  expectError({ ...validProduct(), 'fullsend/how-to/images/x.png': 'png' }, /only allowed directly under the product/)
  expectError({ ...validProduct(), 'fullsend/how-to/x.png': 'png' }, /only \.md files and folders belong here/)
  const root = writeTree(validProduct())
  fs.symlinkSync('/etc/hosts', path.join(root, 'fullsend', 'how-to', 'leak.md'))
  const { errors } = buildManifest(root)
  assert.ok(errors.some((e) => /symbolic links are not allowed/.test(e.message)), messages(errors).join('\n'))
})

test('only plain content and raster images are allowed in products', () => {
  expectError({ ...validProduct(), 'fullsend/images/logo.svg': '<svg/>' }, /logo\.svg: file type not allowed/)
  expectError({ ...validProduct(), 'fullsend/how-to/x.html': '<script>' }, /x\.html: file type not allowed/)
  expectError({ ...validProduct(), 'fullsend/how-to/a.js': '' }, /a\.js: file type not allowed/)
  expectError({ ...validProduct(), 'fullsend/how-to/notes.yml': 'a: 1' }, /notes\.yml: file type not allowed/)
  expectError({ ...validProduct(), 'fullsend/how-to/.secret': 'x' }, /\.secret: hidden files and folders are not allowed/)
  expectError({ ...validProduct(), 'fullsend/.hidden/x.md': 'x' }, /hidden files and folders are not allowed/)
  const { errors } = build({ ...validProduct(), 'fullsend/images/a.WEBP': 'x', 'fullsend/.DS_Store': 'x' })
  assert.deepEqual(messages(errors), [])
})

test('the whole checkout is checked: root, tools/ and .github/ have their own allowlists', () => {
  expectError({ ...validProduct(), 'probe.html': '<script>' }, /probe\.html: unexpected file at the repo root/)
  expectError({ ...validProduct(), 'tools/probe.html': '<script>' }, /tools\/probe\.html: tools\/ may only contain/)
  expectError({ ...validProduct(), '.github/x.html': '<script>' }, /\.github\/x\.html: \.github\/ may only contain/)
  expectError({ ...validProduct(), 'evil/x.svg': '<svg/>' }, /evil\/x\.svg: file type not allowed/)
  const { errors } = build({
    ...validProduct(),
    'README.md': '# Readme',
    'package.json': '{}',
    'tools/a.mjs': '',
    '.github/workflows/a.yml': '',
  })
  assert.deepEqual(messages(errors), [])
})

test('dangerous URL schemes are caught through entities, whitespace and unquoted attributes', () => {
  assert.equal(urlScheme('&#106;avascript:alert(1)'), 'javascript:')
  assert.equal(urlScheme('&#x6A;ava&Tab;script:x'), 'javascript:')
  assert.equal(urlScheme(' java\nscript:x'), 'javascript:')
  assert.equal(urlScheme('JaVaScRiPt&colon;x'), 'javascript:')
  assert.equal(urlScheme('/fullsend/overview'), null)

  const withBody = (body) => ({ ...validProduct(), 'fullsend/how-to/step-1.md': page('Step 1', body) })
  for (const body of [
    '<a href=javascript:alert(1)>x</a>',
    '[x](&#106;avascript:alert(1))',
    '<iframe src="java\tscript:alert(1)"></iframe>',
    '<form action=JAVASCRIPT:alert(1)></form>',
    '<a title="x" href = \'data:text/html,hi\'>x</a>',
    '<a title=">" href="javascript:alert(1)">x</a>',
    '<svg><a xlink:href="javascript:alert(1)">x</a></svg>',
    '<template><a href="javascript:alert(1)">x</a></template>',
  ]) {
    const { errors } = build(withBody(body))
    assert.equal(errors.length, 1, `${body} -> ${messages(errors).join('; ') || 'no errors'}`)
    assert.match(errors[0].message, /is never allowed/)
  }
})

test('code and comment masking cannot hide links across paragraphs', () => {
  const withBody = (body) => ({ ...validProduct(), 'fullsend/how-to/step-1.md': page('Step 1', body) })
  for (const body of [
    'a stray ` here\n\n[x](javascript:alert(1))\n\nand another ` here',
    'text <!-- not closed here\n\n[x](javascript:alert(1))\n\nlater --> text',
  ]) {
    assert.equal(build(withBody(body)).errors.length, 1, body)
  }
  // Real code spans, fenced blocks and block comments are still ignored.
  for (const body of [
    'inline `[x](javascript:1)` code',
    '```\n[x](javascript:1)\n\n[y](javascript:2)\n```',
    '<!--\n[x](javascript:1)\n\n[y](javascript:2)\n-->',
  ]) {
    assert.deepEqual(messages(build(withBody(body)).errors), [], body)
  }
})

test('a directory named index.md is an error, not a crash', () => {
  expectError({ ...validProduct(), 'fullsend/how-to/on-android/index.md/x.png': 'png' }, /index\.md: index\.md must be a file/)
})

test('URL-looking text inside other attributes is not a link', () => {
  const { errors, warnings } = build({
    ...validProduct(),
    'fullsend/how-to/step-1.md': page('Step 1', '<a title=\'href="javascript:alert(1)"\' href="/fullsend/overview">x</a>'),
  })
  assert.deepEqual(messages(errors), [])
  assert.deepEqual(messages(warnings), [])
})

test('links in v2 pages must be root-absolute and resolve', () => {
  const withBody = (body) => ({ ...validProduct(), 'fullsend/how-to/step-1.md': page('Step 1', body) })
  expectError(withBody('[x](setup.md)'), /relative link "setup\.md"/)
  expectError(withBody('[x](../overview)'), /relative link/)
  expectError(withBody('[x](/docs/fullsend/overview)'), /drop the \/docs prefix/)
  expectError(withBody('[x](/fullsend/overview.md)'), /link to the page URL, not the file/)
  expectError(withBody('[x](/fullsend/nope)'), /"\/fullsend\/nope" does not exist/)
  expectError(withBody('[x](/stake)'), /not a docs page/)
  expectError(withBody('![x](/fullsend/images/missing.png)'), /image "\/fullsend\/images\/missing\.png" does not exist/)
  expectError({ ...withBody('![x](/fullsend/how-to/a.png)'), 'fullsend/how-to/a.png': 'png' }, /must live under \/<product>\/images\//)
  expectError(withBody('<a href="javascript:alert(1)">x</a>'), /"javascript:" is never allowed/)
  expectError(withBody('[x](about:blank)'), /"about:" is not allowed/)

  const ok = withBody(
    [
      '[product](/fullsend) [folder](/fullsend/how-to/on-android/) [page](/fullsend/how-to/step-1#part)',
      '[ext](https://jito.network/stake) [mail](mailto:a@b.c) [anchor](#here)',
      '<img src="/fullsend/images/diagram.png"> [ref]: /fullsend/overview',
      '```md\n[ignored](relative.md)\n```',
      'Inline `[ignored](relative.md)` too. <!-- [ignored](x.md) -->',
    ].join('\n\n'),
  )
  const { errors, warnings } = build(ok)
  assert.deepEqual(messages(errors), [])
  assert.deepEqual(messages(warnings), [])
})

test('splitFrontmatter handles BOM, CRLF, empty frontmatter and none', () => {
  assert.deepEqual(splitFrontmatter('﻿---\r\ntitle: A\r\n---\r\nbody').data, { title: 'A' })
  assert.deepEqual(splitFrontmatter('---\n---\nbody'), { data: {}, body: 'body', bodyLine: 3 })
  assert.equal(splitFrontmatter('# no frontmatter').data, null)
  assert.equal(splitFrontmatter('---\ntitle: A\n---\n\nbody').bodyLine, 4)
})

test('extractLinks reports line numbers and ignores code', () => {
  const links = extractLinks('a\n[x](/a)\n```\n[y](/b)\n```\n![z](/c.png "title")')
  assert.deepEqual(links, [
    { kind: 'link', target: '/a', line: 2 },
    { kind: 'image', target: '/c.png', line: 6 },
  ])
})

test('the real omnidocs content has no errors', () => {
  const { errors } = buildManifest(repoRoot)
  assert.deepEqual(messages(errors), [])
})
