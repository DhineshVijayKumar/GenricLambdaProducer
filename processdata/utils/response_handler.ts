import { APIGatewayProxyResult } from 'aws-lambda';
import { logEvents } from './logger';

export const createResponse = (statusCode: number, body: any): APIGatewayProxyResult => {
    if (statusCode === 200) {
        logEvents('SUCCESS', body);
    } else if (statusCode >= 400) {
        logEvents('CLIENT ERROR', body);
    } else if (statusCode >= 500) {
        logEvents('SERVER ERROR', body);
    } else {
        logEvents('INFO', body);
    }

    return {
        statusCode,
        body: JSON.stringify(body),
    };
};
