import AuthService from "../../../infrastructure/auth/auth-service";
import PrismaSessionRepository from "../../../infrastructure/db/repositories/prisma-session.repository";
import AccessToken from "../../../domain/value-objects/access-token.vo";
import Id from "../../../domain/value-objects/id.vo";

export class LogoutUseCase {
    constructor(
        private readonly jwtService: AuthService,
        private readonly sessionRepository: PrismaSessionRepository,
    ) {
    }

    async execute(
        accessToken: AccessToken,
    ): Promise<void> {

        const userId: Id = this.jwtService.verifyAccessToken(accessToken);

        await this.sessionRepository.deleteByUserId(userId);
    }
}


export default LogoutUseCase;

