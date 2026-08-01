import Id from "../../domain/value-objects/id.vo";
import AccessToken from "../../domain/value-objects/access-token.vo";
import RefreshToken from "../../domain/value-objects/refresh-token.vo";

export interface TokenService {
    generateAccessToken(
        userId: Id,
    ): AccessToken;

    generateRefreshToken(
        userId: Id,
    ): RefreshToken;

    verifyAccessToken(
        token: AccessToken,
    ): Id;

    verifyRefreshToken(
        token: RefreshToken,
    ): Id;
}

export default TokenService;
