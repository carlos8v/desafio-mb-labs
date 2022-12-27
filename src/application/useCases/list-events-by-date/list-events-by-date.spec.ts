import { PrismaClient } from '@prisma/client'
import { describe, it, expect, beforeAll } from 'vitest'

import { listEventsByDateUseCaseFactory } from './list-events-by-date'

import { prismaEventRepositoryFactory } from '@infra/db/prisma/repositories/event-repository'

import { truncateDatabase } from '@tests/db/truncate'

import { userSeed } from '@tests/db/seeds/user.seed'
import { eventSeed } from '@tests/db/seeds/event.seed'
const [firstEvent, secondEvent, thirdEvent] = eventSeed

describe('List events by date use case', () => {
  const prisma = new PrismaClient()
  const prismaEventRepository = prismaEventRepositoryFactory(prisma)
  
  const listEventsByDateUse = listEventsByDateUseCaseFactory({
    eventRepository: prismaEventRepository
  })

  beforeAll(async () => {
    await truncateDatabase(prisma)
    await prisma.user.create({ data: userSeed[0] })
    await prisma.event.createMany({ data: eventSeed })
  })

  it('should filter events with inclusive date', async () => {
    const firstEndDate = new Date()
    firstEndDate.setDate(firstEndDate.getDate() - 1)
    const firstEventList = await listEventsByDateUse({ endDate: firstEndDate })

    expect(firstEventList.length).toBe(1)
    expect(firstEventList).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ id: firstEvent.id, completed: true })
      ])
    )

    const secondEndDate = new Date()
    secondEndDate.setDate(secondEndDate.getDate() + 1)
    const secondEventList = await listEventsByDateUse({ endDate: secondEndDate })

    expect(secondEventList.length).toBe(1)
    expect(secondEventList).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ id: secondEvent.id })
      ])
    )

    const thirdStartDate = new Date()
    const thirdEndDate = new Date()
    thirdStartDate.setDate(thirdEndDate.getDate() + 2)
    thirdEndDate.setDate(thirdEndDate.getDate() + 7)

    const thirdEventList = await listEventsByDateUse({
      startDate: thirdStartDate,
      endDate: thirdEndDate
    })

    expect(thirdEventList.length).toBe(1)
    expect(thirdEventList).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ id: thirdEvent.id })
      ])
    )

    const fourthStartDate = new Date()
    const fourthEndDate = new Date()
    fourthStartDate.setDate(fourthEndDate.getDate() - 1)
    fourthEndDate.setDate(fourthEndDate.getDate() + 7)

    const fourthEventList = await listEventsByDateUse({
      startDate: fourthStartDate,
      endDate: fourthEndDate
    })

    expect(fourthEventList.length).toBe(3)
    expect(fourthEventList).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ id: firstEvent.id, completed: true }),
        expect.objectContaining({ id: secondEvent.id }),
        expect.objectContaining({ id: thirdEvent.id })
      ])
    )
  })
})
