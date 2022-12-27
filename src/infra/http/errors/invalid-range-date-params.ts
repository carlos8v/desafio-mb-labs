import type { InfraError } from './infra-error'

export class InvalidRangeDateParamsError extends Error implements InfraError {
  constructor() {
    super('Invalid startDate and/or endDate params')
    this.name = 'InvalidRangeDateParamsError'
  }
}
