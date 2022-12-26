import { PrismaClient } from '@prisma/client'
import { describe, it, expect, beforeAll } from 'vitest'

import { listEventsByTitleUseCaseFactory } from './list-events-by-title'

import { prismaEventRepositoryFactory } from '@infra/db/prisma/repositories/eventRepository'

import { truncateDatabase } from '@tests/db/truncate'

import { userSeed } from '@tests/db/seeds/user.seed'
import { eventSeed } from '@tests/db/seeds/event.seed'

describe('List events by title use case', () => {
  const [user] = userSeed
  const [_, event] = eventSeed

  const prisma = new PrismaClient()
  const prismaEventRepository = prismaEventRepositoryFactory(prisma)

  const listEventsByTitleUseCase = listEventsByTitleUseCaseFactory({
    eventRepository: prismaEventRepository
  })

  beforeAll(async () => {
    await truncateDatabase(prisma)
    await prisma.user.create({ data: user })
    await prisma.event.create({ data: event })
  })

  it('should return correct event info in uppercase title match', async () => {
    const result = await listEventsByTitleUseCase('JAVASCRIPT')
    expect(result.length).toBe(1)
    expect(result).toEqual(
      expect.arrayContaining([
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
      ])
    )
  })

  it('should return correct event info in lowercase title match', async () => {
    const result = await listEventsByTitleUseCase('javascript')
    expect(result.length).toBe(1)
    expect(result).toEqual(
      expect.arrayContaining([
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
      ])
    )
  })

  it('should return empyt list in no title match', async () => {
    const events = await listEventsByTitleUseCase('should not match')
    expect(events.length).toBe(0)
  })
})
