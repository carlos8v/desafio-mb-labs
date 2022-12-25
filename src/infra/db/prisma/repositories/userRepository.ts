import type { PrismaClient } from '@prisma/client'
import type { UserRepository } from '@application/interfaces/UserRepository'

import { User } from '@domain/User'

export const prismaUserRepositoryFactory: (prisma: PrismaClient) => UserRepository = (prisma) => ({
  save: async (userData) => {
    await prisma.user.upsert({
      where: {
        id: userData.id
      },
      create: {
        id: userData.id,
        name: userData.name,
        username: userData.username,
        password: userData.password,
        thumbnail: userData.thumbnail,
        description: userData.description
      },
      update: {
        name: userData.name,
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
  findByUsername: async (username) => {
    const user = await prisma.user.findFirst({
      where: { username }
    })

    if (!user) return null

    return User(user)
  }
})
