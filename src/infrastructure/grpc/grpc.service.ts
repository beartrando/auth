import * as grpc from "@grpc/grpc-js";
import * as healthProto from '../../contracts/proto/common/health';
import * as authProto from '../../contracts/proto/auth';
import * as authHandler from "./handlers/auth.handler";
import {anonymousSignIn} from "./handlers/auth.handler";
import * as healthHandler from "./handlers/health.handler";
import logger from "@shared/logger";
import config from "./config";

export class GrpcService {
    private readonly server: grpc.Server;

    constructor(private readonly grpcPort: number) {
        this.server = new grpc.Server();
    }

    async init(
        {
            anonymousSignInUseCase,
        }: {
            anonymousSignInUseCase: AnonymousSignInUseCase;
        }
    ): Promise<void> {
        return new Promise<void>(
            (resolve, reject) => {
                this.addServices({
                    anonymousSignInUseCase,
                });
                this.server.bindAsync(
                    `0.0.0.0:${this.grpcPort}`,
                    grpc.ServerCredentials.createInsecure(),
                    (err, port) => {
                        if (err) {
                            logger.error(
                                {err},
                                '❌ Failed to start gRPC',
                            );

                            return reject(err);
                        }
                        this.server.start();
                        logger.info(
                            `🟢 gRPC server started on port ${port}`,
                        );
                        resolve();
                    },
                );
            },
        );
    }

    private registerAuthService(
        {
            anonymousSignInUseCase,
        }: {
            anonymousSignInUseCase: AnonymousSignInUseCase;
        }
    ) {
        this.server.addService(authProto.AuthService, {
            anonymousSignIn: authHandler.anonymousSignIn(anonymousSignIn()),
            // get: authHandler.get,
            // getMe: authHandler.getMe,
            // refreshTokens: authHandler.refreshTokens,
            // logout: authHandler.logout,
        });
    }

    private registerHealthService() {
        this.server.addService(healthProto.HealthService, {
            check: healthHandler.check,
            status: healthHandler.status,
            livez: healthHandler.livez,
            readyz: healthHandler.readyz,
        });
    }

    private addServices(
        {
            anonymousSignInUseCase,
        }: {
            anonymousSignInUseCase: AnonymousSignInUseCase;
        }
    ) {
        this.registerAuthService({
            anonymousSignInUseCase,
        });
        this.registerHealthService();
    }

    stop() {
        this.server.forceShutdown();
    }
}

export const grpcService = new GrpcService(config.grpcPort);

export default grpcService;

