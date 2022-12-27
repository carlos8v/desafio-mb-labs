import type { ApplicationError } from './application-error'

export class NonexistentUserError extends Error implements ApplicationError {
  constructor() {
    super('User does not exists')
    this.name = 'NonexistentUserError'
  }
}
