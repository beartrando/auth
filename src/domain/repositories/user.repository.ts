import UserEntity from "../entities/user.entity";
import Id from "../value-objects/id.vo";

export interface UserRepository {
    findById(id: Id): Promise<UserEntity | null>;

    save(user: UserEntity): Promise<UserEntity>;
}

export default UserRepository;
