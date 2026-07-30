import Id from "../value-objects/id.vo";
import AccessToken from "../value-objects/access-token.vo";
import RefreshToken from "../value-objects/refresh-token.vo";

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
}

export default SessionEntity;
