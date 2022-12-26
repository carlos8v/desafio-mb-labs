import { randomUUID } from 'crypto'
import { PrismaClient } from '@prisma/client'
import { describe, it, expect, beforeEach } from 'vitest'

import supertest from 'supertest'
import { app } from '@infra/http/app'

import { userSeed } from '@tests/db/seeds/user.seed'

import { NonexistentUserError } from '@application/errors/nonexistent-user'
import { InvalidEventBodyError } from '@infra/http/errors/InvalidEventBody'

import { truncateDatabase } from '@tests/db/truncate'

describe('Create user use case', () => {
  const prisma = new PrismaClient()

  beforeEach(async () => {
    await truncateDatabase(prisma)
    await prisma.user.createMany({ data: userSeed })
  })

  it('should be able to create event successfully', async () => {
    const dueDate = new Date()
    dueDate.setDate(dueDate.getDate() + 7)

    const { body, status } = await supertest(app)
      .post('/events')
      .send({
        title: 'Javascript programmers challenge',
        subtitle: '1 week programming challenge',
        createdBy: userSeed[0].id,
        dueDate: dueDate.toISOString(),
        ticketPrice: 0
      })

    expect(status).toBe(201)
    expect(body).toEqual(
      expect.objectContaining({
        title: 'Javascript programmers challenge',
        subtitle: '1 week programming challenge',
        createdBy: userSeed[0].id,
        dueDate: dueDate.toISOString(),
        ticketPrice: 0
      })
    )
  })

  it('should not be able to create event with nonexistent user', async () => {
    const mockedUserId = randomUUID()
    const dueDate = new Date()
    dueDate.setDate(dueDate.getDate() + 1)

    const { body, status } = await supertest(app)
      .post('/events')
      .send({
        title: 'Javascript programmers challenge',
        subtitle: '1 week programming challenge',
        createdBy: mockedUserId,
        dueDate: dueDate.toISOString(),
        ticketPrice: 0
      })

    expect(status).toBe(400)
    expect(body).toEqual(
      expect.objectContaining({
        error: NonexistentUserError.name
      })
    )
  })

  it('should not be able to create event with invalid fields', async () => {
    const { body, status } = await supertest(app)
      .post('/events')
      .send({})

    expect(status).toBe(422)
    expect(body).toEqual(
      expect.objectContaining({
        error: InvalidEventBodyError.name
      })
    )
  })
})
