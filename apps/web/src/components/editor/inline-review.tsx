'use client'

interface ReviewComment { line: number; message: string; author: string; severity: 'info' | 'warning' | 'error' }

export function InlineReviewComments({ comments }: { comments: ReviewComment[] }) {
  return (
    <div className="absolute right-0 top-0 z-10 space-y-1">
      {comments.map((c, i) => (
        <div key={i} className={`rounded-md px-2 py-1 text-xs shadow-lg ${
          c.severity === 'error' ? 'bg-red-500/20 text-red-500' :
          c.severity === 'warning' ? 'bg-yellow-500/20 text-yellow-500' : 'bg-blue-500/20 text-blue-500'
        }`}>
          <span className="font-medium">{c.author}:</span> {c.message}
        </div>
      ))}
    </div>
  )
}
