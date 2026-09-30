import {PrismaClient} from "@prisma/client";

import SessionRepository from "../../../domain/session/session.repository";
import SessionEntity from "../../../domain/session/session.entity";

import SessionRefreshToken from "../../../domain/session/value-objects/sesion-refresh-token.vo";
import SessionDbMapper from "../mappers/session.db.mapper";
import UserId from "../../../domain/user/value-objects/user-id.vo";

export class PrismaSessionRepository implements SessionRepository {

    constructor(
        private readonly prisma: PrismaClient,
    ) {
    }

    async findByRefreshToken(
        refreshToken: SessionRefreshToken,
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
        userId: UserId,
    ): Promise<void> {

        await this.prisma.session.deleteMany({
            where: {
                userId: userId.value,
            },
        });
    }
}

export default PrismaSessionRepository;
