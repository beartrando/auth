import {AuthConfig} from "./service";
import {SignOptions} from "jsonwebtoken";
import logger from "@shared/logger";

function required(name: string): string {
    logger.log(process.env);
    const value = process.env[name];
    if (!value) {
        throw new Error(`${name} is missing`);
    }
    return value;
}

export const config: AuthConfig = {
    accessSecret: required("ACCESS_SECRET"),
};

export default config;

