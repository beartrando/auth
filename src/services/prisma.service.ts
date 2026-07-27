import {PrismaClient} from '@prisma/client';

export class PrismaService {

    private prisma: PrismaClient;

    constructor() {
        this.prisma = new PrismaClient();
    }

    async init() {}

    async stop() {}

}

export const prismaService = new PrismaService();

export default prismaService;

