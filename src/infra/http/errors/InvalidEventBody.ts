import type { InfraError } from './infra-error'

export class InvalidEventBodyError extends Error implements InfraError {
  constructor(fields: string[]) {
    super(`Invalid ${fields.join(', ')} fields on event body request`)
    this.name = 'InvalidEventBodyError'
  }
}
