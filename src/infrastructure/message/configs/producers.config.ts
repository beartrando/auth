export const messageProducersConfig: Record<string, string> = {
    userCreated: process.env.MESSAGE_TOPIC_USER_CREATED ?? 'user.created',
};

export default messageProducersConfig;
