import { APIGatewayProxyResult } from 'aws-lambda';
// import { logEvents } from './logger';
import logger from './logger';
import { Response } from 'express';

export const createErrorResponse = (res: Response, statusCode: number, error: Error): Response => {
    const err_payload = {
        error_name: error?.name,
        error_message: error.message,
    };

    logger.error(JSON.stringify(err_payload));
    
    // if (statusCode === 200) {
    //     logEvents('SUCCESS', err_payload);
    // } else if (statusCode >= 400) {
    //     logEvents('CLIENT ERROR', err_payload);
    // } else if (statusCode >= 500) {
    //     logEvents('SERVER ERROR', err_payload);
    // } else {
    //     logEvents('INFO', err_payload);
    // }

    return res.status(statusCode).json(err_payload);
};
