import {PrismaClient} from "@prisma/client";

import SessionRepository from "../../../domain/repositories/session.repository";
import SessionEntity from "../../../domain/entities/session.entity";

import Id from "../../../domain/value-objects/id.vo";
import RefreshToken from "../../../domain/value-objects/session/refresh-token.vo";
import SessionDbMapper from "../mappers/session.mapper";

export class PrismaSessionRepository implements SessionRepository {

    constructor(
        private readonly prisma: PrismaClient,
    ) {
    }

    async findByRefreshToken(
        refreshToken: RefreshToken,
    ): Promise<SessionEntity | null> {

        const session = await this.prisma.session.findFirst({
            where: {
                refreshToken: refreshToken.value,
            },
        });

        if (!session) {
            return null;
        }

        return SessionDbMapper.toDomain(session);
    }

    async save(
        session: SessionEntity,
    ): Promise<void> {

        const sessionDb = SessionDbMapper.toPersistence(session);

        const {
            id,
            ...update
        } = sessionDb;

        await this.prisma.session.upsert({
            where: {
                id: sessionDb.id,
            },
            create: sessionDb,
            update,
        });
    }

    async deleteByUserId(
        userId: Id,
    ): Promise<void> {

        await this.prisma.session.deleteMany({
            where: {
                userId: userId.value,
            },
        });
    }
}

export default PrismaSessionRepository;
