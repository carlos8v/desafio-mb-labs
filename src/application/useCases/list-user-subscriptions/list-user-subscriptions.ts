import type { SubscriptionRepository } from '@application/interfaces/SubscriptionRepository'
import type { EventModel } from '@domain/Event'

type ListUserSubscriptionsUseCaseFactory = UseCase<
  { subscriptionRepository: SubscriptionRepository },
  { userId: string },
  Promise<EventModel[]>
>
export type ListUserSubscriptionsUseCase = ReturnType<ListUserSubscriptionsUseCaseFactory>

export const listUserSubscriptionsUseCaseFactory: ListUserSubscriptionsUseCaseFactory = ({
  subscriptionRepository
}) => {
  return async ({ userId }) => {
    const eventsSubcribed = await subscriptionRepository.findByUserId(userId)
    return eventsSubcribed
  }
}
