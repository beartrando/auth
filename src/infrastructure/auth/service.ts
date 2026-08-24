import jwt from "jsonwebtoken";

import SessionAccessToken from "../../domain/session/value-objects/session-access-token.vo";
import SessionRefreshToken from "../../domain/session/value-objects/sesion-refresh-token.vo";

import TokenService from "../../application/ports/token-service.port";
import AuthConfig from "./interfaces/auth-config";
import TokenPayload from "./interfaces/token-payload";
import UserId from "../../domain/user/value-objects/user-id.vo";


export class AuthService implements TokenService {
    constructor(private readonly config: AuthConfig) {
    }

    generateAccessToken(userId: UserId): SessionAccessToken {
        const token = jwt.sign(
            {},
            this.config.accessSecret,
            {
                expiresIn: this.config.accessTokenExpiresIn,
                subject: userId.value,
            },
        );

        return new SessionAccessToken(token);
    }

    generateRefreshToken(userId: UserId): SessionRefreshToken {
        const token = jwt.sign(
            {},
            this.config.refreshSecret,
            {
                expiresIn: this.config.refreshTokenExpiresIn,
                subject: userId.value,
            },
        );

        return new SessionRefreshToken(token);
    }

    verifyAccessToken(token: SessionAccessToken): UserId {
        const payload = this.payload(token.value, this.config.accessSecret);

        return new UserId(payload.sub);
    }

    verifyRefreshToken(token: SessionRefreshToken): UserId {
        const payload = this.payload(token.value, this.config.refreshSecret);

        return new UserId(payload.sub);
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
