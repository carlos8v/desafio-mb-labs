import { prisma } from '@infra/db/prisma/prismaClient'
import { prismaUserRepositoryFactory } from '@infra/db/prisma/repositories/userRepository'
import { prismaEventRepositoryFactory } from '@infra/db/prisma/repositories/eventRepository'
import { prismaSubscriptionRepositoryFactory } from '@infra/db/prisma/repositories/subscriptionRepository'

import { subscribeInEventUseCaseFactory } from '@application/useCases/subscribe-in-event/subscribe-in-event'
import { subscribeInEventSchema } from '@application/useCases/subscribe-in-event/subscribe-in-event-validator'

import { subscribeInEventControllerFactory } from './subscribe-in-event'

const subscribeInEventUseCase = subscribeInEventUseCaseFactory({
  eventRepository: prismaEventRepositoryFactory(prisma),
  subscriptionRepository: prismaSubscriptionRepositoryFactory(prisma),
  userRepository: prismaUserRepositoryFactory(prisma),
})

export const subscribeInEventController = subscribeInEventControllerFactory({
  subscribeInEventSchema,
  subscribeInEventUseCase
})
