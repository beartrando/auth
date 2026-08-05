import UserRepository from "../../../domain/repositories/user.repository";
import UserEntity from "../../../domain/entities/user.entity";
import Id from "../../../domain/value-objects/id.vo";

export class GetUserUseCase {
    constructor(
        private readonly userRepository: UserRepository,
    ) {
    }

    async execute(userId: Id): Promise<UserEntity> {
        const user = await this.userRepository.findById(userId);

        if (!user) {
            throw new Error("User does not exist");
        }

        return user;
    }
}


export default GetUserUseCase;

