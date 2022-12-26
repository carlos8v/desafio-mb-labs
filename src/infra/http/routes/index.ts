import type { Express } from 'express'

import { userRouter } from './user.routes'
import { eventsRouter } from './events.routes'

export const setupRoutes = (app: Express) => {
  app.use('/users', userRouter)
  app.use('/events', eventsRouter)
}
