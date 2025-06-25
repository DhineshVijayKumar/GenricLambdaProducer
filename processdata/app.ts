import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { SourceOrderData, TargetOrderModel } from './interface/process_order_producer_interface';
import { validateSourceOrderData, transformToTargetOrderModel } from './utils/order_service';
import { createResponse } from './utils/response_handler';
import axios from 'axios';
/**
 *
 * Event doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html#api-gateway-simple-proxy-for-lambda-input-format
 * @param {Object} event - API Gateway Lambda Proxy Input Format
 *
 * Return doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html
 * @returns {Object} object - API Gateway Lambda Proxy Output Format
 *
 */

export const lambdaHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
        if (event.httpMethod === 'GET' && event.path.endsWith('/process/order-producer/v1/healthCheck')) {
            const webhookUrl = process.env.WebhookUrl;
            if (!webhookUrl) {
                return createResponse(500, {
                    message: 'Webhook URL is not configured',
                });
            }
            return createResponse(200, {
                message: 'Service is up and running',
            });
        } else if (event.httpMethod === 'POST' && event.path.endsWith('/process/order-producer/v1')) {
            let req_body;
            try {
                req_body = event.body ? JSON.parse(event.body) : {};
            } catch (err) {
                return createResponse(422, {
                    message: 'Invalid order JSON object',
                });
            }

            const payload: SourceOrderData = req_body;

            const { status, message } = validateSourceOrderData(payload);
            if (status) {
                const targetPayload: TargetOrderModel = transformToTargetOrderModel(payload);
                // Process the targetPayload as needed

                const webhookUrl = process.env.WebhookUrl;
                if (!webhookUrl) {
                    return createResponse(500, {
                        message: 'Webhook URL is not configured',
                    });
                }
                await axios.post(webhookUrl, targetPayload);

                return createResponse(200, {
                    data: { 'transformed-data': targetPayload },
                    message: 'Data has been processed successfully',
                });
            }
            return createResponse(400, {
                message: message || 'Invalid input data',
                data: payload,
            });
        }
    } catch (err) {
        console.log(err);
        return createResponse(500, {
            message: 'internal server error',
        });
    }

    // Return 404 if no route matched
    return createResponse(404, {
        message: 'Method Not Found',
        data: {
            method: event.httpMethod,
            path: event.path,
        },
    });
};
