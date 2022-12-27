import type { EventRepository } from '@application/interfaces/event-repository'
import type { EventModel } from '@domain/event'

import { NonexistentEventError } from '@application/errors/nonexistent-event'

import type { Either } from '@domain/utils/either'
import { left, right } from '@domain/utils/either'

type FindEventByIdResponse = Either<
  NonexistentEventError,
  EventModel
>

type FindEventByIdUseCaseFactory = UseCase<
  { eventRepository: EventRepository },
  string,
  Promise<FindEventByIdResponse>
>
export type FindEventByIdUseCase = ReturnType<FindEventByIdUseCaseFactory>

export const findEventByIdUseCaseFactory: FindEventByIdUseCaseFactory = ({
  eventRepository
}) => {
  return async (eventId) => {
    const event = await eventRepository.findById(eventId)

    if (!event?.id) {
      return left(new NonexistentEventError)
    }

    return right(event)
  }
}
