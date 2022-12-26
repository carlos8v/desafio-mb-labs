import type { DomainError } from './domain-error'

export class InvalidTicketPriceError extends Error implements DomainError {
  constructor(entity = 'event') {
    super(`Cannot create ${entity} with negative ticket price`)
    this.name = 'InvalidTicketPrice'
  }
}
