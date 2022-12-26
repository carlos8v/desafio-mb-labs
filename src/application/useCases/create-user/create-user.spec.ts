import { PrismaClient } from '@prisma/client'
import { describe, it, expect, beforeAll } from 'vitest'

import { createUserUseCaseFactory } from './create-user'
import { DuplicatedUsernameError } from '@application/errors/duplicated-username'

import { prismaUserRepositoryFactory } from '@infra/db/prisma/repositories/userRepository'

import { truncateDatabase } from '@tests/db/truncate'

describe('Create user use case', () => {
  const prisma = new PrismaClient()
  const prismaUserRepository = prismaUserRepositoryFactory(prisma)

  const createUserUseCase = createUserUseCaseFactory({
    userRepository: prismaUserRepository
  })

  beforeAll(async () => {
    await truncateDatabase(prisma)
  })

  it('should not be able to create user with duplicated username', async () => {
    const newUser = await createUserUseCase({
      name: 'Carlos Souza',
      username: 'carlos8v',
      email: 'carlos.pessoal@hotmail.com',
      password: '$2a$10$hTMiRrtZBsW89P1jc3QLXuj.tn6jH87Cza3ckDEwV/lrx9/DDsqGa'
    })

    expect(newUser.isLeft()).toBe(false)
    expect(newUser.isRight()).toBe(true)
    expect(newUser.value).toEqual(
      expect.objectContaining({
        name: 'Carlos Souza',
        username: 'carlos8v'
      })
    )

    const duplicatedUser = await createUserUseCase({
      name: 'Carlos Souza 2',
      username: 'carlos8v',
      email: 'carlos.pessoal2@hotmail.com',
      password: '$2a$10$hTMiRrtZBsW89P1jc3QLXuj.tn6jH87Cza3ckDEwV/lrx9/DDsqGa'
    })

    expect(duplicatedUser.isLeft()).toBe(true)
    expect(duplicatedUser.isRight()).toBe(false)
    expect(duplicatedUser.value).toBeInstanceOf(DuplicatedUsernameError)
  })
})
