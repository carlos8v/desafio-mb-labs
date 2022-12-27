import { prisma } from '@infra/db/prisma/prisma-client'
import { prismaUserRepositoryFactory } from '@infra/db/prisma/repositories/user-repository'

import { loginUserUseCaseFactory } from '@application/useCases/login-user/login-user'
import { loginUserSchema } from '@application/useCases/login-user/login-user-validator'

import { loginUserControllerFactory } from './login-user'

import { jwtAuthServiceFactory } from '@infra/http/services/jwt-auth-service'

const authService = jwtAuthServiceFactory({
  jwtSecret: process.env.JWT_SECRET!
})

const loginUserUseCase = loginUserUseCaseFactory({
  userRepository: prismaUserRepositoryFactory(prisma)
})

export const loginUserController = loginUserControllerFactory({
  authService,
  loginUserSchema,
  loginUserUseCase
})
