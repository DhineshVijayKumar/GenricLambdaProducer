import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from 'aws-lambda';
import express from 'express';
import { Request, Response } from 'express';
import { errorHandler } from './middlewares/errorHandler';
import { NextFunction } from 'express';
import orderProcessRouter from './routes/OrderProcess_routes';
import serverlessExpress from '@codegenie/serverless-express';
import { bodyParser } from './middlewares/bodyParser';

const app = express();

app.use((req: Request, res: Response, next: NextFunction) => {
    bodyParser(req, res, next);
});

app.use(express.json());
app.use('/process/order-producer/v1', orderProcessRouter);

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    errorHandler(err, req, res, next);
});

export const lambdaHandler = serverlessExpress({ app });
