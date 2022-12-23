import { randomUUID } from 'crypto'
import { PrismaClient } from '@prisma/client'
import { describe, it, expect, beforeAll } from 'vitest'

import { findEventByIdUseCaseFactory } from './find-event-by-id'

import { prismaEventRepositoryFactory } from '@infra/db/prisma/repositories/eventRepository'

import { truncateDatabase } from '@tests/db/truncate'

import { userSeed } from '@tests/db/seeds/user.seed'
import { eventSeed } from '@tests/db/seeds/event.seed'

describe('Find event by title use case', () => {
  const [user] = userSeed
  const [_, event] = eventSeed

  const prisma = new PrismaClient()
  const prismaEventRepository = prismaEventRepositoryFactory(prisma)

  const findEventByIdUseCase = findEventByIdUseCaseFactory({
    eventRepository: prismaEventRepository
  })

  beforeAll(async () => {
    await truncateDatabase(prisma)
    await prisma.user.create({ data: user })
    await prisma.event.create({ data: event })
  })

  it('should return correct event info in lowercase title match', async () => {
    const result = await findEventByIdUseCase(event.id)
    expect(result).toEqual(
      expect.objectContaining({
        id: event.id,
        title: event.title,
        subtitle: event.subtitle,
        description: event.description,
        createdBy: event.createdBy,
        dueDate: event.dueDate,
        ticketPrice: event.ticketPrice,
        completed: event.completed,
        place: event.place,
        link: event.link,
        createdAt: event.createdAt
      })
    )
  })

  it('should return empyt list in no title match', async () => {
    await expect(findEventByIdUseCase(randomUUID())).rejects.toThrowError()
  })
})
