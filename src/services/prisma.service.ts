import { PrismaClient } from "@prisma/client";

export class PrismaService {
    private readonly prisma: PrismaClient;

    constructor() {
        this.prisma = new PrismaClient();
    }

    async init(): Promise<void> {
        // await this.prisma.$connect();
    }

    async stop(): Promise<void> {
        // await this.prisma.$disconnect();
    }

    get client(): PrismaClient {
        return this.prisma;
    }
}

export const prismaService = new PrismaService();

export default prismaService;
