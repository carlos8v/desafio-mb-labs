import { PrismaClient } from '@prisma/client'
import { describe, it, expect, beforeAll } from 'vitest'

import { createUserUseCaseFactory } from './create-user'

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
    await createUserUseCase({
      name: 'Carlos Souza',
      username: 'carlos8v',
      password: '$2a$10$hTMiRrtZBsW89P1jc3QLXuj.tn6jH87Cza3ckDEwV/lrx9/DDsqGa'
    })

    await expect(createUserUseCase({
      name: 'Carlos Souza 2',
      username: 'carlos8v',
      password: '$2a$10$hTMiRrtZBsW89P1jc3QLXuj.tn6jH87Cza3ckDEwV/lrx9/DDsqGa'
    })).rejects.toThrowError()
  })
})
