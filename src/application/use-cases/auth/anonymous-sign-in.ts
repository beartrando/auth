import * as authProto from "../../../contracts/proto/auth";
import DeviceRepository from "../../../domain/repositories/device.repository";
import UserRepository from "../../../domain/repositories/user.repository";
import DeviceId from "../../../domain/value-objects/device-id.vo";
import Auth from "../../../domain/value-objects/auth.vo";
import UserEntity from "../../../domain/entities/user.entity";
import AccessToken from "../../../domain/value-objects/access-token.vo";
import RefreshToken from "../../../domain/value-objects/refresh-token.vo";

export class AnonymousSignInUseCase {

    constructor(
        private readonly userRepository: UserRepository,
        private readonly deviceRepository: DeviceRepository,
    ) {
    }

    async execute(deviceId: DeviceId): Promise<Auth> {
        const device = await this.deviceRepository.findByDeviceId(deviceId);

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

        return new Auth(new AccessToken(accessToken), new RefreshToken(refreshToken));
    }
}

export default AnonymousSignInUseCase;
