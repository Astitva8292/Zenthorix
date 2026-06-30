import { createWriteStream } from 'fs'
import { join } from 'path'
import { tmpdir } from 'os'

export class WorkspaceExport {
  async exportToZip(files: Map<string, string>): Promise<Buffer> {
    const { writeFileSync, mkdirSync, readFileSync } = await import('fs')
    const { execSync } = await import('child_process')
    const tmpDir = join(tmpdir(), `zenthorix-export-${Date.now()}`)
    
    mkdirSync(tmpDir, { recursive: true })
    for (const [path, content] of files) {
      const fullPath = join(tmpDir, path)
      mkdirSync(fullPath.slice(0, fullPath.lastIndexOf('/')), { recursive: true })
      writeFileSync(fullPath, content, 'utf-8')
    }
    
    execSync(`cd "${tmpDir}" && zip -r export.zip .`, { stdio: 'ignore' })
    const zipBuffer = readFileSync(join(tmpDir, 'export.zip'))
    execSync(`rm -rf "${tmpDir}"`, { stdio: 'ignore' })
    return zipBuffer
  }
}
