import * as authProto from "../../contracts/proto/auth";

export class GetUseCase {
    async execute(id: string, jwt: string): Promise<authProto.UserObject> {
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

