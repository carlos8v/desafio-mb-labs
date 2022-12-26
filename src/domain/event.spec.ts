import { randomUUID } from 'crypto'
import { it, expect } from 'vitest'

import { Event } from './Event'

import { InvalidDueDateError } from './errors/invalid-due-date'
import { InvalidTicketPriceError } from './errors/invalid-ticket-price'

const mockedUserId = randomUUID()

it('should be able to create event', () => {
  const dueDate = new Date()
  const createdAt = new Date()

  createdAt.setDate(createdAt.getDate())
  dueDate.setDate(dueDate.getDate() + 1)

  const newEvent = Event({
    title: 'Javascript programmers challenge',
    subtitle: '1 week programming challenge',
    createdBy: mockedUserId,
    dueDate,
    completed: true,
    ticketPrice: 0,
    createdAt
  })

  expect(newEvent.isLeft()).toBe(false)
  expect(newEvent.isRight()).toBe(true)
  expect(newEvent.value).toEqual(
    expect.objectContaining({
      title: 'Javascript programmers challenge',
      subtitle: '1 week programming challenge',
      createdBy: mockedUserId,
      dueDate,
      completed: true,
      ticketPrice: 0,
      createdAt
    })
  )
})

it('should not be able to create event before current day', () => {
  const dueDate = new Date()
  dueDate.setDate(dueDate.getDate() - 1)

  const invalidDueDateError = Event({
    title: 'Javascript programmers challenge',
    subtitle: '1 week programming challenge',
    createdBy: mockedUserId,
    dueDate,
    ticketPrice: 0
  })

  expect(invalidDueDateError.isLeft()).toBe(true)
  expect(invalidDueDateError.isRight()).toBe(false)
  expect(invalidDueDateError.value).toBeInstanceOf(InvalidDueDateError)
})

it('should not be able to create event with negative ticketPrice', () => {
  const dueDate = new Date()
  dueDate.setDate(dueDate.getDate() + 1)

  const invalidTicketPrice = Event({
    title: 'Javascript programmers challenge',
    subtitle: '1 week programming challenge',
    createdBy: mockedUserId,
    dueDate,
    ticketPrice: -10
  })

  expect(invalidTicketPrice.isLeft()).toBe(true)
  expect(invalidTicketPrice.isRight()).toBe(false)
  expect(invalidTicketPrice.value).toBeInstanceOf(InvalidTicketPriceError)
})
