import { PrismaClient } from '@prisma/client'
import { describe, it, expect, beforeEach } from 'vitest'

import supertest from 'supertest'
import { app } from '@infra/http/app'

import { User } from '@domain/user'

import { DuplicatedUsernameError } from '@application/errors/duplicated-username'
import { InvalidUserBodyError } from '@infra/http/errors/invalid-user-body'

import { truncateDatabase } from '@tests/db/truncate'

describe('Create user route', () => {
  const prisma = new PrismaClient()

  beforeEach(async () => {
    await truncateDatabase(prisma)
  })

  it('should be able to create user successfully', async () => {
    const { body, status } = await supertest(app)
      .post('/users')
      .send({
        name: 'Carlos Souza',
        email: 'carlos.pessoal@hotmail.com',
        username: 'carlos8v',
        password: '123123'
      })

    expect(status).toBe(201)
    expect(body.accessToken).not.toBeNull()
    expect(typeof body.accessToken).toBe('string')
    expect(body).toEqual(
      expect.objectContaining({
        user: expect.objectContaining({
          name: "Carlos Souza",
          username: "carlos8v",
          thumbnail: null,
          description: null
        })
      })
    )
  })

  it('should not be able to create user with invalid fields', async () => {
    const { body, status } = await supertest(app)
      .post('/users')
      .send({})

    expect(status).toBe(422)
    expect(body).toEqual(
      expect.objectContaining({
        error: InvalidUserBodyError.name
      })
    )
  })

  it('should not be able to create user with duplicated username', async () => {
    await prisma.user.create({
      data: User({
        name: 'Carlos Souza',
        username: 'carlos8v',
        email: 'carlos.pessoal@hotmail.com',
        password: '$2a$10$hTMiRrtZBsW89P1jc3QLXuj.tn6jH87Cza3ckDEwV/lrx9/DDsqGa'
      })
    })

    const { body, status } = await supertest(app)
      .post('/users')
      .send({
        name: 'Carlos Souza',
        username: 'carlos8v',
        email: 'carlos.pessoal2@hotmail.com',
        password: '123123'
      })

    expect(status).toBe(400)
    expect(body).toEqual(
      expect.objectContaining({
        error: DuplicatedUsernameError.name
      })
    )
  })
})
