import jwt, {SignOptions} from "jsonwebtoken";
import config from "./config";

import Id from "../../domain/value-objects/id";
import AccessToken from "../../domain/value-objects/access-token.vo";
import RefreshToken from "../../domain/value-objects/refresh-token.vo";

import TokenService from "../../application/ports/token-service.port";


const accessTokenOptions: SignOptions = {
    expiresIn: config.accessTokenExpiresIn as any,
};

const refreshTokenOptions: SignOptions = {
    expiresIn: config.refreshTokenExpiresIn as any,
};


export class AuthService implements TokenService {

    userIdFromJwt(token: string): string {

        const payload = jwt.verify(token, config.jwtAccessSecret) as { sub: string };
        if (!payload.sub) {
            throw new Error('JWT payload missing sub');
        }

        return payload.sub;
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
}

export default JwtTokenGenerator;


// import jwt, {JwtPayload, SignOptions} from 'jsonwebtoken';
// import config from '../config/config';
//
// const accessTokenOptions: SignOptions = {
//     expiresIn: config.accessTokenExpiresIn as any,
// };
//
// const refreshTokenOptions: SignOptions = {
//     expiresIn: config.refreshTokenExpiresIn as any,
// };
//
// interface TokenPayload extends JwtPayload {
//     sub: string;
// }
//
// export const generateAccessToken = (userId: string): string => {
//     return jwt.sign({}, config.jwtAccessSecret, {
//         ...refreshTokenOptions,
//         subject: userId,
//     });
// };
//
// export const generateRefreshToken = (userId: string): string => {
//     return jwt.sign({}, config.jwtRefreshSecret, {
//         ...refreshTokenOptions,
//         subject: userId,
//     });
// };
//
// export const verifyAccessToken = (token: string): TokenPayload => {
//     const payload = jwt.verify(token, config.jwtAccessSecret) as TokenPayload;
//     if (!payload.sub) throw new Error('Access token missing sub');
//     return payload;
// };
//
// export const verifyRefreshToken = (token: string): TokenPayload => {
//     const payload = jwt.verify(token, config.jwtRefreshSecret) as TokenPayload;
//     if (!payload.sub) throw new Error('Refresh token missing sub');
//     return payload;
// };
