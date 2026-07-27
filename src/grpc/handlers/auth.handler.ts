import * as grpc from '@grpc/grpc-js';
import * as authGrpc from '../generated/auth';
import * as responseGrpc from '../generated/common/response';
import * as emptyGrpc from '../generated/common/empty';
import * as authService from '../../services/auth.service';
import {callbackError} from './callback.error';
import logger from "@shared/logger";
import {userToGrpc} from "../../utils/grpc-prisma-converters/user";
import {getUserIdFromGrpcRequest} from "../../utils/grpcRequestMetadata";

export const register = async (
    call: grpc.ServerUnaryCall<authGrpc.RegisterRequest, authGrpc.AuthObject>,
    callback: grpc.sendUnaryData<authGrpc.AuthObject>
) => {
    throw new Error('Registration is disabled');
    const {email, password} = call.request;

    try {
        await authService.create(email, password);

        const result = await authService.login(email, password);

        callback(null, result);

    } catch (err: any) {
        logger.log(err);
        callbackError(callback, err);
    }
};

export const anonymousSignIn = async (
    call: grpc.ServerUnaryCall<authGrpc.AnonymousSignInRequest, authGrpc.AuthObject>,
    callback: grpc.sendUnaryData<authGrpc.AuthObject>
) => {
    try {
        const {deviceId} = call.request;
        // logger.log('anonymousSignIn ' + deviceId);
        const result = await authService.anonymousSignIn(deviceId);

        callback(null, result);

    } catch (err: any) {
        logger.log(err);
        callbackError(callback, err);
    }
};

export const login = async (
    call: grpc.ServerUnaryCall<authGrpc.LoginRequest, authGrpc.AuthObject>,
    callback: grpc.sendUnaryData<authGrpc.AuthObject>
) => {
    throw new Error('Login is disabled');
    const {email, password} = call.request;

    try {
        const result = await authService.login(email, password);

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
        const response = await authService.refreshTokens(token);

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
    const userId = getUserIdFromGrpcRequest(call);

    try {
        const response = await authService.logout(userId);

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
        const result = userToGrpc(await authService.get(userId));

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
        const userId = getUserIdFromGrpcRequest(call);
        const result = userToGrpc(await authService.get(userId));

        callback(null, result);

    } catch (err: any) {
        logger.log(err);
        callbackError(callback, err);
    }
};
