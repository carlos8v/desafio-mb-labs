import { randomUUID } from 'crypto'
import { compare, hash } from 'bcrypt'
import type { OptionalProps } from './utils/OptionalProps'

export type UserModel = {
  id: string
  name: string
  username: string
  password: string
  thumbnail?: string | null
  description?: string | null
}

type OptionalCreateProps = 'id'
export type CreateUserProps = OptionalProps<UserModel, OptionalCreateProps>

export const User = (userData: CreateUserProps): UserModel => ({
  ...userData,
  id: userData?.id || randomUUID()
})

const saltRound = 10

export const comparePassword = async (pass: string, hashedPass: string) => compare(pass, hashedPass)
export const hashPass = async (pass: string) => hash(pass, saltRound)
