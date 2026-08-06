import {Session} from "@prisma/client";
import Auth from "../../../domain/value-objects/auth.vo";
import AccessToken from "../../../domain/value-objects/session/access-token.vo";
import RefreshToken from "../../../domain/value-objects/session/refresh-token.vo";

export class AuthDbMapper {
    static toDomain(session: Session): Auth {
        return new Auth(
            new AccessToken(session.accessToken),
            new RefreshToken(session.refreshToken),
        );
    }

}

export default AuthDbMapper;
