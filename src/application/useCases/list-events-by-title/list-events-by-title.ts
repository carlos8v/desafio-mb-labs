import type { EventRepository } from '@application/interfaces/EventRepository'
import { EventModel } from '@domain/Event'

type ListEventsByTitleUseCaseFactory = UseCase<
  { eventRepository: EventRepository },
  string,
  Promise<EventModel[]>
>
export type ListEventsByTitleUseCase = ReturnType<ListEventsByTitleUseCaseFactory>

export const listEventsByTitleUseCaseFactory: ListEventsByTitleUseCaseFactory = ({
  eventRepository
}) => {
  return async (title) => {
    const events = await eventRepository.findManyByTitle(title)
    return events
  }
}
