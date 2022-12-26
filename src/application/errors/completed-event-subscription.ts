import type { ApplicationError } from './application-error'

export class CompletedEventSubscriptionError extends Error implements ApplicationError {
  constructor() {
    super('Cannot subscribe on completed event')
    this.name = 'CompletedEventSubscriptionError'
  }
}
