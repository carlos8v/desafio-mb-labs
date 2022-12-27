import type { UserRepository } from '@application/interfaces/user-repository'

import { InvalidLoginError } from '@application/errors/invalid-login'

import type { UserModel } from '@domain/user'
import { comparePassword } from '@domain/user'

import type { Either } from '@domain/utils/either'
import { left, right } from '@domain/utils/either'

import type { LoginUserSchema } from './login-user-validator'

type LoginUserResponse = Either<
  InvalidLoginError,
  Omit<UserModel, 'password'>
>

type LoginUserUseCaseFactory = UseCase<
  { userRepository: UserRepository },
  LoginUserSchema,
  Promise<LoginUserResponse>
>
export type LoginUserUseCase = ReturnType<LoginUserUseCaseFactory>

export const loginUserUseCaseFactory: LoginUserUseCaseFactory = ({
  userRepository
}) => {
  return async ({ email, password }) => {
    const user = await userRepository.findByEmail(email)
    if (!user?.id) return left(new InvalidLoginError())

    const correctPass = await comparePassword(password, user.password)
    if (!correctPass) return left(new InvalidLoginError())

    const { password: _, ...safeUser } = user
    return right(safeUser)
  }
}
