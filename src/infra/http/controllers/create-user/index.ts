import { prisma } from '@infra/db/prisma/prismaClient'
import { prismaUserRepositoryFactory } from '@infra/db/prisma/repositories/userRepository'

import { createUserUseCaseFactory } from '@application/useCases/create-user/create-user'
import { createUserSchema } from '@application/useCases/create-user/create-user-validator'

import { createUserControllerFactory } from './create-user'

const createUserUseCase = createUserUseCaseFactory({
  userRepository: prismaUserRepositoryFactory(prisma)
})

export const createUserController = createUserControllerFactory({
  createUserUseCase,
  createUserSchema
})
