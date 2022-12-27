import { prisma } from '@infra/db/prisma/prisma-client'
import { prismaUserRepositoryFactory } from '@infra/db/prisma/repositories/user-repository'
import { prismaSubscriptionRepositoryFactory } from '@infra/db/prisma/repositories/subscription-repository'

import { listUserSubscriptionsUseCaseFactory } from '@application/useCases/list-user-subscriptions/list-user-subscriptions'
import { findAuthUserUseCaseFactory } from '@application/useCases/find-auth-user/find-auth-user'

import { listUserSubscriptionsControllerFactory } from './list-user-subscriptions'

import { jwtAuthServiceFactory } from '@infra/http/services/jwt-auth-service'

const authService = jwtAuthServiceFactory({
  jwtSecret: process.env.JWT_SECRET!
})

const findAuthUserUseCase = findAuthUserUseCaseFactory({
  authService,
  userRepository: prismaUserRepositoryFactory(prisma)
})


const listUserSubscriptionsUseCase = listUserSubscriptionsUseCaseFactory({
  subscriptionRepository: prismaSubscriptionRepositoryFactory(prisma)
})

export const listUserSubscriptionsController = listUserSubscriptionsControllerFactory({
  findAuthUserUseCase,
  listUserSubscriptionsUseCase
})
