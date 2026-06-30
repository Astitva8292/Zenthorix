interface ImportedFile {
  path: string
  content: string
}

export class GitHubImporter {
  async importRepo(token: string, owner: string, repo: string, branch = 'main'): Promise<ImportedFile[]> {
    const files: ImportedFile[] = []
    const treeUrl = `https://api.github.com/repos/${owner}/${repo}/git/trees/${branch}?recursive=1`

    const res = await fetch(treeUrl, {
      headers: { Authorization: `Bearer ${token}`, Accept: 'application/vnd.github.v3+json' },
    })
    if (!res.ok) throw new Error(`Failed to fetch repo tree: ${res.status}`)

    const tree = await res.json()
    const blobs = tree.tree?.filter((item: any) => item.type === 'blob') ?? []

    for (const blob of blobs.slice(0, 100)) {
      try {
        const contentRes = await fetch(blob.url, {
          headers: { Authorization: `Bearer ${token}`, Accept: 'application/vnd.github.v3+json' },
        })
        if (contentRes.ok) {
          const data = await contentRes.json()
          if (data.content) {
            files.push({ path: blob.path, content: Buffer.from(data.content, 'base64').toString('utf-8') })
          }
        }
      } catch { /* skip failed files */ }
    }
    return files
  }
}
