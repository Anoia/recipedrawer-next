import { PrismaClient } from '@prisma/client'

// eslint-disable-next-line no-var
var prismaClientGlobal: PrismaClient

if (process.env.NODE_ENV === 'production') {
  prismaClientGlobal = new PrismaClient()
} else {
  if (!globalThis.prismaClientGlobal) {
    globalThis.prismaClientGlobal = new PrismaClient()
  }

  prismaClientGlobal = globalThis.prismaClientGlobal
}

export default prismaClientGlobal
