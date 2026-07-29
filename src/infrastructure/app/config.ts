function required(name: string): string {
    const value = process.env[name];
    if (!value) {
        throw new Error(`${name} is missing`);
    }
    return value;
}

export const config = {
    appName: process.env.APP_NAME ?? 'auth',
    appVersion: process.env.APP_VERSION ?? '0.0.0',
    appEnv: process.env.APP_ENV ?? 'prod',

    jwtAccessSecret: required("JWT_ACCESS_SECRET"),
    jwtRefreshSecret: required("JWT_REFRESH_SECRET"),
    accessTokenExpiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN ?? '15m',
    refreshTokenExpiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN ?? '7d',
};

export default config;
