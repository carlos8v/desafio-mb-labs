import { createHash, randomUUID } from 'crypto'
import { PrismaClient } from '@prisma/client'
import { describe, it, expect, beforeAll } from 'vitest'

import type { AuthService } from '@application/interfaces/auth-service'

import { left, right } from '@domain/utils/either'

import { findAuthUserUseCaseFactory } from './find-auth-user'

import { NotAuthorizedUserError } from '@application/errors/not-authorized-user'
import { NonexistentUserError } from '@application/errors/nonexistent-user'

import { prismaUserRepositoryFactory } from '@infra/db/prisma/repositories/user-repository'

import { truncateDatabase } from '@tests/db/truncate'

import { userSeed } from '@tests/db/seeds/user.seed'

describe('Find auth user use case', () => {
  const [user] = userSeed

  const prisma = new PrismaClient()
  const prismaUserRepository = prismaUserRepositoryFactory(prisma)

  const mockedAuthService: AuthService = (() => {
    const sessions = new Map<string, string>()

    return {
      sign: (payload) => {
        const token = createHash('md5').update(payload.id).digest('hex')
        sessions.set(token, payload.id)
        return token
      },
      verify: (token) => {
        const userId = sessions.get(token)
        if (!userId) {
          return left(new NotAuthorizedUserError())
        }
  
        return right({ id: userId })
      }
    }
  })()

  const findAuthUserUseCase = findAuthUserUseCaseFactory({
    authService: mockedAuthService,
    userRepository: prismaUserRepository
  })

  beforeAll(async () => {
    await truncateDatabase(prisma)
    await prisma.user.create({ data: user })
  })

  it('should return correct event info', async () => {
    const token = mockedAuthService.sign({ id: user.id })
    const result = await findAuthUserUseCase(token)

    expect(result.isLeft()).toBe(false)
    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual(
      expect.objectContaining({
        id: user.id,
        name: user.name,
        username: user.username,
        email: user.email
      })
    )
  })

  it('should return error with nonexistent user', async () => {
    const token = mockedAuthService.sign({ id: randomUUID() })
    const result = await findAuthUserUseCase(token)

    expect(result.isLeft()).toBe(true)
    expect(result.isRight()).toBe(false)
    expect(result.value).toBeInstanceOf(NonexistentUserError)
  })

  it('should return error with invalid token', async () => {
    const result = await findAuthUserUseCase('123')

    expect(result.isLeft()).toBe(true)
    expect(result.isRight()).toBe(false)
    expect(result.value).toBeInstanceOf(NotAuthorizedUserError)
  })
})
