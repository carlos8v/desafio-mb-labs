import { randomUUID } from 'crypto'
import { it, expect } from 'vitest'

import { Subscription } from './subscription'

import { InvalidTicketPriceError } from './errors/invalid-ticket-price'

it('should not be able to create event with negative ticketPrice', () => {
  const mockedEventId = randomUUID()
  const mockedUserId = randomUUID()

  const invalidSubscription = Subscription({
    eventId: mockedEventId,
    userId: mockedUserId,
    ticketPrice: -10,
    createdAt: new Date()
  })

  expect(invalidSubscription.isLeft()).toBe(true)
  expect(invalidSubscription.isRight()).toBe(false)
  expect(invalidSubscription.value).toBeInstanceOf(InvalidTicketPriceError)
})
