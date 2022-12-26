import { prisma } from '@infra/db/prisma/prismaClient'
import { prismaUserRepositoryFactory } from '@infra/db/prisma/repositories/userRepository'

import { createUserUseCaseFactory } from '@application/useCases/create-user/create-user'
import { createUserSchema } from '@application/useCases/create-user/create-user-validator'

import { createUserControllerFactory } from './create-user'

import { jwtAuthServiceFactory } from '@infra/http/services/JWTAuthService'

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
