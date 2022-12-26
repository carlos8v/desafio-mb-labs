import type { ApplicationError } from './application-error'

export class InvalidLoginError extends Error implements ApplicationError {
  constructor() {
    super('Invalid login data')
    this.name = 'InvalidLoginError'
  }
}
