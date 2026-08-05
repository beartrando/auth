import * as grpc from '@grpc/grpc-js';
import * as authProto from '../../../contracts/proto/auth';
import * as emptyProto from '../../../contracts/proto/common/empty';
import * as responseProto from '../../../contracts/proto/common/response';
import callbackError from './callback.error';
import logger from "@shared/logger";
import AnonymousSignInUseCase from "../../../application/use-cases/auth/anonymous-sign-in";
import RefreshTokensUseCase from "../../../application/use-cases/auth/refresh-tokens";
import LogoutUseCase from "../../../application/use-cases/auth/logout";
import GetUserUseCase from "../../../application/use-cases/auth/getUser";
import DeviceId from "../../../domain/value-objects/device-id.vo";
import AuthProtoMapper from "../mappers/auth.proto.mapper";
import RefreshToken from "../../../domain/value-objects/refresh-token.vo";
import AuthHelper from "../helpers/auth.helper";
import Id from "../../../domain/value-objects/id.vo";
import UserProtoMapper from "../mappers/user.proto.mapper";
import AuthService from "../../auth/service";

export class AuthHandler {
    constructor(
        private readonly anonymousSignInUseCase: AnonymousSignInUseCase,
        private readonly refreshTokensUseCase: RefreshTokensUseCase,
        private readonly logoutUseCase: LogoutUseCase,
        private readonly getUseCase: GetUserUseCase,
        private readonly authService: AuthService
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

            const result = authProto.AuthResponse.create({auth: AuthProtoMapper.toProto(session)});

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
            const refreshToken = new RefreshToken(token);

            const userId = this.authService.verifyRefreshToken(refreshToken);

            const authObject = await this.refreshTokensUseCase.execute(userId, refreshToken);

            const response = authProto.AuthResponse.create({auth: AuthProtoMapper.toProto(authObject)})

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
        try {
            const accessToken = AuthHelper.getAccessToken(call);

            const userId = this.authService.verifyAccessToken(accessToken)

            await this.logoutUseCase.execute(userId);
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
            const accessToken = AuthHelper.getAccessToken(call);
            // logger.log('anonymousSignIn ' + deviceId);
            const userObject = UserProtoMapper.toProto(await this.getUseCase.execute(new Id(userId)));

            const result = authProto.UserResponse.create({user: userObject})

            callback(null, result);

        } catch (err: any) {
            logger.log(err);
            callbackError(callback, err);
        }
    };
}

export default AuthHandler;
