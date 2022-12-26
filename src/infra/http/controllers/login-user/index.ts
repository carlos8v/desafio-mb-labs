import { prisma } from '@infra/db/prisma/prismaClient'
import { prismaUserRepositoryFactory } from '@infra/db/prisma/repositories/userRepository'

import { loginUserUseCaseFactory } from '@application/useCases/login-user/login-user'
import { loginUserSchema } from '@application/useCases/login-user/login-user-validator'

import { loginUserControllerFactory } from './login-user'

const loginUserUseCase = loginUserUseCaseFactory({
  userRepository: prismaUserRepositoryFactory(prisma)
})

export const loginUserController = loginUserControllerFactory({
  loginUserSchema,
  loginUserUseCase
})
