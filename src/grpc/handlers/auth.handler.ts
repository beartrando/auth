import * as grpc from '@grpc/grpc-js';
import * as authGrpc from '../generated/auth';
import * as responseGrpc from '../generated/common/response';
import * as emptyGrpc from '../generated/common/empty';
import {callbackError} from './callback.error';
import logger from "@shared/logger";
import {userToGrpc} from "../../utils/grpc-prisma-converters/user";
import {getJwtFromGrpcRequest} from "../../utils/grpcRequestMetadata";
import anonymousSignInUseCase from "../../use-cases/auth/anonymous-sign-in";
import refreshTokensUseCase from "../../use-cases/auth/refresh-tokens";
import logoutUseCase from "../../use-cases/auth/logout";
import getUseCase from "../../use-cases/auth/get";

export const anonymousSignIn = async (
    call: grpc.ServerUnaryCall<authGrpc.AnonymousSignInRequest, authGrpc.AuthObject>,
    callback: grpc.sendUnaryData<authGrpc.AuthObject>
) => {
    try {
        const {deviceId} = call.request;
        // logger.log('anonymousSignIn ' + deviceId);
        const result = await anonymousSignInUseCase.execute(deviceId);

        callback(null, result);

    } catch (err: any) {
        logger.log(err);
        callbackError(callback, err);
    }
};

export const refreshTokens = async (
    call: grpc.ServerUnaryCall<authGrpc.RefreshTokensRequest, authGrpc.AuthObject>,
    callback: grpc.sendUnaryData<authGrpc.AuthObject>
) => {
    const {token} = call.request;

    try {
        const response = await refreshTokensUseCase.execute(token);

        callback(null, response);

    } catch (err: any) {
        logger.log(err);
        callbackError(callback, err);
    }
};

export const logout = async (
    call: grpc.ServerUnaryCall<emptyGrpc.Empty, responseGrpc.EmptyResponse>,
    callback: grpc.sendUnaryData<responseGrpc.EmptyResponse>
) => {
    const jwt = getJwtFromGrpcRequest(call);

    try {
        const response = await logoutUseCase.execute(jwt);

        callback(null, response);

    } catch (err: any) {
        logger.log(err);
        callbackError(callback, err);
    }
};

export const get = async (
    call: grpc.ServerUnaryCall<authGrpc.UserIdRequest, authGrpc.UserObject>,
    callback: grpc.sendUnaryData<authGrpc.UserObject>
) => {
    try {
        const {userId} = call.request;
        // logger.log('anonymousSignIn ' + deviceId);
        const result = userToGrpc(await getUseCase.execute(userId));

        callback(null, result);

    } catch (err: any) {
        logger.log(err);
        callbackError(callback, err);
    }
};


export const getMe = async (
    call: grpc.ServerUnaryCall<authGrpc.UserIdRequest, authGrpc.UserObject>,
    callback: grpc.sendUnaryData<authGrpc.UserObject>
) => {
    try {
        const jwt = getJwtFromGrpcRequest(call);
        const result = userToGrpc(await getMeUseCase.execute(jwt));

        callback(null, result);

    } catch (err: any) {
        logger.log(err);
        callbackError(callback, err);
    }
};
