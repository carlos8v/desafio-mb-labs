import { Router } from 'express'

import { expressRouteAdapter } from '../adapters/expressRouteAdapter'

import { createEventController } from '../controllers/create-event'

export const eventsRouter = Router()

eventsRouter.post('/', expressRouteAdapter(createEventController))
