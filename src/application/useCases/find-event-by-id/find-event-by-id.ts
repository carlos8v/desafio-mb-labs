import type { EventRepository } from '@application/interfaces/EventRepository'
import type { EventModel } from '@domain/Event'

type FindEventByIdUseCaseFactory = UseCase<
  { eventRepository: EventRepository },
  string,
  Promise<EventModel>
>
export type FindEventByIdUseCase = ReturnType<FindEventByIdUseCaseFactory>

export const findEventByIdUseCaseFactory: FindEventByIdUseCaseFactory = ({
  eventRepository
}) => {
  return async (eventId) => {
    const event = await eventRepository.findById(eventId)
    if (!event?.id) throw new Error('Event does not exists')

    return event
  }
}
