export default function AdminPage() {
  return (
    <div className="mx-auto max-w-5xl p-8">
      <h1 className="mb-6 text-2xl font-bold">System Health</h1>
      <div className="grid grid-cols-3 gap-4">
        <div className="rounded-xl border border-border p-4"><p className="text-xs text-muted-foreground">Active Connections</p><p className="mt-1 text-2xl font-bold">3</p></div>
        <div className="rounded-xl border border-border p-4"><p className="text-xs text-muted-foreground">Queue Length</p><p className="mt-1 text-2xl font-bold">0</p></div>
        <div className="rounded-xl border border-border p-4"><p className="text-xs text-muted-foreground">Memory Usage</p><p className="mt-1 text-2xl font-bold">256 MB</p></div>
      </div>
      <div className="mt-8 rounded-xl border border-border p-4">
        <h2 className="mb-3 text-sm font-semibold">Active Sessions</h2>
        <table className="w-full text-sm">
          <thead><tr className="text-left text-muted-foreground"><th className="pb-2">User</th><th className="pb-2">Workspace</th><th className="pb-2">Duration</th></tr></thead>
          <tbody>
            <tr className="border-t border-border"><td className="py-2">demo@user.com</td><td>My App</td><td>12m</td></tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}
