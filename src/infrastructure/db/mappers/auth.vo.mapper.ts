import {Session} from "@prisma/client";
import Auth from "../../../domain/value-objects/auth.vo";

export class AuthDbMapper {
    static toEntity(session: Session): Auth {
        return new Auth(
            new AccessToken(session.accessToken),
            new RefreshToken(session.refreshToken),
        );
    }

}

export default AuthDbMapper;
