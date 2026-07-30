import Id from "../value-objects/id.vo";
import Email from "../value-objects/email.vo";

type UserEntityProps = {
    id?: Id;
    email?: Email | null;
    googleId?: string | null;
    lastLoginAt?: Date | null;
    lastActiveAt?: Date | null;
    createdAt?: Date;
    updatedAt?: Date;
};

export class UserEntity {
    constructor(
        readonly id: Id,
        readonly email: Email | null,
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
            props.id ?? Id.create(),
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
