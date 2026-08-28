import { Router } from 'express';
import {
  getPromotions,
  createPromotion,
  updateStatus,
  deletePromotion,
  getSummary,
} from '../controllers/promotionController.js';

const router = Router();

router.get('/summary', getSummary);

router.get('/', getPromotions);
router.post('/', createPromotion);
router.patch('/:id/status', updateStatus);
router.delete('/:id', deletePromotion);

export default router;