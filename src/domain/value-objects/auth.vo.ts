import AccessToken from "./access-token.vo";
import RefreshToken from "./refresh-token.vo";

export class Auth {
    constructor(
        readonly accessToken: AccessToken,
        readonly refreshToken: RefreshToken,
    ) {
    }
}

export default Auth;
