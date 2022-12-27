import type { CreateUserUseCase } from '@application/useCases/create-user/create-user'
import type { CreateUserValidator } from '@application/useCases/create-user/create-user-validator'
import type { AuthService } from '@application/interfaces/auth-service'

import { InvalidUserBodyError } from '@infra/http/errors/invalid-user-body'

import { badRequest, created, unprocessableEntity } from '@infra/http/helpers/http-helper'

type CreateUserController = Controller<{
  authService: AuthService
  createUserUseCase: CreateUserUseCase
  createUserSchema: CreateUserValidator
}>

export const createUserControllerFactory: CreateUserController = ({
  authService,
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

    const accessToken = authService.sign({ id: newUser.value.id })

    return created({
      accessToken,
      user: newUser.value
    })
  }
}
