import { randomUUID } from 'crypto'
import { OptionalProps } from './utils/OptionalProps'

export type SubscriptionModel = {
  id: string
  userId: string
  eventId: string
  ticketPrice: number
  createdAt: Date
}

type OptionalCreateProps = 'id'
export type CreateSubscriptionProps = OptionalProps<SubscriptionModel, OptionalCreateProps>

export const Subscription = (subscriptionData: CreateSubscriptionProps): SubscriptionModel => ({
  ...subscriptionData,
  id: subscriptionData?.id || randomUUID()
})
