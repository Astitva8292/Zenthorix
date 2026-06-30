export class GitHubService {
  private token: string

  constructor(token: string) {
    this.token = token
  }

  async getUser(): Promise<{ login: string; id: number } | null> {
    try {
      const res = await fetch('https://api.github.com/user', {
        headers: { Authorization: `Bearer ${this.token}`, Accept: 'application/vnd.github.v3+json' },
      })
      if (!res.ok) return null
      const data = await res.json() as { login: string; id: number }
      return data
    } catch { return null }
  }

  async getRepo(owner: string, repo: string): Promise<{ name: string; defaultBranch: string } | null> {
    try {
      const res = await fetch(`https://api.github.com/repos/${owner}/${repo}`, {
        headers: { Authorization: `Bearer ${this.token}`, Accept: 'application/vnd.github.v3+json' },
      })
      if (!res.ok) return null
      const data = await res.json() as { name: string; defaultBranch: string }
      return data
    } catch { return null }
  }
}
