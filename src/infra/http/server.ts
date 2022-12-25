import 'dotenv/config'
import { app } from './app'
import type { Server } from 'http'

import { prisma } from '@infra/db/prisma/prismaClient'

let server: Server

async function gracefulShutdown(e: any) {
  console.error(e)
  await prisma.$disconnect()
  server?.close()
  process.exit(0)
}

async function start() {
  server = app.listen(process.env.PORT, () => {
    console.log(`Server started at port ${process.env.PORT}`)
  })

  const signalTraps = ['SIGTERM', 'SIGINT', 'SIGUSR2']
  signalTraps.forEach((type) => process.on(type, gracefulShutdown))
}

start()
