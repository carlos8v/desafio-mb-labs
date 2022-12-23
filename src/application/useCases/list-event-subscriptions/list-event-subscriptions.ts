import type { EventRepository } from '@application/interfaces/EventRepository'
import type { SubscriptionRepository } from '@application/interfaces/SubscriptionRepository'

import type { EventModel } from '@domain/Event'
import type { SubscriptionModel } from '@domain/Subscription'

import type { ListEventSubscriptionsSchema } from './list-event-subscriptions-validator'

type ListEventSubscriptionsResponse = {
  event: EventModel
  subscriptions: SubscriptionModel[]
}

type ListEventSubscriptionsUseCaseFactory = UseCase<
  {
    eventRepository: EventRepository
    subscriptionRepository: SubscriptionRepository
  },
  ListEventSubscriptionsSchema,
  Promise<ListEventSubscriptionsResponse>
>
export type ListEventSubscriptionsUseCase = ReturnType<ListEventSubscriptionsUseCaseFactory>

export const listEventSubscriptionsUseCaseFactory: ListEventSubscriptionsUseCaseFactory = ({
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
