import { EventModel } from '@domain/event'

export interface EventRepository {
  save(eventData: EventModel): Promise<void>
  findById(eventId: string): Promise<EventModel | null>
  findManyByTitle(name: string): Promise<EventModel[]>
  findByDueDateRange(startDate: Date, endDate: Date): Promise<EventModel[]>
}
