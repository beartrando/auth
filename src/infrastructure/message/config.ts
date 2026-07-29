const config = {
    brokers: process.env.KAFKA_BROKERS?.split(',') ?? ['kafka:9092'],
    clientId: process.env.KAFKA_CLIENT_ID ?? 'auth-client',
    groupId: process.env.KAFKA_GROUP_ID ?? 'auth-service',
};

type ConsumerConfig = {
    topic: string;
    handler: (message: unknown) => Promise<void>;
};

export const kafkaConsumersConfig: Record<string, ConsumerConfig> = {};


export const kafkaProducersConfig = {
    userCreated:
        process.env.KAFKA_TOPIC_USER_CREATED ?? 'user.created',
};


export default config;