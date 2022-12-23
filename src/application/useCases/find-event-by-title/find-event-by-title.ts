import type { EventRepository } from '@application/interfaces/EventRepository'
import { EventModel } from '@domain/Event'

type FindEventByTitleUseCaseFactory = UseCase<
  { eventRepository: EventRepository },
  string,
  Promise<EventModel[]>
>
export type FindEventByTitleUseCase = ReturnType<FindEventByTitleUseCaseFactory>

export const findEventByTitleUseCaseFactory: FindEventByTitleUseCaseFactory = ({
  eventRepository
}) => {
  return async (title) => {
    const events = await eventRepository.findManyByTitle(title)
    return events
  }
}
