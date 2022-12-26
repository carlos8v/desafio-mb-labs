import type { ApplicationError } from './application-error'

export class NonexistentEventError extends Error implements ApplicationError {
  constructor() {
    super('Event does not exists')
    this.name = 'NonexistentEventError'
  }
}
