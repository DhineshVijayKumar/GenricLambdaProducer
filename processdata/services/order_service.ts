import { SourceOrderData } from '../interface/SourceOrderDataInterface';
import { TargetOrderModel } from '../interface/TargetOrderInterface';

export class OrderService {
    private orderData: SourceOrderData;

    constructor(orderData: SourceOrderData) {
        this.orderData = orderData;
    }

    public validateSourceOrderData(): { status: boolean; message?: string } {
        if (typeof this.orderData !== 'object' || this.orderData === null) {
            return { status: false, message: 'Input is not a valid object or is empty.' };
        }

        const stringFields: Array<keyof SourceOrderData> = [
            'orderId',
            'orderDate',
            'customerId',
            'paymentMethod',
            'status',
        ];
        for (const field of stringFields) {
            const value = this.orderData[field];
            if (typeof value !== 'string' || value.trim() === '') {
                return { status: false, message: `Field '${field}' is required and must be a non-empty string.` };
            }
        }

        // Required number fields
        const numberFields: Array<keyof SourceOrderData> = ['storeId', 'totalAmount'];
        for (const field of numberFields) {
            if (!(field in this.orderData) || typeof this.orderData[field] !== 'number') {
                return { status: false, message: `Field '${field}' is required and must be a number.` };
            }
        }

        // Required items array
        if (!Array.isArray(this.orderData.items)) {
            return { status: false, message: "Field 'items' must be an array." };
        }
        if (this.orderData.items.length === 0) {
            return { status: false, message: "Field 'items' must have at least one item." };
        }
        for (let i = 0; i < this.orderData.items.length; i++) {
            const item = this.orderData.items[i];
            if (typeof item !== 'object' || item === null) {
                return { status: false, message: `Item at index ${i} in 'items' is not a valid object.` };
            }
            if (typeof item.sku !== 'string') {
                return { status: false, message: `Item at index ${i} in 'items': 'sku' must be a string.` };
            }
            if (typeof item.quantity !== 'number') {
                return { status: false, message: `Item at index ${i} in 'items': 'quantity' must be a number.` };
            }
            if (typeof item.unitPrice !== 'number') {
                return { status: false, message: `Item at index ${i} in 'items': 'unitPrice' must be a number.` };
            }
            if (item.discountAmount !== undefined && typeof item.discountAmount !== 'number') {
                return {
                    status: false,
                    message: `Item at index ${i} in 'items': 'discountAmount' must be a number if provided.`,
                };
            }
        }

        // Optional shippingAddress
        if (this.orderData.shippingAddress !== undefined) {
            const addr: { [key: string]: any } = this.orderData.shippingAddress;
            if (typeof addr !== 'object' || addr === null) {
                return { status: false, message: "Field 'shippingAddress' must be an object if provided." };
            }
            const addrFields = ['street', 'city', 'state', 'zipCode', 'country'];
            for (const field of addrFields) {
                if (typeof addr[field] !== 'string' || addr[field].trim() === '') {
                    return { status: false, message: `Field 'shippingAddress.${field}' must be a non-empty string.` };
                }
            }
        }

        // Optional notes
        if (this.orderData.notes !== undefined && typeof this.orderData.notes !== 'string') {
            return { status: false, message: "Field 'notes' must be a string if provided." };
        }

        // Status check (optional, for stricter validation)
        const validStatuses = ['NEW', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'];
        if (!validStatuses.includes(this.orderData.status)) {
            return { status: false, message: `Field 'status' must be one of: ${validStatuses.join(', ')}.` };
        }

        // Validate orderDate format (MM/DD/YYYY)
        const dateRegex = /^(0[1-9]|1[0-2])\/(0[1-9]|[12][0-9]|3[01])\/\d{4}$/;
        if (!dateRegex.test(this.orderData.orderDate)) {
            return { status: false, message: "Field 'orderDate' must be in MM/DD/YYYY format." };
        }

        return { status: true };
    }

    public transformToTargetOrderModel(): TargetOrderModel {
        const orderData: TargetOrderModel = {
            order: {
                id: this.orderData.orderId,
                createdAt: (() => {
                    const [mm, dd, yyyy] = this.orderData.orderDate.split('/');
                    return `${yyyy}-${mm.padStart(2, '0')}-${dd.padStart(2, '0')}`;
                })(), // Convert MM/DD/YYYY to YYYY-MM-DD
                customer: {
                    id: this.orderData.customerId,
                },
                location: {
                    storeId: this.orderData.storeId.toString(), // Store ID as string
                },
                status: this.orderData.status.toLocaleLowerCase(),
                payment: {
                    method: this.orderData.paymentMethod,
                    total: this.orderData.totalAmount,
                },
                shipping: {
                    address: {
                        line1: this.orderData.shippingAddress ? this.orderData.shippingAddress.street : '',
                        city: this.orderData.shippingAddress ? this.orderData.shippingAddress.city : '',
                        state: this.orderData.shippingAddress ? this.orderData.shippingAddress.state : '',
                        postalCode: this.orderData.shippingAddress ? this.orderData.shippingAddress.zipCode : '',
                        country: this.orderData.shippingAddress ? this.orderData.shippingAddress.country : '',
                    },
                },
            },
            items: this.orderData.items.map((item) => ({
                productId: item.sku,
                quantity: item.quantity,
                price: {
                    base: item.unitPrice,
                    discount: item.discountAmount || 0, // Default to 0 if no discount
                    final: item.unitPrice - (item.discountAmount || 0), // Final price after discount
                },
            })),
            metadata: {
                source: 'order_producer',
                notes: this.orderData.notes || '',
                processedAt: new Date().toISOString(), // Current timestamp in ISO format
            },
        };
        return orderData;
    }
}
