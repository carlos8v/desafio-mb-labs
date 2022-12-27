import type { EventRepository } from '@application/interfaces/event-repository'
import type { SubscriptionRepository } from '@application/interfaces/subscription-repository'

import type { EventModel } from '@domain/event'
import type { SubscriptionModel } from '@domain/subscription'

import type { ListEventSubscriptionsSchema } from './list-event-subscriptions-validator'

import { EventSubscriptionAuthError } from '@application/errors/event-subscriptions-auth'
import { NonexistentEventError } from '@application/errors/nonexistent-event'

import type { Either } from '@domain/utils/either'
import { left, right } from '@domain/utils/either'

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
