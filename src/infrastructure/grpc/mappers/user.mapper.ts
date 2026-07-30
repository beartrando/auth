import * as authProto from "../../../contracts/proto/auth";
import UserEntity from "../../../domain/entities/user.entity";
import Email from "../../../domain/value-objects/email.vo";
import Id from "../../../domain/value-objects/id.vo";

export class UserProtoMapper {
    static to(user: UserEntity): authProto.UserObject {

        return {
            id: user.id.value,
            email: user.email.value ?? '',
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        };
    }

    static from(user: authProto.UserObject): UserEntity {

        return new UserEntity(
            new Id(user.id),
            new Email(user.email),
            user.createdAt,
            user.updatedAt,
        );
    }

}

export default UserProtoMapper;
