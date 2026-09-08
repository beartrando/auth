// import {Session} from "@prisma/client";
// import ProfileEntity from "../../../setting/user/user.entity";
// import ProfileId from "../../../setting/value-objects/id.vo";
// import SessionEntity from "../../../setting/session/session.entity";
// import SessionAccessToken from "../../../setting/session/value-objects/access-token.vo";
// import SessionRefreshToken from "../../../setting/session/value-objects/refresh-token.vo";
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
//             new SessionAccessToken(session.accessToken),
//             new SessionRefreshToken(session.refreshToken),
//
//             session.createdAt,
//             session.updatedAt,
//         );
//     }
// }
//
// export default SessionDbMapper;
