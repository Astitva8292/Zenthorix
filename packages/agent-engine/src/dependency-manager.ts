export class DependencyManager {
  async validatePackage(name: string): Promise<boolean> {
    try {
      const res = await fetch(`https://registry.npmjs.org/${encodeURIComponent(name)}/latest`)
      return res.ok
    } catch { return false }
  }

  async parsePackageJson(content: string): Promise<Record<string, string>> {
    try { return JSON.parse(content).dependencies ?? {} }
    catch { return {} }
  }
}
