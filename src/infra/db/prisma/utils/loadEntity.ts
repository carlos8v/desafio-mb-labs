import type { Event as PrismaEvent } from '@prisma/client'

import type { EventModel } from '@domain/Event'
import { Event } from '@domain/Event'

export const loadEventEntity = (event: PrismaEvent) => Event({
  id: event.id,
  title: event.title,
  subtitle: event.subtitle,
  description: event.description,
  createdBy: event.createdBy,
  dueDate: event.dueDate,
  ticketPrice: Number(event.ticketPrice),
  completed: event.completed,
  place: event.place,
  link: event.link,
  createdAt: event.createdAt,
}).value as EventModel
