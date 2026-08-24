import PrismaSessionRepository from "../../../infrastructure/db/repositories/prisma-session.repository";
import UserId from "../../../domain/user/value-objects/user-id.vo";

export class LogoutUseCase {
    constructor(
        private readonly sessionRepository: PrismaSessionRepository,
    ) {
    }

    async execute(
        userId: UserId,
    ): Promise<void> {
        await this.sessionRepository.deleteByUserId(userId);
    }
}


export default LogoutUseCase;

