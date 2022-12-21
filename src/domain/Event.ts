import { randomUUID } from 'crypto'
import type { OptionalProps } from './utils/OptionalProps'

export type EventModel = {
  id: string
  title: string
  subtitle: string
  description?: string | null
  createdBy: string
  dueDate: Date
  ticketPrice: number
  completed: boolean
  place?: string | null
  link?: string | null
  createdAt: Date
}

type OptionalCreateProps = 'id' | 'createdAt' | 'completed'
export type CreateEventProps = OptionalProps<EventModel, OptionalCreateProps>

export const Event = ({
  completed = false,
  ...eventData
}: CreateEventProps): EventModel => {
  if (
    !completed &&
    new Date(eventData.dueDate) < new Date()
  ) {
    throw new Error('Cannot create event before current date')
  }

  if (eventData.ticketPrice < 0) throw new Error('Cannot create event with negative ticket price')

  return {
    ...eventData,
    id: eventData?.id || randomUUID(),
    completed,
    createdAt: eventData?.createdAt || new Date()
  }
}
