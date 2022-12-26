import { randomUUID } from 'crypto'

import { Either, left, right } from './utils/Either'
import type { OptionalProps } from './utils/OptionalProps'

import { InvalidDueDateError } from './errors/invalid-due-date'
import { InvalidTicketPriceError } from './errors/invalid-ticket-price'

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

type CreateEventResponse = Either<
  InvalidDueDateError |
  InvalidTicketPriceError,
  EventModel
>

export const Event = ({
  completed = false,
  ...eventData
}: CreateEventProps): CreateEventResponse => {
  if (
    !completed &&
    new Date(eventData.dueDate) < new Date()
  ) {
    return left(new InvalidDueDateError())
  }

  if (eventData.ticketPrice < 0) {
    return left(new InvalidTicketPriceError())
  }

  return right({
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
  })
}
