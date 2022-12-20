import { randomUUID } from 'crypto'
import type { OptionalProps } from './utils/OptionalProps'

export type EventModel = {
  id: string
  title: string
  subtitle: string
  description?: string | null
  createdBy: string
  dueDate: Date
  ticketPrice: Number
  completed: boolean
  place?: string | null
  link?: string | null
  createdAt: Date
}

type OptionalCreateProps = 'id' | 'createdAt' | 'completed'

export type CreateEventProps = OptionalProps<EventModel, OptionalCreateProps>

export const Event = (eventData: CreateEventProps): EventModel => {
  if (
    !eventData?.completed &&
    new Date(eventData.dueDate) < new Date()
  ) {
    throw new Error('Cannot create event before current date')
  }

  return {
    ...eventData,
    id: eventData?.id || randomUUID(),
    completed: eventData?.completed || false,
    createdAt: eventData?.createdAt || new Date()
  }
}
