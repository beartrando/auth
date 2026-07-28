import responseFactory from "../response-factory";
import * as responseGrpc from "../../grpc/generated/common/response";
import * as errorGrpc from "../../grpc/generated/common/error";
import * as orchestrationGrpc from "../../grpc/generated/orchestration";

export class ResponseAdapter {

    private normalize(data: unknown): unknown {
        return data ?? responseFactory.error(
            responseGrpc.EmptyResponse,
            errorGrpc.ErrorCode.SERVICE_UNAVAILABLE,
            "Service unavailable",
        );
    }

    public ok(data: unknown): orchestrationGrpc.ProxyResponse {
        return this.json(200, this.normalize(data));
    }

    private json(
        statusCode: number,
        body: unknown,
    ): orchestrationGrpc.ProxyResponse {

        return {
            statusCode,
            headers: [
                {
                    key: "content-type",
                    value: "application/json",
                },
            ],
            body: Buffer.from(
                JSON.stringify(body),
            ),
        };
    }
}

export const response = new ResponseAdapter();
