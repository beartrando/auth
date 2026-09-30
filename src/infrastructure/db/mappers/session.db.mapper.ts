import {Session} from "@prisma/client";
import SessionEntity from "../../../domain/session/session.entity";
import SessionAccessToken from "../../../domain/session/value-objects/session-access-token.vo";
import SessionRefreshToken from "../../../domain/session/value-objects/sesion-refresh-token.vo";
import SessionId from "../../../domain/session/value-objects/session-id.vo";
import UserId from "../../../domain/user/value-objects/user-id.vo";

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

    static toDomain(session: Session): SessionEntity {
        return new SessionEntity(
            new SessionId(session.id),

            new UserId(session.userId),

            new SessionAccessToken(session.accessToken),
            new SessionRefreshToken(session.refreshToken),

            session.createdAt,
            session.updatedAt,
        );
    }
}

export default SessionDbMapper;
