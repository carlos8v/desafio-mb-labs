import type { EventRepository } from '@application/interfaces/event-repository'
import type { SubscriptionRepository } from '@application/interfaces/subscription-repository'

import type { EventModel } from '@domain/event'
import type { SubscriptionModel } from '@domain/subscription'

import type { FindEventSubscriptionsSchema } from './find-event-subscriptions-validator'

import { NotAuthorizedUserError } from '@application/errors/not-authorized-user'
import { NonexistentEventError } from '@application/errors/nonexistent-event'

import type { Either } from '@domain/utils/either'
import { left, right } from '@domain/utils/either'

type FindEventSubscriptionsResponse = Either<
  NonexistentEventError |
  NotAuthorizedUserError,
  {
    event: EventModel
    subscriptions: SubscriptionModel[]
  }
>

type FindEventSubscriptionsUseCaseFactory = UseCase<
  {
    eventRepository: EventRepository
    subscriptionRepository: SubscriptionRepository
  },
  FindEventSubscriptionsSchema,
  Promise<FindEventSubscriptionsResponse>
>
export type FindEventSubscriptionsUseCase = ReturnType<FindEventSubscriptionsUseCaseFactory>

export const findEventSubscriptionsUseCaseFactory: FindEventSubscriptionsUseCaseFactory = ({
  eventRepository,
  subscriptionRepository
}) => {
  return async ({ eventId, userId }) => {
    const event = await eventRepository.findById(eventId)
    if (!event?.id) {
      return left(new NonexistentEventError())
    }

    if(event.createdBy !== userId) {
      return left(new NotAuthorizedUserError())
    }

    const subscriptions = await subscriptionRepository.findManyByEventId(eventId)

    return right({
      event,
      subscriptions
    })
  }
}
