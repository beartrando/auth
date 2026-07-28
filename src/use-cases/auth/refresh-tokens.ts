import {LiveStatus} from "../../infrastructure/grpc/generated/common/health";

export class RefreshTokensUseCase {
    async execute(): Promise<LiveStatus> {
        // return async (token: string) => {
        //     const decoded = verifyRefreshToken(token) as any;
        //
        //     // ищем сессию по refreshToken
        //     const session = await prisma.session.findFirst({
        //         where: {refreshToken: token},
        //         include: {user: true},
        //     });
        //
        //     if (!session || !session.user || session.user.id !== decoded.userId) {
        //         throw new Error('Invalid refresh token');
        //     }
        //
        //     const newAccessToken = generateAccessToken(session.user.id);
        //     const newRefreshToken = generateRefreshToken(session.user.id);
        //
        //     // обновляем сессию
        //     await prisma.session.update({
        //         where: {id: session.id},
        //         data: {
        //             accessToken: newAccessToken,
        //             refreshToken: newRefreshToken,
        //         },
        //     });
        //
        //     return {
        //         accessToken: newAccessToken,
        //         refreshToken: newRefreshToken,
        //     };
        // };
    }
}


const refreshTokensUseCase = new RefreshTokensUseCase();

export default refreshTokensUseCase;

