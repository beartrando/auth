import logger from '@shared/logger';
import grpcService from "./infrastructure/grpc/grpc.service";
import prismaService from "./services/prisma.service";
import pgBossService from "./services/pg-boss.service";
import kafkaService from "./services/kafka.service";

async function bootstrap(): Promise<void> {

    try {
        await grpcService.init();
        await prismaService.init();
        await pgBossService.init();
        await kafkaService.init();

        logger.info(
            '🚀 Auth service started',
        );
    } catch (err) {
        logger.error(
            { err },
            '💥 Failed to start Battle',
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
            await prismaService.stop();
            await pgBossService.stop();
            await kafkaService.stop();

            process.exit(0);
        },
    );
}


bootstrap();
