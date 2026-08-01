import logger from "@shared/logger";
import {config as kafkaConfig} from "./infrastructure/message/config";
import MessageService from "./infrastructure/message/message.service";
import JobService from "./infrastructure/job/job.service";
import DbService from "./infrastructure/db/db.service";

const messageService = new MessageService(kafkaConfig);
const jobService = new JobService()
const dbService = new DbService();

const grpcService = buildGrpcService(dbService, messageService, jobService);

async function bootstrap(): Promise<void> {

    try {
        await messageService.init();
        await jobService.init();
        await dbService.init();
        await grpcService.init();
        logger.info(
            '🚀 Auth service started',
        );
    } catch (err) {
        logger.error(
            {err},
            '💥 Failed to start Auth',
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




