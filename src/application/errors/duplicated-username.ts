import type { ApplicationError } from './application-error'

export class DuplicatedUsernameError extends Error implements ApplicationError {
  constructor() {
    super('Cannot create user with duplicated username')
    this.name = 'DuplicatedUsernameError'
  }
}
