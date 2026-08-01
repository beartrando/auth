import * as grpc from "@grpc/grpc-js";
import * as healthProto from '../../contracts/proto/common/health';
import * as authProto from '../../contracts/proto/auth';
import logger from "@shared/logger";
import AuthHandler from "./handlers/auth.handler";
import HealthHandler from "./handlers/health.handler";

export class GrpcService {
    private readonly server: grpc.Server;

    constructor(
        private readonly port: number,
        private readonly authHandler: AuthHandler,
        private readonly healthHandler: HealthHandler,
    ) {
        this.server = new grpc.Server();
    }

    async init(): Promise<void> {
        return new Promise<void>(
            (resolve, reject) => {
                this.addServices();
                this.server.bindAsync(
                    `0.0.0.0:${this.port}`,
                    grpc.ServerCredentials.createInsecure(),
                    (err, port) => {
                        if (err) {
                            logger.error(
                                {err},
                                '❌ Failed to start gRPC',
                            );

                            return reject(err);
                        }

                        logger.info(
                            `🟢 gRPC server started on port ${port}`,
                        );
                        resolve();
                    },
                );
            },
        );
    }

    stop() {
        this.server.forceShutdown();
    }

    public getJwtFromRequest = (
        call: grpc.ServerUnaryCall<any, any>
    ): string => {
        const authHeader = call.metadata.get('authorization')[0] as string;
        // logger.log(authHeader);
        if (!authHeader?.startsWith('Bearer ')) {
            // throw new Error('Missing or invalid Authorization header');
            logger.error('Missing or invalid Authorization header');
            return '';
        }

        return authHeader.slice(7);
    };

    private registerAuthService() {
        this.server.addService(authProto.AuthService, {
            anonymousSignIn: this.authHandler.anonymousSignIn,
            get: this.authHandler.get,
            getMe: this.authHandler.getMe,
            logout: this.authHandler.logout,
            refreshTokens: this.authHandler.refreshTokens,
        });
    }

    private registerHealthService() {
        this.server.addService(healthProto.HealthService, {
            check: this.healthHandler.check,
            status: this.healthHandler.status,
            livez: this.healthHandler.livez,
            readyz: this.healthHandler.readyz,
        });
    }

    private addServices() {
        this.registerAuthService();
        this.registerHealthService();
    }
}

export default GrpcService;

