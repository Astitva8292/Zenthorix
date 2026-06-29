import Fastify from 'fastify'
import cors from '@fastify/cors'
import { healthRoute } from './routes/health.js'
import { agentsRoute } from './routes/agents.js'
import { workspacesRoute } from './routes/workspaces.js'

const app = Fastify({ logger: true })

await app.register(cors, { origin: true })

await app.register(healthRoute)
await app.register(agentsRoute, { prefix: '/v1/agents' })
await app.register(workspacesRoute, { prefix: '/v1/workspaces' })

const port = parseInt(process.env.PORT ?? '3001', 10)
await app.listen({ port, host: '0.0.0.0' })
