import { PrismaClient } from '@prisma/client'

export type PrismaRepositoryFactory<T> = (prisma: PrismaClient) => T

export const prisma = new PrismaClient()
