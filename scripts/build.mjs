import { build } from 'esbuild'
import { readdirSync, existsSync, mkdirSync, readFileSync } from 'fs'
import { execSync } from 'child_process'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const cwd = process.cwd()
const pkgJson = JSON.parse(readFileSync(join(cwd, 'package.json'), 'utf-8'))

const deps = new Set([
  ...Object.keys(pkgJson.dependencies || {}),
  ...Object.keys(pkgJson.peerDependencies || {}),
])

const entryPoints = []
const srcDir = join(cwd, 'src')
if (existsSync(srcDir)) {
  function walk(dir) {
    const entries = readdirSync(dir, { withFileTypes: true })
    for (const entry of entries) {
      const fullPath = join(dir, entry.name)
      if (entry.isDirectory()) {
        walk(fullPath)
      } else if (entry.name.endsWith('.ts') && !entry.name.endsWith('.d.ts')) {
        entryPoints.push(fullPath)
      } else if (entry.name.endsWith('.tsx') && !entry.name.endsWith('.d.ts')) {
        entryPoints.push(fullPath)
      }
    }
  }
  walk(srcDir)
}

await build({
  entryPoints,
  outdir: 'dist',
  format: 'esm',
  platform: 'node',
  target: 'es2022',
  bundle: true,
  external: [...deps],
  sourcemap: true,
  outbase: 'src',
  logLevel: 'info',
})

if (!existsSync('dist')) mkdirSync('dist')

try {
  execSync('tsc --emitDeclarationOnly --declaration --outDir dist', { stdio: 'inherit' })
} catch {
  console.warn('Declaration generation failed (may be expected for some packages)')
}
