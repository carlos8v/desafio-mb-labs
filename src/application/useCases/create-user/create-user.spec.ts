import { describe, it, expect } from 'vitest'

import { createUserUseCaseFactory } from './create-user'

import { inMemoryDatabaseFactory } from '@tests/db/inMemoryDatabase'
import { inMemoryUserRepositoryFactory } from '@tests/db/inMemoryUserRepository'

describe('Create event use case', () => {
  const inMemoryDatabase = inMemoryDatabaseFactory()
  const inMemoryUserRepository = inMemoryUserRepositoryFactory(inMemoryDatabase)
  
  const createUserUseCase = createUserUseCaseFactory({
    userRepository: inMemoryUserRepository
  })

  it('should not be able to create user with duplicated username', async () => {
    await createUserUseCase({
      name: 'Carlos Souza',
      username: 'carlos8v',
      password: '123123'
    })

    await expect(() => createUserUseCase({
      name: 'Carlos Souza 2',
      username: 'carlos8v',
      password: '321321'
    })).rejects.toThrowError()
  })
})
