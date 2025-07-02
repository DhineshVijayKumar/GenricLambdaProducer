// import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
// import { lambdaHandler } from '../../app';
// import { validateSourceOrderData, transformToTargetOrderModel } from '../../services/order_service';
// import { expect, describe, it, beforeEach, jest } from '@jest/globals';
// import axios from 'axios';

// const baseOrder = {
//     orderId: 'ORD-12345',

//     orderDate: '10/15/2023',

//     customerId: 'CUST-789',

//     storeId: 42,

//     items: [
//         {
//             sku: 'PROD-001',

//             quantity: 2,

//             unitPrice: 29.99,

//             discountAmount: 5.0,
//         },

//         {
//             sku: 'PROD-002',

//             quantity: 1,

//             unitPrice: 49.99,
//         },
//     ],

//     paymentMethod: 'CREDIT_CARD',

//     shippingAddress: {
//         street: '123 Main St',

//         city: 'Columbus',

//         state: 'OH',

//         zipCode: '43215',

//         country: 'USA',
//     },

//     totalAmount: 104.97,

//     status: 'NEW',

//     notes: 'Please deliver after 5pm',
// };

// describe('validateSourceOrderData - full sequential coverage', () => {
//     it('fails if data is not an object', () => {
//         expect(validateSourceOrderData(null).status).toBe(false);
//         expect(validateSourceOrderData(undefined).status).toBe(false);
//         expect(validateSourceOrderData(123).status).toBe(false);
//         expect(validateSourceOrderData('string').status).toBe(false);
//     });

//     it('fails if required string fields are missing or empty', () => {
//         for (const field of ['orderId', 'orderDate', 'customerId', 'paymentMethod', 'status']) {
//             const order = { ...baseOrder, [field]: undefined };
//             expect(validateSourceOrderData(order).status).toBe(false);

//             const order2 = { ...baseOrder, [field]: '' };
//             expect(validateSourceOrderData(order2).status).toBe(false);

//             const order3 = { ...baseOrder, [field]: 123 };
//             expect(validateSourceOrderData(order3).status).toBe(false);
//         }
//     });

//     it('fails if required number fields are missing or not numbers', () => {
//         for (const field of ['storeId', 'totalAmount']) {
//             const order: Partial<typeof baseOrder> = { ...baseOrder };
//             delete order[field as keyof typeof baseOrder];
//             expect(validateSourceOrderData(order).status).toBe(false);

//             const order2 = { ...baseOrder, [field]: 'not-a-number' };
//             expect(validateSourceOrderData(order2).status).toBe(false);
//         }
//     });

//     it('fails if items is not an array', () => {
//         const order = { ...baseOrder, items: null };
//         expect(validateSourceOrderData(order).status).toBe(false);

//         const order2 = { ...baseOrder, items: 'not-an-array' };
//         expect(validateSourceOrderData(order2).status).toBe(false);
//     });

//     it('fails if items array is empty', () => {
//         const order = { ...baseOrder, items: [] };
//         expect(validateSourceOrderData(order).status).toBe(false);
//     });

//     it('fails if any item is not an object', () => {
//         const order = { ...baseOrder, items: [null] };
//         expect(validateSourceOrderData(order).status).toBe(false);

//         const order2 = { ...baseOrder, items: ['not-an-object'] };
//         expect(validateSourceOrderData(order2).status).toBe(false);
//     });

//     it('fails if item.sku is not a string', () => {
//         const order = { ...baseOrder, items: [{ ...baseOrder.items[0], sku: 123 }] };
//         expect(validateSourceOrderData(order).status).toBe(false);
//     });

//     it('fails if item.quantity is not a number', () => {
//         const order = { ...baseOrder, items: [{ ...baseOrder.items[0], quantity: 'not-a-number' }] };
//         expect(validateSourceOrderData(order).status).toBe(false);
//     });

//     it('fails if item.unitPrice is not a number', () => {
//         const order = { ...baseOrder, items: [{ ...baseOrder.items[0], unitPrice: 'not-a-number' }] };
//         expect(validateSourceOrderData(order).status).toBe(false);
//     });

//     it('fails if item.discountAmount is not a number when provided', () => {
//         const order = { ...baseOrder, items: [{ ...baseOrder.items[0], discountAmount: 'not-a-number' }] };
//         expect(validateSourceOrderData(order).status).toBe(false);
//     });

//     it('fails if shippingAddress is not an object', () => {
//         const order = { ...baseOrder, shippingAddress: 'not-an-object' };
//         expect(validateSourceOrderData(order).status).toBe(false);
//     });

//     it('fails if shippingAddress fields are not strings', () => {
//         const badAddress = { street: 123, city: 'A', state: 'B', zipCode: 'C', country: 'D' };
//         const order = { ...baseOrder, shippingAddress: badAddress };
//         expect(validateSourceOrderData(order).status).toBe(false);
//     });

//     it('fails if notes is not a string when provided', () => {
//         const order = { ...baseOrder, notes: 123 };
//         expect(validateSourceOrderData(order).status).toBe(false);
//     });

//     it('fails if status is not one of allowed values', () => {
//         const order = { ...baseOrder, status: 'INVALID' };
//         expect(validateSourceOrderData(order).status).toBe(false);
//     });

//     it('fails if orderDate does not match MM/DD/YYYY format', () => {
//         const order = { ...baseOrder, orderDate: '2023-12-25' };
//         expect(validateSourceOrderData(order).status).toBe(false);

//         const order2 = { ...baseOrder, orderDate: '13/25/2023' };
//         expect(validateSourceOrderData(order2).status).toBe(false);

//         const order3 = { ...baseOrder, orderDate: '00/25/2023' };
//         expect(validateSourceOrderData(order3).status).toBe(false);

//         const order4 = { ...baseOrder, orderDate: '12/00/2023' };
//         expect(validateSourceOrderData(order4).status).toBe(false);
//     });

//     it('returns status true for a fully valid order', () => {
//         expect(validateSourceOrderData(baseOrder).status).toBe(true);
//     });
// });

// describe('transformToTargetOrderModel - full sequential coverage', () => {
//     it('transforms a valid SourceOrderData to TargetOrderModel', () => {
//         const transformed = transformToTargetOrderModel(baseOrder);

//         // Check static fields
//         expect(transformed.order.id).toBe('ORD-12345');
//         expect(transformed.order.customer.id).toBe('CUST-789');
//         expect(transformed.order.location.storeId).toBe('42');
//         expect(transformed.order.status).toBe('new');
//         expect(transformed.order.payment.method).toBe('CREDIT_CARD');
//         expect(transformed.order.payment.total).toBe(104.97);
//         expect(transformed.order.shipping.address).toEqual({
//             line1: '123 Main St',
//             city: 'Columbus',
//             state: 'OH',
//             postalCode: '43215',
//             country: 'USA',
//         });

//         // Check items
//         expect(transformed.items).toEqual([
//             {
//                 productId: 'PROD-001',
//                 quantity: 2,
//                 price: {
//                     base: 29.99,
//                     discount: 5.0,
//                     final: 24.99,
//                 },
//             },
//             {
//                 productId: 'PROD-002',
//                 quantity: 1,
//                 price: {
//                     base: 49.99,
//                     discount: 0,
//                     final: 49.99,
//                 },
//             },
//         ]);

//         // Check metadata static fields
//         expect(transformed.metadata.source).toBe('order_producer');
//         expect(transformed.metadata.notes).toBe('Please deliver after 5pm');

//         // Check createdAt format and validity
//         expect(transformed.order.createdAt).toMatch(/^\d{4}-\d{2}-\d{2}$/);
//         expect(new Date(transformed.order.createdAt).toString()).not.toBe('Invalid Date');

//         // Check processedAt format and validity (ISO string)
//         expect(transformed.metadata.processedAt).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/);
//         expect(new Date(transformed.metadata.processedAt).toString()).not.toBe('Invalid Date');
//     });
// });

// jest.mock('axios');
// const mockedAxios = axios as jest.Mocked<typeof axios>;

// describe('lambdaHandler', () => {
//     const baseEvent: Partial<APIGatewayProxyEvent> = {
//         headers: {},
//         isBase64Encoded: false,
//         multiValueHeaders: {},
//         multiValueQueryStringParameters: {},
//         pathParameters: {},
//         queryStringParameters: {},
//         requestContext: {} as any,
//         resource: '',
//         stageVariables: {},
//     };

//     beforeEach(() => {
//         jest.clearAllMocks();
//         process.env.WebhookUrl = 'https://webhook.site/9681d4a0-cf1c-4336-98ed-62ac5c896a5e';
//     });

//     it('returns 200 for health check GET', async () => {
//         const event = {
//             ...baseEvent,
//             httpMethod: 'GET',
//             path: '/process/order-producer/v1/healthCheck',
//         } as APIGatewayProxyEvent;

//         const result = await lambdaHandler(event);
//         expect(result.statusCode).toBe(200);
//         expect(JSON.parse(result.body).message).toBe('Service is up and running');
//     });

//     it('returns 500 for health check GET if webhook url is not configured', async () => {
//         delete process.env.WebhookUrl;
//         const event = {
//             ...baseEvent,
//             httpMethod: 'GET',
//             path: '/process/order-producer/v1/healthCheck',
//         } as APIGatewayProxyEvent;

//         const result = await lambdaHandler(event);
//         expect(result.statusCode).toBe(500);
//         expect(JSON.parse(result.body).message).toMatch(/Webhook URL is not configured/);
//     });

//     it('returns 200 for valid POST and sends to webhook', async () => {
//         mockedAxios.post.mockResolvedValue({ status: 200 });

//         const event = {
//             ...baseEvent,
//             httpMethod: 'POST',
//             path: '/process/order-producer/v1',
//             body: JSON.stringify(baseOrder),
//         } as APIGatewayProxyEvent;

//         const result = await lambdaHandler(event);
//         expect(result.statusCode).toBe(200);
//         expect(JSON.parse(result.body).message).toMatch(/processed successfully/);
//         expect(mockedAxios.post).toHaveBeenCalledWith(process.env.WebhookUrl, expect.any(Object));
//     });

//     it('returns 400 for invalid POST payload without orderId feild', async () => {
//         const invalidOrder = { ...baseOrder, orderId: undefined };
//         const event = {
//             ...baseEvent,
//             httpMethod: 'POST',
//             path: '/process/order-producer/v1',
//             body: JSON.stringify(invalidOrder),
//         } as APIGatewayProxyEvent;

//         const result = await lambdaHandler(event);
//         expect(result.statusCode).toBe(400);
//         expect(JSON.parse(result.body).message).toMatch(/orderId/);
//     });

//     it('returns 500 if WebhookUrl is not configured', async () => {
//         delete process.env.WebhookUrl;
//         mockedAxios.post.mockResolvedValue({ status: 200 });

//         const event = {
//             ...baseEvent,
//             httpMethod: 'POST',
//             path: '/process/order-producer/v1',
//             body: JSON.stringify(baseOrder),
//         } as APIGatewayProxyEvent;

//         const result = await lambdaHandler(event);
//         expect(result.statusCode).toBe(500);
//         expect(JSON.parse(result.body).message).toMatch(/Webhook URL is not configured/);
//         expect(mockedAxios.post).not.toHaveBeenCalled();
//     });

//     it('returns 400 on thrown error by passing without required fields', async () => {
//         const event = {
//             ...baseEvent,
//             httpMethod: 'POST',
//             path: '/process/order-producer/v1',
//             body: '{"na": "ORD-12345"}', // Missing required fields
//         } as APIGatewayProxyEvent;

//         const result = await lambdaHandler(event);
//         expect(result.statusCode).toBe(400);
//         expect(JSON.parse(result.body).message).toBe("Field 'orderId' is required and must be a non-empty string.");
//     });

//     it('returns 422 on thrown error by passing invalid JSON', async () => {
//         const event = {
//             ...baseEvent,
//             httpMethod: 'POST',
//             path: '/process/order-producer/v1',
//             body: '{invalidJson}',
//         } as APIGatewayProxyEvent;

//         const result = await lambdaHandler(event);
//         expect(result.statusCode).toBe(422);
//         expect(JSON.parse(result.body).message).toBe('Invalid order JSON object');
//     });

//     it('returns 404 for unmatched route', async () => {
//         const event = {
//             ...baseEvent,
//             httpMethod: 'GET',
//             path: '/unmatched/path',
//         } as APIGatewayProxyEvent;

//         const result = await lambdaHandler(event);
//         expect(result.statusCode).toBe(404);
//         expect(JSON.parse(result.body).message).toBe('Method Not Found');
//     });
// });
