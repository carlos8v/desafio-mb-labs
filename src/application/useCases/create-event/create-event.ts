import type { EventModel } from '@domain/Event'
import { Event } from '@domain/Event'

import type { EventRepository } from '@application/interfaces/EventRepository'
import type { UserRepository } from '@application/interfaces/UserRepository'

import type { CreateEventSchema } from './create-event-validator'

import type { Either } from '@domain/utils/Either'
import { left, right } from '@domain/utils/Either'

import { InvalidDueDateError } from '@domain/errors/invalid-due-date'
import { InvalidTicketPriceError } from '@domain/errors/invalid-ticket-price'

import { NonexistentUserError } from '@application/errors/nonexistent-user'

type CreateEventUseCaseResponse = Either<
  InvalidDueDateError |
  InvalidTicketPriceError |
  NonexistentUserError,
  EventModel
>

type CreateEventUseCaseFactory = UseCase<
  {
    userRepository: UserRepository
    eventRepository: EventRepository
  },
  CreateEventSchema,
  Promise<CreateEventUseCaseResponse>
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
    if (!user) {
      return left(new NonexistentUserError())
    }

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

    if (newEvent.isLeft()) {
      return left(newEvent.value)
    }

    await eventRepository.save(newEvent.value)

    return right(newEvent.value)
  }
}
