import { PrismaClient} from "@prisma/client"


export function prisma_start() {
    const prisma = new PrismaClient()
    return prisma
}

export function prisma_stop() {
    prisma_start().$disconnect
}