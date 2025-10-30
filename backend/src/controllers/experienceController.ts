import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getAllExperiences = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const experiences = await prisma.experience.findMany({
      orderBy: { createdAt: 'desc' },
    });
    res.json(experiences);
  } catch (error) {
    next(error);
  }
};

export const getExperienceById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const experienceId = parseInt(id);

    if (isNaN(experienceId)) {
      return res.status(400).json({ error: 'Invalid experience ID' });
    }

    const experience = await prisma.experience.findUnique({
      where: { id: experienceId },
    });

    if (!experience) {
      return res.status(404).json({ error: 'Experience not found' });
    }

    res.json(experience);
  } catch (error) {
    next(error);
  }
};

export const getExperienceSlots = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const experienceId = parseInt(id);

    if (isNaN(experienceId)) {
      return res.status(400).json({ error: 'Invalid experience ID' });
    }

    const slots = await prisma.slot.findMany({
      where: {
        experienceId,
        date: { gte: new Date() }, 
      },
      orderBy: [{ date: 'asc' }, { time: 'asc' }],
    });

    res.json(slots);
  } catch (error) {
    next(error);
  }
};