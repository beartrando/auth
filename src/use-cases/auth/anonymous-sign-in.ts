import {LiveStatus} from "../../infrastructure/grpc/generated/common/health";
import {Prisma} from "@prisma/client";
import pgBossManager from "@shared/pg-boss-manager";
import {kafkaProducersConfig} from "../../config/kafka.config";
import {generateAccessToken, generateRefreshToken} from "../../utils/token";

export class AnonymousSignInUseCase {
    async execute(deviceId: string): Promise<LiveStatus> {
        let device = await prisma.device.findUnique({
            where: {deviceId},
            include: {user: true},
        });

        let user;

        if (!device) {
            user = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
                const newUser = await tx.user.create({
                    data: {
                        // email: randomUUID(),
                        devices: {
                            create: {deviceId},
                        },
                    },
                });

                await pgBossManager.queue.enqueueTx(kafkaProducersConfig.userCreated, newUser, tx);

                return newUser;
            });

            // const newUser = user = await prisma.user.create({
            //   data: {
            //     email: randomUUID(),
            //     devices: {
            //       create: {deviceId},
            //     },
            //   },
            // });
            //
            // await pgBossManager.queue.enqueueTx(kafkaProducersConfig.userCreated, {userId: newUser.id});
            // user = newUser;
        } else {
            user = device.user;
        }

        const accessToken = generateAccessToken(user.id);
        const refreshToken = generateRefreshToken(user.id);

        await prisma.session.deleteMany({where: {userId: user.id}});
        await prisma.session.create({data: {userId: user.id, accessToken, refreshToken}});

        return {accessToken, refreshToken};
    }
}


const anonymousSignInUseCase = new AnonymousSignInUseCase();

export default anonymousSignInUseCase;

