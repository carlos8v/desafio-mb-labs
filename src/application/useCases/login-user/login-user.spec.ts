import { PrismaClient } from '@prisma/client'
import { describe, it, expect, beforeAll } from 'vitest'

import { loginUserUseCaseFactory } from './login-user'

import { InvalidLoginError } from '@application/errors/invalid-login'

import { truncateDatabase } from '@tests/db/truncate'

import { userSeed } from '@tests/db/seeds/user.seed'
import { prismaUserRepositoryFactory } from '@infra/db/prisma/repositories/userRepository'

describe('List events by title use case', () => {
  const [user] = userSeed

  const prisma = new PrismaClient()
  const prismaUserRepository = prismaUserRepositoryFactory(prisma)

  const loginUserUseCase = loginUserUseCaseFactory({
    userRepository: prismaUserRepository
  })

  beforeAll(async () => {
    await truncateDatabase(prisma)
    await prisma.user.create({ data: user })
  })

  it('should return correct user during login', async () => {
    const user = await loginUserUseCase({
      email: 'carlos.pessoal@hotmail.com',
      password: '123123'
    })

    expect(user.isLeft()).toBe(false)
    expect(user.isRight()).toBe(true)
    expect(user.value).toEqual(
      expect.objectContaining({
        name: 'Carlos Souza',
        email: 'carlos.pessoal@hotmail.com'
      })
    )
  })

  it('should return error with invalid user data', async () => {
    const user = await loginUserUseCase({
      email: 'carlos.pessoal@hotmail.com',
      password: '123321'
    })
    
    expect(user.isLeft()).toBe(true)
    expect(user.isRight()).toBe(false)
    expect(user.value).toBeInstanceOf(InvalidLoginError)
  })
})
