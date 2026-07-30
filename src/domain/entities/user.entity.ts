import Id from "../value-objects/id.vo";
import Email from "../value-objects/email.vo";

export class UserEntity {
    constructor(
        readonly id: Id,

        readonly email: Email | null,
        // readonly passwordHash: string | null,
        readonly googleId: string | null,

        readonly lastLoginAt: Date | null,
        readonly lastActiveAt: Date | null,

        readonly createdAt: Date,
        readonly updatedAt: Date,
    ) {
    }
}

export default UserEntity;
