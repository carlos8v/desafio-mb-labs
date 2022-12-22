import { EventModel } from '@domain/Event'

export interface EventRepository {
  save(eventData: EventModel): Promise<void>
  findById(eventId: string): Promise<EventModel | null>
  findByDueDateRange(startDate: Date, endDate: Date): Promise<EventModel[]>
}
