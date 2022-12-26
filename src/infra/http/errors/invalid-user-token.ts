import type { InfraError } from './infra-error'

export class InvalidUserTokenError extends Error implements InfraError {
  constructor() {
    super('Invalid authorization token')
    this.name = 'InvalidUserTokenError'
  }
}
