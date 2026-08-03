import * as authProto from "../../../contracts/proto/auth";
import Auth from "../../../domain/value-objects/auth.vo";

export class AuthProtoMapper {
    static toProto(auth: Auth): authProto.AuthObject {
        return authProto.AuthObject.create({
            accessToken: auth.accessToken.value,
            refreshToken: auth.refreshToken.value,
        });
    }

}

export default AuthProtoMapper;
