import jwt, {JwtPayload, SignOptions} from "jsonwebtoken";
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

    private readonly accessSecret: jwt.Secret = config.jwtAccessSecret;
    private readonly refreshSecret: jwt.Secret = config.jwtRefreshSecret;

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
        return this.payload(token.value, this.accessSecret);
    }


    verifyRefreshToken(
        token: RefreshToken,
    ): Id {
        return this.payload(token.value, this.refreshSecret);
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

export default JwtService;
