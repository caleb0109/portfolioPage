import { writeFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const file = join(root, 'dist', '.nojekyll')
writeFileSync(file, '')
console.log('Wrote dist/.nojekyll (disables Jekyll on GitHub Pages)')
