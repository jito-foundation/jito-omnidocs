#!/usr/bin/env node
/**
 * Builds docs/manifest.json from omnidocs content, or validates it with --check.
 *
 *   node tools/build-manifest.mjs --check                      # CI / local validation
 *   node tools/build-manifest.mjs --root <content> --out <manifest.json> \
 *        [--dates <dates.json>] [--ref <content sha>]
 *
 * Exits 1 when there are errors (in both modes), so site builds fail loudly on bad content.
 */
import fs from 'node:fs'
import path from 'node:path'
import { parseArgs } from 'node:util'
import { buildManifest } from './manifest-lib.mjs'

const { values: args } = parseArgs({
  options: {
    root: { type: 'string', default: '.' },
    out: { type: 'string' },
    dates: { type: 'string' },
    ref: { type: 'string' },
    check: { type: 'boolean', default: false },
    quiet: { type: 'boolean', default: false },
  },
})

if (!args.check && !args.out) {
  console.error('Pass --check to validate, or --out <file> to write the manifest.')
  process.exit(2)
}

const dates = args.dates ? JSON.parse(fs.readFileSync(args.dates, 'utf8')) : null
const { manifest, errors, warnings } = buildManifest(args.root, { dates, ref: args.ref ?? null })

const inActions = process.env.GITHUB_ACTIONS === 'true'
const print = (level, { file, line, message }) => {
  if (inActions) {
    const loc = file ? ` file=${file}${line ? `,line=${line}` : ''}` : ''
    console.log(`::${level}${loc}::${message}`)
  } else {
    console.log(`${level === 'error' ? 'error' : 'warn '} ${file}${line ? `:${line}` : ''}  ${message}`)
  }
}
if (!args.quiet) warnings.forEach((w) => print('warning', w))
errors.forEach((e) => print('error', e))

console.log(
  `\nProducts: ${Object.keys(manifest.products).join(', ') || 'none'}\nPages: ${manifest.pages.length}  Errors: ${errors.length}  Warnings: ${warnings.length}`,
)

if (errors.length) process.exit(1)
if (args.out) {
  fs.mkdirSync(path.dirname(path.resolve(args.out)), { recursive: true })
  fs.writeFileSync(args.out, JSON.stringify(manifest, null, 2) + '\n')
  console.log(`Wrote ${args.out}`)
}
