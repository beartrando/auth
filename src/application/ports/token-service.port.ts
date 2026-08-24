import SessionAccessToken from "../../domain/session/value-objects/session-access-token.vo";
import SessionRefreshToken from "../../domain/session/value-objects/sesion-refresh-token.vo";
import UserId from "../../domain/user/value-objects/user-id.vo";

export interface TokenService {
    generateAccessToken(
        userId: UserId,
    ): SessionAccessToken;

    generateRefreshToken(
        userId: UserId,
    ): SessionRefreshToken;

    verifyAccessToken(
        token: SessionAccessToken,
    ): UserId;

    verifyRefreshToken(
        token: SessionRefreshToken,
    ): UserId;
}

export default TokenService;
