import { prisma } from '@infra/db/prisma/prisma-client'
import { prismaUserRepositoryFactory } from '@infra/db/prisma/repositories/user-repository'
import { prismaEventRepositoryFactory } from '@infra/db/prisma/repositories/event-repository'
import { prismaSubscriptionRepositoryFactory } from '@infra/db/prisma/repositories/subscription-repository'

import { subscribeInEventUseCaseFactory } from '@application/useCases/subscribe-in-event/subscribe-in-event'
import { subscribeInEventSchema } from '@application/useCases/subscribe-in-event/subscribe-in-event-validator'

import { findAuthUserUseCaseFactory } from '@application/useCases/find-auth-user/find-auth-user'

import { subscribeInEventControllerFactory } from './subscribe-in-event'

import { jwtAuthServiceFactory } from '@infra/http/services/jwt-auth-service'

const authService = jwtAuthServiceFactory({
  jwtSecret: process.env.JWT_SECRET!
})

const findAuthUserUseCase = findAuthUserUseCaseFactory({
  authService,
  userRepository: prismaUserRepositoryFactory(prisma)
})

const subscribeInEventUseCase = subscribeInEventUseCaseFactory({
  eventRepository: prismaEventRepositoryFactory(prisma),
  subscriptionRepository: prismaSubscriptionRepositoryFactory(prisma),
  userRepository: prismaUserRepositoryFactory(prisma),
})

export const subscribeInEventController = subscribeInEventControllerFactory({
  findAuthUserUseCase,
  subscribeInEventSchema,
  subscribeInEventUseCase
})
