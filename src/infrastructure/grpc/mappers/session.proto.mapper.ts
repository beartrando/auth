import * as authProto from "../../../contracts/proto/auth";
import SessionEntity from "../../../domain/session/session.entity";

export class SessionProtoMapper {
    static toProto(session: SessionEntity): authProto.SessionObject {
        return authProto.SessionObject.create({
            accessToken: session.accessToken.value,
            refreshToken: session.refreshToken.value,
        });
    }

}

export default SessionProtoMapper;
