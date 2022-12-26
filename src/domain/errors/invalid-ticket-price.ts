import type { DomainError } from './domain-error'

export class InvalidTicketPriceError extends Error implements DomainError {
  constructor() {
    super('Cannot create event with negative ticket price')
    this.name = 'InvalidTicketPrice'
  }
}
