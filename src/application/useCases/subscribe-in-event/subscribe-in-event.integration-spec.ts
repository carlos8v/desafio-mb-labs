import { randomUUID } from 'crypto'
import { PrismaClient } from '@prisma/client'
import { describe, it, expect, beforeAll } from 'vitest'

import { subscribeInEventUseCaseFactory } from './subscribe-in-event'

import { InvalidTicketPriceError } from '@domain/errors/invalid-ticket-price'
import { NonexistentUserError } from '@application/errors/nonexistent-user'
import { NonexistentEventError } from '@application/errors/nonexistent-event'
import { CompletedEventSubscriptionError } from '@application/errors/completed-event-subscription'

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

  beforeAll(async () => {
    await truncateDatabase(prisma)
    await prismaUserRepository.save(userSeed[0])
    await prismaEventRepository.save(event)
    await prismaEventRepository.save(completedEvent)
  })

  it('should not able to subscribe in event', async () => {
    const result = await subscribeInEventUseCase({
      eventId: event.id,
      userId: userSeed[0].id,
      ticketPrice: event.ticketPrice,
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual(
      expect.objectContaining({
        eventId: event.id,
        userId: userSeed[0].id,
        ticketPrice: event.ticketPrice,
      })
    )
  })

  it('should not be able to subscribe with nonexistent event', async () => {
    const result = await subscribeInEventUseCase({
      eventId: randomUUID(),
      userId: userSeed[0].id,
      ticketPrice: event.ticketPrice,
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NonexistentEventError)
  })

  it('should not be able to subscribe with nonexistent user', async () => {
    const result = await subscribeInEventUseCase({
      eventId: event.id,
      userId: randomUUID(),
      ticketPrice: event.ticketPrice,
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NonexistentUserError)
  })

  it('should not be able to subscribe in completed event', async () => {
    const result = await subscribeInEventUseCase({
      eventId: completedEvent.id,
      userId: userSeed[0].id,
      ticketPrice: completedEvent.ticketPrice,
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(CompletedEventSubscriptionError)
  })

  it('should not be able to subscribe with negative ticket price', async () => {
    const result = await subscribeInEventUseCase({
      eventId: event.id,
      userId: userSeed[0].id,
      ticketPrice: -10,
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(InvalidTicketPriceError)
  })
})
