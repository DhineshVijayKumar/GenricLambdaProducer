class webhookURLNotFoundError extends Error {
    constructor(message?: string) {
        super(message || 'Webhook URL is not configured');
        this.name = 'WebhookURLNotFoundError';
        Object.setPrototypeOf(this, webhookURLNotFoundError.prototype);
    }
}

export { webhookURLNotFoundError };
