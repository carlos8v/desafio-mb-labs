import { prisma } from '@infra/db/prisma/prisma-client'
import { prismaEventRepositoryFactory } from '@infra/db/prisma/repositories/event-repository'

import { listEventsByDateUseCaseFactory } from '@application/useCases/list-events-by-date/list-events-by-date'
import { listEventsByDateSchema } from '@application/useCases/list-events-by-date/list-events-by-date-validator'


import { listEventsByDateControllerFactory } from './list-events-by-date'

const listEventsByDateUseCase = listEventsByDateUseCaseFactory({
  eventRepository: prismaEventRepositoryFactory(prisma)
})

export const listEventsByDateController = listEventsByDateControllerFactory({
  listEventsByDateSchema,
  listEventsByDateUseCase
})
