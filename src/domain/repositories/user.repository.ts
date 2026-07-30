import UserEntity from "../entities/user.entity";
import Id from "../value-objects/id";
import Email from "../value-objects/email.vo";

export interface UserRepository {
    findById(
        id: Id,
    ): Promise<UserEntity | null>;

    findByEmail(
        email: Email,
    ): Promise<UserEntity | null>;

    save(
        user: UserEntity,
    ): Promise<void>;
}

export default UserRepository;
