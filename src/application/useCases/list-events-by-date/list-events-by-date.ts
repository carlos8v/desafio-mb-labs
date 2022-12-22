import type { EventModel } from '@domain/Event'
import type { EventRepository } from '@application/interfaces/EventRepository'

type ListEventsByDateConstructor = {
  eventRepository: EventRepository
}

type ListEventsByDateRequest = {
  startDate?: Date | null
  endDate: Date
}

type ListEventsByDateUseCase = (_: ListEventsByDateConstructor) => (_: ListEventsByDateRequest) => Promise<EventModel[]>

export const listEventsByDateUseCaseFactory: ListEventsByDateUseCase = ({
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
