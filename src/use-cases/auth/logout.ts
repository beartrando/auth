import * as emptyProto from "../../contracts/proto/common/empty";

export class LogoutUseCase {
    async execute(jwt: string): Promise<emptyProto.Empty> {
        //     // удаляем все сессии пользователя
        //     await prisma.session.deleteMany({
        //         where: {userId},
        //     });
        //
        return {};
    }
}


const logoutUseCase = new LogoutUseCase();

export default logoutUseCase;

