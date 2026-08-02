import {Session} from "@prisma/client";
import Id from "../../../domain/value-objects/id.vo";
import SessionEntity from "../../../domain/entities/session.entity";
import AccessToken from "../../../domain/value-objects/access-token.vo";
import RefreshToken from "../../../domain/value-objects/refresh-token.vo";

type SessionSaveData = Omit<
    Session,
    "createdAt" | "updatedAt"
>;

export class SessionDbMapper {
    static toPersistence(session: SessionEntity): SessionSaveData {
        return {
            id: session.id.value,
            userId: session.userId.value,
            accessToken: session.accessToken.value,
            refreshToken: session.refreshToken.value,
            // createdAt: session.createdAt,
            // updatedAt: session.updatedAt,
        };
    }

    static toEntity(session: Session): SessionEntity {
        return new SessionEntity(
            new Id(session.id),

            new Id(session.userId),

            new AccessToken(session.accessToken),
            new RefreshToken(session.refreshToken),

            session.createdAt,
            session.updatedAt,
        );
    }
}

export default SessionDbMapper;
