import type { CreateUserProps, UserModel } from '@domain/User'
import { User, hashPass } from '@domain/User'

import type { UserRepository } from '@application/interfaces/UserRepository'

type CreateUserUseCaseConstructor = {
  userRepository: UserRepository
}

type CreateUserRequest = CreateUserProps
type CreateUserUseCase = (_: CreateUserUseCaseConstructor) => (_: CreateUserRequest) => Promise<UserModel>

export const createUserUseCaseFactory: CreateUserUseCase = ({ userRepository }) => {
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
