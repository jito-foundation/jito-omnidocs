#!/usr/bin/env node
/**
 * Writes { "<path/to/file.md>": "<ISO date>" } with each markdown file's last real change.
 *
 *   node tools/git-dates.mjs --repo <omnidocs checkout> --out dates.json
 *
 * Run it before deleting the checkout's .git. It needs full history (not --depth 1).
 * Follows renames, and skips commits whose message contains [skip-dates] (use it for
 * commits that only move files around, like the v2 migration).
 */
import fs from 'node:fs'
import path from 'node:path'
import { execFile } from 'node:child_process'
import { promisify } from 'node:util'
import { parseArgs } from 'node:util'
import { pathToFileURL } from 'node:url'

const run = promisify(execFile)
export const SKIP_MARKER = '[skip-dates]'

async function git(repo, args) {
  const { stdout } = await run('git', ['-C', repo, ...args], { maxBuffer: 64 * 1024 * 1024 })
  return stdout
}

async function lastRealChange(repo, file) {
  // %x1e separates commits, %x1f separates fields.
  const out = await git(repo, ['log', '--follow', '--format=%H%x1f%cI%x1f%B%x1e', '--', file])
  for (const record of out.split('\x1e')) {
    const [sha, date, message = ''] = record.replace(/^\n/, '').split('\x1f')
    if (!sha || !date) continue
    if (message.includes(SKIP_MARKER)) continue
    return date
  }
  return null
}

export async function computeDates(repo, { concurrency = 8 } = {}) {
  if (fs.existsSync(path.join(repo, '.git', 'shallow'))) {
    console.warn('git-dates: shallow clone detected; dates may be wrong. Clone with full history.')
  }
  const files = (await git(repo, ['ls-files', '-z', '--', '*.md'])).split('\0').filter(Boolean)
  const dates = {}
  const queue = [...files]
  await Promise.all(
    Array.from({ length: concurrency }, async () => {
      while (queue.length) {
        const file = queue.shift()
        const date = await lastRealChange(repo, file)
        if (date) dates[file] = date
      }
    }),
  )
  return Object.fromEntries(Object.entries(dates).sort(([a], [b]) => a.localeCompare(b)))
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  const { values } = parseArgs({ options: { repo: { type: 'string', default: '.' }, out: { type: 'string' } } })
  const dates = await computeDates(path.resolve(values.repo))
  const json = JSON.stringify(dates, null, 2) + '\n'
  if (values.out) {
    fs.writeFileSync(values.out, json)
    console.log(`Wrote ${Object.keys(dates).length} dates to ${values.out}`)
  } else {
    process.stdout.write(json)
  }
}
