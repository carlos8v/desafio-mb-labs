import type { EventRepository } from '@application/interfaces/EventRepository'
import type { SubscriptionRepository } from '@application/interfaces/SubscriptionRepository'

import type { EventModel } from '@domain/Event'
import type { SubscriptionModel } from '@domain/Subscription'

import type { ListEventSubscriptionsSchema } from './list-event-subscriptions-validator'

import { EventSubscriptionAuthError } from '@application/errors/event-subscriptions-auth'
import { NonexistentEventError } from '@application/errors/nonexistent-event'

import type { Either } from '@domain/utils/Either'
import { left, right } from '@domain/utils/Either'

type ListEventSubscriptionsResponse = Either<
  NonexistentEventError |
  EventSubscriptionAuthError,
  {
    event: EventModel
    subscriptions: SubscriptionModel[]
  }
>

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
    if (!event?.id) {
      return left(new NonexistentEventError())
    }

    if(event.createdBy !== userId) {
      return left(new EventSubscriptionAuthError())
    }

    const subscriptions = await subscriptionRepository.findManyByEventId(eventId)

    return right({
      event,
      subscriptions
    })
  }
}
