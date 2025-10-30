import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const validatePromoCode = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { code } = req.body;

    if (!code || typeof code !== 'string') {
      return res.status(400).json({
        valid: false,
        discount: 0,
        message: 'Promo code is required',
      });
    }

    const promoCode = await prisma.promoCode.findFirst({
      where: {
        code: code.toUpperCase(),
        active: true,
      },
    });

    if (!promoCode) {
      return res.json({
        valid: false,
        discount: 0,
        message: 'Invalid or expired promo code',
      });
    }

    res.json({
      valid: true,
      discount: promoCode.discount,
      message: 'Promo code applied successfully',
    });
  } catch (error) {
    next(error);
  }
};