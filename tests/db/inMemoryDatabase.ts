import type { UserModel } from '@domain/User'
import type { EventModel } from '@domain/Event'

export type InMemoryDatabase = {
  users: Map<string, UserModel>
  events: Map<string, EventModel>
  truncate: () => void
}

export const inMemoryDatabaseFactory = (): InMemoryDatabase => {
  const users = new Map<string, UserModel>()
  const events = new Map<string, EventModel>()

  function truncate() {
    users.clear()
    events.clear()
  }

  return {
    users,
    events,
    truncate
  }
}
