import {LiveStatus} from "../../infrastructure/grpc/generated/common/health";

export class GetUseCase {
    async execute(): Promise<LiveStatus> {
        // return async (id: string) => {
        //     const user = await prisma.user.findUnique({
        //         where: {id},
        //     });
        //
        //     if (!user) {
        //         throw new Error("User does not exist");
        //     }
        //
        //     return user;
        // };
    }
}


const getUseCase = new GetUseCase();

export default getUseCase;

