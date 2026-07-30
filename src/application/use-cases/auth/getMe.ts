import * as authProto from "../../../contracts/proto/auth";
import UserRepository from "../../../domain/repositories/user.repository";

export class GetMeUseCase {
    constructor(
        private readonly userRepository: UserRepository,
    ) {
    }

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


export default GetUseMeCase;

