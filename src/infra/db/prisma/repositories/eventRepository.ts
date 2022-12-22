import type { PrismaClient } from '@prisma/client'
import type { EventRepository } from '@application/interfaces/EventRepository'

import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
dayjs.extend(utc)

import { loadEventEntity } from '../utils/loadEntity'

export const prismaEventRepositoryFactory: (prisma: PrismaClient) => EventRepository = (prisma) => ({
  save: async (eventData) => {
    await prisma.event.upsert({
      where: {
        id: eventData.id
      },
      create: {
        id: eventData.id,
        title: eventData.title,
        subtitle: eventData.subtitle,
        description: eventData.description,
        dueDate: eventData.dueDate,
        ticketPrice: eventData.ticketPrice,
        completed: eventData.completed,
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
        completed: eventData.completed,
        link: eventData.link,
        place: eventData.place,
      }
    })
  },
  findById: async (eventId) => {
    const event = await prisma.event.findFirst({
      where: { id: eventId }
    })

    if (!event?.id) return null

    return loadEventEntity(event)
  },
  findManyByTitle: async (title) => {
    const events = await prisma.event.findMany({
      where: {
        title: {
          contains: title,
          mode: 'insensitive'
        }
      }
    })

    return events.map((event) => loadEventEntity(event))
  },
  findByDueDateRange: async (firstDate, secondDate) => {
    const startDate = dayjs(firstDate <= secondDate ? firstDate : secondDate)
      .utc()
      .startOf('day')

    const endDate = dayjs(firstDate >= secondDate ? firstDate : secondDate)
      .utc()
      .endOf('day')

    const events = await prisma.event.findMany({
      where: {
        AND: [
          { dueDate: { gte: startDate.toDate() } },
          { dueDate: { lte: endDate.toDate() } }
        ]
      }
    })

    return events.map((event) => loadEventEntity(event))
  }
})
