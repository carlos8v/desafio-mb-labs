import { Router } from 'express'

import { expressRouteAdapter } from '../adapters/expressRouteAdapter'

import { createEventController } from '../controllers/create-event'
import { findEventByIdController } from '../controllers/find-event-by-id'
import { listEventByTitleController } from '../controllers/list-event-by-title'

export const eventsRouter = Router()

eventsRouter.post('/', expressRouteAdapter(createEventController))
eventsRouter.get('/search/title', expressRouteAdapter(listEventByTitleController))
eventsRouter.get('/:eventId', expressRouteAdapter(findEventByIdController))
