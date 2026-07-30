import {User} from "@prisma/client";
import UserEntity from "../../../domain/entities/user.entity";
import Id from "../../../domain/value-objects/id.vo";
import Email from "../../../domain/value-objects/email.vo";

type UserSaveData = Omit<
    User,
    "createdAt" | "updatedAt" | "passwordHash"
>;
type UserRegistrationData = Omit<
    User,
    "createdAt" | "updatedAt"
>;

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

    static toEntity(user: User): UserEntity {
        return new UserEntity(
            new Id(user.id),
            user.email ? new Email(user.email) : null,
            user.googleId,
            user.lastLoginAt,
            user.lastActiveAt,
            user.createdAt,
            user.updatedAt,
        );
    }
}

export default UserDbMapper;
