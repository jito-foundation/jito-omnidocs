import { test } from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import { writeTree, page, meta, validProduct } from './helpers.mjs'

const script = path.join(path.dirname(fileURLToPath(import.meta.url)), '../build-site-data.mjs')
const run = (root, extra = []) => {
  const out = fs.mkdtempSync(path.join(os.tmpdir(), 'site-data-'))
  const pub = fs.mkdtempSync(path.join(os.tmpdir(), 'site-public-'))
  const res = spawnSync(process.execPath, [script, '--root', root, '--out', out, '--public', pub, ...extra], { encoding: 'utf8' })
  return { ...res, out, pub, read: (dir, f) => fs.readFileSync(path.join(dir, f), 'utf8') }
}

test('builds pages, manifest, redirects, search, markdown exports, llms.txt and images', () => {
  const root = writeTree({
    ...validProduct(),
    'fullsend/how-to/step-1.md': page('Step 1', 'Go to [setup](/fullsend/how-to/on-android/setup#a).\n\n![d](/fullsend/images/diagram.png)'),
  })
  const r = run(root, ['--site-url', 'https://site.example', '--site-name', 'Example Docs', '--ref', 'abc'])
  assert.equal(r.status, 0, r.stderr)

  const manifest = JSON.parse(r.read(r.out, 'manifest.json'))
  assert.equal(manifest.contentRef, 'abc')
  assert.deepEqual(Object.keys(manifest.products), ['fullsend'])
  assert.deepEqual(manifest.redirects, {
    'fullsend/sending': 'fullsend/sending/send-transaction',
    'fullsend/how-to/on-android': 'fullsend/how-to/on-android/setup',
    fullsend: 'fullsend/overview',
  })

  const step = JSON.parse(r.read(r.out, 'pages/fullsend/how-to/step-1.json'))
  assert.equal(step.title, 'Step 1')
  assert.match(step.html, /href="\/docs\/fullsend\/how-to\/on-android\/setup\/#a"/)
  assert.deepEqual(step.prev, { urlPath: 'how-to', title: 'How To' })
  assert.deepEqual(step.next, { urlPath: 'how-to/on-android/setup', title: 'Setup' })
  assert.deepEqual(step.breadcrumbs, [
    { title: 'How To', urlPath: 'how-to' },
    { title: 'Step 1', urlPath: 'how-to/step-1' },
  ])

  const index = JSON.parse(r.read(r.out, 'search-index.json'))
  assert.equal(index.length, 5)
  assert.ok(index.every((e) => e.product === 'fullsend' && typeof e.text === 'string'))

  const md = r.read(r.pub, 'docs/fullsend/how-to/step-1.md')
  assert.match(md, /^# Step 1\n/)
  assert.match(md, /\(https:\/\/site\.example\/docs\/fullsend\/how-to\/on-android\/setup\.md#a\)/)
  assert.match(md, /\(https:\/\/site\.example\/omnidocs\/fullsend\/images\/diagram\.png\)/)

  const llms = r.read(r.pub, 'llms.txt')
  assert.match(llms, /^# Example Docs\n/)
  assert.match(llms, /- \[Step 1\]\(https:\/\/site\.example\/docs\/fullsend\/how-to\/step-1\.md\)/)
  assert.match(r.read(r.pub, 'llms-full.txt'), /# Setup/)
  assert.equal(r.read(r.pub, 'omnidocs/fullsend/images/diagram.png'), 'png')
})

test('only the requested products are published', () => {
  const root = writeTree({
    ...validProduct(),
    'other/_meta.yml': meta('Other', ['a']),
    'other/a.md': page('A', '[to fullsend](/fullsend/overview)'),
  })
  const r = run(root, ['--products', 'other'])
  assert.equal(r.status, 0, r.stderr)
  assert.deepEqual(Object.keys(JSON.parse(r.read(r.out, 'manifest.json')).products), ['other'])
  assert.ok(!fs.existsSync(path.join(r.out, 'pages/fullsend')))
  // Links into a product that isn't published here are inert.
  assert.match(JSON.parse(r.read(r.out, 'pages/other/a.json')).html, /<a>to fullsend<\/a>/)
})

test('fails on invalid content and on unpublishable products', () => {
  const bad = run(writeTree({ ...validProduct(), 'fullsend/extra.md': page('Extra') }))
  assert.equal(bad.status, 1)
  assert.match(bad.stderr, /not listed/)

  const legacy = run(writeTree({ 'jitosol/intro/index.md': page('Intro') }), ['--products', 'jitosol'])
  assert.equal(legacy.status, 1)
  assert.match(legacy.stderr, /not in format v2/)

  const missing = run(writeTree(validProduct()), ['--products', 'nope'])
  assert.equal(missing.status, 1)
  assert.match(missing.stderr, /not in the content/)
})
