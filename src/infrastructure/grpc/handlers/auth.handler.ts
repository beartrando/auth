import * as grpc from '@grpc/grpc-js';
import * as authProto from '../../../contracts/proto/auth';
import * as emptyProto from '../../../contracts/proto/common/empty';
import * as responseProto from '../../../contracts/proto/common/response';
import callbackError from './callback.error';
import logger from "@shared/logger";
import AnonymousSignInUseCase from "../../../application/use-cases/auth/anonymous-sign-in";
import RefreshTokensUseCase from "../../../application/use-cases/auth/refresh-tokens";
import LogoutUseCase from "../../../application/use-cases/auth/logout";
import GetUserUseCase from "../../../application/use-cases/auth/get-user";
import AuthProtoMapper from "../mappers/auth.proto.mapper";
import SessionRefreshToken from "../../../domain/session/value-objects/sesion-refresh-token.vo";
import AuthHelper from "../helpers/auth.helper";
import UserProtoMapper from "../mappers/user.proto.mapper";
import AuthService from "../../auth/service";
import DeviceDeviceId from "../../../domain/device/value-objects/device-device-id.vo";
import UserId from "../../../domain/user/value-objects/user-id.vo";

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
            const session = await this.anonymousSignInUseCase.execute(new DeviceDeviceId(deviceId));

            const result = authProto.AuthResponse.create({auth: AuthProtoMapper.toProto(session)});

            // logger.log(result);
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
            const refreshToken = new SessionRefreshToken(token);

            const userId = this.authService.verifyRefreshToken(refreshToken);

            const authObject = await this.refreshTokensUseCase.execute(userId, refreshToken);

            const response = authProto.AuthResponse.create({auth: AuthProtoMapper.toProto(authObject)})

            // logger.log(response);


            callback(null, response);

        } catch (err: any) {
            logger.log(err);
            callbackError(callback, err);
        }
    };

    async logout(
        call: grpc.ServerUnaryCall<emptyProto.Empty, responseProto.SuccessResponse>,
        callback: grpc.sendUnaryData<responseProto.SuccessResponse>
    ) {
        try {
            const accessToken = AuthHelper.getAccessToken(call);

            const userId = this.authService.verifyAccessToken(accessToken)

            await this.logoutUseCase.execute(userId);
            const response = responseProto.SuccessResponse.create({success: true});

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
            const userObject = UserProtoMapper.toProto(await this.getUseCase.execute(new UserId(userId)));

            const result = authProto.UserResponse.create({user: userObject})

            callback(null, result);

        } catch (err: any) {
            logger.log(err);
            callbackError(callback, err);
        }
    };
}

export default AuthHandler;
