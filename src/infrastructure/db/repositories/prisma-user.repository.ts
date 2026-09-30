import {PrismaClient} from "@prisma/client";

import UserRepository from "../../../domain/user/user.repository";
import UserEntity from "../../../domain/user/user.entity";

import UserDbMapper from "../mappers/user.db.mapper";
import UserId from "../../../domain/user/value-objects/user-id.vo";

export class PrismaUserRepository implements UserRepository {

    constructor(
        private readonly prisma: PrismaClient,
    ) {
    }

    async findById(
        id: UserId,
    ): Promise<UserEntity | null> {

        const user = await this.prisma.user.findUnique({
            where: {
                id: id.value,
            },
        });

        if (!user) {
            return null;
        }

        return UserDbMapper.toDomain(user);
    }

    async save(
        user: UserEntity,
    ): Promise<UserEntity> {

        const userDb = UserDbMapper.toPersistence(user);

        const {
            id,
            ...update
        } = userDb;

        const result = await this.prisma.user.upsert({
            where: {
                id: userDb.id,
            },
            create: userDb,
            update,
        });

        return UserDbMapper.toDomain(result);
    }
}

export default PrismaUserRepository;
