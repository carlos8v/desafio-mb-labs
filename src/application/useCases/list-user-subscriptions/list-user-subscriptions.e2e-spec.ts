import { PrismaClient } from '@prisma/client'
import { describe, it, expect, beforeEach } from 'vitest'

import { listUserSubscriptionsUseCaseFactory } from './list-user-subscriptions'

import { prismaSubscriptionRepositoryFactory } from '@infra/db/prisma/repositories/subscriptionRepository'

import { truncateDatabase } from '@tests/db/truncate'

import { userSeed } from '@tests/db/seeds/user.seed'
import { eventSeed } from '@tests/db/seeds/event.seed'
import { Subscription } from '@domain/Subscriptions'

describe('List events by date use case', () => {
  const [_, ...events] = eventSeed

  const prisma = new PrismaClient()
  const prismaSubscriptionRepository = prismaSubscriptionRepositoryFactory(prisma)
  
  const listUserSubscriptionsUseCase = listUserSubscriptionsUseCaseFactory({
    subscriptionRepository: prismaSubscriptionRepository
  })

  beforeEach(async () => {
    await truncateDatabase(prisma)
    await prisma.user.create({ data: userSeed[0] })
    await prisma.event.createMany({ data: events })
  })

  it('should filter correct event subscriptions', async () => {
    const subscription = Subscription({
      eventId: events[0].id,
      userId: userSeed[0].id,
      createdAt: new Date(),
      ticketPrice: events[0].ticketPrice
    })
    await prisma.subscription.create({ data: subscription })

    const subscriptionList = await listUserSubscriptionsUseCase({ userId: userSeed[0].id })
    expect(subscriptionList.length).toBe(1)
    expect(subscriptionList).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ id: events[0].id }),
      ])
    )

    const newSubscription = Subscription({
      eventId: events[1].id,
      userId: userSeed[0].id,
      createdAt: new Date(),
      ticketPrice: events[1].ticketPrice
    })
    await prisma.subscription.create({ data: newSubscription })

    const updatedSubscriptionList = await listUserSubscriptionsUseCase({ userId: userSeed[0].id })
    expect(updatedSubscriptionList.length).toBe(2)
    expect(updatedSubscriptionList).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ id: events[0].id }),
        expect.objectContaining({ id: events[1].id }),
      ])
    )
  })
})
