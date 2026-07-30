import jwt, { SignOptions,JwtPayload } from "jsonwebtoken";
import config from "./config";

import Id from "../../domain/value-objects/id";
import AccessToken from "../../domain/value-objects/access-token.vo";
import RefreshToken from "../../domain/value-objects/refresh-token.vo";

import TokenService from "../../application/ports/token-service.port";


interface TokenPayload extends JwtPayload {
    sub: string;
}

const accessTokenOptions: SignOptions = {
    expiresIn: config.accessTokenExpiresIn as any,
};

const refreshTokenOptions: SignOptions = {
    expiresIn: config.refreshTokenExpiresIn as any,
};

export class JwtService implements TokenService {

    userIdFromAccessToken(
        token: AccessToken,
    ): Id {

        const payload = this.accessTokenPayload(token};

        return new Id(payload.sub);
    }

    userIdFromRefreshToken(
        token: RefreshToken,
    ): Id {

        const payload = this.refreshTokenPayload(token);

        return new Id(payload.sub);
    }

    generateAccessToken(
        userId: Id,
    ): AccessToken {

        const token = jwt.sign(
            {},
            config.jwtAccessSecret,
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
            config.jwtRefreshSecret,
            {
                ...refreshTokenOptions,
                subject: userId.value,
            },
        );

        return new RefreshToken(token);
    }



    accessTokenPayload(token: AccessToken): TokenPayload {
        const payload = jwt.verify(token, config.jwtAccessSecret) as TokenPayload;
        if (!payload.sub) throw new Error('Access token missing sub');
        return payload;
    }

    refreshTokenPayload(token: RefreshToken): TokenPayload {
        const payload = jwt.verify(token, config.jwtRefreshSecret) as TokenPayload;
        if (!payload.sub) throw new Error('Refresh token missing sub');
        return payload;
    }
}

export default JwtService;
