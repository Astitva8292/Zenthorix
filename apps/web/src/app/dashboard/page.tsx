import Link from 'next/link'

const mockProjects = [
  { id: '1', name: 'My App', lastModified: '2 hours ago', model: 'claude-3.5-sonnet' },
  { id: '2', name: 'API Service', lastModified: '1 day ago', model: 'gpt-4o' },
]

export default async function DashboardPage() {
  return (
    <div className="mx-auto max-w-6xl p-8">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Workspaces</h1>
        <Link href="/" className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90">
          + New Project
        </Link>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {mockProjects.map(p => (
          <Link key={p.id} href="/"
            className="rounded-xl border border-border p-5 transition-shadow hover:shadow-lg"
          >
            <h3 className="font-semibold">{p.name}</h3>
            <p className="mt-1 text-xs text-muted-foreground">Modified {p.lastModified}</p>
            <p className="mt-1 text-xs text-muted-foreground">Model: {p.model}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}
