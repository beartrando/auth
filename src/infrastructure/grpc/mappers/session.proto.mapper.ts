// import {Session} from "@prisma/client";
// import ProfileEntity from "../../../domain/entities/user.entity";
// import ProfileId from "../../../domain/value-objects/id.vo";
// import SessionEntity from "../../../domain/entities/session.entity";
// import AccessToken from "../../../domain/value-objects/session/access-token.vo";
// import RefreshToken from "../../../domain/value-objects/session/refresh-token.vo";
// import * as authProto from "../../../contracts/proto/auth";
// export class SessionDbMapper {
//     static to(session: SessionEntity): Session {
//         return {
//             session.id.value,
//             session.userId.value,
//             session.accessToken.value,
//             session.refreshToken.value,
//             session.createdAt,
//             session.updatedAt,
//         };
//     }
//
//     static from(session: Session): SessionEntity {
//         return new SessionEntity(
//             new ProfileId(session.id),
//
//             new ProfileId(session.userId),
//
//             new AccessToken(session.accessToken),
//             new RefreshToken(session.refreshToken),
//
//             session.createdAt,
//             session.updatedAt,
//         );
//     }
// }
//
// export default SessionDbMapper;
