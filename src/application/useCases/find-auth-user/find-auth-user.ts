import type { UserRepository } from '@application/interfaces/user-repository'
import type { UserModel } from '@domain/user'

import { NotAuthorizedUserError } from '@application/errors/not-authorized-user'

import type { Either } from '@domain/utils/either'
import { left, right } from '@domain/utils/either'

import type { AuthService } from '@application/interfaces/auth-service'
import { NonexistentUserError } from '@application/errors/nonexistent-user'

type FindAuthUserResponse = Either<
  NotAuthorizedUserError |
  NonexistentUserError,
  Omit<UserModel, 'password'>
>
type FindAuthUserUseCaseFactory = UseCase<
  {
    userRepository: UserRepository
    authService: AuthService
  },
  string,
  Promise<FindAuthUserResponse>
>
export type FindAuthUserUseCase = ReturnType<FindAuthUserUseCaseFactory>

export const findAuthUserUseCaseFactory: FindAuthUserUseCaseFactory = ({
  authService,
  userRepository
}) => {
  return async (token) => {
    const userPayload = authService.verify(token)

    if (userPayload.isLeft()) {
      return left(new NotAuthorizedUserError())
    }

    const user = await userRepository.findById(userPayload.value.id)
    if (!user?.id) {
      return left(new NonexistentUserError())
    }

    const { password, ...safeUser } = user
    return right(safeUser)
  }
}
