import type { SubscriptionRepository } from '@application/interfaces/subscription-repository'

import type { EventModel } from '@domain/event'

type ListUserSubscriptionsUseCaseFactory = UseCase<
  { subscriptionRepository: SubscriptionRepository },
  string,
  Promise<EventModel[]>
>
export type ListUserSubscriptionsUseCase = ReturnType<ListUserSubscriptionsUseCaseFactory>

export const listUserSubscriptionsUseCaseFactory: ListUserSubscriptionsUseCaseFactory = ({
  subscriptionRepository
}) => {
  return async (userId) => {
    const eventsSubcribed = await subscriptionRepository.findByUserId(userId)
    return eventsSubcribed
  }
}
