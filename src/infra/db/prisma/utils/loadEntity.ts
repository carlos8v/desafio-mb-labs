import type {
  Event as PrismaEvent,
  Subscription as PrismaSubscription
} from '@prisma/client'

import type { EventModel } from '@domain/Event'
import { Event } from '@domain/Event'

import type { SubscriptionModel } from '@domain/Subscription'
import { Subscription } from '@domain/Subscription'

export const loadEventEntity = (event: PrismaEvent) => Event({
  id: event.id,
  title: event.title,
  subtitle: event.subtitle,
  description: event.description,
  createdBy: event.createdBy,
  dueDate: event.dueDate,
  ticketPrice: Number(event.ticketPrice),
  completed: event.completed,
  place: event.place,
  link: event.link,
  createdAt: event.createdAt,
}).value as EventModel

export const loadSubscriptionEntity = (subscription: PrismaSubscription) => Subscription({
  id: subscription.id,
  eventId: subscription.eventId,
  userId: subscription.userId,
  ticketPrice: Number(subscription.ticketPrice),
  createdAt: subscription.createdAt
}).value as SubscriptionModel
