import * as healthGrpc from "../../infrastructure/grpc/generated/common/health";
import kafkaService, {KafkaService} from "../../services/kafka.service";
import prismaService, {PrismaService} from "../../services/prisma.service";
import pgBossService, {PgBossService} from "../../services/pg-boss.service";
import config from "../../config/config";
import logger from "@shared/logger";

export class HealthUseCase {
    constructor(
        private readonly prisma: PrismaService,
        private readonly kafka: KafkaService,
        private readonly pgBoss: PgBossService,
    ) {
    }

    private toHealthStatus(ok: boolean): healthGrpc.HealthStatus {
        return ok
            ? healthGrpc.HealthStatus.HEALTH_STATUS_OK
            : healthGrpc.HealthStatus.HEALTH_STATUS_FAIL;
    }

    async execute(): Promise<healthGrpc.HealthReport> {
        const [pgOk, kafkaOk, pgBossOk] = await Promise.all([this.prisma.check(), this.kafka.check(), this.pgBoss.check()]);

        const components = {
            postgres: pgOk,
            kafka: kafkaOk,
            pgBoss: pgBossOk,
        };

        return {
            service: config.appName,
            status: this.toHealthStatus(
                Object.values(components).every(Boolean),
            ),
            components: Object.fromEntries(
                Object.entries(components).map(([name, ok]) => [
                    name,
                    this.toHealthStatus(ok),
                ]),
            ),
            timestamp: new Date(),
        };
    }
}

const healthUseCase = new HealthUseCase(prismaService, kafkaService, pgBossService);

export default healthUseCase;

