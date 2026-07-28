// import {NextFunction, Request, Response} from 'express';
// import jwt from 'jsonwebtoken';
// import app from "../../app/app";
//
//
// export const verifyToken = (req: Request, res: Response, next: NextFunction) => {
//     // logger.log(req.headers.authorization);
//     let token = req.headers.authorization?.split(' ')[1];
//
//     // logger.log(token);
//
//     if (!token) {
//         return res.status(401).json({message: 'Token is missing'});
//     }
//
//     try {
//         const decoded = jwt.verify(token, app.jwtAccessSecret!);
//         (req as any).user = decoded;
//         next();
//     } catch (err) {
//         return res.status(401).json({message: 'Invalid token'});
//     }
// };
