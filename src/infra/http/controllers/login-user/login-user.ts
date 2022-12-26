import type { LoginUserUseCase } from '@application/useCases/login-user/login-user'
import type { LoginUserValidator } from '@application/useCases/login-user/login-user-validator'

import { InvalidLoginError } from '@application/errors/invalid-login'

import jwt from 'jsonwebtoken'

import { ok, badRequest, unprocessableEntity } from '@infra/http/helpers/httpHelper'

type LoginUserController = Controller<{
  loginUserUseCase: LoginUserUseCase
  loginUserSchema: LoginUserValidator
}>

export const loginUserControllerFactory: LoginUserController = ({
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

    const accessToken = jwt.sign(
      { id: user.value. id },
      process.env.JWT_SECRET!,
      {
        subject: user.value.id,
        algorithm: 'HS256'
      }
    )

    return ok({
      accessToken,
      user: user.value
    })
  }
}
