import axios from 'axios';
import { webhookURLNotFoundError } from '../exceptions/webhookErrors';

const sendWebhookNotification = async (webhookUrl: string, payload: any) => {
    try {
        await axios.post(webhookUrl, payload);
    } catch (error) {
        throw new webhookURLNotFoundError('Error sending to webhook, Check if the URL is correct.');
    }
};

export { sendWebhookNotification };
