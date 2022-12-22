import { randomUUID } from 'crypto'
import { PrismaClient } from '@prisma/client'
import { describe, it, expect, beforeEach } from 'vitest'

import { subscribeInEventUseCaseFactory } from './subscribe-in-event'

import { prismaUserRepositoryFactory } from '@infra/db/prisma/repositories/userRepository'
import { prismaEventRepositoryFactory } from '@infra/db/prisma/repositories/eventRepository'
import { prismaSubscriptionRepositoryFactory } from '@infra/db/prisma/repositories/subscriptionRepository'

import { User } from '@domain/User'
import { Event } from '@domain/Event'

import { truncateDatabase } from '@tests/db/truncate'

const dueDate = new Date()
dueDate.setDate(dueDate.getDate() + 1)

const completedDueDate = new Date()
completedDueDate.setDate(completedDueDate.getDate() - 1)

const user = User({
  name: 'Carlos Souza',
  username: 'carlos8v',
  password: '$2a$10$hTMiRrtZBsW89P1jc3QLXuj.tn6jH87Cza3ckDEwV/lrx9/DDsqGa'
})

const event = Event({
  title: 'Javascript programmers challenge II',
  subtitle: '1 week programming challenge',
  createdBy: user.id,
  dueDate,
  ticketPrice: 0
})

const completedEvent = Event({
  title: 'Javascript programmers challenge I',
  subtitle: '1 day programming challenge',
  createdBy: user.id,
  dueDate: completedDueDate,
  completed: true,
  ticketPrice: 0
})

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
    await prismaUserRepository.save(user)
    await prismaEventRepository.save(event)
    await prismaEventRepository.save(completedEvent)
  })

  it('should not able to subscribe in event', async () => {
    await expect(subscribeInEventUseCase({
      eventId: event.id,
      userId: user.id,
      ticketPrice: event.ticketPrice,
    })).resolves.not.toThrowError()
  })

  it('should not be able to subscribe with nonexistent event', async () => {
    await expect(subscribeInEventUseCase({
      eventId: randomUUID(),
      userId: user.id,
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
      userId: user.id,
      ticketPrice: completedEvent.ticketPrice,
    })).rejects.toThrowError()
  })

  it('should not be able to subscribe with negative ticket price', async () => {
    await expect(subscribeInEventUseCase({
      eventId: randomUUID(),
      userId: user.id,
      ticketPrice: -10,
    })).rejects.toThrowError()
  })
})
