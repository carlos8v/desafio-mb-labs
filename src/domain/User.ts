import { randomUUID } from 'crypto'
import type { OptionalProps } from './utils/OptionalProps'

type UserModel = {
  id: string
  name: string
  username: string
  password: string
  thumbnail?: string | null
  description?: string | null
}

type OptionalCreateProps = 'id'

type CreateUserProps = OptionalProps<UserModel, OptionalCreateProps>

export const User = (userData: CreateUserProps): UserModel => ({
  ...userData,
  id: userData?.id || randomUUID()
})
