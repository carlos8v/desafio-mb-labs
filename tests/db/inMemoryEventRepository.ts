import type { InMemoryDatabase } from './inMemoryDatabase'
import type { EventRepository } from '@application/interfaces/EventRepository'

export const inMemoryEventRepositoryFactory: (db: InMemoryDatabase) => EventRepository = (db) => ({
  save: async (eventData) => {
    db.events.set(eventData.id, eventData)
  },
  findById: async (eventId) => {
    return db.events.get(eventId) || null
  }
})
