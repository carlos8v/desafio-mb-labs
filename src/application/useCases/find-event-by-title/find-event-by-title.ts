import type { EventRepository } from '@application/interfaces/EventRepository'
import { EventModel } from '@domain/Event'

type FindEventByTitleConstructor = {
  eventRepository: EventRepository
}
type FindEventByTitleUseCase = (_: FindEventByTitleConstructor) => (title: string) => Promise<EventModel[]>

export const findEventByTitleUseCaseFactory: FindEventByTitleUseCase = ({
  eventRepository
}) => {
  return async (title) => {
    const events = await eventRepository.findManyByTitle(title)
    return events
  }
}
