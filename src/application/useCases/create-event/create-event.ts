import type { EventModel } from '@domain/Event'
import { Event } from '@domain/Event'

import type { EventRepository } from '@application/interfaces/EventRepository'
import type { UserRepository } from '@application/interfaces/UserRepository'

import type { CreateEventSchema } from './create-event-validator'

type CreateEventUseCaseFactory = UseCase<
  {
    userRepository: UserRepository
    eventRepository: EventRepository
  },
  CreateEventSchema,
  Promise<EventModel>
>
export type CreateEventUseCase = ReturnType<CreateEventUseCaseFactory>

export const createEventUseCaseFactory: CreateEventUseCaseFactory = ({
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
      dueDate: new Date(dueDate),
      ticketPrice,
      link,
      place,
      createdBy
    })

    await eventRepository.save(newEvent)

    return newEvent
  }
}
