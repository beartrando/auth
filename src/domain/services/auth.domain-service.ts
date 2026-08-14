// import ProfileId from "../value-objects/id";
// import Auth from "../value-objects/auth.vo";
// import AccessToken from "../value-objects/session/access-token.vo";
// import RefreshToken from "../value-objects/session/refresh-token.vo";
//
// export class AuthDomainService {
//
//     createAuth(
//         userId: ProfileId,
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
//         userId: ProfileId,
//     ): string {
//         // TODO: JWT generation
//         return "";
//     }
//
//
//     private generateRefreshToken(
//         userId: ProfileId,
//     ): string {
//         // TODO: JWT generation
//         return "";
//     }
// }
//
// export default AuthDomainService;
