import type { EventRepository } from '@application/interfaces/EventRepository'
import type { EventModel } from '@domain/Event'

type FindEventByIdConstructor = {
  eventRepository: EventRepository
}
type FindEventByIdUseCase = (_: FindEventByIdConstructor) => (_: string) => Promise<EventModel>

export const findEventByIdUseCaseFactory: FindEventByIdUseCase = ({
  eventRepository
}) => {
  return async (eventId) => {
    const event = await eventRepository.findById(eventId)
    if (!event?.id) throw new Error('Event does not exists')

    return event
  }
}
