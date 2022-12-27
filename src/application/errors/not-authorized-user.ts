import type { ApplicationError } from './application-error'

export class NotAuthorizedUserError extends Error implements ApplicationError {
  constructor() {
    super('User cannot use this function')
    this.name = 'NotAuthorizedUserError'
  }
}
