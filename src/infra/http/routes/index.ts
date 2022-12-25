import type { Express } from 'express'

import { userRouter } from './user.routes'

export const setupRoutes = (app: Express) => {
  app.use('/users', userRouter)
}
