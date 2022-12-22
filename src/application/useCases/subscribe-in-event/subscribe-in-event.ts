import { Subscription } from '@domain/Subscription'

import type { EventRepository } from '@application/interfaces/EventRepository'
import type { SubscriptionRepository } from '@application/interfaces/SubscriptionRepository'
import type { UserRepository } from '@application/interfaces/UserRepository'

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

type SubscribeInEventUseCase = (_: SubscribeInEventConstructor) => (_: SubscribeInEventRequest) => Promise<void>

export const subscribeInEventUseCaseFactory: SubscribeInEventUseCase = ({
  eventRepository,
  userRepository,
  subscriptionRepository
}) => {
  return async ({ eventId, userId, ticketPrice }) => {
    if (ticketPrice < 0) throw new Error('Cannot create subscription with negative ticket price')

    const event = await eventRepository.findById(eventId)
    if (!event?.id) throw new Error('Cannot subscribe in nonexistent event')
    if (event.completed) throw new Error('Cannot subscribe on completed event')

    const user = await userRepository.findById(userId)
    if (!user) throw new Error('Cannot subscribe with nonexistent user')

    const subscription = Subscription({
      eventId,
      userId,
      ticketPrice,
      createdAt: new Date()
    })

    await subscriptionRepository.save(subscription)
  }
}
