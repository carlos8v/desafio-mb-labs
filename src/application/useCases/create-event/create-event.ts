import type { EventModel } from '@domain/Event'
import { Event } from '@domain/Event'

import type { EventRepository } from '@application/interfaces/EventRepository'
import type { UserRepository } from '@application/interfaces/UserRepository'

type CreateEventUseCaseConstructor = {
  userRepository: UserRepository
  eventRepository: EventRepository
}

type CreateEventRequest = Pick<EventModel, 'title' |
  'subtitle' |
  'description' |
  'dueDate' |
  'ticketPrice' |
  'link' |
  'place' |
  'createdBy'
>

type CreateEventUseCase = (_: CreateEventUseCaseConstructor) => (_: CreateEventRequest) => Promise<EventModel>

export const createEventUseCaseFactory: CreateEventUseCase = ({
  eventRepository,
  userRepository
}) => {
  return async ({
    title,
    subtitle,
    description = null,
    dueDate,
    ticketPrice,
    link = null,
    place = null,
    createdBy
  }) => {
    const user = await userRepository.findById(createdBy)
    if (!user) throw new Error('Cannot create event without user')

    const newEvent = Event({
      title,
      subtitle,
      description,
      dueDate,
      ticketPrice,
      link,
      place,
      createdBy
    })

    await eventRepository.save(newEvent)

    return newEvent
  }
}
