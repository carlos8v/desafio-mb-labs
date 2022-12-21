import type { PrismaClient } from '@prisma/client'
import type { SubscriptionRepository } from '@application/interfaces/SubscriptionRepository'

import { loadEventEntity } from '../utils/loadEntity'
import { Subscription } from '@domain/Subscriptions'

export const prismaSubscriptionRepositoryFactory: (prisma: PrismaClient) => SubscriptionRepository = (prisma) => ({
  save: async (subscriptionData) => {
    await prisma.subscription.upsert({
      where: {
        id: subscriptionData.id
      },
      create: {
        id: subscriptionData.id,
        eventId: subscriptionData.eventId,
        userId: subscriptionData.userId,
        ticketPrice: subscriptionData.ticketPrice,
        createdAt: subscriptionData.createdAt
      },
      update: {
        ticketPrice: subscriptionData.ticketPrice
      }
    })
  },
  findManyByEventId: async (eventId) => {
    const eventWithSubscriptions = await prisma.event.findFirst({
      where: { id: eventId },
      include: {
        subscriptions: true
      }
    })

    if (!eventWithSubscriptions?.id) return null
    const { subscriptions, ...event } = eventWithSubscriptions

    return {
      event: loadEventEntity(event),
      subscriptions: subscriptions.map((sub) => Subscription({
        eventId: sub.eventId,
        userId: sub.userId,
        ticketPrice: Number(sub.ticketPrice),
        createdAt: sub.createdAt
      }))
    }
  }
})
