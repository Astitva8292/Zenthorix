const plugins = [
  { id: '1', name: 'Tailwind Formatter', desc: 'Auto-formats Tailwind classes', installs: 120, category: 'Formatting' },
  { id: '2', name: 'Figma to Code', desc: 'Convert Figma designs to React', installs: 89, category: 'Agents' },
  { id: '3', name: 'Dark Theme', desc: 'Custom dark theme variant', installs: 200, category: 'Themes' },
]

export default function MarketplacePage() {
  return (
    <div className="mx-auto max-w-5xl p-8">
      <h1 className="mb-2 text-2xl font-bold">Plugin Marketplace</h1>
      <p className="mb-6 text-sm text-muted-foreground">Extend Zenthorix with community plugins</p>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {plugins.map(p => (
          <div key={p.id} className="rounded-xl border border-border p-5">
            <h3 className="font-semibold">{p.name}</h3>
            <p className="mt-1 text-xs text-muted-foreground">{p.desc}</p>
            <div className="mt-3 flex items-center justify-between">
              <span className="text-xs text-muted-foreground">{p.installs} installs</span>
              <button className="rounded-md bg-primary px-3 py-1 text-xs text-primary-foreground">Install</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
