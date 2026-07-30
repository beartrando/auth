// import Id from "../value-objects/id";
// import Auth from "../value-objects/auth.vo";
// import AccessToken from "../value-objects/access-token.vo";
// import RefreshToken from "../value-objects/refresh-token.vo";
//
// export class AuthDomainService {
//
//     createAuth(
//         userId: Id,
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
//         userId: Id,
//     ): string {
//         // TODO: JWT generation
//         return "";
//     }
//
//
//     private generateRefreshToken(
//         userId: Id,
//     ): string {
//         // TODO: JWT generation
//         return "";
//     }
// }
//
// export default AuthDomainService;
