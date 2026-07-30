import * as grpc from "@grpc/grpc-js";
import * as healthProto from '../../contracts/proto/common/health';
import * as orchestrationProto from "../../contracts/proto/orchestration";
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

    private registerOrchestrationService() {
        this.server.addService(healthProto.HealthService, {
            anon: this.authHandler.a,
            status: this.healthHandler.status,
            livez: this.healthHandler.livez,
            readyz: this.healthHandler.readyz,
        });



        this.server.addService(orchestrationProto.OrchestrationService, {
            proxy: this.orchestrationHandler.proxy,
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
        this.registerOrchestrationService();
        this.registerHealthService();
    }
}

export default GrpcService;

