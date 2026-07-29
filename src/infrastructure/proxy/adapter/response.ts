import responseFactory from "../response-factory";
import * as responseProto from "../../grpc/generated/common/response";
import * as errorProto from "../../grpc/generated/common/error";
import * as orchestrationProto from "../../grpc/generated/orchestration";

export class ResponseAdapter {

    private normalize(data: unknown): unknown {
        return data ?? responseFactory.error(
            responseProto.EmptyResponse,
            errorProto.ErrorCode.SERVICE_UNAVAILABLE,
            "Service unavailable",
        );
    }

    public ok(data: unknown): orchestrationProto.ProxyResponse {
        return this.json(200, this.normalize(data));
    }

    private json(
        statusCode: number,
        body: unknown,
    ): orchestrationProto.ProxyResponse {

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
