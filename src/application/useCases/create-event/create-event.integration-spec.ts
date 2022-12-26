import { randomUUID } from 'crypto'
import { PrismaClient } from '@prisma/client'

import { describe, it, expect, beforeAll } from 'vitest'

import { createEventUseCaseFactory } from './create-event'
import { NonexistentUserError } from '@application/errors/nonexistent-user'

import { prismaEventRepositoryFactory } from '@infra/db/prisma/repositories/eventRepository'
import { prismaUserRepositoryFactory } from '@infra/db/prisma/repositories/userRepository'

import { truncateDatabase } from '@tests/db/truncate'
import { userSeed } from '@tests/db/seeds/user.seed'

describe('Create event use case', () => {
  let prisma = new PrismaClient()

  const eventRepositoryFactory = prismaEventRepositoryFactory(prisma)
  const userRepositoryFactory = prismaUserRepositoryFactory(prisma)
  
  const createEventUseCase = createEventUseCaseFactory({
    userRepository: userRepositoryFactory,
    eventRepository: eventRepositoryFactory
  })

  beforeAll(async () => {
    truncateDatabase(prisma)
    await userRepositoryFactory.save(userSeed[0])
  })

  it('should not be able to create event with nonexistent user', async () => {
    const mockedUserId = randomUUID()
    const dueDate = new Date()
    dueDate.setDate(dueDate.getDate() + 1)

    const newEvent = await createEventUseCase({
      title: 'Javascript programmers challenge',
      subtitle: '1 week programming challenge',
      createdBy: mockedUserId,
      dueDate: dueDate,
      ticketPrice: 0
    })

    expect(newEvent.isLeft()).toBe(true)
    expect(newEvent.isRight()).toBe(false)
    expect(newEvent.value).toBeInstanceOf(NonexistentUserError)
  })
})
