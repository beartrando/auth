import * as healthGrpc from "../../grpc/generated/common/health";

export class Health {
    constructor(
        private readonly postgres: PostgresService,
        private readonly kafka: KafkaService,
    ) {}

    async execute() {
        const [pgOk, kafkaOk] = await Promise.all([checkPostgres(), checkKafka()]);

        return {
            service: 'auth',
            status:
                pgOk && kafkaOk
                    ? healthGrpc.HealthStatus.HEALTH_STATUS_OK
                    : healthGrpc.HealthStatus.HEALTH_STATUS_FAIL,
            components: {
                postgres: pgOk
                    ? healthGrpc.HealthStatus.HEALTH_STATUS_OK
                    : healthGrpc.HealthStatus.HEALTH_STATUS_FAIL,
                kafka: kafkaOk
                    ? healthGrpc.HealthStatus.HEALTH_STATUS_OK
                    : healthGrpc.HealthStatus.HEALTH_STATUS_FAIL,
            },
            timestamp: new Date(),
        };

    }
}
