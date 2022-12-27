import { randomUUID } from 'crypto'
import { PrismaClient } from '@prisma/client'
import { describe, it, expect, beforeAll } from 'vitest'

import jwt from 'jsonwebtoken'
import supertest from 'supertest'
import { app } from '@infra/http/app'

import { NonexistentUserError } from '@application/errors/nonexistent-user'
import { NonexistentEventError } from '@application/errors/nonexistent-event'
import { CompletedEventSubscriptionError } from '@application/errors/completed-event-subscription'
import { InvalidSubscriptionBodyError } from '@infra/http/errors/invalid-subscription-body'

import { truncateDatabase } from '@tests/db/truncate'

import { userSeed } from '@tests/db/seeds/user.seed'
import { eventSeed } from '@tests/db/seeds/event.seed'

describe('Subscribe in event route', () => {
  const prisma = new PrismaClient()
  const [user] = userSeed
  const [completedEvent, event] = eventSeed

  beforeAll(async () => {
    await truncateDatabase(prisma)
    await prisma.user.create({ data: user })
    await prisma.event.createMany({ data: [event, completedEvent] })
  })

  it('should be able to subscribe in event', async () => {
    const { body: auth, status: authStatus } = await supertest(app)
      .post('/users/login')
      .send({
        email: 'carlos.pessoal@hotmail.com',
        password: '123123'
      })

    expect(authStatus).toBe(200)
    expect(typeof auth.accessToken).toBe('string')
    expect(auth.accessToken).not.toBeNull()

    const { body, status } = await supertest(app)
      .post(`/events/${event.id}/subscribe`)
      .send({
        eventId: event.id,
        userId: user.id,
        ticketPrice: event.ticketPrice,
      })
      .set('Authorization', `Bearer ${auth.accessToken}`)

    expect(status).toBe(200)
    expect(body).toEqual(
      expect.objectContaining({ subscribed: true })
    )
  })

  it('should not be able to subscribe with nonexistent event', async () => {
    const { body: auth, status: authStatus } = await supertest(app)
      .post('/users/login')
      .send({
        email: 'carlos.pessoal@hotmail.com',
        password: '123123'
      })

    expect(authStatus).toBe(200)
    expect(typeof auth.accessToken).toBe('string')
    expect(auth.accessToken).not.toBeNull()

    const { body, status } = await supertest(app)
      .post(`/events/${event.id}/subscribe`)
      .send({
        eventId: randomUUID(),
        userId: user.id,
        ticketPrice: event.ticketPrice,
      })
      .set('Authorization', `Bearer ${auth.accessToken}`)

    expect(status).toBe(400)
    expect(body).toEqual(
      expect.objectContaining({
        error: NonexistentEventError.name
      })
    )
  })

  it('should not be able to subscribe with nonexistent user', async () => {
    const token = jwt.sign({ id: '123' }, process.env.JWT_SECRET!, { algorithm: 'HS256', subject: '123' })
    const { body, status } = await supertest(app)
      .post(`/events/${event.id}/subscribe`)
      .send({
        eventId: event.id,
        userId: randomUUID(),
        ticketPrice: event.ticketPrice,
      })
      .set('Authorization', `Bearer ${token}`)

    expect(status).toBe(401)
    expect(body).toEqual(
      expect.objectContaining({
        error: NonexistentUserError.name
      })
    )
  })

  it('should not be able to subscribe in completed event', async () => {
    const { body: auth, status: authStatus } = await supertest(app)
      .post('/users/login')
      .send({
        email: 'carlos.pessoal@hotmail.com',
        password: '123123'
      })

    expect(authStatus).toBe(200)
    expect(typeof auth.accessToken).toBe('string')
    expect(auth.accessToken).not.toBeNull()

    const { body, status } = await supertest(app)
      .post(`/events/${event.id}/subscribe`)
      .send({
        eventId: completedEvent.id,
        userId: user.id,
        ticketPrice: completedEvent.ticketPrice,
      })
      .set('Authorization', `Bearer ${auth.accessToken}`)

    expect(status).toBe(400)
    expect(body).toEqual(
      expect.objectContaining({
        error: CompletedEventSubscriptionError.name
      })
    )
  })

  it('should not be able to subscribe with invalid body', async () => {
    const { body: auth, status: authStatus } = await supertest(app)
      .post('/users/login')
      .send({
        email: 'carlos.pessoal@hotmail.com',
        password: '123123'
      })

    expect(authStatus).toBe(200)
    expect(typeof auth.accessToken).toBe('string')
    expect(auth.accessToken).not.toBeNull()

    const { body, status } = await supertest(app)
      .post(`/events/${event.id}/subscribe`)
      .send({
        eventId: '123',
        userId: '321',
        ticketPrice: event.ticketPrice,
      })
      .set('Authorization', `Bearer ${auth.accessToken}`)

    expect(status).toBe(422)
    expect(body).toEqual(
      expect.objectContaining({
        error: InvalidSubscriptionBodyError.name
      })
    )
  })

  it('should not be able to subscribe with negative ticket price', async () => {
    const { body: auth, status: authStatus } = await supertest(app)
      .post('/users/login')
      .send({
        email: 'carlos.pessoal@hotmail.com',
        password: '123123'
      })

    expect(authStatus).toBe(200)
    expect(typeof auth.accessToken).toBe('string')
    expect(auth.accessToken).not.toBeNull()

    const { body, status } = await supertest(app)
      .post(`/events/${event.id}/subscribe`)
      .send({
        eventId: event.id,
        userId: user.id,
        ticketPrice: -10,
      })
      .set('Authorization', `Bearer ${auth.accessToken}`)

    expect(status).toBe(422)
    expect(body).toEqual(
      expect.objectContaining({
        error: InvalidSubscriptionBodyError.name
      })
    )
  })
})
