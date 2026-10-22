import { test } from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { execFileSync } from 'node:child_process'
import { computeDates } from '../git-dates.mjs'
import { writeTree } from './helpers.mjs'

function commit(repo, message, date) {
  const env = {
    ...process.env,
    GIT_AUTHOR_NAME: 'Test',
    GIT_AUTHOR_EMAIL: 'test@example.com',
    GIT_COMMITTER_NAME: 'Test',
    GIT_COMMITTER_EMAIL: 'test@example.com',
    GIT_AUTHOR_DATE: date,
    GIT_COMMITTER_DATE: date,
  }
  execFileSync('git', ['-C', repo, 'add', '-A'], { env })
  execFileSync('git', ['-C', repo, 'commit', '-q', '--no-gpg-sign', '-m', message], { env })
  return execFileSync('git', ['-C', repo, 'rev-parse', 'HEAD']).toString().trim()
}

const body = (n) => `---\ntitle: Page\n---\n\n${'Real content line.\n'.repeat(20)}${n}\n`

test('dates follow renames and skip [skip-dates] commits', async () => {
  const repo = writeTree({ 'p/a/index.md': body(1), 'p/b/index.md': body(2), 'p/c.md': body(3) })
  execFileSync('git', ['-C', repo, 'init', '-q'])
  commit(repo, 'initial', '2025-01-01T00:00:00Z')

  fs.writeFileSync(path.join(repo, 'p/c.md'), body('3 edited'))
  commit(repo, 'edit c', '2025-02-01T00:00:00Z')

  // Migration-style move, marked in the message body (survives squash merges).
  fs.renameSync(path.join(repo, 'p/a/index.md'), path.join(repo, 'p/a.md'))
  fs.renameSync(path.join(repo, 'p/b/index.md'), path.join(repo, 'p/b.md'))
  commit(repo, 'Migrate to v2\n\n* move pages [skip-dates]', '2025-03-01T00:00:00Z')

  const dates = await computeDates(repo)
  assert.deepEqual(Object.keys(dates), ['p/a.md', 'p/b.md', 'p/c.md'])
  assert.match(dates['p/a.md'], /^2025-01-01/)
  assert.match(dates['p/b.md'], /^2025-01-01/)
  assert.match(dates['p/c.md'], /^2025-02-01/)
})
