import express from 'express';
import { validatePromoCode } from '../controllers/promoController';

const router = express.Router();

router.post('/validate', validatePromoCode);

export default router;