import {PrismaClient} from "@prisma/client";

import UserRepository from "../../../domain/repositories/user.repository";
import UserEntity from "../../../domain/entities/user.entity";

import Id from "../../../domain/value-objects/id.vo";
import UserDbMapper from "../mappers/user.mapper";

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

        return UserDbMapper.toEntity(user);
    }

    async save(
        user: UserEntity,
    ): Promise<void> {

        const userDb = UserDbMapper.toPersistence(user);

        await this.prisma.user.upsert({
            where: {
                id: userDb.id,
            },
            create: userDb,
            update: {
                email: userDb.email,
                // passwordHash: userDb.passwordHash,
                googleId: userDb.googleId,

                lastLoginAt: userDb.lastLoginAt,
                lastActiveAt: userDb.lastActiveAt,
            },
        });
    }
}

export default PrismaUserRepository;