import DbService from "../infrastructure/db/db.service";
import MessageService from "../infrastructure/message/message.service";
import JobService from "../infrastructure/job/job.service";
import AuthService from "../infrastructure/auth/auth-service";
import PrismaDeviceRepository from "../infrastructure/db/repositories/prisma-device.repository";
import PrismaUserRepository from "../infrastructure/db/repositories/prisma-user.repository";
import PrismaSessionRepository from "../infrastructure/db/repositories/prisma-session.repository";
import AnonymousSignInUseCase from "../application/use-cases/auth/anonymous-sign-in";
import {kafkaProducersConfig} from "../infrastructure/message/config";
import GetUseCase from "../application/use-cases/auth/get";
import GetMeUseCase from "../application/use-cases/auth/get-me";
import LogoutUseCase from "../application/use-cases/auth/logout";
import RefreshTokensUseCase from "../application/use-cases/auth/refresh-tokens";
import HealthUseCase from "../application/use-cases/health/health";
import StatusUseCase from "../application/use-cases/health/status";
import LivezUseCase from "../application/use-cases/health/livez";
import ReadyzUseCase from "../application/use-cases/health/readyz";
import AuthHandler from "../infrastructure/grpc/handlers/auth.handler";
import HealthHandler from "../infrastructure/grpc/handlers/health.handler";
import {config as grpcConfig} from "../infrastructure/grpc/config";
import GrpcService from "../infrastructure/grpc/grpc.service";

function buildGrpcService(dbService: DbService, messageService: MessageService, jobService: JobService) {

    const authService = new AuthService();

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
        kafkaProducersConfig.userCreated
    );
    const getUseCase = new GetUseCase(userRepository);
    const getMeUseCase = new GetMeUseCase(userRepository, authService);
    const logoutUseCase = new LogoutUseCase(authService, sessionRepository);
    const refreshTokensUseCase = new RefreshTokensUseCase(authService, sessionRepository);


    const healthUseCase = new HealthUseCase(dbService, messageService, jobService);
    const statusUseCase = new StatusUseCase;
    const livezUseCase = new LivezUseCase;
    const readyzUseCase = new ReadyzUseCase;

    const authHandler = new AuthHandler(anonymousSignInUseCase, refreshTokensUseCase, logoutUseCase, getMeUseCase, getUseCase);
    const healthHandler = new HealthHandler(healthUseCase, statusUseCase, livezUseCase, readyzUseCase);

    return new GrpcService(grpcConfig.port, authHandler, healthHandler);

}

export default buildGrpcService;
