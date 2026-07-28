import {LiveStatus} from "../../infrastructure/grpc/generated/common/health";

export class LogoutUseCase {
    async execute(): Promise<LiveStatus> {
        // return async (userId: string) => {
        //     // удаляем все сессии пользователя
        //     await prisma.session.deleteMany({
        //         where: {userId},
        //     });
        //
        //     return {};
        // };
    }
}


const logoutUseCase = new LogoutUseCase();

export default logoutUseCase;

