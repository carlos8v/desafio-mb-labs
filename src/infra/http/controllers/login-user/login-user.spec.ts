import { PrismaClient } from '@prisma/client'
import { describe, it, expect, beforeAll } from 'vitest'

import supertest from 'supertest'
import { app } from '@infra/http/app'

import { InvalidLoginError } from '@application/errors/invalid-login'

import { truncateDatabase } from '@tests/db/truncate'

import { userSeed } from '@tests/db/seeds/user.seed'

describe('Login user route', () => {
  const [user] = userSeed

  const prisma = new PrismaClient()

  beforeAll(async () => {
    await truncateDatabase(prisma)
    await prisma.user.create({ data: user })
  })

  it('should return user data and jwt token', async () => {
    const { body, status } = await supertest(app)
      .post('/users/login')
      .send({
        email: 'carlos.pessoal@hotmail.com',
        password: '123123'
      })
    
    expect(status).toBe(200)
    expect(typeof body.accessToken).toBe('string')
    expect(body.accessToken).not.toBeNull()
    expect(body).toEqual(
      expect.objectContaining({
        user: expect.objectContaining({
          id: user.id,
          name: user.name,
          email: user.email,
          username: user.username
        })
      })
    )
  })

  it('should return error with invalid login data', async () => {
    const { body, status } = await supertest(app)
      .post('/users/login')
      .send({
        email: 'carlos.pessoal@hotmail.com',
        password: '123321'
      })

    expect(status).toBe(400)
    expect(body).toEqual(
      expect.objectContaining({
        error: InvalidLoginError.name
      })
    )
  })
})
