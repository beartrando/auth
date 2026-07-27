import logger from '@shared/logger';
import grpcService from "./services/grpc.service";
import prismaService from "./services/prisma.service";
import pgbossService from "./services/pgboss.service";
import kafkaService from "./services/kafka.service";

// import grpcServer from './grpc/server';
// import * as grpc from '@grpc/grpc-js';
//
//
// import kafkaConfig, {
//     kafkaConsumersConfig,
//     kafkaProducersConfig,
// } from './config/kafka.config';
//
// import { createConsumer } from '@shared/kafka-manager';
//
// import pgBossManager from '@shared/pg-boss-manager';
// import pgBossConfig from './config/pg.boss.config';
//
//

//
// async function startPgBoss(): Promise<void> {
//     void pgBossManager.start(pgBossConfig);
//
//     await pgBossManager.waitUntilReady();
//
//     await initKafkaBridge();
// }
//
// async function initKafkaBridge(): Promise<void> {
//     const topics = Object.values(
//         kafkaProducersConfig,
//     );
//
//     while (true) {
//         try {
//             for (const topic of topics) {
//                 await pgBossManager.kafka.start(
//                     kafkaConfig,
//                     topic,
//                 );
//             }
//             logger.info(
//                 '✅ PgBoss Kafka bridge initialized',
//             );
//             return;
//         } catch (err) {
//             logger.warn(
//                 { err },
//                 '⏳ Waiting for PgBoss/Kafka bridge initialization...',
//             );
//             await sleep(3000);
//         }
//     }
// }
//
// async function retryKafkaInit(
//     fn: () => Promise<void>,
// ): Promise<void> {
//     while (true) {
//         try {
//             await fn();
//             logger.info(
//                 '✅ Kafka initialized',
//             );
//             return;
//         } catch (err) {
//             logger.warn(
//                 { err },
//                 '⏳ Waiting for Kafka topics...',
//             );
//             await sleep(3000);
//         }
//     }
// }
//
// async function createKafkaConsumers(): Promise<void> {
//     const configs = Object.values(
//         kafkaConsumersConfig,
//     );
//     await retryKafkaInit(
//         async () => {
//             await Promise.all(
//                 configs.map(
//                     async ({ topic, handler }) => {
//                         await createConsumer(
//                             kafkaConfig,
//                             {
//                                 topic,
//                                 handler,
//                             },
//                         );
//                     },
//                 ),
//             );
//         },
//     );
// }

async function bootstrap(): Promise<void> {

    try {
        await grpcService.init();
        await prismaService.init();
        await pgbossService.init();
        await kafkaService.init();


        // await startGrpc();
        // await startPgBoss();
        // await createKafkaConsumers();
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
            await pgbossService.stop();
            await kafkaService.stop();

            process.exit(0);
        },
    );
}
//
// function sleep(
//     ms: number,
// ): Promise<void> {
//     return new Promise(
//         resolve => setTimeout(resolve, ms),
//     );
// }

bootstrap();
