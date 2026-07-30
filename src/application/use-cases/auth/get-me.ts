import * as authProto from "../../../contracts/proto/auth";
import UserRepository from "../../../domain/repositories/user.repository";
import UserEntity from "../../../domain/entities/user.entity";
import JwtService from "../../../infrastructure/auth/jwt-service";
import AccessToken from "../../../domain/value-objects/access-token.vo";

export class GetMeUseCase {
    constructor(
        private readonly userRepository: UserRepository,
        private readonly jwtService: JwtService,
    ) {
    }

    async execute(jwt: AccessToken): Promise<UserEntity> {

        const userId = this.jwtService.verifyAccessToken(jwt)

        const user = await this.userRepository.findById(userId);

        if (!user) {
            throw new Error("User does not exist");
        }

        return user;
    }
}


export default GetMeUseCase;

