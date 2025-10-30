import express from 'express';
import {
  getAllExperiences,
  getExperienceById,
  getExperienceSlots,
} from '../controllers/experienceController';

const router = express.Router();

router.get('/', getAllExperiences);

router.get('/:id', getExperienceById);

router.get('/:id/slots', getExperienceSlots);

export default router;