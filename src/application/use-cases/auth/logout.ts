import AuthService from "../../../infrastructure/auth/auth-service";
import PrismaSessionRepository from "../../../infrastructure/db/repositories/prisma-session.repository";
import AccessToken from "../../../domain/value-objects/access-token.vo";
import Id from "../../../domain/value-objects/id.vo";

export class LogoutUseCase {
    constructor(
        private readonly sessionRepository: PrismaSessionRepository,
    ) {
    }

    async execute(
        userId: Id,
    ): Promise<void> {
        await this.sessionRepository.deleteByUserId(userId);
    }
}


export default LogoutUseCase;

