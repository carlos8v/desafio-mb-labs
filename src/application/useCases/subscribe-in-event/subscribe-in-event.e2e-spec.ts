import { randomUUID } from 'crypto'
import { PrismaClient } from '@prisma/client'
import { describe, it, expect, beforeEach } from 'vitest'

import { subscribeInEventUseCaseFactory } from './subscribe-in-event'

import { prismaUserRepositoryFactory } from '@infra/db/prisma/repositories/userRepository'
import { prismaEventRepositoryFactory } from '@infra/db/prisma/repositories/eventRepository'
import { prismaSubscriptionRepositoryFactory } from '@infra/db/prisma/repositories/subscriptionRepository'

import { truncateDatabase } from '@tests/db/truncate'

import { userSeed } from '@tests/db/seeds/user.seed'
import { eventSeed } from '@tests/db/seeds/event.seed'
const [completedEvent, event] = eventSeed

describe('Subscribe in event use case', () => {
  const prisma = new PrismaClient()
  const prismaUserRepository = prismaUserRepositoryFactory(prisma)
  const prismaEventRepository = prismaEventRepositoryFactory(prisma)
  const prismaSubscriptionRepository = prismaSubscriptionRepositoryFactory(prisma)

  const subscribeInEventUseCase = subscribeInEventUseCaseFactory({
    userRepository: prismaUserRepository,
    eventRepository: prismaEventRepository,
    subscriptionRepository: prismaSubscriptionRepository
  })

  beforeEach(async () => {
    await truncateDatabase(prisma)
    await prismaUserRepository.save(userSeed[0])
    await prismaEventRepository.save(event)
    await prismaEventRepository.save(completedEvent)
  })

  it('should not able to subscribe in event', async () => {
    await expect(subscribeInEventUseCase({
      eventId: event.id,
      userId: userSeed[0].id,
      ticketPrice: event.ticketPrice,
    })).resolves.not.toThrowError()
  })

  it('should not be able to subscribe with nonexistent event', async () => {
    await expect(subscribeInEventUseCase({
      eventId: randomUUID(),
      userId: userSeed[0].id,
      ticketPrice: event.ticketPrice,
    })).rejects.toThrowError()
  })

  it('should not be able to subscribe with nonexistent user', async () => {
    await expect(subscribeInEventUseCase({
      eventId: event.id,
      userId: randomUUID(),
      ticketPrice: event.ticketPrice,
    })).rejects.toThrowError()
  })

  it('should not be able to subscribe in completed event', async () => {
    await expect(subscribeInEventUseCase({
      eventId: completedEvent.id,
      userId: userSeed[0].id,
      ticketPrice: completedEvent.ticketPrice,
    })).rejects.toThrowError()
  })

  it('should not be able to subscribe with negative ticket price', async () => {
    await expect(subscribeInEventUseCase({
      eventId: randomUUID(),
      userId: userSeed[0].id,
      ticketPrice: -10,
    })).rejects.toThrowError()
  })
})
