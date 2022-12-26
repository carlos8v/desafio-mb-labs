import { Router } from 'express'

import { expressRouteAdapter } from '../adapters/expressRouteAdapter'

import { createEventController } from '../controllers/create-event'
import { findEventByIdController } from '../controllers/find-event-by-id'

export const eventsRouter = Router()

eventsRouter.post('/', expressRouteAdapter(createEventController))
eventsRouter.get('/:eventId', expressRouteAdapter(findEventByIdController))
