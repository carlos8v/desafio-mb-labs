import type { ApplicationError } from './application-error'

export class EventSubscriptionAuthError extends Error implements ApplicationError {
  constructor() {
    super('User cannot see subscriptions for this event')
    this.name = 'EventSubscriptionAuthError'
  }
}
