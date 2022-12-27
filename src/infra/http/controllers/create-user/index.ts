import { prisma } from '@infra/db/prisma/prisma-client'
import { prismaUserRepositoryFactory } from '@infra/db/prisma/repositories/user-repository'

import { createUserUseCaseFactory } from '@application/useCases/create-user/create-user'
import { createUserSchema } from '@application/useCases/create-user/create-user-validator'

import { createUserControllerFactory } from './create-user'

import { jwtAuthServiceFactory } from '@infra/http/services/jwt-auth-service'

const jwtAuthService = jwtAuthServiceFactory({
  jwtSecret: process.env.JWT_SECRET!
})

const createUserUseCase = createUserUseCaseFactory({
  userRepository: prismaUserRepositoryFactory(prisma)
})

export const createUserController = createUserControllerFactory({
  authService: jwtAuthService,
  createUserUseCase,
  createUserSchema
})
