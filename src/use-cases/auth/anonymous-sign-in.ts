import * as authProto from "../../contracts/proto/auth";

export class AnonymousSignInUseCase {
    async execute(deviceId: string): Promise<authProto.AuthObject> {
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


const anonymousSignInUseCase = new AnonymousSignInUseCase();

export default anonymousSignInUseCase;

