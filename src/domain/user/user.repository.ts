import UserId from "./value-objects/user-id.vo";
import UserEntity from "./user.entity";

export interface UserRepository {
    findById(id: UserId): Promise<UserEntity | null>;

    save(user: UserEntity): Promise<UserEntity>;
}

export default UserRepository;
