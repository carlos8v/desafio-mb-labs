import type { Schema } from 'zod'
import type { CreateUserUseCase } from '@application/useCases/create-user/create-user'

import { badRequest, created } from '@infra/http/helpers/httpHelper'

type CreateUserController = Controller<{
  createUserUseCase: CreateUserUseCase
  createUserSchema: Schema
}>

export const createUserControllerFactory: CreateUserController = ({
  createUserUseCase,
  createUserSchema
}) => {
  return async (req) => {
    const userData = createUserSchema.parse(req.body)
    const newUser = await createUserUseCase(userData)

    if (newUser.isLeft()) {
      return badRequest(newUser.value)
    }

    return created(newUser.value)
  }
}
