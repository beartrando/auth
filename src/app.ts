import logger from "@shared/logger";

import {config as kafkaConfig} from "./infrastructure/message/config";
import {config as grpcConfig} from "./infrastructure/grpc/config";
import DbService from "./infrastructure/db/db.service";
import JobService from "./infrastructure/job/job.service";
import MessageService from "./infrastructure/message/message.service";

import PrismaDeviceRepository from "./infrastructure/db/repositories/prisma-device.repository";
import AnonymousSignInUseCase from "./application/use-cases/auth/anonymous-sign-in";
import GrpcService from "./infrastructure/grpc/grpc.service";
import GetUseCase from "./application/use-cases/auth/get";
import LogoutUseCase from "./application/use-cases/auth/logout";
import RefreshTokensUseCase from "./application/use-cases/auth/refresh-tokens";
import PrismaUserRepository from "./infrastructure/db/repositories/prisma-user.repository";
import PrismaSessionRepository from "./infrastructure/db/repositories/prisma-session.repository";
import GetMeUseCase from "./application/use-cases/auth/getMe";
import HealthUseCase from "./application/use-cases/health/health";
import StatusUseCase from "./application/use-cases/health/status";
import LivezUseCase from "./application/use-cases/health/livez";
import ReadyzUseCase from "./application/use-cases/health/readyz";
import HealthHandler from "./infrastructure/grpc/handlers/health.handler";
import AuthHandler from "./infrastructure/grpc/handlers/auth.handler";

const messageService = new MessageService(kafkaConfig);
const jobService = new JobService()
const dbService = new DbService();

function buildGrpcService(dbService: DbService, messageService: MessageService, jobService: JobService) {

    const deviceRepository = new PrismaDeviceRepository(dbService.client);
    const userRepository = new PrismaUserRepository(dbService.client);
    const sessionRepository = new PrismaSessionRepository(dbService.client);


    const anonymousSignInUseCase = new AnonymousSignInUseCase(userRepository, deviceRepository);
    const getUseCase = new GetUseCase(userRepository);
    const getMeUseCase = new GetMeUseCase(userRepository);
    const logoutUseCase = new LogoutUseCase();
    const refreshTokensUseCase = new RefreshTokensUseCase();


    const healthUseCase = new HealthUseCase(dbService, messageService, jobService);
    const statusUseCase = new StatusUseCase;
    const livezUseCase = new LivezUseCase;
    const readyzUseCase = new ReadyzUseCase;

    const authHandler = new AuthHandler(anonymousSignInUseCase, refreshTokensUseCase, logoutUseCase, getMeUseCase, getUseCase,);
    const healthHandler = new HealthHandler(healthUseCase, statusUseCase, livezUseCase, readyzUseCase);

    return new GrpcService(grpcConfig.port, authHandler, healthHandler);

}

const grpcService = buildGrpcService(dbService, messageService, jobService);

async function bootstrap(): Promise<void> {

    try {
        await dbService.init();
        await jobService.init();
        await messageService.init();
        await grpcService.init();
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