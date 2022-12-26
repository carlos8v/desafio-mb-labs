import { prisma } from '@infra/db/prisma/prismaClient'
import { prismaEventRepositoryFactory } from '@infra/db/prisma/repositories/eventRepository'

import { findEventByIdUseCaseFactory } from '@application/useCases/find-event-by-id/find-event-by-id'

import { findEventByIdControllerFactory } from './find-event-by-id'
import { findEventByIdSchema } from './find-event-by-id-validator'

const findEventByIdUseCase = findEventByIdUseCaseFactory({
  eventRepository: prismaEventRepositoryFactory(prisma)
})

export const findEventByIdController = findEventByIdControllerFactory({
  findEventByIdUseCase,
  findEventByIdSchema
})
