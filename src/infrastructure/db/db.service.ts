import { PrismaClient } from "@prisma/client";

export class DbService {
    private readonly prisma: PrismaClient;

    constructor() {
        this.prisma = new PrismaClient();
    }

    async init(): Promise<void> {
    }

    async stop(): Promise<void> {
    }

    get client(): PrismaClient {
        return this.prisma;
    }

    async check(): Promise<boolean> {
        try {
            await this.prisma.$queryRaw`SELECT 1`;
            return true;
        } catch {
            return false;
        }
    }
}

export const dbService = new DbService();

export default dbService;
