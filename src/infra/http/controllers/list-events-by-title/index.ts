import { prisma } from '@infra/db/prisma/prismaClient'
import { prismaEventRepositoryFactory } from '@infra/db/prisma/repositories/eventRepository'

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
