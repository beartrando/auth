import SessionId from "./value-objects/session-id.vo";
import UserId from "../user/value-objects/user-id.vo";
import SessionAccessToken from "./value-objects/session-access-token.vo";
import SessionRefreshToken from "./value-objects/sesion-refresh-token.vo";

type SessionEntityProps = {
    id?: SessionId;
    userId: UserId;
    accessToken: SessionAccessToken;
    refreshToken: SessionRefreshToken;
    createdAt?: Date;
    updatedAt?: Date;
};

export class SessionEntity {
    constructor(
        readonly id: SessionId,
        readonly userId: UserId,
        public accessToken: SessionAccessToken,
        public refreshToken: SessionRefreshToken,
        readonly createdAt: Date,
        readonly updatedAt: Date,
    ) {
    }

    static create(
        props: SessionEntityProps,
    ): SessionEntity {
        const now = new Date();

        return new SessionEntity(
            props.id ?? SessionId.create(),
            props.userId,
            props.accessToken,
            props.refreshToken,
            props.createdAt ?? now,
            props.updatedAt ?? now,
        );
    }

}

export default SessionEntity;
