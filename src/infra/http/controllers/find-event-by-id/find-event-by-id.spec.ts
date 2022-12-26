import { randomUUID } from 'crypto'
import { PrismaClient } from '@prisma/client'
import { describe, it, expect, beforeAll } from 'vitest'

import supertest from 'supertest'
import { app } from '@infra/http/app'

import { InvalidEventIdParamError } from '@infra/http/errors/invalid-event-id-param'
import { NonexistentEventError } from '@application/errors/nonexistent-event'

import { truncateDatabase } from '@tests/db/truncate'

import { userSeed } from '@tests/db/seeds/user.seed'
import { eventSeed } from '@tests/db/seeds/event.seed'

describe('Find event by title use case', () => {
  const [user] = userSeed
  const [_, event] = eventSeed

  const prisma = new PrismaClient()

  beforeAll(async () => {
    await truncateDatabase(prisma)
    await prisma.user.create({ data: user })
    await prisma.event.create({ data: event })
  })

  it('should return correct event info', async () => {
    const { body, status } = await supertest(app).get(`/events/${event.id}`)

    expect(status).toBe(200)
    expect(body).toEqual(
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
    )
  })

  it('should return error with nonexistent event', async () => {
    const { body, status } = await supertest(app).get(`/events/${randomUUID()}`)

    expect(status).toBe(404)
    expect(body).toEqual(
      expect.objectContaining({
        error: NonexistentEventError.name
      })
    )
  })

  it('should return error with invalid id', async () => {
    const { body, status } = await supertest(app).get('/events/123')

    expect(status).toBe(400)
    expect(body).toEqual(
      expect.objectContaining({
        error: InvalidEventIdParamError.name
      })
    )
  })
})
