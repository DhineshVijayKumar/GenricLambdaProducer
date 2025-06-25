# sam-application

This project is a sample AWS Lambda application written in TypeScript, designed to be deployed using AWS SAM (Serverless Application Model). It demonstrates Lambda handler structure, input validation, transformation, logging, and unit testing.

## Features

- **API Gateway Integration:**  
  Exposes endpoints for order processing and health checks.

- **Order Validation:**  
  Validates incoming order data for required fields, handel optional feilds with specified or default value and transform formats.

- **Order Transformation:**  
  Transforms validated order data into a target model for downstream processing.

- **Webhook Integration:**  
  Sends transformed order data to an external webhook (e.g., webhook.site).

- **Logging:**  
  Logs events and errors with timestamps and context.

- **Unit Testing:**  
  Comprehensive Jest test suites for validation, transformation, and Lambda handler logic.

## Project Structure

```
  .aws-sam/ # SAM Build directory
  events/
    event.json                # Sample event for testing
  processdata/
    app.ts                    # Lambda handler
    utils/
      order_service.ts        # Validation and transformation logic
      response_handler.ts     # Standardized API responses
      logger.ts               # Logging utility
    interface/
      process_order_producer_interface.ts # TypeScript interfaces
    tests/
      unit/
        test-handler.test.ts  # Jest unit tests
    package.json
    tsconfig.json
    jest.config.ts
  template.yaml # SAM template
```

## Endpoints

- **POST /process/order-producer/v1**  
  Accepts order data, validates and transforms it, then sends to the configured webhook.

- **GET /process/order-producer/v1/healthCheck**  
  Returns a simple health check response.

## Environment Variables

- `WebhookUrl` — The URL to which transformed order data will be POSTed.

## Local Lambda Invocation

- Note: Change Directory to project Root where sam template is present before running the command

```
  sam local invoke ProcessOrderProducerFunction --event events/event.json
```

## Unit Test

- Note: Change Directory to `processdata` folder before running the command

```
  npm test
```

## Deployment

- Note: Change Directory to project Root where sam template is present before running the command

```
  sam build
  sam deploy --guided # for guided deployment (1st time)
  sam deploy # for non-guided deployment
```
