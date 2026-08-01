import * as grpc from '@grpc/grpc-js';
import logger from "@shared/logger";

export class AuthHelper {
    static getJwt(
        call: grpc.ServerUnaryCall<any, any>
    ): string | null {
        const authHeader = call.metadata.get('authorization')[0] as string;
        // logger.log(authHeader);
        if (!authHeader?.startsWith('Bearer ')) {
            // throw new Error('Missing or invalid Authorization header');
            logger.error('Missing or invalid Authorization header');
            return null;
        }

        return authHeader.slice(7);
    };

    static getMetadata(jwt: string): grpc.Metadata {
        const metadata = new grpc.Metadata();
        metadata.add('authorization', 'Bearer ' + jwt);
        return metadata;
    }
}

export default AuthHelper;
