import { prisma } from '@infra/db/prisma/prisma-client'
import { prismaUserRepositoryFactory } from '@infra/db/prisma/repositories/user-repository'
import { prismaEventRepositoryFactory } from '@infra/db/prisma/repositories/event-repository'

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
