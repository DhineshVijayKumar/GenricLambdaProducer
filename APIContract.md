# sam-application

## API Contract

### POST `/process/order-producer/v1`

**Request Body (SourceOrderData):**

```json
{
  "orderId": "ORD-12345",
  "orderDate": "10/15/2023",
  "customerId": "CUST-789",
  "storeId": 42,
  "items": [
    {
      "sku": "PROD-001",
      "quantity": 2,
      "unitPrice": 29.99,
      "discountAmount": 5.0
    },
    {
      "sku": "PROD-002",
      "quantity": 1,
      "unitPrice": 49.99
    }
  ],
  "paymentMethod": "CREDIT_CARD",
  "shippingAddress": {
    "street": "123 Main St",
    "city": "Columbus",
    "state": "OH",
    "zipCode": "43215",
    "country": "USA"
  },
  "totalAmount": 104.97,
  "status": "NEW",
  "notes": "Please deliver after 5pm"
}
```

**Response (Success, 200):**

```json
{
  "data": {
    "transformed-data": {
      "order": {
        "id": "ORD-12345",
        "createdAt": "2023-10-15",
        "customer": { "id": "CUST-789" },
        "location": { "storeId": "42" },
        "status": "new",
        "payment": { "method": "CREDIT_CARD", "total": 104.97 },
        "shipping": {
          "address": {
            "line1": "123 Main St",
            "city": "Columbus",
            "state": "OH",
            "postalCode": "43215",
            "country": "USA"
          }
        }
      },
      "items": [
        {
          "productId": "PROD-001",
          "quantity": 2,
          "price": { "base": 29.99, "discount": 5.0, "final": 24.99 }
        },
        {
          "productId": "PROD-002",
          "quantity": 1,
          "price": { "base": 49.99, "discount": 0, "final": 49.99 }
        }
      ],
      "metadata": {
        "source": "order_producer",
        "notes": "Please deliver after 5pm",
        "processedAt": "2023-10-15T14:30:45.123Z"
      }
    }
  },
  "message": "Data has been processed successfully"
}
```

**Response (Validation Error, 400):**

```json
{
  "message": "Field 'orderId' is required and must be a non-empty string.",
  "data": {
    /* original payload */
  }
}
```

**Response (Invalid JSON, 422):**

```json
{
  "message": "Invalid order JSON object"
}
```

**Response (Webhook URL not configured, 500):**

```json
{
  "message": "Webhook URL is not configured"
}
```

**Response (Internal Error, 500):**

```json
{
  "message": "internal server error"
}
```

---

### GET `/process/order-producer/v1/healthCheck`

**Response (200):**

```json
{
  "message": "Service is up and running"
}
```

---

## Error Handling & Troubleshooting

- **400 Bad Request:**

  - Returned if the request body is missing required fields, has invalid types, or with invalid values.
  - The error message will specify the problematic field or indicate invalid JSON.
  - Change the request body to match the expected format.

- **422 Unprocessable Entity:**

  - Returned if the request body is valid JSON but contains invalid data.
  - Provide a valid json object.

- **500 Internal Server Error:**

  - Returned if the webhook URL is not configured or if an unexpected error occurs during processing.

- **404 Not Found:**

  - Returned if the endpoint path or HTTP method does not match any defined route.

- **Troubleshooting Steps:**
  1. **Check request body:** Ensure all required fields are present and correctly formatted.
  2. **Check environment variables:** Make sure `WebhookUrl` is set in your Lambda environment.
  3. **Check logs:** Review Lambda logs for error details.
  4. **Check webhook.site:** If using webhook.site, verify the URL is correct and active.

---

## Setting Up webhook.site for Testing

1. Go to [https://webhook.site](https://webhook.site).
2. Copy your unique URL from the top of the page (e.g., `https://webhook.site/your-unique-id`).
3. Set the environment variable `WebhookUrl` in your Lambda or local `.env` file to this URL.
   - In AWS Lambda, add it under "Environment variables".
   - Locally, you can set it in your shell or `.env` file:
     ```
     export WebhookUrl=https://webhook.site/your-unique-id
     ```
4. Deploy and invoke your Lambda function.
5. Check the webhook.site page to see the POSTed payloads.

---
