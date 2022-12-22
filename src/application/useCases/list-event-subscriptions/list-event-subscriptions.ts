import type { EventRepository } from '@application/interfaces/EventRepository'
import type { SubscriptionRepository } from '@application/interfaces/SubscriptionRepository'

import type { EventModel } from '@domain/Event'
import type { SubscriptionModel } from '@domain/Subscription'

type ListEventSubscriptionsConstructor = {
  eventRepository: EventRepository
  subscriptionRepository: SubscriptionRepository
}

type ListEventSubscriptionsRequest = {
  userId: string
  eventId: string
}

type ListEventSubscriptionsResponse = {
  event: EventModel
  subscriptions: SubscriptionModel[]
}
type ListEventSubscriptionsUseCase = (_: ListEventSubscriptionsConstructor) => (_: ListEventSubscriptionsRequest) => Promise<ListEventSubscriptionsResponse>

export const listEventSubscriptionsUseCaseFactory: ListEventSubscriptionsUseCase = ({
  eventRepository,
  subscriptionRepository
}) => {
  return async ({ eventId, userId }) => {
    const event = await eventRepository.findById(eventId)
    if (!event?.id) throw new Error('Event does not exist')

    if(event.createdBy !== userId) throw new Error('User cannot see subscriptions for this event')

    const subscriptions = await subscriptionRepository.findManyByEventId(eventId)

    return {
      event,
      subscriptions
    }
  }
}
