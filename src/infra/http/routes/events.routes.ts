import { Router } from 'express'

import { expressRouteAdapter } from '../adapters/express-route-adapter'

import { createEventController } from '../controllers/create-event'
import { findEventByIdController } from '../controllers/find-event-by-id'
import { listEventsByTitleController } from '../controllers/list-events-by-title'
import { subscribeInEventController } from '../controllers/subscribe-in-event'

export const eventsRouter = Router()

eventsRouter.post('/', expressRouteAdapter(createEventController))
eventsRouter.get('/search/title', expressRouteAdapter(listEventsByTitleController))
eventsRouter.get('/:eventId', expressRouteAdapter(findEventByIdController))
eventsRouter.post('/:eventId/subscribe', expressRouteAdapter(subscribeInEventController))
