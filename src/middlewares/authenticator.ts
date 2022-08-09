import { Request, Response, NextFunction } from 'express';
import { TOKEN_SECRET } from '../database';
import { User } from '../models/User';
import jwt from 'jsonwebtoken';

const verifyUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const authorizationHeader = req.headers.authorization;
        const token = authorizationHeader?.split(' ')[1];
        jwt.verify(token as string, TOKEN_SECRET as string);
        next();
    } catch (error) {
        res.status(401);
        res.json('You need to sign-in to access this page.');
    }
};

const verifyAdmin = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const authorizationHeader = req.headers.authorization;
        const token = authorizationHeader?.split(' ')[1];

        jwt.verify(token as string, TOKEN_SECRET as string);

        const decoded = parseJwt(token as string);
        if (decoded.user.authority != 'admin') {
            throw new Error('You need admin privileges to access this page.');
        }

        next();
    } catch (error) {
        res.status(401);
        res.json(error);
    }
};

const createUserToken = (newUser: User): string => {
    return jwt.sign({ user: newUser }, TOKEN_SECRET as string);
};

const parseJwt = (token: string) => {
    return JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
};

export { verifyUser, verifyAdmin, createUserToken };
