import type { UserModel } from '@domain/User'
import type { InMemoryDatabase } from './inMemoryDatabase'
import type { UserRepository } from '@application/interfaces/UserRepository'

export const inMemoryUserRepositoryFactory: (db: InMemoryDatabase) => UserRepository = (db) => ({
  save: async (userData) => {
    db.users.set(userData.id, userData)
  },
  findById: async (userId) => {
    return db.users.get(userId) || null
  },
  findByUsername: async (username) => {
    const usersByUsername = new Map<string, UserModel>(
      [...db.users.values()].map((user) => ([user.username, user]))
    )

    return usersByUsername.get(username) || null
  }
})
