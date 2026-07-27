import {createProducer, KafkaConfig, KafkaProducer} from "@shared/kafka-manager";
import kafkaConfig from "../config/kafka.config";
import logger from "@shared/logger";

export class KafkaService {

    private producer?: KafkaProducer;

    constructor(private readonly config: KafkaConfig) {}

    async init() {}

    async stop() {}

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
