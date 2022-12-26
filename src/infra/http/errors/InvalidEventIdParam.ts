import type { InfraError } from './infra-error'

export class InvalidEventIdParamError extends Error implements InfraError {
  constructor() {
    super('Invalid event id param')
    this.name = 'InvalidEventIdParamError'
  }
}
