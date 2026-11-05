import express from 'express';
import {
  getProducts,
  getFeaturedProducts,
  getCategories,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  addReview,
  getStats,
  resetProducts
} from '../controllers/productController.js';
import { validateProduct, validateReview } from '../middleware/validator.js';

const router = express.Router();

router.get('/', getProducts);
router.get('/featured', getFeaturedProducts);
router.get('/categories', getCategories);
router.get('/stats', getStats);
router.post('/reset', resetProducts);

router.get('/:id', getProductById);
router.post('/', validateProduct, createProduct);
router.put('/:id', validateProduct, updateProduct);
router.delete('/:id', deleteProduct);
router.post('/:id/reviews', validateReview, addReview);

export default router;
