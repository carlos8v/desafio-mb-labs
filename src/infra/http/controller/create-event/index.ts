import { prisma } from '@infra/db/prisma/prismaClient'
import { prismaUserRepositoryFactory } from '@infra/db/prisma/repositories/userRepository'
import { prismaEventRepositoryFactory } from '@infra/db/prisma/repositories/eventRepository'

import { createEventUseCaseFactory } from '@application/useCases/create-event/create-event'
import { createEventSchema } from '@application/useCases/create-event/create-event-validator'

import { createEventControllerFactory } from './create-event'

const createEventUseCase = createEventUseCaseFactory({
  userRepository: prismaUserRepositoryFactory(prisma),
  eventRepository: prismaEventRepositoryFactory(prisma)
})

export const createEventController = createEventControllerFactory({
  createEventSchema,
  createEventUseCase
})
