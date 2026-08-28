export const messageProducersConfig: Record<string, string> = {
    userCreated: process.env.MESSAGE_PRODUCER_TOPIC_USER_CREATED ?? 'user.created',
};

export default messageProducersConfig;
