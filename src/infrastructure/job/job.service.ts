import pgBossManager from '@shared/pg-boss-manager';
import config, {kafkaProducersConfig} from "./config";
import config from "./config";
import logger from "@shared/logger";
import sleep from "../../utils/sleep";


export class JobService {

    constructor() {
    }

    async init(): Promise<void> {

        void pgBossManager.start(config);

        await pgBossManager.waitUntilReady();

        await this.initKafkaBridge();
    }

    async initKafkaBridge(): Promise<void> {
        const topics = Object.values(kafkaProducersConfig);

        while (true) {
            try {
                await Promise.all(
                    topics.map(topic =>
                        pgBossManager.kafka.start(
                            config,
                            topic,
                        ),
                    ),
                );

                logger.info("✅ PgBoss Kafka bridge initialized");
                return;
            } catch (err) {
                logger.warn(
                    { err },
                    "⏳ Waiting for PgBoss/Kafka bridge initialization...",
                );

                await sleep(3000);
            }
        }
    }

    async stop() {
        return await pgBossManager.stop();
    }

    async check(): Promise<boolean> {
        return pgBossManager.check();
    }

}

const jobService = new JobService()

export default jobService;
