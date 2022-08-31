import { PrismaClient } from '@prisma/client'

// eslint-disable-next-line no-var
var prismaClientGlobal: PrismaClient

if (process.env.NODE_ENV === 'production') {
  prismaClientGlobal = new PrismaClient()
} else {
  if (!globalThis.prisma) {
    globalThis.prisma = new PrismaClient()
  }

  prismaClientGlobal = globalThis.prisma
}

export default prismaClientGlobal
