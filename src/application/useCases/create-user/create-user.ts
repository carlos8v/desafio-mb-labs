import type { UserModel } from '@domain/User'
import { User, hashPass } from '@domain/User'

import type { UserRepository } from '@application/interfaces/UserRepository'

import type { CreateUserSchema } from './create-user-validator'

import type { Either } from '@domain/utils/Either'
import { left, right } from '@domain/utils/Either'
import { DuplicatedUsernameError } from '@application/errors/duplicated-username'

type CreateUserResponse = Either<
  DuplicatedUsernameError,
  Omit<UserModel, 'password'>
>

type CreateUserRequestFactory = UseCase<
  { userRepository: UserRepository },
  CreateUserSchema,
  Promise<CreateUserResponse>
>
export type CreateUserUseCase = ReturnType<CreateUserRequestFactory>

export const createUserUseCaseFactory: CreateUserRequestFactory = ({ userRepository }) => {
  return async ({
    username,
    name,
    email,
    password,
    description = null,
    thumbnail = null
  }) => {
    const user = await userRepository.findByUsername(username)
    if (user?.id) {
      return left(new DuplicatedUsernameError())
    }

    const cryptPass = await hashPass(password)

    const newUser = User({
      username,
      name,
      email,
      password: cryptPass,
      description,
      thumbnail
    })

    await userRepository.save(newUser)
    const { password: _, ...safeUser } = newUser

    return right(safeUser)
  }
}
