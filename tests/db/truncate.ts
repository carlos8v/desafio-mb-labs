import type { PrismaClient } from '@prisma/client'

export const truncateDatabase = async (prisma: PrismaClient) => {
  await prisma.user.deleteMany({})
  await prisma.event.deleteMany({})
}
