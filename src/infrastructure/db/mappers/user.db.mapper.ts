import {User} from "@prisma/client";
import UserEntity from "../../../domain/user/user.entity";
import UserEmail from "../../../domain/user/value-objects/user-email.vo";
import UserId from "../../../domain/user/value-objects/user-id.vo";

type UserSaveData = Omit<
    User,
    "createdAt" | "updatedAt" | "passwordHash"
>;
// type UserRegistrationData = Omit<
//     User,
//     "createdAt" | "updatedAt"
// >;

export class UserDbMapper {
    static toPersistence(user: UserEntity): UserSaveData {
        return {
            id: user.id.value,
            email: (user.email?.value ?? null),
            googleId: user.googleId,
            lastLoginAt: user.lastLoginAt,
            lastActiveAt: user.lastActiveAt,
        };
    }

    static toDomain(user: User): UserEntity {
        return new UserEntity(
            new UserId(user.id),
            user.email ? new UserEmail(user.email) : null,
            user.googleId,
            user.lastLoginAt,
            user.lastActiveAt,
            user.createdAt,
            user.updatedAt,
        );
    }
}

export default UserDbMapper;
