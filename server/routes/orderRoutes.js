import express from 'express';
import { createOrder, getOrders } from '../controllers/orderController.js';
import { validateOrder } from '../middleware/validator.js';

const router = express.Router();

router.get('/', getOrders);
router.post('/', validateOrder, createOrder);

export default router;
