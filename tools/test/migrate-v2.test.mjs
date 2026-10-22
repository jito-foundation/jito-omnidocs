import { test } from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { migrate } from '../migrate-v2.mjs'
import { buildManifest } from '../manifest-lib.mjs'
import { writeTree } from './helpers.mjs'

const legacy = (title, sectionType, order, body = '', extra = '') =>
  `---\ntitle: '${title}'\norder: ${order}\nsection_type: '${sectionType}'\nsubtitle: ''\n${extra}---\n${body}`

const fixture = () =>
  writeTree({
    'jitosol/intro/index.md': legacy('Intro', 'page', 1, '\nSee [faq](/docs/jitosol/faqs/general/) and [setup](../get-started/setup/index.md).\n'),
    'jitosol/get-started/index.md': legacy('Get Started', 'header', 2),
    'jitosol/get-started/setup/index.md': legacy(
      'Setup',
      'page',
      2,
      [
        '',
        '![shot](/shared/images/jitosol/shot.png)',
        '<img src="/shared/images/jitosol/shot.png" alt="x">',
        '[sibling](wallets/) [product-relative](jitosol/faqs/general/) [ext](https://jito.network)',
        '[broken](missing-page.md) [anchor](#top)',
        '```md',
        '[in code](relative.md)',
        '```',
        '',
      ].join('\n'),
    ),
    'jitosol/get-started/wallets/index.md': legacy('Wallets', 'expandable', 1),
    'jitosol/get-started/wallets/phantom/index.md': legacy('Phantom', 'page', 1, '\nPhantom.\n', 'mermaid: true\n'),
    'jitosol/faqs/index.md': legacy('FAQs', 'expandable', 3),
    'jitosol/faqs/general/index.md': legacy('General', 'page', 1, '\nQ&A.\n'),
    'shared/images/jitosol/shot.png': 'png',
  })

test('migrates a legacy product to valid v2 with the same navigation', () => {
  const root = fixture()
  const { report } = migrate(root, { log: () => {} })

  // Pages become slug.md, containers get _meta.yml ordered by the old `order`.
  assert.equal(fs.readFileSync(path.join(root, 'jitosol/_meta.yml'), 'utf8'), 'title: JitoSOL\npages:\n  - intro\n  - get-started\n  - faqs\n')
  assert.equal(
    fs.readFileSync(path.join(root, 'jitosol/get-started/_meta.yml'), 'utf8'),
    'title: Get Started\ntype: header\npages:\n  - wallets\n  - setup\n',
  )
  assert.equal(fs.readFileSync(path.join(root, 'jitosol/get-started/wallets/_meta.yml'), 'utf8'), 'title: Wallets\npages:\n  - phantom\n')
  assert.equal(
    fs.readFileSync(path.join(root, 'jitosol/get-started/wallets/phantom.md'), 'utf8'),
    '---\ntitle: Phantom\nmermaid: true\n---\n\nPhantom.\n',
  )
  assert.ok(!fs.existsSync(path.join(root, 'jitosol/intro')), 'empty legacy page dir removed')
  assert.ok(!fs.existsSync(path.join(root, 'shared')), 'shared/ removed once empty')
  assert.ok(fs.existsSync(path.join(root, 'jitosol/images/shot.png')), 'images moved')

  // Links are rewritten to root-absolute v2 form; code and external links are untouched.
  const setup = fs.readFileSync(path.join(root, 'jitosol/get-started/setup.md'), 'utf8')
  assert.match(setup, /!\[shot\]\(\/jitosol\/images\/shot\.png\)/)
  assert.match(setup, /<img src="\/jitosol\/images\/shot\.png"/)
  assert.match(setup, /\[sibling\]\(\/jitosol\/get-started\/setup\/wallets\/\)/)
  assert.match(setup, /\[product-relative\]\(\/jitosol\/faqs\/general\/\)/)
  assert.match(setup, /\[ext\]\(https:\/\/jito\.network\)/)
  assert.match(setup, /\[anchor\]\(#top\)/)
  assert.match(setup, /\[in code\]\(relative\.md\)/)
  const intro = fs.readFileSync(path.join(root, 'jitosol/intro.md'), 'utf8')
  assert.match(intro, /\[faq\]\(\/jitosol\/faqs\/general\/\)/)
  assert.match(intro, /\[setup\]\(\/jitosol\/get-started\/setup\)/)

  // Unresolvable links are reported, not guessed. (A sibling link written as `wallets/`
  // resolves against the page URL, like a browser would, so it is reported too.)
  assert.deepEqual(
    report.map((r) => `${r.target} ${r.problem}`),
    ['wallets/ link target does not exist', 'missing-page.md link target does not exist'],
  )

  const { manifest, errors } = buildManifest(root)
  assert.deepEqual(
    errors.map((e) => e.message),
    [
      'link target "/jitosol/get-started/setup/wallets/" does not exist',
      'link target "/jitosol/get-started/setup/missing-page" does not exist',
    ],
  )
  const tree = manifest.products.jitosol.tree
  assert.deepEqual(
    tree.map((n) => [n.slug, n.section_type, n.isPage]),
    [
      ['intro', 'page', true],
      ['get-started', 'header', false],
      ['faqs', 'expandable', false],
    ],
  )
})

test('is idempotent: a second run changes nothing', () => {
  const root = fixture()
  migrate(root, { log: () => {} })
  const snapshot = (dir) =>
    fs.readdirSync(dir, { recursive: true }).sort().map((f) => {
      const p = path.join(dir, f)
      return fs.statSync(p).isFile() ? `${f}:${fs.readFileSync(p, 'utf8')}` : f
    })
  const before = snapshot(root)
  const { report } = migrate(root, { log: () => {} })
  assert.deepEqual(snapshot(root), before)
  assert.deepEqual(report, [])
})

test('dry run writes nothing', () => {
  const root = fixture()
  migrate(root, { dryRun: true, log: () => {} })
  assert.ok(fs.existsSync(path.join(root, 'jitosol/intro/index.md')))
  assert.ok(!fs.existsSync(path.join(root, 'jitosol/_meta.yml')))
})
