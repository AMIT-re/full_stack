import { db } from '../db/database.js';

export const createOrder = (req, res, next) => {
  try {
    const order = db.createOrder(req.body);
    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      data: order
    });
  } catch (error) {
    next(error);
  }
};

export const getOrders = (req, res, next) => {
  try {
    const orders = db.getOrders();
    res.json({
      success: true,
      data: orders
    });
  } catch (error) {
    next(error);
  }
};
