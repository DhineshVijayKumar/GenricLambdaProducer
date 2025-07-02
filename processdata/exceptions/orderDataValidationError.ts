class OrderInvalidError extends Error {
    constructor(message?: string) {
        super(message || 'Invalid order data');
        this.name = 'OrderInvalidError';
        Object.setPrototypeOf(this, OrderInvalidError.prototype);
    }
}

export { OrderInvalidError };
