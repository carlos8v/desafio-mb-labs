import type { EventModel } from '@domain/Event'
import { Event } from '@domain/Event'

export const eventSeed: EventModel[] = [
  Event({
    title: 'Javascript programmers challenge I',
    subtitle: '1 day programming challenge',
    createdBy: 'fe48e697-f141-41a8-bf28-05717570f3e6',
    dueDate: (() => {
      const dueDate = new Date()
      dueDate.setDate(dueDate.getDate() - 1)
      return dueDate
    })(),
    completed: true,
    ticketPrice: 0
  }),
  Event({
    title: 'Javascript programmers challenge II',
    subtitle: '1 week programming challenge',
    createdBy: 'fe48e697-f141-41a8-bf28-05717570f3e6',
    dueDate: (() => {
      const dueDate = new Date()
      dueDate.setDate(dueDate.getDate() + 1)
      return dueDate
    })(),
    ticketPrice: 0
  }),
  Event({
    title: 'Javascript programmers challenge III',
    subtitle: '1 week programming challenge',
    createdBy: 'fe48e697-f141-41a8-bf28-05717570f3e6',
    dueDate: (() => {
      const dueDate = new Date()
      dueDate.setDate(dueDate.getDate() + 7)
      return dueDate
    })(),
    ticketPrice: 0
  })
]
