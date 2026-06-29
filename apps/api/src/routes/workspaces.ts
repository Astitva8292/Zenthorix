import type { FastifyInstance } from 'fastify'

export async function workspacesRoute(app: FastifyInstance) {
  app.get('/', async () => {
    return { workspaces: [] }
  })

  app.post<{ Body: { name: string } }>('/', async (request) => {
    const { name } = request.body
    return { id: crypto.randomUUID(), name, files: [] }
  })
}
