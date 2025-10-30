import express from 'express';
import {
  createBooking,
  getBookingById,
} from '../controllers/bookingController';

const router = express.Router();

router.post('/', createBooking);

router.get('/:bookingId', getBookingById);

export default router;