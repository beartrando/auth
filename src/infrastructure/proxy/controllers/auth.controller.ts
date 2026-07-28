import * as orchestrationGrpc from "../../grpc/generated/orchestration";
import * as authGrpc from "../../grpc/generated/auth";
import * as errorGrpc from "../../grpc/generated/common/error";
import {response} from "../adapter/response";
import {getJwtFromProxyRequest} from "../../../utils/proxy-request-metadata";
import {parseBody} from "../../../utils/parse-body";
import anonymousSignInUseCase from "../../../use-cases/auth/anonymous-sign-in";
import getMeUseCase from "../../../use-cases/auth/get-me";
import {getOrCreateUseCase as getOrCreateProfileUseCase,} from "../../../use-cases/profile/get-or-create";
import responseFactory from "../response-factory";
import refreshTokensUseCase from "../../../use-cases/auth/refresh-tokens";

export async function anonymousSignIn(
    request: orchestrationGrpc.ProxyRequest,
): Promise<orchestrationGrpc.ProxyResponse> {

    const {deviceId} = parseBody<authGrpc.AnonymousSignInRequest>(request.body);

    const resp = await anonymousSignInUseCase.execute(deviceId);

    if (!resp) {
        return response.ok(
            responseFactory.error(
                authGrpc.AuthResponse,
                errorGrpc.ErrorCode.SERVICE_UNAVAILABLE,
                "Auth service unavailable",
            )
        );
    }

    if (resp.error) {
        return response.ok(resp);
    }

    if (resp.auth?.accessToken) {
        await getOrCreateProfileUseCase.execute(resp.auth.accessToken);
        return response.ok(resp);
    }

    return response.ok(
        responseFactory.error(
            authGrpc.AuthResponse,
            errorGrpc.ErrorCode.INVALID_RESPONSE,
            "Auth service returned invalid response",
        )
    );
}

export async function getMe(
    request: orchestrationGrpc.ProxyRequest,
): Promise<orchestrationGrpc.ProxyResponse> {

    const jwt = getJwtFromProxyRequest(request);

    const resp = response.ok(await getMeUseCase.execute(jwt));
    return response.ok(resp);
}

export async function refreshTokens(
    request: orchestrationGrpc.ProxyRequest,
): Promise<orchestrationGrpc.ProxyResponse> {

    const {token} = parseBody<authGrpc.RefreshTokensRequest>(request.body);


    const resp = response.ok(await refreshTokensUseCase.execute(token));
    return response.ok(resp);
}

// export const register = wrapper(async (req, res) => {
//   const {email, password} = req.body;
//   return authService.register(email, password);
// });
//
// export const login = wrapper(async (req, res) => {
//   const {email, password} = req.body;
//   return authService.login(email, password);
// });
//
// export const logout = wrapper(async (req, res) => {
//   const userId = getUserId(req);
//   return authService.logout(userId);
// });
//
// export const forgotPassword = wrapper(async (req, res) => {
//   const email = req.body.email;
//   return authService.forgotPassword(email);
// });
//
// export const resetPassword = wrapper(async (req, res) => {
//   const {token, newPassword} = req.body;
//   return authService.resetPassword(token, newPassword);
// });

