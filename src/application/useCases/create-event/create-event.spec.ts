import { randomUUID } from 'crypto'
import { describe, it, expect, beforeEach } from 'vitest'

import { createEventUseCaseFactory } from './create-event'

import { inMemoryDatabaseFactory } from '@tests/db/inMemoryDatabase'
import { inMemoryUserRepositoryFactory } from '@tests/db/inMemoryUserRepository'
import { inMemoryEventRepositoryFactory } from '@tests/db/inMemoryEventRepository'

describe('Create event use case', () => {
  const inMemoryDatabase = inMemoryDatabaseFactory()
  const inMemoryUserRepository = inMemoryUserRepositoryFactory(inMemoryDatabase)
  const inMemoryEventRepository = inMemoryEventRepositoryFactory(inMemoryDatabase)
  
  const createEventUseCase = createEventUseCaseFactory({
    userRepository: inMemoryUserRepository,
    eventRepository: inMemoryEventRepository
  })

  beforeEach(() => {
    inMemoryDatabase.truncate()
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
