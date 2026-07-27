import * as grpc from "@grpc/grpc-js";
import {AuthService} from '../grpc/generated/auth';
import {HealthService} from '../grpc/generated/common/health';
// import * as authHandler from "../grpc/handlers/auth.handler";
import * as healthHandler from "../grpc/handlers/health.handler";
import logger from "@shared/logger";
import config from "../config/config";

export class GrpcService {
    private readonly server: grpc.Server;

    constructor(private readonly grpcPort: number) {
        this.server = new grpc.Server();
    }

    async init() {
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
                        this.server.start()
                        logger.info(
                            `🟢 gRPC server started on port ${port}`,
                        );
                        resolve();
                    },
                );
            },
        );


    }

    private addServices() {
        // this.server.addService(AuthService, {
        //
        //     register: authHandler.register,
        //     anonymousSignIn: authHandler.anonymousSignIn,
        //     get: authHandler.get,
        //     getMe: authHandler.getMe,
        //     login: authHandler.login,
        //     refreshTokens: authHandler.refreshTokens,
        //     logout: authHandler.logout,
        //     // forgotPassword: authHandler.forgotPassword,
        //     // resetPassword: authHandler.resetPassword,
        // });

        this.server.addService(HealthService, {
            check: healthHandler.check,
            status: healthHandler.status,
            livez: healthHandler.livez,
            readyz: healthHandler.readyz,
        });
    }

    stop() {
        this.server.forceShutdown();
    }
}

export const grpcService = new GrpcService(config.grpcPort);

export default grpcService;

