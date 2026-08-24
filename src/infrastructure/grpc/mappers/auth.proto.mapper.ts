import * as authProto from "../../../contracts/proto/auth";
import AuthObject from "../../../domain/auth/value-objects/auth-object.vo";

export class AuthProtoMapper {
    static toProto(auth: AuthObject): authProto.AuthObject {
        return authProto.AuthObject.create({
            accessToken: auth.accessToken.value,
            refreshToken: auth.refreshToken.value,
        });
    }

}

export default AuthProtoMapper;
