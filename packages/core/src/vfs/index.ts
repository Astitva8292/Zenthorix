export interface VFSEntry {
  path: string
  content: string
  type: 'file' | 'directory'
  children?: VFSEntry[]
}

export class VirtualFileSystem {
  private files = new Map<string, string>()

  readFile(path: string): string | undefined {
    return this.files.get(path)
  }

  writeFile(path: string, content: string): void {
    this.files.set(path, content)
  }

  deleteFile(path: string): boolean {
    return this.files.delete(path)
  }

  listFiles(dir?: string): string[] {
    const allPaths = Array.from(this.files.keys())
    if (!dir) return allPaths
    return allPaths.filter(p => p.startsWith(dir + '/') || p === dir)
  }

  exists(path: string): boolean {
    return this.files.has(path)
  }

  applyPatch(path: string, newContent: string): boolean {
    if (!this.files.has(path)) return false
    this.files.set(path, newContent)
    return true
  }

  createSnapshot(): Map<string, string> {
    return new Map(this.files)
  }

  restoreSnapshot(snapshot: Map<string, string>): void {
    this.files = new Map(snapshot)
  }

  toTree(): VFSEntry[] {
    const root = new Map<string, VFSEntry>()

    for (const [path, content] of this.files) {
      const parts = path.split('/')
      let current = root
      for (let i = 0; i < parts.length; i++) {
        const part = parts[i]
        const fullPath = parts.slice(0, i + 1).join('/')
        if (i === parts.length - 1) {
          current.set(part, { path: fullPath, content, type: 'file' })
        } else {
          if (!current.has(part)) {
            current.set(part, { path: fullPath, content: '', type: 'directory', children: [] })
          }
          const entry = current.get(part)!
          if (entry.type === 'directory') {
            current = new Map(entry.children!.map(c => [c.path.split('/').pop()!, c]))
          }
        }
      }
    }

    function buildMap(map: Map<string, VFSEntry>): VFSEntry[] {
      return Array.from(map.values()).map(e => {
        if (e.type === 'directory') {
          return { ...e, children: buildMap(new Map(e.children!.map(c => [c.path.split('/').pop()!, c]))) }
        }
        return e
      })
    }

    return buildMap(root)
  }
}
