import * as authProto from "../../../contracts/proto/auth";
import UserEntity from "../../../domain/entities/user.entity";
import Email from "../../../domain/value-objects/email.vo";
import Id from "../../../domain/value-objects/id.vo";

export class UserGrpcMapper {
    static toGrpc(user: UserEntity): authProto.UserObject {

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

    static toEntity(user: authProto.UserObject): UserEntity {

        return UserEntity.create({
            id: new Id(user.id),
            email: user.email ? new Email(user.email) : null,
            googleId: user.googleId,
            lastLoginAt: user.lastLoginAt,
            lastActiveAt: user.lastActiveAt,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        });
    }

}

export default UserGrpcMapper;
