// Fixtures are written to temp dirs at test time on purpose: the docs sites index every .md
// file in the omnidocs checkout, so checked-in fixture pages would leak into site search.
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'

/** Writes { 'a/b.md': 'text', 'a/c/': null (empty dir) } under a fresh temp dir. */
export function writeTree(files) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'omnidocs-test-'))
  for (const [rel, content] of Object.entries(files)) {
    const abs = path.join(root, rel)
    if (content === null) {
      fs.mkdirSync(abs, { recursive: true })
      continue
    }
    fs.mkdirSync(path.dirname(abs), { recursive: true })
    fs.writeFileSync(abs, content)
  }
  return root
}

export const page = (title, body = 'Some content.', extra = '') =>
  `---\ntitle: ${title}\n${extra}---\n\n${body}\n`

export const meta = (title, pages, extra = '') =>
  `title: ${title}\n${extra}pages: [${pages.join(', ')}]\n`

/** A small valid v2 product used as a base by most tests. */
export const validProduct = () => ({
  'fullsend/_meta.yml': meta('FullSend', ['overview', 'sending', 'how-to']),
  'fullsend/overview.md': page('Overview', 'See [send](/fullsend/sending/send-transaction#auth).'),
  'fullsend/images/diagram.png': 'png',
  'fullsend/sending/_meta.yml': meta('Sending Transactions', ['send-transaction'], 'type: header\n'),
  'fullsend/sending/send-transaction.md': page('sendTransaction', '![d](/fullsend/images/diagram.png)'),
  'fullsend/how-to/_meta.yml': meta('How To', ['step-1', 'on-android']),
  'fullsend/how-to/index.md': '---\nsubtitle: Intro\n---\n\nHow-to intro.\n',
  'fullsend/how-to/step-1.md': page('Step 1'),
  'fullsend/how-to/on-android/_meta.yml': meta('On Android', ['setup']),
  'fullsend/how-to/on-android/setup.md': page('Setup'),
})

export const messages = (list) => list.map((e) => `${e.file}: ${e.message}`)
