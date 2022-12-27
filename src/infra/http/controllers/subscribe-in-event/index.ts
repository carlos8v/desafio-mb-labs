import { prisma } from '@infra/db/prisma/prisma-client'
import { prismaUserRepositoryFactory } from '@infra/db/prisma/repositories/user-repository'
import { prismaEventRepositoryFactory } from '@infra/db/prisma/repositories/event-repository'
import { prismaSubscriptionRepositoryFactory } from '@infra/db/prisma/repositories/subscription-repository'

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
