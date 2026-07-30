import {PrismaClient} from "@prisma/client";

import UserRepository from "../../../domain/repositories/user.repository";
import UserEntity from "../../../domain/entities/user.entity";

import Id from "../../../domain/value-objects/id";
import Email from "../../../domain/value-objects/email.vo";

export class PrismaUserRepository implements UserRepository {

    constructor(
        private readonly prisma: PrismaClient,
    ) {
    }

    async findById(
        id: Id,
    ): Promise<UserEntity | null> {

        const user = await this.prisma.user.findUnique({
            where: {
                id: id.value,
            },
        });

        if (!user) {
            return null;
        }

        return new UserEntity(
            new Id(user.id),

            user.email ? new Email(user.email) : null,
            user.passwordHash,
            user.googleId,

            user.lastLoginAt,
            user.lastActiveAt,

            user.createdAt,
            user.updatedAt,
        );
    }

    async findByEmail(
        email: Email,
    ): Promise<UserEntity | null> {

        const user = await this.prisma.user.findUnique({
            where: {
                email: email.value,
            },
        });

        if (!user) {
            return null;
        }

        return new UserEntity(
            new Id(user.id),

            user.email ? new Email(user.email) : null,
            user.passwordHash,
            user.googleId,

            user.lastLoginAt,
            user.lastActiveAt,

            user.createdAt,
            user.updatedAt,
        );
    }

    async save(
        user: UserEntity,
    ): Promise<void> {

        await this.prisma.user.upsert({
            where: {
                id: user.id.value,
            },
            create: {
                id: user.id.value,

                email: user.email?.value ?? null,
                passwordHash: user.passwordHash,
                googleId: user.googleId,

                lastLoginAt: user.lastLoginAt,
                lastActiveAt: user.lastActiveAt,
            },
            update: {
                email: user.email?.value ?? null,
                passwordHash: user.passwordHash,
                googleId: user.googleId,

                lastLoginAt: user.lastLoginAt,
                lastActiveAt: user.lastActiveAt,
            },
        });
    }
}

export default PrismaUserRepository;