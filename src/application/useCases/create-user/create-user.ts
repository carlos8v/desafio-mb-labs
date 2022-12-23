import type { UserModel } from '@domain/User'
import { User, hashPass } from '@domain/User'

import type { UserRepository } from '@application/interfaces/UserRepository'

import type { CreateUserSchema } from './create-user-validator'

type CreateUserRequestFactory = UseCase<
  { userRepository: UserRepository },
  CreateUserSchema,
  Promise<UserModel>
>
export type CreateUserUseCase = ReturnType<CreateUserRequestFactory>

export const createUserUseCaseFactory: CreateUserRequestFactory = ({ userRepository }) => {
  return async ({
    username,
    name,
    password,
    description = null,
    thumbnail = null
  }) => {
    const user = await userRepository.findByUsername(username)
    if (user?.id) throw new Error('Cannot create user with duplicated username')

    const cryptPass = await hashPass(password)

    const newUser = User({
      username,
      name,
      password: cryptPass,
      description,
      thumbnail
    })

    await userRepository.save(newUser)

    return newUser
  }
}
