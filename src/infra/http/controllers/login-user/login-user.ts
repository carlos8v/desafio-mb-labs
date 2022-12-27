import type { LoginUserUseCase } from '@application/useCases/login-user/login-user'
import type { LoginUserValidator } from '@application/useCases/login-user/login-user-validator'
import type { AuthService } from '@application/interfaces/auth-service'

import { InvalidLoginError } from '@application/errors/invalid-login'

import { ok, badRequest, unprocessableEntity } from '@infra/http/helpers/http-helper'

type LoginUserController = Controller<{
  authService: AuthService
  loginUserUseCase: LoginUserUseCase
  loginUserSchema: LoginUserValidator
}>

export const loginUserControllerFactory: LoginUserController = ({
  authService,
  loginUserSchema,
  loginUserUseCase
}) => {
  return async (req) => {
    const userBody = loginUserSchema.safeParse(req.body)
    if (!userBody.success) {
      return unprocessableEntity(new InvalidLoginError())
    }

    const user = await loginUserUseCase(userBody.data)

    if (user.isLeft()) {
      return badRequest(user.value)
    }

    const accessToken = authService.sign({ id: user.value.id })

    return ok({
      accessToken,
      user: user.value
    })
  }
}
