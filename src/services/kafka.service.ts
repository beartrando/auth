import {createConsumer, createProducer, KafkaConfig, KafkaProducer} from "@shared/kafka-manager";
import logger from "@shared/logger";
import kafkaConfig, {kafkaConsumersConfig,} from '../config/kafka.config';
import sleep from "../utils/sleep";

export class KafkaService {

    private producer?: KafkaProducer;

    constructor(private readonly config: KafkaConfig) {
    }

    async retryKafkaInit(
        fn: () => Promise<void>,
    ): Promise<void> {
        while (true) {
            try {
                await fn();
                logger.info(
                    '✅ Kafka initialized',
                );
                return;
            } catch (err) {
                logger.warn(
                    {err},
                    '⏳ Waiting for Kafka topics...',
                );
                await sleep(3000);
            }
        }
    }

    async createKafkaConsumers(): Promise<void> {
        const configs = Object.values(
            kafkaConsumersConfig,
        );
        await this.retryKafkaInit(
            async () => {
                await Promise.all(
                    configs.map(
                        async ({topic, handler}) => {
                            await createConsumer(
                                kafkaConfig,
                                {
                                    topic,
                                    handler,
                                },
                            );
                        },
                    ),
                );
            },
        );
    }


    async init() {
        this.createKafkaConsumers();

    }

    async stop() {
    }

    async getProducer(): Promise<KafkaProducer> {
        if (!this.producer) {
            this.producer = await createProducer(this.config);
        }

        return this.producer;
    }

    async health(): Promise<boolean> {
        try {
            const producer = await this.getProducer();

            await producer.send('healthcheck', [{value: 'ping'}]);

            return true;
        } catch (err) {
            logger.error("Kafka health check failed", err);
            return false;
        }
    }
}

const kafkaService = new KafkaService(kafkaConfig);

export default kafkaService;
