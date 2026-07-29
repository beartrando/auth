import * as authProto from "../../contracts/proto/auth";

import {User} from "@prisma/client";

export function userToProto(user: User): authProto.UserObject {

    return {
        id: user.id,
        email: user.email || '',
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
    };
}

export function userToPrisma(user: authProto.UserObject) {
    return {
        id: user.id,
        email: user.email,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
    };
}