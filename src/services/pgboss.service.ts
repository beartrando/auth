import pgBossManager from '@shared/pg-boss-manager';
import pgBossConfig from './config/pg.boss.config';
import {kafkaProducersConfig} from "../config/kafka.config";


export class PgbossService {

    constructor() {
    }

    async init() {
        void pgBossManager.start(pgBossConfig);

        await pgBossManager.waitUntilReady();

        await initKafkaBridge();
    }

    async initKafkaBridge(): Promise<void> {
        const topics = Object.values(
            kafkaProducersConfig,
        );

        while (true) {
            try {
                for (const topic of topics) {
                    await pgBossManager.kafka.start(
                        kafkaConfig,
                        topic,
                    );
                }
                logger.info(
                    '✅ PgBoss Kafka bridge initialized',
                );
                return;
            } catch (err) {
                logger.warn(
                    { err },
                    '⏳ Waiting for PgBoss/Kafka bridge initialization...',
                );
                await sleep(3000);
            }
        }
    }

    async stop() {
        // await pgBossManager.stop();
    }

}

const pgbossService = new PgbossService()

export default pgbossService;
