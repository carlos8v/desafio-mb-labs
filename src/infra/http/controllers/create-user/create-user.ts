import type { CreateUserUseCase } from '@application/useCases/create-user/create-user'
import type { CreateUserValidator } from '@application/useCases/create-user/create-user-validator'

import { InvalidUserBodyError } from '@infra/http/errors/invalid-user-body'

import { badRequest, created, unprocessableEntity } from '@infra/http/helpers/httpHelper'

type CreateUserController = Controller<{
  createUserUseCase: CreateUserUseCase
  createUserSchema: CreateUserValidator
}>

export const createUserControllerFactory: CreateUserController = ({
  createUserUseCase,
  createUserSchema
}) => {
  return async (req) => {
    const userBody = createUserSchema.safeParse(req.body)

    if (!userBody.success) {
      return unprocessableEntity(new InvalidUserBodyError(
        userBody.error.issues.map(({ path }) => String(path))
      ))
    }

    const newUser = await createUserUseCase(userBody.data)

    if (newUser.isLeft()) {
      return badRequest(newUser.value)
    }

    return created(newUser.value)
  }
}
