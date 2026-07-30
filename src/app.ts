import logger from "@shared/logger";

import GrpcService from "./infrastructure/grpc/grpc.service";
import DbService from "./infrastructure/db/db.service";
import JobService from "./infrastructure/job/job.service";
import MessageService from "./infrastructure/message/message.service";

import PrismaDeviceRepository from "./infrastructure/db/repositories/prisma-device.repository";
import AnonymousSignInUseCase from "./use-cases/auth/anonymous-sign-in";

const dbService = buildDbService();
const jobService = buildJobService();
const messageService = buildMessageService();
const grpcService = buildGrpcService();
function buildGrpcService() {

    const deviceRepository = new PrismaDeviceRepository(
        dbService.client,
    );

    const anonymousSignInUseCase = new AnonymousSignInUseCase(
        deviceRepository,
    );
    return {
        anonymousSignInUseCase,
    };

}

async function bootstrap(): Promise<void> {

    try {
        await dbService.init();
        await jobService.init();
        await messageService.init();
        await grpcService.init(buildGrpcDependencies());
        logger.info(
            '🚀 Auth service started',
        );
    } catch (err) {
        logger.error(
            {err},
            '💥 Failed to start Auth',
        );
        process.exit(1);
    }

    process.on(
        'SIGINT',
        async () => {
            logger.info(
                '🛑 Shutting down...',
            );

            await grpcService.stop();
            await dbService.stop();
            await jobService.stop();
            await messageService.stop();

            process.exit(0);
        },
    );
}

bootstrap();