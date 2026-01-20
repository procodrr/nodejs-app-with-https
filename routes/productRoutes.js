import express from 'express';
import {
  getAllProducts,
  getProductById,
  getProductsByCategory
} from '../controllers/productController.js';

const router = express.Router();

router.get('/', getAllProducts);
router.get('/category/:category', getProductsByCategory);
router.get('/:id', getProductById);

export default router;
