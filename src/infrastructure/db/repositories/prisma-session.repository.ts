import {PrismaClient} from "@prisma/client";

import SessionRepository from "../../../domain/repositories/session.repository";
import SessionEntity from "../../../domain/entities/session.entity";

import Id from "../../../domain/value-objects/id";
import AccessToken from "../../../domain/value-objects/access-token.vo";
import RefreshToken from "../../../domain/value-objects/refresh-token.vo";

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

        return new SessionEntity(
            new Id(session.id),

            new Id(session.userId),

            new AccessToken(session.accessToken),
            new RefreshToken(session.refreshToken),

            session.createdAt,
            session.updatedAt,
        );
    }

    async save(
        session: SessionEntity,
    ): Promise<void> {

        await this.prisma.session.upsert({
            where: {
                id: session.id.value,
            },
            create: {
                id: session.id.value,

                userId: session.userId.value,
                accessToken: session.accessToken.value,
                refreshToken: session.refreshToken.value,
            },
            update: {
                userId: session.userId.value,
                accessToken: session.accessToken.value,
                refreshToken: session.refreshToken.value,
            },
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