// import DeviceId from "../value-objects/id";
// import Auth from "../value-objects/auth.vo";
// import AccessToken from "../value-objects/session/access-token.vo";
// import RefreshToken from "../value-objects/session/refresh-token.vo";
//
// export class AuthDomainService {
//
//     createAuth(
//         userId: DeviceId,
//     ): Auth {
//
//         const accessToken = this.generateAccessToken(userId);
//         const refreshToken = this.generateRefreshToken(userId);
//
//         return new Auth(
//             new AccessToken(accessToken),
//             new RefreshToken(refreshToken),
//         );
//     }
//
//
//     private generateAccessToken(
//         userId: DeviceId,
//     ): string {
//         // TODO: JWT generation
//         return "";
//     }
//
//
//     private generateRefreshToken(
//         userId: DeviceId,
//     ): string {
//         // TODO: JWT generation
//         return "";
//     }
// }
//
// export default AuthDomainService;
