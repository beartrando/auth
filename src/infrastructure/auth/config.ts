import {SignOptions} from "jsonwebtoken";
import logger from "@shared/logger";
import AuthConfig from "./interfaces/auth-config";

function required(name: string): string {
    const value = process.env[name];
    if (!value) {
        throw new Error(`${name} is missing`);
    }
    return value;
}

export const authConfig: AuthConfig = {
    accessSecret: required("ACCESS_SECRET"),
    refreshSecret: required("REFRESH_SECRET"),
    accessTokenExpiresIn: (process.env.ACCESS_TOKEN_EXPIRES_IN ?? '15m') as SignOptions["expiresIn"],
    refreshTokenExpiresIn: (process.env.REFRESH_TOKEN_EXPIRES_IN ?? '7d') as SignOptions["expiresIn"],
};

export default authConfig;

