import { SourceOrderData, TargetOrderModel } from '../interface/process_order_producer_interface';

export function validateSourceOrderData(data: any): { status: boolean; message?: string } {
    if (typeof data !== 'object' || data === null) {
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
        if (!(field in data) || typeof data[field] !== 'string' || data[field].trim() === '') {
            return { status: false, message: `Field '${field}' is required and must be a non-empty string.` };
        }
    }

    // Required number fields
    const numberFields: Array<keyof SourceOrderData> = ['storeId', 'totalAmount'];
    for (const field of numberFields) {
        if (!(field in data) || typeof data[field] !== 'number') {
            return { status: false, message: `Field '${field}' is required and must be a number.` };
        }
    }

    // Required items array
    if (!Array.isArray(data.items)) {
        return { status: false, message: "Field 'items' must be an array." };
    }
    if (data.items.length === 0) {
        return { status: false, message: "Field 'items' must have at least one item." };
    }
    for (let i = 0; i < data.items.length; i++) {
        const item = data.items[i];
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
    if (data.shippingAddress !== undefined) {
        const addr = data.shippingAddress;
        if (typeof addr !== 'object' || addr === null) {
            return { status: false, message: "Field 'shippingAddress' must be an object if provided." };
        }
        const addrFields = ['street', 'city', 'state', 'zipCode', 'country'];
        for (const field of addrFields) {
            if (typeof addr[field] !== 'string') {
                return { status: false, message: `Field 'shippingAddress.${field}' must be a string.` };
            }
        }
    }

    // Optional notes
    if (data.notes !== undefined && typeof data.notes !== 'string') {
        return { status: false, message: "Field 'notes' must be a string if provided." };
    }

    // Status check (optional, for stricter validation)
    const validStatuses = ['NEW', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'];
    if (!validStatuses.includes(data.status)) {
        return { status: false, message: `Field 'status' must be one of: ${validStatuses.join(', ')}.` };
    }

    // Validate orderDate format (MM/DD/YYYY)
    const dateRegex = /^(0[1-9]|1[0-2])\/(0[1-9]|[12][0-9]|3[01])\/\d{4}$/;
    if (!dateRegex.test(data.orderDate)) {
        return { status: false, message: "Field 'orderDate' must be in MM/DD/YYYY format." };
    }

    return { status: true };
}

export function transformToTargetOrderModel(data: SourceOrderData): TargetOrderModel {
    const orderData: TargetOrderModel = {
        order: {
            id: data.orderId,
            createdAt: (() => {
                const [mm, dd, yyyy] = data.orderDate.split('/');
                return `${yyyy}-${mm.padStart(2, '0')}-${dd.padStart(2, '0')}`;
            })(), // Convert MM/DD/YYYY to YYYY-MM-DD
            customer: {
                id: data.customerId,
            },
            location: {
                storeId: data.storeId.toString(), // Store ID as string
            },
            status: data.status.toLocaleLowerCase(),
            payment: {
                method: data.paymentMethod,
                total: data.totalAmount,
            },
            shipping: {
                address: {
                    line1: data.shippingAddress ? data.shippingAddress.street : '',
                    city: data.shippingAddress ? data.shippingAddress.city : '',
                    state: data.shippingAddress ? data.shippingAddress.state : '',
                    postalCode: data.shippingAddress ? data.shippingAddress.zipCode : '',
                    country: data.shippingAddress ? data.shippingAddress.country : '',
                },
            },
        },
        items: data.items.map((item) => ({
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
            notes: data.notes || '',
            processedAt: new Date().toISOString(), // Current timestamp in ISO format
        },
    };
    return orderData;
}
