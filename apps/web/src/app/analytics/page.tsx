export default function AnalyticsPage() {
  const mockDailySpend = [
    { date: 'Mon', amount: 0.45 },
    { date: 'Tue', amount: 0.78 },
    { date: 'Wed', amount: 1.23 },
    { date: 'Thu', amount: 0.92 },
    { date: 'Fri', amount: 0.34 },
  ]

  const totalSpend = mockDailySpend.reduce((s, d) => s + d.amount, 0)

  return (
    <div className="mx-auto max-w-4xl p-8">
      <h1 className="mb-6 text-2xl font-bold">Usage Analytics</h1>
      <div className="mb-8 grid grid-cols-3 gap-4">
        <div className="rounded-xl border border-border p-4">
          <p className="text-xs text-muted-foreground">Total Spend</p>
          <p className="mt-1 text-2xl font-bold">${totalSpend.toFixed(2)}</p>
        </div>
        <div className="rounded-xl border border-border p-4">
          <p className="text-xs text-muted-foreground">Total Tokens</p>
          <p className="mt-1 text-2xl font-bold">124.5K</p>
        </div>
        <div className="rounded-xl border border-border p-4">
          <p className="text-xs text-muted-foreground">Avg Cost/Request</p>
          <p className="mt-1 text-2xl font-bold">$0.012</p>
        </div>
      </div>
      <div className="rounded-xl border border-border p-6">
        <h2 className="mb-4 text-sm font-semibold">Daily Spend (Last 5 Days)</h2>
        <div className="flex items-end gap-3" style={{ height: 160 }}>
          {mockDailySpend.map(d => (
            <div key={d.date} className="flex flex-1 flex-col items-center gap-1">
              <div className="w-full rounded-t bg-primary/20" style={{ height: `${(d.amount / 1.5) * 160}px` }} />
              <span className="text-xs text-muted-foreground">{d.date}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
