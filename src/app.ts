import logger from '@shared/logger';
import grpcService from "./infrastructure/grpc/grpc.service";
import dbService from "./infrastructure/db/db.service";
import jobService from "./infrastructure/job/job.service";
import messageService from "./infrastructure/message/message.service";

async function bootstrap(): Promise<void> {

    try {
        await grpcService.init();
        await dbService.init();
        await jobService.init();
        await messageService.init();

        logger.info(
            '🚀 Auth service started',
        );
    } catch (err) {
        logger.error(
            {err},
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
            await dbService.stop();
            await jobService.stop();
            await messageService.stop();

            process.exit(0);
        },
    );
}


bootstrap();

