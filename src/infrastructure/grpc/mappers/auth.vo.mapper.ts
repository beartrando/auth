import * as authProto from "../../../contracts/proto/auth";
import Auth from "../../../domain/value-objects/auth.vo";

export class AuthGrpcMapper {
    static toGrpc(auth: Auth): authProto.AuthObject {
        return authProto.AuthObject.create({
            accessToken: auth.accessToken.value,
            refreshToken: auth.refreshToken.value,
        });
    }

}

export default AuthGrpcMapper;
