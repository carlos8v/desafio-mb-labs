import type { SubscriptionModel } from '@domain/Subscription'
import { Subscription } from '@domain/Subscription'

import type { EventRepository } from '@application/interfaces/EventRepository'
import type { SubscriptionRepository } from '@application/interfaces/SubscriptionRepository'
import type { UserRepository } from '@application/interfaces/UserRepository'

import type { Either } from '@domain/utils/Either'
import { left, right } from '@domain/utils/Either'

import { InvalidTicketPriceError } from '@domain/errors/invalid-ticket-price'
import { NonexistentUserError } from '@application/errors/nonexistent-user'
import { NonexistentEventError } from '@application/errors/nonexistent-event'
import { CompletedEventSubscriptionError } from '@application/errors/completed-event-subscription'

type SubscribeInEventConstructor = {
  eventRepository: EventRepository
  userRepository: UserRepository
  subscriptionRepository: SubscriptionRepository
}

type SubscribeInEventRequest = {
  eventId: string
  userId: string
  ticketPrice: number
}

type SubscribeInEventResponse = Either<
  NonexistentEventError |
  NonexistentUserError |
  CompletedEventSubscriptionError |
  InvalidTicketPriceError,
  SubscriptionModel
>

type SubscribeInEventUseCaseFactory = UseCase<
  SubscribeInEventConstructor,
  SubscribeInEventRequest,
  Promise<SubscribeInEventResponse>
>
export type SubscribeInEventUseCase = ReturnType<SubscribeInEventUseCaseFactory>

export const subscribeInEventUseCaseFactory: SubscribeInEventUseCaseFactory = ({
  eventRepository,
  userRepository,
  subscriptionRepository
}) => {
  return async ({ eventId, userId, ticketPrice }) => {
    const event = await eventRepository.findById(eventId)
    if (!event?.id) return left(new NonexistentEventError())  
    if (event.completed) return left(new CompletedEventSubscriptionError())

    const user = await userRepository.findById(userId)
    if (!user) return left(new NonexistentUserError())

    const subscription = Subscription({
      eventId,
      userId,
      ticketPrice,
      createdAt: new Date()
    })

    if (subscription.isLeft()) {
      return left(subscription.value)
    }

    await subscriptionRepository.save(subscription.value)
    return right(subscription.value)
  }
}
