import { PrismaClient } from '@prisma/client'
import { describe, it, expect, beforeAll } from 'vitest'

import { truncateDatabase } from '@tests/db/truncate'

import type { SubscriptionModel } from '@domain/subscription'
import { Subscription } from '@domain/subscription'

import { NonexistentEventError } from '@application/errors/nonexistent-event'
import { NotAuthorizedUserError } from '@application/errors/not-authorized-user'

import jwt from 'jsonwebtoken'
import supertest from 'supertest'
import { app } from '@infra/http/app'

import { userSeed } from '@tests/db/seeds/user.seed'
import { eventSeed } from '@tests/db/seeds/event.seed'
import { User } from '@domain/user'
import { NonexistentUserError } from '@application/errors/nonexistent-user'
import { randomUUID } from 'crypto'

describe('Find event subscriptions route', () => {
  const [user] = userSeed
  const [_, event] = eventSeed

  const prisma = new PrismaClient()

  const newUser = User({
    name: 'Carlos Souza 2',
    username: 'carlos8v2',
    email: 'carlos.pessoal2@hotmail.com',
    password: '$2a$10$hTMiRrtZBsW89P1jc3QLXuj.tn6jH87Cza3ckDEwV/lrx9/DDsqGa'
  })

  const subscription = Subscription({
    eventId: event.id,
    userId: user.id,
    createdAt: new Date(),
    ticketPrice: event.ticketPrice
  }).value as SubscriptionModel
  
  beforeAll(async () => {
    await truncateDatabase(prisma)
    await prisma.user.createMany({ data: [user, newUser] })
    await prisma.event.create({ data: event })
    await prisma.subscription.create({ data: subscription })
  })

  it('should filter correct event subscriptions', async () => {
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
      .get(`/events/${event.id}/subscriptions`)
      .set('Authorization', `Bearer ${auth.accessToken}`)

    expect(status).toBe(200)
    expect(body).toEqual(
      expect.objectContaining({
        event: expect.objectContaining({ id: event.id }),
        subscriptions: expect.arrayContaining([
          expect.objectContaining({ id: subscription.id, userId: user.id })
        ])
      })
    )
  })

  it('should throw error if event does not exists', async () => {
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
      .get(`/events/${randomUUID()}/subscriptions`)
      .set('Authorization', `Bearer ${auth.accessToken}`)

    expect(status).toBe(404)
    expect(body).toEqual(
      expect.objectContaining({
        error: NonexistentEventError.name
      })
    )
  })

  it('should throw error if user does not exists', async () => {
    const token = jwt.sign({ id: '123' }, process.env.JWT_SECRET!, { algorithm: 'HS256', subject: '123' })

    const { body, status } = await supertest(app)
      .get(`/events/${event.id}/subscriptions`)
      .set('Authorization', `Bearer ${token}`)

    expect(status).toBe(401)
    expect(body).toEqual(
      expect.objectContaining({
        error: NonexistentUserError.name
      })
    )
  })

  it('should not allow to see subscriptions of event created by other user', async () => {
    const { body: auth, status: authStatus } = await supertest(app)
      .post('/users/login')
      .send({
        email: 'carlos.pessoal2@hotmail.com',
        password: '123123'
      })

    expect(authStatus).toBe(200)
    expect(typeof auth.accessToken).toBe('string')
    expect(auth.accessToken).not.toBeNull()

    const { body, status } = await supertest(app)
      .get(`/events/${event.id}/subscriptions`)
      .set('Authorization', `Bearer ${auth.accessToken}`)

    expect(status).toBe(403)
    expect(body).toEqual(
      expect.objectContaining({
        error: NotAuthorizedUserError.name
      })
    )
  })
})
