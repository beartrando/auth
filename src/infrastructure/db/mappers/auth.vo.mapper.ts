import {Session} from "@prisma/client";
import AuthObject from "../../../domain/auth/value-objects/auth-object.vo";
import SessionAccessToken from "../../../domain/session/value-objects/session-access-token.vo";
import SessionRefreshToken from "../../../domain/session/value-objects/sesion-refresh-token.vo";

export class AuthDbMapper {
    static toDomain(session: Session): AuthObject {
        return new AuthObject(
            new SessionAccessToken(session.accessToken),
            new SessionRefreshToken(session.refreshToken),
        );
    }

}

export default AuthDbMapper;
