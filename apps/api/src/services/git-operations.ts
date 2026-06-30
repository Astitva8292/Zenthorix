export class GitOperations {
  constructor(private token: string) {}

  async createBranch(owner: string, repo: string, baseBranch: string, newBranch: string): Promise<boolean> {
    try {
      const res = await fetch(`https://api.github.com/repos/${owner}/${repo}/git/refs`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${this.token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ ref: `refs/heads/${newBranch}`, sha: baseBranch }),
      })
      return res.ok
    } catch { return false }
  }

  async createPR(owner: string, repo: string, title: string, head: string, base: string): Promise<string | null> {
    try {
      const res = await fetch(`https://api.github.com/repos/${owner}/${repo}/pulls`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${this.token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, head, base, body: 'Automated PR by Zenthorix AI' }),
      })
      if (!res.ok) return null
      const data = await res.json()
      return data.html_url
    } catch { return null }
  }
}
