export const messageConfig = {
    brokers: process.env.KAFKA_BROKERS?.split(',') ?? ['kafka:9092'],
    clientId: process.env.KAFKA_CLIENT_ID ?? 'auth-client',
    groupId: process.env.KAFKA_GROUP_ID ?? 'auth-service',
};


export default messageConfig;
