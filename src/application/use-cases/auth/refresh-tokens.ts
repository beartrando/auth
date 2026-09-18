import AuthService from "../../../infrastructure/auth/service";
import PrismaSessionRepository from "../../../infrastructure/db/repositories/prisma-session.repository";

import SessionRefreshToken from "../../../domain/session/value-objects/sesion-refresh-token.vo";
import UserId from "../../../domain/user/value-objects/user-id.vo";
import SessionEntity from "../../../domain/session/session.entity";

export class RefreshTokensUseCase {

    constructor(
        private readonly authService: AuthService,
        private readonly sessionRepository: PrismaSessionRepository,
    ) {
    }

    async execute(
        userId: UserId,
        refreshToken: SessionRefreshToken,
    ): Promise<SessionEntity> {

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

        return session;
    }
}

export default RefreshTokensUseCase;
