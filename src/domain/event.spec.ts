import { randomUUID } from 'crypto'
import { it, expect } from 'vitest'

import { Event } from './Event'

it('should not be able to create event before current day', () => {
  const mockedUserId = randomUUID()

  const dueDate = new Date()
  dueDate.setDate(dueDate.getDate() - 1)

  expect(() => Event({
    title: 'Javascript programmers challenge',
    subtitle: '1 week programming challenge',
    createdBy: mockedUserId,
    dueDate,
    ticketPrice: 0
  })).toThrowError()

  const createdAt = new Date()
  createdAt.setDate(dueDate.getDate() - 7)

  expect(() => Event({
    title: 'Javascript programmers challenge',
    subtitle: '1 week programming challenge',
    createdBy: mockedUserId,
    dueDate,
    completed: true,
    ticketPrice: 0,
    createdAt
  })).not.toThrowError()
})
