import * as authProto from "../../contracts/proto/auth";
import {User} from "@prisma/client";
import UserEntity from "../../domain/entities/user.entity";

export function toProto(user: UserEntity): authProto.UserObject {

    return {
        id: user.id,
        email: user.email || '',
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
    };
}

export function toPrisma(user: UserEntity): User {
    return {
        id: user.id,
        email: user.email,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
    };
}
