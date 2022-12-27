import type { PrismaClient } from '@prisma/client'
import type { SubscriptionRepository } from '@application/interfaces/subscription-repository'

import { loadEventEntity, loadSubscriptionEntity } from '../utils/load-entity'

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
  findByUserId: async (userId) => {
    const events = await prisma.event.findMany({
      where: {
        subscriptions: {
          some: {
            userId: userId
          }
        }
      }
    })

    return events.map((event) => loadEventEntity(event))
  },
  findManyByEventId: async (eventId) => {
    const eventWithSubscriptions = await prisma.event.findFirst({
      where: { id: eventId },
      include: {
        subscriptions: true
      }
    })

    if (!eventWithSubscriptions?.id) return []

    return eventWithSubscriptions.subscriptions.map(loadSubscriptionEntity)
  }
})
