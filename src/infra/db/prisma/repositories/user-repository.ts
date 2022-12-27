import type { PrismaClient } from '@prisma/client'
import type { UserRepository } from '@application/interfaces/user-repository'

import { User } from '@domain/user'

export const prismaUserRepositoryFactory: (prisma: PrismaClient) => UserRepository = (prisma) => ({
  save: async (userData) => {
    await prisma.user.upsert({
      where: {
        id: userData.id
      },
      create: {
        id: userData.id,
        name: userData.name,
        email: userData.email,
        username: userData.username,
        password: userData.password,
        thumbnail: userData.thumbnail,
        description: userData.description
      },
      update: {
        name: userData.name,
        email: userData.email,
        username: userData.username,
        password: userData.password,
        thumbnail: userData.thumbnail,
        description: userData.description
      }
    })
  },
  findById: async (userId) => {
    const user = await prisma.user.findFirst({
      where: { id: userId }
    })

    if (!user) return null

    return User(user)
  },
  findByEmail: async (email) => {
    const user = await prisma.user.findFirst({
      where: { email }
    })

    if (!user) return null

    return User(user)
  },
  findByUsername: async (username) => {
    const user = await prisma.user.findFirst({
      where: { username }
    })

    if (!user) return null

    return User(user)
  }
})
