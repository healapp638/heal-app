import { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';

export const requestIdMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const requestId = (req.header('x-request-id') as string) || crypto.randomUUID();//If request already has ID → use itElse → create new
    (req as any).id = requestId;//Attach to request

    // default userId
    (req as any).userId = (req as any).userId || "anonymous";

    res.setHeader('x-request-id', requestId);//Send it back to frontend
    res.setHeader("Access-Control-Expose-Headers", "x-request-id");
    next();//Pass request to next step
};
