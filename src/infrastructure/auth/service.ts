import jwt from "jsonwebtoken";

import SessionAccessToken from "../../domain/session/value-objects/session-access-token.vo";
import SessionRefreshToken from "../../domain/session/value-objects/sesion-refresh-token.vo";

import TokenService from "../../application/ports/token-service.port";
import AuthConfig from "./interfaces/auth-config";
import TokenPayload from "./interfaces/token-payload";
import UserId from "../../domain/user/value-objects/user-id.vo";
import logger from "@shared/logger";
import {TokenExpiredError} from "@shared/errors";


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

        logger.log(this.config.accessTokenExpiresIn);

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
        const payload = this.payload(token, this.config.accessSecret);

        return new UserId(payload.sub);
    }

    verifyRefreshToken(token: SessionRefreshToken): UserId {
        const payload = this.payload(token, this.config.refreshSecret);

        return new UserId(payload.sub);
    }

    private payload(
        token: SessionAccessToken,
        secret: jwt.Secret,
    ): TokenPayload {
        try {
            const payload = jwt.verify(token.value, secret) as TokenPayload;

            if (!payload.sub) {
                throw new Error("JWT payload missing sub");
            }

            return payload;
        } catch (e) {
            if (e instanceof jwt.TokenExpiredError) {
                throw new TokenExpiredError();
            }

            throw e;
        }
    }
}

export default AuthService;
