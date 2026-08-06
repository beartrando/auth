import AccessToken from "./session/access-token.vo";
import RefreshToken from "./session/refresh-token.vo";

export class Auth {
    constructor(
        readonly accessToken: AccessToken,
        readonly refreshToken: RefreshToken,
    ) {
    }
}

export default Auth;
