import { prisma } from '@infra/db/prisma/prisma-client'
import { prismaEventRepositoryFactory } from '@infra/db/prisma/repositories/event-repository'

import { listEventsByTitleUseCaseFactory } from '@application/useCases/list-events-by-title/list-events-by-title'

import { listEventsByTitleControllerFactory } from './list-events-by-title'
import { listEventsByTitleSchema } from './list-events-by-title-validator'

const listEventsByTitleUseCase = listEventsByTitleUseCaseFactory({
  eventRepository: prismaEventRepositoryFactory(prisma)
})

export const listEventsByTitleController = listEventsByTitleControllerFactory({
  listEventsByTitleSchema,
  listEventsByTitleUseCase
})
