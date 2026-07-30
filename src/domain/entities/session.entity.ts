import Id from "../value-objects/id.vo";
import AccessToken from "../value-objects/access-token.vo";
import RefreshToken from "../value-objects/refresh-token.vo";

type SessionEntityProps = {
    id?: Id;
    userId: Id;
    accessToken: AccessToken;
    refreshToken: RefreshToken;
    createdAt?: Date;
    updatedAt?: Date;
};

export class SessionEntity {
    constructor(
        readonly id: Id,
        readonly userId: Id,
        public accessToken: AccessToken,
        public refreshToken: RefreshToken,
        readonly createdAt: Date,
        readonly updatedAt: Date,
    ) {
    }

    static create(
        props: SessionEntityProps,
    ): SessionEntity {
        const now = new Date();

        return new SessionEntity(
            props.id ?? Id.create(),
            props.userId,
            props.accessToken,
            props.refreshToken,
            props.createdAt ?? now,
            props.updatedAt ?? now,
        );
    }

}

export default SessionEntity;
