import PrismaSessionRepository from "../../../infrastructure/db/repositories/prisma-session.repository";
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

