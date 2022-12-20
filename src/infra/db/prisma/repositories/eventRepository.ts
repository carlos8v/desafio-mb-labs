import type { PrismaClient } from '@prisma/client'
import type { EventRepository } from '@application/interfaces/EventRepository'

import { loadEventEntity } from '../utils/loadEntity'

export const prismaEventRepositoryFactory: (prisma: PrismaClient) => EventRepository = (prisma) => ({
  save: async (eventData) => {
    await prisma.event.upsert({
      where: {
        id: eventData.id
      },
      create: {
        title: eventData.title,
        subtitle: eventData.subtitle,
        description: eventData.description,
        dueDate: eventData.dueDate,
        ticketPrice: eventData.ticketPrice,
        link: eventData.link,
        place: eventData.place,
        createdBy: eventData.createdBy,
      },
      update: {
        title: eventData.title,
        subtitle: eventData.subtitle,
        description: eventData.description,
        dueDate: eventData.dueDate,
        ticketPrice: eventData.ticketPrice,
        link: eventData.link,
        place: eventData.place,
      }
    })
  },
  findById: async (eventId) => {
    const event = await prisma.event.findFirst({
      where: { id: eventId }
    })

    if (!event) return null

    return loadEventEntity(event)
  }
})
