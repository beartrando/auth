import AnonymousSignInUseCase from "../application/use-cases/auth/anonymous-sign-in";
import LogoutUseCase from "../application/use-cases/auth/logout";
import RefreshTokensUseCase from "../application/use-cases/auth/refresh-tokens";
import HealthUseCase from "../application/use-cases/health/health";
import StatusUseCase from "../application/use-cases/health/status";
import LivezUseCase from "../application/use-cases/health/livez";
import ReadyzUseCase from "../application/use-cases/health/readyz";
import HealthHandler from "../infrastructure/grpc/handlers/health.handler";
import GrpcService from "../infrastructure/grpc/service";
import grpcConfig from "../infrastructure/grpc/config";
import Application from "../application/application";
import AuthService from "../infrastructure/auth/service";
import PrismaDeviceRepository from "../infrastructure/db/repositories/prisma-device.repository";
import PrismaUserRepository from "../infrastructure/db/repositories/prisma-user.repository";
import PrismaSessionRepository from "../infrastructure/db/repositories/prisma-session.repository";
import GetUserUseCase from "../application/use-cases/auth/getUser";
import AuthHandler from "../infrastructure/grpc/handlers/auth.handler";
import MessageService from "../infrastructure/message/service";
import JobService from "../infrastructure/job/service";
import DbService from "../infrastructure/db/service";
import jobConfig from "../infrastructure/job/config";
import authConfig from "../infrastructure/auth/config";
import messageConfig from "../infrastructure/message/configs/message.config";
import messageConsumersConfig from "../infrastructure/message/configs/consumers.config";
import messageProducersConfig from "../infrastructure/message/configs/producers.config";


function buildApplication() {

    const messageService = new MessageService(messageConfig, messageConsumersConfig);
    const jobService = new JobService(jobConfig, messageConfig, messageProducersConfig)
    const dbService = new DbService();

    const authService = new AuthService(authConfig);

    const deviceRepository = new PrismaDeviceRepository(dbService.client);
    const userRepository = new PrismaUserRepository(dbService.client);
    const sessionRepository = new PrismaSessionRepository(dbService.client);


    const anonymousSignInUseCase = new AnonymousSignInUseCase(
        userRepository,
        deviceRepository,
        sessionRepository,
        jobService,
        dbService,
        authService,
        messageProducersConfig.userCreated
    );
    const getUseCase = new GetUserUseCase(userRepository);
    const logoutUseCase = new LogoutUseCase(sessionRepository);
    const refreshTokensUseCase = new RefreshTokensUseCase(authService, sessionRepository);


    const healthUseCase = new HealthUseCase(dbService, messageService, jobService);
    const statusUseCase = new StatusUseCase;
    const livezUseCase = new LivezUseCase;
    const readyzUseCase = new ReadyzUseCase;

    const authHandler = new AuthHandler(
        anonymousSignInUseCase,
        refreshTokensUseCase,
        logoutUseCase,
        getUseCase,
        authService
    );

    const healthHandler = new HealthHandler(healthUseCase, statusUseCase, livezUseCase, readyzUseCase);

    const grpcService = new GrpcService(grpcConfig.port, authHandler, healthHandler);

    return new Application(grpcService, dbService, jobService, messageService);
}


export default buildApplication;
