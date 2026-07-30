import * as grpc from '@grpc/grpc-js';
import * as authProto from '../../../contracts/proto/auth';
import callbackError from './callback.error';
import logger from "@shared/logger";
import AnonymousSignInUseCase from "../../../application/use-cases/auth/anonymous-sign-in";
import RefreshTokensUseCase from "../../../application/use-cases/auth/refresh-tokens";
import LogoutUseCase from "../../../application/use-cases/auth/logout";
import GetMeUseCase from "../../../application/use-cases/auth/getMe";
import GetUseCase from "../../../application/use-cases/auth/get";

export class AuthHandler {
    constructor(
        private readonly anonymousSignInUseCase: AnonymousSignInUseCase,
        private readonly refreshTokensUseCase: RefreshTokensUseCase,
        private readonly logoutUseCase: LogoutUseCase,
        private readonly getMeUseCase: GetMeUseCase,
        private readonly getUseCase: GetUseCase,
    ) {
    }

    async anonymousSignIn(
        call: grpc.ServerUnaryCall<authProto.AnonymousSignInRequest, authProto.AuthResponse>,
        callback: grpc.sendUnaryData<authProto.AuthResponse>
    ) {
        try {
            const {deviceId} = call.request;
            // logger.log('anonymousSignIn ' + deviceId);
            const authObject = await this.anonymousSignInUseCase.execute(deviceId);

            const result = authProto.AuthResponse.create({auth: authObject})

            callback(null, result);

        } catch (err: any) {
            logger.log(err);
            callbackError(callback, err);
        }
    }

// export const refreshTokens = async (
//     call: grpc.ServerUnaryCall<authProto.RefreshTokensRequest, authProto.AuthResponse>,
//     callback: grpc.sendUnaryData<authProto.AuthResponse>
// ) => {
//     const {token} = call.request;
//
//     try {
//         const authObject = await refreshTokensUseCase.execute(token);
//
//         const response = authProto.AuthResponse.create({auth: authObject})
//
//         callback(null, response);
//
//     } catch (err: any) {
//         logger.log(err);
//         callbackError(callback, err);
//     }
// };
//
// export const logout = async (
//     call: grpc.ServerUnaryCall<emptyProto.Empty, responseProto.EmptyResponse>,
//     callback: grpc.sendUnaryData<responseProto.EmptyResponse>
// ) => {
//     const jwt = jwtFromProtoRequest(call);
//
//     try {
//         await logoutUseCase.execute(jwt);
//         const response = responseProto.EmptyResponse.create({success: true});
//
//         callback(null, response);
//
//     } catch (err: any) {
//         logger.log(err);
//         callbackError(callback, err);
//     }
// };
//
// export const get = async (
//     call: grpc.ServerUnaryCall<authProto.UserIdRequest, authProto.UserResponse>,
//     callback: grpc.sendUnaryData<authProto.UserResponse>
// ) => {
//     try {
//         const {userId} = call.request;
//         const jwt = jwtFromProtoRequest(call);
//         // logger.log('anonymousSignIn ' + deviceId);
//         const userObject = userToProto(await getUseCase.execute(userId, jwt));
//
//         const result = authProto.UserResponse.create({user: userObject})
//
//         callback(null, result);
//
//     } catch (err: any) {
//         logger.log(err);
//         callbackError(callback, err);
//     }
// };
//
//
// export const getMe = async (
//     call: grpc.ServerUnaryCall<authProto.UserIdRequest, authProto.UserResponse>,
//     callback: grpc.sendUnaryData<authProto.UserResponse>
// ) => {
//     try {
//         const jwt = jwtFromProtoRequest(call);
//         const userObject = userToProto(await getMeUseCase.execute(jwt));
//
//         const result = authProto.UserResponse.create({user: userObject})
//
//         callback(null, result);
//
//     } catch (err: any) {
//         logger.log(err);
//         callbackError(callback, err);
//     }
// };

}

export default AuthHandler;