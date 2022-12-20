import { randomUUID } from 'crypto'
import { PrismaClient } from '@prisma/client'

import { describe, it, expect, beforeEach } from 'vitest'

import { createEventUseCaseFactory } from './create-event'

import { prismaEventRepositoryFactory } from '@infra/db/prisma/repositories/eventRepository'
import { prismaUserRepositoryFactory } from '@infra/db/prisma/repositories/userRepository'

import { truncateDatabase } from '@tests/db/truncate'

describe('Create event use case', () => {
  let prisma = new PrismaClient()

  const eventRepositoryFactory = prismaEventRepositoryFactory(prisma)
  const userRepositoryFactory = prismaUserRepositoryFactory(prisma)
  
  const createEventUseCase = createEventUseCaseFactory({
    userRepository: userRepositoryFactory,
    eventRepository: eventRepositoryFactory
  })

  beforeEach(() => {
    truncateDatabase(prisma)
  })

  it('should not be able to create event with nonexistent user', async () => {
    const mockedUserId = randomUUID()
    const dueDate = new Date()
    dueDate.setDate(dueDate.getDate() + 1)

    await expect(() => createEventUseCase({
      title: 'Javascript programmers challenge',
      subtitle: '1 week programming challenge',
      createdBy: mockedUserId,
      dueDate,
      ticketPrice: 0
    })).rejects.toThrowError()
  })
})
