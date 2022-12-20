import { UserModel } from '@domain/User'

export interface UserRepository {
  save(userData: UserModel): Promise<void>
  findById(userId: string): Promise<UserModel | null>
  findByUsername(username: string): Promise<UserModel | null>
}
