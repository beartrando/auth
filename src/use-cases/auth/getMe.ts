import * as authProto from "../../contracts/proto/auth";

export class GetMeUseCase {
    async execute(jwt: string): Promise<authProto.UserObject> {
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


const getMeUseCase = new GetUseMeCase();

export default getMeUseCase;

