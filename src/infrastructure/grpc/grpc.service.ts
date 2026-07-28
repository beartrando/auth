import * as grpc from "@grpc/grpc-js";
import * as healthGrpc from './generated/common/health';
import * as authGrpc from './generated/auth';
import * as authHandler from "./handlers/auth.handler";
import * as healthHandler from "./handlers/health.handler";
import logger from "@shared/logger";
import config from "../../config/config";

export class GrpcService {
    private readonly server: grpc.Server;

    constructor(private readonly grpcPort: number) {
        this.server = new grpc.Server();
    }

    async init(): Promise<void> {
        return new Promise<void>(
            (resolve, reject) => {
                this.addServices();
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

    private registerAuthService() {
        this.server.addService(authGrpc.AuthService, {
            anonymousSignIn: authHandler.anonymousSignIn,
            get: authHandler.get,
            getMe: authHandler.getMe,
            refreshTokens: authHandler.refreshTokens,
            logout: authHandler.logout,
        });
    }

    private registerHealthService() {
        this.server.addService(healthGrpc.HealthService, {
            check: healthHandler.check,
            status: healthHandler.status,
            livez: healthHandler.livez,
            readyz: healthHandler.readyz,
        });
    }

    private addServices() {
        this.registerAuthService();
        this.registerHealthService();
    }

    stop() {
        this.server.forceShutdown();
    }
}

export const grpcService = new GrpcService(config.grpcPort);

export default grpcService;

