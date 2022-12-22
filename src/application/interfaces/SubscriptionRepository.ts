import { EventModel } from '@domain/Event'
import { SubscriptionModel } from '@domain/Subscription'

export interface SubscriptionRepository {
  save(subscriptionData: SubscriptionModel): Promise<void>
  findByUserId(userId: string): Promise<EventModel[]>
  findManyByEventId(eventId: string): Promise<SubscriptionModel[]>
}
