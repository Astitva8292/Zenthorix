export class MapReduce {
  split<T>(items: T[], chunks: number): T[][] {
    const result: T[][] = []
    const size = Math.ceil(items.length / chunks)
    for (let i = 0; i < items.length; i += size) {
      result.push(items.slice(i, i + size))
    }
    return result
  }

  async execute<T, R>(items: T[], mapper: (chunk: T[]) => Promise<R>, reducer: (results: R[]) => R, chunks = 4): Promise<R> {
    const splitItems = this.split(items, chunks)
    const results = await Promise.allSettled(splitItems.map(mapper))
    const fulfilled: R[] = []
    for (const r of results) {
      if (r.status === 'fulfilled') fulfilled.push(r.value)
    }
    return reducer(fulfilled)
  }
}
