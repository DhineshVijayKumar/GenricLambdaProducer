import { Request, Response, NextFunction } from 'express';
import { EnvVarNotConfiguredError } from '../exceptions/envVariableError';
import { OrderInvalidError } from '../exceptions/orderDataValidationError';
import { webhookURLNotFoundError } from '../exceptions/webhookErrors';
import { createErrorResponse } from '../utils/errResponseHandler';
export function errorHandler(err: Error, req: Request, res: Response, next: NextFunction) {
    if (err instanceof EnvVarNotConfiguredError) {
        return createErrorResponse(res, 500, err);
    } else if (err instanceof OrderInvalidError) {
        return createErrorResponse(res, 400, err);
    } else if (err instanceof webhookURLNotFoundError) {
        return createErrorResponse(res, 404, err);
    } else {
        return createErrorResponse(res, 500, err);
    }
}
