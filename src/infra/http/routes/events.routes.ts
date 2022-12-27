import { Router } from 'express'

import { expressRouteAdapter } from '../adapters/express-route-adapter'

import { createEventController } from '../controllers/create-event'
import { listUserSubscriptionsController } from '../controllers/list-user-subscriptions'
import { findEventByIdController } from '../controllers/find-event-by-id'
import { findEventSubscriptionsController } from '../controllers/find-event-subscriptions'
import { listEventsByTitleController } from '../controllers/list-events-by-title'
import { listEventsByDateController } from '../controllers/list-events-by-date'
import { subscribeInEventController } from '../controllers/subscribe-in-event'

export const eventsRouter = Router()

eventsRouter.post('/', expressRouteAdapter(createEventController))
eventsRouter.get('/subscriptions', expressRouteAdapter(listUserSubscriptionsController))
eventsRouter.get('/search/title', expressRouteAdapter(listEventsByTitleController))
eventsRouter.get('/search/date', expressRouteAdapter(listEventsByDateController))
eventsRouter.get('/:eventId', expressRouteAdapter(findEventByIdController))
eventsRouter.get('/:eventId/subscriptions', expressRouteAdapter(findEventSubscriptionsController))
eventsRouter.post('/:eventId/subscribe', expressRouteAdapter(subscribeInEventController))
