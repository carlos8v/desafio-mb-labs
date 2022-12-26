import { PrismaClient } from '@prisma/client'
import { describe, it, expect, beforeEach } from 'vitest'

import supertest from 'supertest'
import { app } from '@infra/http/app'

import { User } from '@domain/User'

import { truncateDatabase } from '@tests/db/truncate'

describe('Create user use case', () => {
  const prisma = new PrismaClient()

  beforeEach(async () => {
    await truncateDatabase(prisma)
  })

  it('should be able to create user successfully', async () => {
    const { body, status } = await supertest(app)
      .post('/users')
      .send({
        name: 'Carlos Souza',
        username: 'carlos8v',
        password: '$2a$10$hTMiRrtZBsW89P1jc3QLXuj.tn6jH87Cza3ckDEwV/lrx9/DDsqGa'
      })

    expect(status).toBe(201)
    expect(body).toEqual(
      expect.objectContaining({
        name: "Carlos Souza",
        username: "carlos8v",
        thumbnail: null,
        description: null
      })
    )
  })

  it('should not be able to create user with duplicated username', async () => {
    await prisma.user.create({
      data: User({
        name: 'Carlos Souza',
        username: 'carlos8v',
        password: '$2a$10$hTMiRrtZBsW89P1jc3QLXuj.tn6jH87Cza3ckDEwV/lrx9/DDsqGa'
      })
    })

    const { status } = await supertest(app)
      .post('/users')
      .send({
        name: 'Carlos Souza',
        username: 'carlos8v',
        password: '$2a$10$hTMiRrtZBsW89P1jc3QLXuj.tn6jH87Cza3ckDEwV/lrx9/DDsqGa'
      })

    expect(status).toBe(400)
  })
})