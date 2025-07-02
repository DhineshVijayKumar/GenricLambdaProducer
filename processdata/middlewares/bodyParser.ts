import { Request, Response, NextFunction } from 'express';
export function bodyParser(req: Request, res: Response, next: NextFunction) {
    if (Buffer.isBuffer(req.body)) {
        try {
            req.body = JSON.parse(req.body.toString('utf8'));
        } catch {
            req.body = {};
        }
    } else if (typeof req.body === 'string') {
        try {
            req.body = JSON.parse(req.body);
        } catch {
            req.body = {};
        }
    }
    next();
}
