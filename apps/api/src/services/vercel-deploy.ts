export class VercelDeployService {
  constructor(private token: string) {}

  async deploy(files: Map<string, string>, projectName: string): Promise<{ url?: string; error?: string }> {
    try {
      const projectRes = await fetch('https://api.vercel.com/v9/projects', {
        method: 'POST',
        headers: { Authorization: `Bearer ${this.token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: projectName, framework: 'nextjs' }),
      })
      if (!projectRes.ok) return { error: 'Failed to create Vercel project' }
      const project = await projectRes.json() as { id: string }

      const deployRes = await fetch(`https://api.vercel.com/v13/deployments`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${this.token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: projectName, project: project.id, files: [] }),
      })
      if (!deployRes.ok) return { error: 'Deployment failed' }
      const deploy = await deployRes.json() as { url: string }
      return { url: deploy.url }
    } catch (err: any) {
      return { error: err.message }
    }
  }
}
