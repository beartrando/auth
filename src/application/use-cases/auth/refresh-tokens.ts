import AuthService from "../../../infrastructure/auth/auth-service";
import PrismaSessionRepository from "../../../infrastructure/db/repositories/prisma-session.repository";

import RefreshToken from "../../../domain/value-objects/refresh-token.vo";
import Auth from "../../../domain/value-objects/auth.vo";
import Id from "../../../domain/value-objects/id.vo";

export class RefreshTokensUseCase {

    constructor(
        private readonly authService: AuthService,
        private readonly sessionRepository: PrismaSessionRepository,
    ) {
    }

    async execute(
        userId: Id,
        refreshToken: RefreshToken,
    ): Promise<Auth> {

        const session = await this.sessionRepository.findByRefreshToken(
            refreshToken,
        );

        if (
            !session ||
            !session.userId.equals(userId)
        ) {
            throw new Error("Invalid refresh token");
        }

        const newAccessToken = this.authService.generateAccessToken(
            userId,
        );

        const newRefreshToken = this.authService.generateRefreshToken(
            userId,
        );

        session.accessToken = newAccessToken;
        session.refreshToken = newRefreshToken;

        await this.sessionRepository.save(
            session,
        );

        return new Auth(
            newAccessToken,
            newRefreshToken,
        );
    }
}

export default RefreshTokensUseCase;
