import jwt, {SignOptions} from "jsonwebtoken";

export interface AuthConfig {
    accessSecret: jwt.Secret;
    accessTokenExpiresIn: SignOptions["expiresIn"];
    refreshSecret: jwt.Secret;
    refreshTokenExpiresIn: SignOptions["expiresIn"];
}

export default AuthConfig;
