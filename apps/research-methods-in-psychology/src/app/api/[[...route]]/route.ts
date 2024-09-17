import { Hono } from 'hono'
import { handle } from 'hono/vercel'

export const dynamic = 'force-dynamic'

const app = new Hono().basePath('/api')

const routes = app.get('/hello', (c) => {
  return c.json({
    message: 'Hello Next.js!',
    another: 1,
  })
})

export const GET = handle(app)
export const POST = handle(app)
export type AppType = typeof routes
