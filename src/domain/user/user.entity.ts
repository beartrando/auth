import UserId from "./value-objects/user-id.vo";
import UserEmail from "./value-objects/user-email.vo";

type UserEntityProps = {
    id?: UserId;
    email?: UserEmail | null;
    googleId?: string | null;
    lastLoginAt?: Date | null;
    lastActiveAt?: Date | null;
    createdAt?: Date;
    updatedAt?: Date;
};

export class UserEntity {
    constructor(
        readonly id: UserId,
        readonly email: UserEmail | null,
        // readonly passwordHash: string | null,
        readonly googleId: string | null,
        readonly lastLoginAt: Date | null,
        readonly lastActiveAt: Date | null,
        readonly createdAt: Date | null,
        readonly updatedAt: Date | null,
    ) {
    }

    static create(
        props: UserEntityProps = {},
    ): UserEntity {
        const now = new Date();

        return new UserEntity(
            props.id ?? UserId.create(),
            props.email ?? null,
            props.googleId ?? null,
            (props.lastLoginAt === undefined ? now : props.lastLoginAt),
            (props.lastActiveAt === undefined ? now : props.lastActiveAt),
            props.createdAt ?? now,
            props.updatedAt ?? now,
        );
    }

}

export default UserEntity;
