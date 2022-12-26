import type { DomainError } from './domain-error'

export class InvalidDueDateError extends Error implements DomainError {
  constructor() {
    super('Cannot create event before current date')
    this.name = 'InvalidDueDateError'
  }
}
