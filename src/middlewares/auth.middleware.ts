import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config';

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization;
    
    if (!token) {
        return res.status(401).json({
            status: 'error',
            message: 'Access denied, no token!!!'
        });
    }

    try {
        const decoded = jwt.verify(token, config.jwtSecret) as any;
        (req as any).userId = decoded.userId;
        next();
    } catch {
        return res.status(401).json({
            message: 'Invalid token'
        });
    }
};