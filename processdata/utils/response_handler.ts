import { APIGatewayProxyResult } from 'aws-lambda';
// import { logEvents } from './logger';
import { Response } from 'express';
import logger from './logger';

export const createResponse = (res: Response, statusCode: number, body: any): Response => {
    // if (statusCode === 200) {
    //     logEvents('SUCCESS', body);
    // } else if (statusCode >= 400) {
    //     logEvents('CLIENT ERROR', body);
    // } else if (statusCode >= 500) {
    //     logEvents('SERVER ERROR', body);
    // } else {
    //     logEvents('INFO', body);
    // }

    logger.info(JSON.stringify(body));

    return res.status(statusCode).json(body);
};
