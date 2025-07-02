import { Request, Response } from 'express';
import { webhookUrl } from '../utils/global_config';
import { sendWebhookNotification } from '../services/webhook_servce';
import { OrderInvalidError } from '../exceptions/orderDataValidationError';
import { SourceOrderData } from '../interface/SourceOrderDataInterface';
import { OrderService } from '../services/order_service';
import { TargetOrderModel } from '../interface/TargetOrderInterface';
import { createResponse } from '../utils/response_handler';
import logger from '../utils/logger';

export class OrderController {
    public healthCheck = async (req: Request, res: Response): Promise<any> => {
        logger.debug('Received request to health check');
        await sendWebhookNotification(webhookUrl(), { message: 'Health Check Test' });
        return createResponse(res, 200, {
            Message: 'Service is up and running',
            webhookStatus: 'Webhook URL is configured and the service is available',
        });
    };

    public processOrder = async (req: Request, res: Response): Promise<any> => {
        let req_body;
        try {
            req_body = req.body;
            logger.debug('Request body:' + JSON.stringify(req_body));
            if (!req_body) {
                throw new OrderInvalidError('Request body is empty');
            }
        } catch (err) {
            throw new OrderInvalidError('Invalid JSON format in request body');
        }

        const payload: SourceOrderData = req_body.data;
        const orderService = new OrderService(payload);
        logger.debug('Payload:' + JSON.stringify(payload));
        const { status, message } = orderService.validateSourceOrderData();

        if (status) {
            const targetPayload: TargetOrderModel = orderService.transformToTargetOrderModel();
            await sendWebhookNotification(webhookUrl(), targetPayload);

            return createResponse(res, 200, {
                data: { 'transformed-data': targetPayload },
                message: 'Data has been processed successfully',
            });
        }

        throw new OrderInvalidError(message);
    };
}
