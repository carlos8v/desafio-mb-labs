import { randomUUID } from 'crypto'
import type { OptionalProps } from './utils/OptionalProps'

type EventModel = {
  id: string
  title: string
  subtitle: string
  description?: string | null
  createdBy: string
  dueDate: Date
  createdAt: Date
}

type OptionalCreateProps =
  'id' |
  'createdAt'

type CreateEventProps = OptionalProps<EventModel, OptionalCreateProps>

export const Event = (eventData: CreateEventProps): EventModel => ({
  ...eventData,
  id: eventData?.id || randomUUID(),
  createdAt: eventData?.createdAt || new Date()
})
