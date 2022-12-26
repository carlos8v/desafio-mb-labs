import type { ApplicationError } from './application-error'

export class NonexistentUserError extends Error implements ApplicationError {
  constructor() {
    super('Cannot create event without user')
    this.name = 'NonexistentUserError'
  }
}
