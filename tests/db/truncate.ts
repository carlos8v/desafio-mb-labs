import type { PrismaClient } from '@prisma/client'

export const truncateDatabase = async (prisma: PrismaClient) => {
  await prisma.subscription.deleteMany({})
  await prisma.event.deleteMany({})
  await prisma.user.deleteMany({})
}
