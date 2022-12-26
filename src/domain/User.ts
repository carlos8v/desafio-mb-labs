import { randomUUID } from 'crypto'
import { compare, hash } from 'bcrypt'
import type { OptionalProps } from './utils/OptionalProps'

export type UserModel = {
  id: string
  name: string
  username: string
  email: string
  password: string
  thumbnail: string | null
  description: string | null
}

type OptionalCreateProps = 'id' | 'thumbnail' | 'description'
export type CreateUserProps = OptionalProps<UserModel, OptionalCreateProps>

export const User = (userData: CreateUserProps): UserModel => ({
  id: userData?.id || randomUUID(),
  name: userData.name,
  email: userData.email,
  username: userData.username,
  password: userData.password,
  thumbnail: userData?.thumbnail || null,
  description: userData?.description || null,
})

const saltRound = 10

export const comparePassword = async (pass: string, hashedPass: string) => compare(pass, hashedPass)
export const hashPass = async (pass: string) => hash(pass, saltRound)
