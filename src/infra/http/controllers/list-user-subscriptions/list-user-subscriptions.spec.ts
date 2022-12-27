import { PrismaClient } from '@prisma/client'
import { describe, it, expect, beforeAll } from 'vitest'

import type { SubscriptionModel } from '@domain/subscription'
import { Subscription } from '@domain/subscription'

import jwt from 'jsonwebtoken'
import supertest from 'supertest'
import { app } from '@infra/http/app'

import { NotAuthorizedUserError } from '@application/errors/not-authorized-user'
import { NonexistentUserError } from '@application/errors/nonexistent-user'

import { truncateDatabase } from '@tests/db/truncate'

import { userSeed } from '@tests/db/seeds/user.seed'
import { eventSeed } from '@tests/db/seeds/event.seed'

describe('List user subscriptions route', () => {
  const [user] = userSeed
  const [_, ...events] = eventSeed

  const prisma = new PrismaClient()

  beforeAll(async () => {
    await truncateDatabase(prisma)
    await prisma.user.create({ data: user })
    await prisma.event.createMany({ data: events })

    const subscription = Subscription({
      eventId: events[0].id,
      userId: user.id,
      createdAt: new Date(),
      ticketPrice: events[0].ticketPrice
    }).value as SubscriptionModel

    await prisma.subscription.create({ data: subscription })
  })

  it('should filter correct user subscriptions', async () => {
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
      .get('/events/subscriptions')
      .set('Authorization', `Bearer ${auth.accessToken}`)

    expect(status).toBe(200)
    expect(body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ id: events[0].id }),
      ])
    )

    const newSubscription = Subscription({
      eventId: events[1].id,
      userId: user.id,
      createdAt: new Date(),
      ticketPrice: events[1].ticketPrice
    }).value as SubscriptionModel

    await prisma.subscription.create({ data: newSubscription })

    const { body: updatedBody, status: updatedStatus } = await supertest(app)
      .get('/events/subscriptions')
      .set('Authorization', `Bearer ${auth.accessToken}`)

    expect(updatedStatus).toBe(200)
    expect(updatedBody).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ id: events[0].id }),
        expect.objectContaining({ id: events[1].id })
      ])
    )
  })

  it('should failed with invalid auth token', async () => {
    const { body, status } = await supertest(app)
    .get('/events/subscriptions')
    .set('Authorization', 'Bearer 123')

    expect(status).toBe(401)
    expect(body).toEqual(
      expect.objectContaining({
        error: NotAuthorizedUserError.name
      })
    )
  })

  it('should failed with nonexistent user', async () => {
    const token = jwt.sign({ id: '123' }, process.env.JWT_SECRET!, { algorithm: 'HS256', subject: '123' })

    const { body, status } = await supertest(app)
    .get('/events/subscriptions')
    .set('Authorization', `Bearer ${token}`)

    expect(status).toBe(401)
    expect(body).toEqual(
      expect.objectContaining({
        error: NonexistentUserError.name
      })
    )
  })
})
