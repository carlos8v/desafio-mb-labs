import type { EventModel } from '@domain/event'
import type { EventRepository } from '@application/interfaces/event-repository'

type ListEventsByDateRequest = {
  startDate?: Date | null
  endDate: Date
}

type ListEventsByDateUseCaseFactory = UseCase<
  { eventRepository: EventRepository },
  ListEventsByDateRequest,
  Promise<EventModel[]>
>
export type ListEventsByDateUseCase = ReturnType<ListEventsByDateUseCaseFactory>

export const listEventsByDateUseCaseFactory: ListEventsByDateUseCaseFactory = ({
  eventRepository
}) => {
  return async ({
    startDate = new Date(),
    endDate
  }) => {
    const events = await eventRepository.findByDueDateRange(startDate!, endDate)
    return events
  }
}
