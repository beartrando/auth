import UserRepository from "../../../domain/repositories/user.repository";
import UserEntity from "../../../domain/entities/user.entity";
import AuthService from "../../../infrastructure/auth/auth-service";
import AccessToken from "../../../domain/value-objects/access-token.vo";

export class GetMeUseCase {
    constructor(
        private readonly userRepository: UserRepository,
        private readonly authService: AuthService,
    ) {
    }

    async execute(accessToken: AccessToken): Promise<UserEntity> {

        const userId = this.authService.verifyAccessToken(accessToken)

        const user = await this.userRepository.findById(userId);

        if (!user) {
            throw new Error("User does not exist");
        }

        return user;
    }
}


export default GetMeUseCase;

