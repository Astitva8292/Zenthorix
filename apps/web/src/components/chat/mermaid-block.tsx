'use client'

interface MermaidBlockProps { code: string }

export function MermaidBlock({ code }: MermaidBlockProps) {
  return (
    <div className="my-2 rounded-lg border border-border bg-secondary p-4">
      <div className="mb-2 text-xs font-medium text-muted-foreground">Architecture Diagram</div>
      <pre className="overflow-auto text-xs text-foreground">{code}</pre>
    </div>
  )
}
