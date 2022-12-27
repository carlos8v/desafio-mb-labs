import type { UserRepository } from '@application/interfaces/user-repository'
import type { SubscriptionRepository } from '@application/interfaces/subscription-repository'

import type { EventModel } from '@domain/event'

import type { ListUserSubscriptionsSchema } from './list-user-subscriptions-validator'
import { NonexistentUserError } from '@application/errors/nonexistent-user'

import type { Either } from '@domain/utils/either'
import { left, right } from '@domain/utils/either'

type ListUserSubscriptionsResponse = Either<
  NonexistentUserError,
  EventModel[]
>

type ListUserSubscriptionsUseCaseFactory = UseCase<
  {
    subscriptionRepository: SubscriptionRepository,
    userRepository: UserRepository
  },
  ListUserSubscriptionsSchema,
  Promise<ListUserSubscriptionsResponse>
>
export type ListUserSubscriptionsUseCase = ReturnType<ListUserSubscriptionsUseCaseFactory>

export const listUserSubscriptionsUseCaseFactory: ListUserSubscriptionsUseCaseFactory = ({
  userRepository,
  subscriptionRepository
}) => {
  return async ({ userId }) => {
    const user = await userRepository.findById(userId)
    if (!user?.id) return left(new NonexistentUserError())

    const eventsSubcribed = await subscriptionRepository.findByUserId(userId)
    return right(eventsSubcribed)
  }
}
