import { PrismaClient } from '@prisma/client'
import { describe, it, expect, beforeAll } from 'vitest'

import type { SubscriptionModel } from '@domain/subscription'
import { Subscription } from '@domain/subscription'

import { listUserSubscriptionsUseCaseFactory } from './list-user-subscriptions'

import { prismaUserRepositoryFactory } from '@infra/db/prisma/repositories/user-repository'
import { prismaSubscriptionRepositoryFactory } from '@infra/db/prisma/repositories/subscription-repository'

import { truncateDatabase } from '@tests/db/truncate'

import { userSeed } from '@tests/db/seeds/user.seed'
import { eventSeed } from '@tests/db/seeds/event.seed'

describe('List user subscriptions use case', () => {
  const [_, ...events] = eventSeed

  const prisma = new PrismaClient()
  const prismaSubscriptionRepository = prismaSubscriptionRepositoryFactory(prisma)
  const prismaUserRepository = prismaUserRepositoryFactory(prisma)
  
  const listUserSubscriptionsUseCase = listUserSubscriptionsUseCaseFactory({
    userRepository: prismaUserRepository,
    subscriptionRepository: prismaSubscriptionRepository
  })

  beforeAll(async () => {
    await truncateDatabase(prisma)
    await prisma.user.create({ data: userSeed[0] })
    await prisma.event.createMany({ data: events })
  })

  it('should filter correct user subscriptions', async () => {
    const subscription = Subscription({
      eventId: events[0].id,
      userId: userSeed[0].id,
      createdAt: new Date(),
      ticketPrice: events[0].ticketPrice
    }).value as SubscriptionModel

    await prisma.subscription.create({ data: subscription })

    const subscriptionList = await listUserSubscriptionsUseCase({ userId: userSeed[0].id })
    expect(subscriptionList.isRight()).toBe(true)
    expect(subscriptionList.value).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ id: events[0].id }),
      ])
    )

    const newSubscription = Subscription({
      eventId: events[1].id,
      userId: userSeed[0].id,
      createdAt: new Date(),
      ticketPrice: events[1].ticketPrice
    }).value as SubscriptionModel

    await prisma.subscription.create({ data: newSubscription })

    const updatedSubscriptionList = await listUserSubscriptionsUseCase({ userId: userSeed[0].id })
    expect(updatedSubscriptionList.isRight()).toBe(true)
    expect(updatedSubscriptionList.value).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ id: events[0].id }),
        expect.objectContaining({ id: events[1].id }),
      ])
    )
  })
})
