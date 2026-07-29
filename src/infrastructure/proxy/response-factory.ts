import * as responseProto from "../grpc/generated/common/response";
import * as errorProto from "../grpc/generated/common/error";

export class ResponseFactory {
    error<
        T extends {
            create(data: {
                error: errorProto.ErrorObject;
            }): R;
        },
        R
    >(
        responseType: T,
        code: errorProto.ErrorCode,
        message: string,
    ): R {
        return responseType.create({
            error: {
                code,
                message,
            },
        });
    }
}

const responseFactory = new ResponseFactory();

export default responseFactory;
