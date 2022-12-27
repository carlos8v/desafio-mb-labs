import { EventModel } from '@domain/event'
import { SubscriptionModel } from '@domain/subscription'

export interface SubscriptionRepository {
  save(subscriptionData: SubscriptionModel): Promise<void>
  findByUserId(userId: string): Promise<EventModel[]>
  findManyByEventId(eventId: string): Promise<SubscriptionModel[]>
}
