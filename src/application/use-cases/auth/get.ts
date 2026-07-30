import * as authProto from "../../../contracts/proto/auth";
import UserRepository from "../../../domain/repositories/user.repository";
import UserEntity from "../../../domain/entities/user.entity";

export class GetUseCase {
    constructor(
        private readonly userRepository: UserRepository,
    ) {
    }

    async execute(id: string, jwt: string): Promise<UserEntity> {
        const user = await this.userRepository.findById(id);

        if (!user) {
            throw new Error("User does not exist");
        }

        return user;
    }
}


export default GetUseCase;

