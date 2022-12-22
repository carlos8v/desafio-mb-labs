import { randomUUID } from 'crypto'
import type { OptionalProps } from './utils/OptionalProps'

export type EventModel = {
  id: string
  title: string
  subtitle: string
  description: string | null
  createdBy: string
  dueDate: Date
  ticketPrice: number
  completed: boolean
  place: string | null
  link: string | null
  createdAt: Date
}

type OptionalCreateProps = 'id' |
  'description' |
  'place' |
  'link' |
  'createdAt' |
  'completed'

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
    id: eventData?.id || randomUUID(),
    title: eventData.title,
    subtitle: eventData.subtitle,
    description: eventData?.description || null,
    createdBy: eventData.createdBy,
    dueDate: eventData.dueDate,
    ticketPrice: eventData.ticketPrice,
    completed,
    place: eventData?.place || null,
    link: eventData?.link || null,
    createdAt: eventData?.createdAt || new Date()
  }
}
