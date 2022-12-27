import { randomUUID } from 'crypto'
import { PrismaClient } from '@prisma/client'
import { describe, it, expect, beforeAll } from 'vitest'

import type { SubscriptionModel } from '@domain/subscription' 
import { Subscription } from '@domain/subscription'
import { User } from '@domain/user'

import { findEventSubscriptionsUseCaseFactory } from './find-event-subscriptions'

import { prismaEventRepositoryFactory } from '@infra/db/prisma/repositories/event-repository'
import { prismaSubscriptionRepositoryFactory } from '@infra/db/prisma/repositories/subscription-repository'

import { truncateDatabase } from '@tests/db/truncate'

import { NonexistentEventError } from '@application/errors/nonexistent-event'
import { NotAuthorizedUserError } from '@application/errors/not-authorized-user'

import { userSeed } from '@tests/db/seeds/user.seed'
import { eventSeed } from '@tests/db/seeds/event.seed'

describe('Find event subscriptions use case', () => {
  const [user] = userSeed
  const [_, event] = eventSeed

  const prisma = new PrismaClient()
  const prismaEventRepository = prismaEventRepositoryFactory(prisma)
  const prismaSubscriptionRepository = prismaSubscriptionRepositoryFactory(prisma)

  const findEventSubscriptionsUseCase = findEventSubscriptionsUseCaseFactory({
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
    }).value as SubscriptionModel

    await prisma.subscription.create({ data: subscription })

    const eventSubscriptions = await findEventSubscriptionsUseCase({
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
      username: 'carlos8v2',
      email: 'carlos.pessoal2@hotmail.com',
      password: '$2a$10$Kl/U71Kw1EpbYtuL5vkc7eeHTo9DKFNG6J.DklKmmD/wBYrRJBh16'
    })

    const newSubscription = Subscription({
      eventId: event.id,
      userId: newUser.id,
      createdAt: new Date(),
      ticketPrice: event.ticketPrice
    }).value as SubscriptionModel

    await prisma.user.create({ data: newUser })
    await prisma.subscription.create({ data: newSubscription })

    const updatedEventSubscriptions = await findEventSubscriptionsUseCase({
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
    const result = await findEventSubscriptionsUseCase({
      userId: user.id,
      eventId: randomUUID()
    })

    expect(result.isLeft()).toBe(true)
    expect(result.isRight()).toBe(false)
    expect(result.value).toBeInstanceOf(NonexistentEventError)
  })

  it('should not allow to see subscriptions of event created by other user', async () => {
    const result = await findEventSubscriptionsUseCase({
      userId: randomUUID(),
      eventId: event.id
    })

    expect(result.isLeft()).toBe(true)
    expect(result.isRight()).toBe(false)
    expect(result.value).toBeInstanceOf(NotAuthorizedUserError)
  })
})
