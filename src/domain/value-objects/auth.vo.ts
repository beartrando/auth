import AccessToken from "./access-token.vo";
import RefreshToken from "./refresh-token.vo";

export class Auth {
    constructor(
        readonly accessToken: AccessToken,
        readonly refreshToken: RefreshToken,
    ) {}

    static create(
        accessToken: string,
        refreshToken: string,
    ): Auth {
        return new Auth(
            new AccessToken(accessToken),
            new RefreshToken(refreshToken),
        );
    }
}

export default Auth;
