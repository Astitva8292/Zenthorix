export interface BuildResult {
  success: boolean
  output: string
  error?: string
  duration: number
}

export class BuildRunner {
  async runBuild(files: Map<string, string>, command: string = 'npm run build'): Promise<BuildResult> {
    const start = Date.now()
    const tmpDir = `/tmp/zenthorix-build-${Date.now()}`
    try {
      const { mkdirSync, writeFileSync } = await import('fs')
      const { execSync } = await import('child_process')
      const { join } = await import('path')

      mkdirSync(tmpDir, { recursive: true })
      for (const [path, content] of files) {
        const fullPath = join(tmpDir, path)
        const dir = fullPath.slice(0, fullPath.lastIndexOf('/'))
        mkdirSync(dir, { recursive: true })
        writeFileSync(fullPath, content, 'utf-8')
      }

      const output = execSync(command, { cwd: tmpDir, timeout: 60000, encoding: 'utf-8' })
      return { success: true, output, duration: Date.now() - start }
    } catch (err: any) {
      return { success: false, output: err.stdout ?? '', error: err.stderr ?? err.message, duration: Date.now() - start }
    } finally {
      const { rmSync } = await import('fs')
      try { rmSync(tmpDir, { recursive: true, force: true }) } catch {}
    }
  }
}
