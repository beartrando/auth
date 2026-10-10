import UserRepository from "../../../domain/user/user.repository";
import UserEntity from "../../../domain/user/user.entity";
import UserId from "../../../domain/user/value-objects/user-id.vo";

export class GetUserUseCase {
    constructor(
        private readonly userRepository: UserRepository,
    ) {
    }

    async execute(userId: UserId): Promise<UserEntity> {
        const user = await this.userRepository.findById(userId);

        if (!user) {
            throw new Error("User does not exist");
        }

        return user;
    }
}


export default GetUserUseCase;
