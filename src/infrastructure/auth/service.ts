import jwt, {JwtPayload, SignOptions} from "jsonwebtoken";
import config from "./config";

import AccessToken from "../../domain/value-objects/access-token.vo";
import RefreshToken from "../../domain/value-objects/refresh-token.vo";

import TokenService from "../../application/ports/token-service.port";
import Id from "../../domain/value-objects/id.vo";


interface TokenPayload extends JwtPayload {
    sub: string;
}

export interface AuthConfig {
    accessSecret: jwt.Secret;
    accessTokenExpiresIn: SignOptions["expiresIn"];
    refreshSecret: jwt.Secret;
    refreshTokenExpiresIn: SignOptions["expiresIn"];
}

export class AuthService implements TokenService {
    constructor(private readonly config: AuthConfig) {}

    generateAccessToken(
        userId: Id,
    ): AccessToken {

        const token = jwt.sign(
            {},
            this.accessSecret,
            {
                ...accessTokenOptions,
                subject: userId.value,
            },
        );

        return new AccessToken(token);
    }

    generateRefreshToken(
        userId: Id,
    ): RefreshToken {

        const token = jwt.sign(
            {},
            this.refreshSecret,
            {
                ...refreshTokenOptions,
                subject: userId.value,
            },
        );

        return new RefreshToken(token);
    }


    verifyAccessToken(
        token: AccessToken,
    ): Id {
        const payload = this.payload(token.value, this.accessSecret);

        return new Id(payload.sub);
    }


    verifyRefreshToken(
        token: RefreshToken,
    ): Id {
        const payload = this.payload(token.value, this.refreshSecret);

        return new Id(payload.sub);
    }

    private payload(
        token: string,
        secret: jwt.Secret,
    ): TokenPayload {
        const payload = jwt.verify(token, secret) as TokenPayload;

        if (!payload.sub) {
            throw new Error("JWT payload missing sub");
        }

        return payload;
    }
}

export default AuthService;
