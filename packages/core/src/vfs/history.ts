export class VFSHistory {
  private snapshots: { timestamp: number; files: Map<string, string>; label: string }[] = []
  private maxSnapshots = 20

  snapshot(files: Map<string, string>, label: string): void {
    this.snapshots.push({ timestamp: Date.now(), files: new Map(files), label })
    if (this.snapshots.length > this.maxSnapshots) this.snapshots.shift()
  }

  get(index: number) { return this.snapshots[index] }
  getAll() { return this.snapshots }
  latest() { return this.snapshots[this.snapshots.length - 1] }
  clear() { this.snapshots = [] }
  get count() { return this.snapshots.length }
}
