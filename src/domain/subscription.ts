import { randomUUID } from 'crypto'
import { OptionalProps } from './utils/optional-props'

import type { Either } from './utils/either'
import { left, right } from './utils/either'

import { InvalidTicketPriceError } from './errors/invalid-ticket-price'

export type SubscriptionModel = {
  id: string
  userId: string
  eventId: string
  ticketPrice: number
  createdAt: Date
}

type OptionalCreateProps = 'id'
export type CreateSubscriptionProps = OptionalProps<SubscriptionModel, OptionalCreateProps>

type CreateSubscriptionResponse = Either<
  InvalidTicketPriceError,
  SubscriptionModel
>
export const Subscription = (subscriptionData: CreateSubscriptionProps): CreateSubscriptionResponse => {
  if (subscriptionData.ticketPrice < 0) {
    return left(new InvalidTicketPriceError('subscription'))
  }

  return right({
    id: subscriptionData?.id || randomUUID(),
    userId: subscriptionData.userId,
    eventId: subscriptionData.eventId,
    ticketPrice: subscriptionData.ticketPrice,
    createdAt: subscriptionData.createdAt,
  })
}
