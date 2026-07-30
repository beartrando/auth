import * as authProto from "../../../contracts/proto/auth";
import prismaDeviceRepository from "../../../infrastructure/db/repositories/prisma-device.repository";
import DeviceRepository from "../../../domain/repositories/device.repository";
import UserRepository from "../../../domain/repositories/user.repository";

export class AnonymousSignInUseCase {

    constructor(
        private readonly userRepository: UserRepository,
        private readonly deviceRepository: DeviceRepository,
    ) {}

    async execute(deviceId: string): Promise<authProto.AuthObject> {
        const device = await prismaDeviceRepository.findByDeviceId(deviceId);

        // let device = await prisma.device.findUnique({
        //     where: {deviceId},
        //     include: {user: true},
        // });
        //
        // let user;
        //
        // if (!device) {
        //     user = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
        //         const newUser = await tx.user.create({
        //             data: {
        //                 // email: randomUUID(),
        //                 devices: {
        //                     create: {deviceId},
        //                 },
        //             },
        //         });
        //
        //         await pgBossManager.queue.enqueueTx(kafkaProducersConfig.userCreated, newUser, tx);
        //
        //         return newUser;
        //     });
        //
        //     // const newUser = user = await prisma.user.create({
        //     //   data: {
        //     //     email: randomUUID(),
        //     //     devices: {
        //     //       create: {deviceId},
        //     //     },
        //     //   },
        //     // });
        //     //
        //     // await pgBossManager.queue.enqueueTx(kafkaProducersConfig.userCreated, {userId: newUser.id});
        //     // user = newUser;
        // } else {
        //     user = device.user;
        // }
        //
        // const accessToken = generateAccessToken(user.id);
        // const refreshToken = generateRefreshToken(user.id);
        //
        // await prisma.session.deleteMany({where: {userId: user.id}});
        // await prisma.session.create({data: {userId: user.id, accessToken, refreshToken}});
        //
        const accessToken = '';
        const refreshToken = '';

        return authProto.AuthObject.create({accessToken, refreshToken});
    }
}

export default AnonymousSignInUseCase;
