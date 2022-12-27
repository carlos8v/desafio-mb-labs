import { prisma } from '@infra/db/prisma/prisma-client'
import { prismaUserRepositoryFactory } from '@infra/db/prisma/repositories/user-repository'
import { prismaEventRepositoryFactory } from '@infra/db/prisma/repositories/event-repository'
import { prismaSubscriptionRepositoryFactory } from '@infra/db/prisma/repositories/subscription-repository'

import { findEventSubscriptionsUseCaseFactory } from '@application/useCases/find-event-subscriptions/find-event-subscriptions'
import { findEventSubscriptionsSchema } from '@application/useCases/find-event-subscriptions/find-event-subscriptions-validator'

import { findEventSubscriptionsControllerFactory } from './find-event-subscriptions'
import { findAuthUserUseCaseFactory } from '@application/useCases/find-auth-user/find-auth-user'

import { jwtAuthServiceFactory } from '@infra/http/services/jwt-auth-service'

const authService = jwtAuthServiceFactory({
  jwtSecret: process.env.JWT_SECRET!
})

const findAuthUserUseCase = findAuthUserUseCaseFactory({
  authService,
  userRepository: prismaUserRepositoryFactory(prisma)
})

const findEventSubscriptionsUseCase = findEventSubscriptionsUseCaseFactory({
  eventRepository: prismaEventRepositoryFactory(prisma),
  subscriptionRepository: prismaSubscriptionRepositoryFactory(prisma),
})

export const findEventSubscriptionsController = findEventSubscriptionsControllerFactory({
  findEventSubscriptionsSchema,
  findAuthUserUseCase,
  findEventSubscriptionsUseCase
})
