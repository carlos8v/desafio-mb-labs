import type { SubscriptionRepository } from '@application/interfaces/SubscriptionRepository'
import type { EventModel } from '@domain/Event'

type ListUserSubscriptionsConstructor = {
  subscriptionRepository: SubscriptionRepository
}
type ListUserSubscriptionsRequest = { userId: string }
type ListUserSubscriptionsUseCase = (_: ListUserSubscriptionsConstructor) => (_: ListUserSubscriptionsRequest) => Promise<EventModel[]>

export const listUserSubscriptionsUseCaseFactory: ListUserSubscriptionsUseCase = ({
  subscriptionRepository
}) => {
  return async ({ userId }) => {
    const eventsSubcribed = await subscriptionRepository.findByUserId(userId)
    return eventsSubcribed
  }
}
