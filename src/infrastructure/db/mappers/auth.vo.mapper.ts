import {Session} from "@prisma/client";
import Auth from "../../../domain/value-objects/auth.vo";
import AccessToken from "../../../domain/value-objects/access-token.vo";
import RefreshToken from "../../../domain/value-objects/refresh-token.vo";

export class AuthDbMapper {
    static toEntity(session: Session): Auth {
        return new Auth(
            new AccessToken(session.accessToken),
            new RefreshToken(session.refreshToken),
        );
    }

}

export default AuthDbMapper;
