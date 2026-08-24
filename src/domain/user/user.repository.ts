import UserEntity from "../entities/user.entity";
import UserId from "./value-objects/user-id.vo";

export interface UserRepository {
    findById(id: UserId): Promise<UserEntity | null>;

    save(user: UserEntity): Promise<UserEntity>;
}

export default UserRepository;
