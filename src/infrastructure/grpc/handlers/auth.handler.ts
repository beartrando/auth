import * as grpc from '@grpc/grpc-js';
import * as authProto from '../../../contracts/proto/auth';
import * as emptyProto from '../../../contracts/proto/common/empty';
import * as responseProto from '../../../contracts/proto/common/response';
import callbackError from './callback.error';
import logger from "@shared/logger";
import AnonymousSignInUseCase from "../../../application/use-cases/auth/anonymous-sign-in";
import RefreshTokensUseCase from "../../../application/use-cases/auth/refresh-tokens";
import LogoutUseCase from "../../../application/use-cases/auth/logout";
import GetMeUseCase from "../../../application/use-cases/auth/get-me";
import GetUseCase from "../../../application/use-cases/auth/get";
import DeviceId from "../../../domain/value-objects/device-id.vo";
import AuthGrpcMapper from "../mappers/auth.vo.mapper";
import RefreshToken from "../../../domain/value-objects/refresh-token.vo";
import AuthHelper from "../helpers/auth.helper";
import AccessToken from "../../../domain/value-objects/access-token.vo";
import {InvalidAuthorizationError} from "@shared/errors";
import Id from "../../../domain/value-objects/id.vo";
import UserGrpcMapper from "../mappers/user.mapper";

export class AuthHandler {
    constructor(
        private readonly anonymousSignInUseCase: AnonymousSignInUseCase,
        private readonly refreshTokensUseCase: RefreshTokensUseCase,
        private readonly logoutUseCase: LogoutUseCase,
        private readonly getMeUseCase: GetMeUseCase,
        private readonly getUseCase: GetUseCase
    ) {
    }

    async anonymousSignIn(
        call: grpc.ServerUnaryCall<authProto.AnonymousSignInRequest, authProto.AuthResponse>,
        callback: grpc.sendUnaryData<authProto.AuthResponse>
    ) {
        try {
            const {deviceId} = call.request;
            // logger.log('anonymousSignIn ' + deviceId);
            const session = await this.anonymousSignInUseCase.execute(new DeviceId(deviceId));

            const result = authProto.AuthResponse.create({auth: AuthGrpcMapper.toGrpc(session)});

            callback(null, result);

        } catch (err: any) {
            logger.log(err);
            callbackError(callback, err);
        }
    }

    async refreshTokens(
        call: grpc.ServerUnaryCall<authProto.RefreshTokensRequest, authProto.AuthResponse>,
        callback: grpc.sendUnaryData<authProto.AuthResponse>
    ) {
        const {token} = call.request;

        try {
            const authObject = await this.refreshTokensUseCase.execute(new RefreshToken(token));

            const response = authProto.AuthResponse.create({auth: AuthGrpcMapper.toGrpc(authObject)})

            callback(null, response);

        } catch (err: any) {
            logger.log(err);
            callbackError(callback, err);
        }
    };

    async logout(
        call: grpc.ServerUnaryCall<emptyProto.Empty, responseProto.EmptyResponse>,
        callback: grpc.sendUnaryData<responseProto.EmptyResponse>
    ) {
        const jwt = AuthHelper.getJwt(call);

        try {
            if (!jwt) {
                throw new InvalidAuthorizationError();
            }
            const accessToken = new AccessToken(jwt);
            await this.logoutUseCase.execute(accessToken);
            const response = responseProto.EmptyResponse.create({success: true});

            callback(null, response);

        } catch (err: any) {
            logger.log(err);
            callbackError(callback, err);
        }
    };

    async get(
        call: grpc.ServerUnaryCall<authProto.UserIdRequest, authProto.UserResponse>,
        callback: grpc.sendUnaryData<authProto.UserResponse>
    ) {
        try {
            const {userId} = call.request;
            const jwt = AuthHelper.getJwt(call);
            if (!jwt) {
                throw new InvalidAuthorizationError();
            }
            // logger.log('anonymousSignIn ' + deviceId);
            const userObject = UserGrpcMapper.toGrpc(await this.getUseCase.execute(new Id(userId), new AccessToken(jwt)));

            const result = authProto.UserResponse.create({user: userObject})

            callback(null, result);

        } catch (err: any) {
            logger.log(err);
            callbackError(callback, err);
        }
    };


    async getMe(
        call: grpc.ServerUnaryCall<authProto.UserIdRequest, authProto.UserResponse>,
        callback: grpc.sendUnaryData<authProto.UserResponse>
    ) {
        try {
            const jwt = AuthHelper.getJwt(call);
            if (!jwt) {
                throw new InvalidAuthorizationError();
            }

            const userObject = UserGrpcMapper.toGrpc(await this.getMeUseCase.execute(new AccessToken(jwt)));

            const result = authProto.UserResponse.create({user: userObject})

            callback(null, result);

        } catch (err: any) {
            logger.log(err);
            callbackError(callback, err);
        }
    };

}

export default AuthHandler;