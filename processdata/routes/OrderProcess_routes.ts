import { Router } from 'express';
import { OrderController } from '../controllers/OrderProcess_Controller';

const orderProcessRouter = Router();
const orderController = new OrderController();

orderProcessRouter.get('/healthCheck', orderController.healthCheck);
orderProcessRouter.post('/', orderController.processOrder);

export default orderProcessRouter;
