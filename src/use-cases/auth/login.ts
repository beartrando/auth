// import bcrypt from "bcrypt";
// import {generateAccessToken, generateRefreshToken} from "../../utils/token";
//
// export const login = async (email: string, password: string) => {
//     // ищем пользователя по email
//     const user = await prisma.user.findUnique({where: {email}});
//     if (!user || !user.passwordHash) {
//         throw new Error('Invalid credentials');
//     }
//
//     // проверяем пароль
//     const isValid = await bcrypt.compare(password, user.passwordHash);
//     if (!isValid) {
//         throw new Error('Invalid credentials');
//     }
//
//     // генерируем токены
//     const accessToken = generateAccessToken(user.id);
//     const refreshToken = generateRefreshToken(user.id);
//
//     // создаём новую сессию
//     await prisma.session.create({
//         data: {
//             userId: user.id,
//             accessToken,
//             refreshToken,
//         },
//     });
//
//     return {accessToken, refreshToken};
// };
