import { PrismaClient } from '@prisma/client'
import { describe, it, expect, beforeAll } from 'vitest'

import supertest from 'supertest'
import { app } from '@infra/http/app'

import { truncateDatabase } from '@tests/db/truncate'

import { userSeed } from '@tests/db/seeds/user.seed'
import { eventSeed } from '@tests/db/seeds/event.seed'

describe('List events by title route', () => {
  const [user] = userSeed
  const [_, event, newEvent] = eventSeed

  const prisma = new PrismaClient()

  beforeAll(async () => {
    await truncateDatabase(prisma)
    await prisma.user.create({ data: user })
    await prisma.event.create({ data: event })
  })

  it('should return correct event info in uppercase title match', async () => {
    const { body, status } = await supertest(app).get('/events/search/title?title=JAVASCRIPT')

    expect(status).toBe(200)
    expect(body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: event.id,
          title: event.title,
          subtitle: event.subtitle,
          description: event.description,
          createdBy: event.createdBy,
          dueDate: event.dueDate.toISOString(),
          ticketPrice: event.ticketPrice,
          completed: event.completed,
          place: event.place,
          link: event.link,
          createdAt: event.createdAt.toISOString()
        })
      ])
    )
  })

  it('should return correct event info in lowercase title match', async () => {
    const { body, status } = await supertest(app).get('/events/search/title?title=javascript')

    expect(status).toBe(200)
    expect(body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: event.id,
          title: event.title,
          subtitle: event.subtitle,
          description: event.description,
          createdBy: event.createdBy,
          dueDate: event.dueDate.toISOString(),
          ticketPrice: event.ticketPrice,
          completed: event.completed,
          place: event.place,
          link: event.link,
          createdAt: event.createdAt.toISOString()
        })
      ])
    )
  })

  it('should return empyt list in no title match', async () => {
    const { body, status } = await supertest(app).get('/events/search/title?title=should not match')

    expect(status).toBe(200)
    expect(body).toBeInstanceOf(Array)
    expect(body.length).toBe(0)
  })

  it('should return all events with empty title', async () => {
    await prisma.event.createMany({ data: newEvent })

    const { body, status } = await supertest(app).get('/events/search/title?title=')

    expect(status).toBe(200)
    expect(body).toBeInstanceOf(Array)
    expect(body.length).toBe(2)
    expect(body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ id: event.id }),
        expect.objectContaining({ id: newEvent.id })
      ])
    )
  })
})
