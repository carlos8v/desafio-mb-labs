import { randomUUID } from 'crypto'
import { PrismaClient } from '@prisma/client'
import { describe, it, expect, beforeAll } from 'vitest'

import { listEventSubscriptionsUseCaseFactory } from './list-event-subscriptions'

import { prismaEventRepositoryFactory } from '@infra/db/prisma/repositories/eventRepository'
import { prismaSubscriptionRepositoryFactory } from '@infra/db/prisma/repositories/subscriptionRepository'

import { truncateDatabase } from '@tests/db/truncate'

import { NonexistentEventError } from '@application/errors/nonexistent-event'
import { EventSubscriptionAuthError } from '@application/errors/event-subscriptions-auth'

import { userSeed } from '@tests/db/seeds/user.seed'
import { eventSeed } from '@tests/db/seeds/event.seed'
import { Subscription } from '@domain/Subscription'
import { User } from '@domain/User'

describe('List event subscriptions use case', () => {
  const [user] = userSeed
  const [_, event] = eventSeed

  const prisma = new PrismaClient()
  const prismaEventRepository = prismaEventRepositoryFactory(prisma)
  const prismaSubscriptionRepository = prismaSubscriptionRepositoryFactory(prisma)

  const listUserSubscriptionsUseCase = listEventSubscriptionsUseCaseFactory({
    eventRepository: prismaEventRepository,
    subscriptionRepository: prismaSubscriptionRepository
  })

  beforeAll(async () => {
    await truncateDatabase(prisma)
    await prisma.user.create({ data: user })
    await prisma.event.create({ data: event })
  })

  it('should filter correct event subscriptions', async () => {
    const subscription = Subscription({
      eventId: event.id,
      userId: user.id,
      createdAt: new Date(),
      ticketPrice: event.ticketPrice
    })
    await prisma.subscription.create({ data: subscription })

    const eventSubscriptions = await listUserSubscriptionsUseCase({
      userId: user.id,
      eventId: event.id
    })

    expect(eventSubscriptions.isLeft()).toBe(false)
    expect(eventSubscriptions.value).toEqual(
      expect.objectContaining({
        event: expect.objectContaining({ id: event.id }),
        subscriptions: expect.arrayContaining([
          expect.objectContaining({ id: subscription.id, userId: user.id })
        ])
      })
    )

    const newUser = User({
      name: 'Carlos Souza 2',
      password: '$2a$10$Kl/U71Kw1EpbYtuL5vkc7eeHTo9DKFNG6J.DklKmmD/wBYrRJBh16',
      username: 'carlos8v2'
    })

    const newSubscription = Subscription({
      eventId: event.id,
      userId: newUser.id,
      createdAt: new Date(),
      ticketPrice: event.ticketPrice
    })
    await prisma.user.create({ data: newUser })
    await prisma.subscription.create({ data: newSubscription })

    const updatedEventSubscriptions = await listUserSubscriptionsUseCase({
      userId: user.id,
      eventId: event.id
    })

    expect(updatedEventSubscriptions.isLeft()).toBe(false)
    expect(updatedEventSubscriptions.value).toEqual(
      expect.objectContaining({
        event: expect.objectContaining({ id: event.id }),
        subscriptions: expect.arrayContaining([
          expect.objectContaining({ id: subscription.id, userId: user.id }),
          expect.objectContaining({ id: newSubscription.id, userId: newUser.id }),
        ])
      })
    )
  })

  it('should throw error if event does not exists', async () => {
    const result = await listUserSubscriptionsUseCase({
      userId: user.id,
      eventId: randomUUID()
    })

    expect(result.isLeft()).toBe(true)
    expect(result.isRight()).toBe(false)
    expect(result.value).toBeInstanceOf(NonexistentEventError)
  })

  it('should not allow to see subscriptions of event created by other user', async () => {
    const result = await listUserSubscriptionsUseCase({
      userId: randomUUID(),
      eventId: event.id
    })

    expect(result.isLeft()).toBe(true)
    expect(result.isRight()).toBe(false)
    expect(result.value).toBeInstanceOf(EventSubscriptionAuthError)
  })
})
