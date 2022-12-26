import type { UserModel } from '@domain/User'
import { User } from '@domain/User'

export const userSeed: UserModel[] = [
  User({
    id: 'fe48e697-f141-41a8-bf28-05717570f3e6',
    name: 'Carlos Souza',
    email: 'carlos.pessoal@hotmail.com',
    username: 'carlos8v',
    password: '$2a$10$hTMiRrtZBsW89P1jc3QLXuj.tn6jH87Cza3ckDEwV/lrx9/DDsqGa'
  })
]
