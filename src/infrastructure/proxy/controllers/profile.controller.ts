import * as orchestrationProto from "../../grpc/generated/orchestration";
import * as profileProto from "../../grpc/generated/profile";
import {response} from "../adapter/response";
import {getJwtFromProxyRequest} from "../../../utils/proxy-request-metadata";
import {createMetadataWithJwt} from "../../../utils/grpc-request-metadata";
import logger from "@shared/logger";
import {parseQueryParams} from "../../../utils/parse-query-params";
import {parseBody} from "../../../utils/parse-body";
import * as authProto from "../../grpc/generated/auth";
import getMeUseCase from "../../../use-cases/profile/get-me";
import getUseCase from "../../../use-cases/profile/get";

export async function getMe(
    request: orchestrationProto.ProxyRequest,
): Promise<orchestrationProto.ProxyResponse> {

    const jwt = getJwtFromProxyRequest(request);

    logger.log(jwt);

    const profile = await getMeUseCase.execute(jwt);

    return response.ok(profile);
}

export async function get(
    request: orchestrationProto.ProxyRequest,
): Promise<orchestrationProto.ProxyResponse> {

    const { profileId } = parseQueryParams<profileProto.ProfileIdRequest>(request.queryParams);

    logger.log(request.body);
    logger.log(profileId);
    const jwt = getJwtFromProxyRequest(request);

    const profile = await getUseCase.execute(profileId, jwt);

    return response.ok(profile);
}
