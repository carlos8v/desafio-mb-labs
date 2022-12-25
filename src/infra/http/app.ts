import express from 'express'

import { setupRoutes } from './routes'

export const app = express()

app.use(express.json())

setupRoutes(app)
