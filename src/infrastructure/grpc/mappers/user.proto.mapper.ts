import * as authProto from "../../../contracts/proto/auth";
import UserEntity from "../../../domain/user/user.entity";
import UserEmail from "../../../domain/user/value-objects/user-email.vo";
import UserId from "../../../domain/user/value-objects/user-id.vo";

export class UserProtoMapper {
    static toProto(user: UserEntity): authProto.UserObject {

        return authProto.UserObject.create({
            id: user.id.value,
            email: user.email?.value ?? "",
            googleId: user.googleId ?? '',
            lastLoginAt: user.lastLoginAt ?? undefined,
            lastActiveAt: user.lastActiveAt ?? undefined,
            createdAt: user.createdAt ?? undefined,
            updatedAt: user.updatedAt ?? undefined,
        });
    }

    static toDomain(user: authProto.UserObject): UserEntity {

        return UserEntity.create({
            id: new UserId(user.id),
            email: user.email ? new UserEmail(user.email) : null,
            googleId: user.googleId,
            lastLoginAt: user.lastLoginAt,
            lastActiveAt: user.lastActiveAt,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        });
    }

}

export default UserProtoMapper;
