import type { FastifyInstance } from 'fastify'

export async function agentsRoute(app: FastifyInstance) {
  app.get('/', async () => {
    return { agents: [] }
  })

  app.post<{ Body: { name: string; model: string } }>('/', async (request) => {
    const { name, model } = request.body
    return { id: crypto.randomUUID(), name, model, status: 'idle' }
  })
}
