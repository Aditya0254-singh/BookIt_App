import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { validateBookingData } from '../utils/validator';

const prisma = new PrismaClient();

export const createBooking = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { experienceId, slotId, name, email, phone, guests, promoCode } = req.body;


    const validation = validateBookingData(req.body);
    if (!validation.valid) {
      return res.status(400).json({
        success: false,
        message: validation.errors.join(', '),
      });
    }


    const slot = await prisma.slot.findUnique({
      where: { id: slotId },
      include: { experience: true },
    });

    if (!slot) {
      return res.status(404).json({
        success: false,
        message: 'Slot not found',
      });
    }

    if (slot.availableSpots < guests) {
      return res.status(400).json({
        success: false,
        message: `Only ${slot.availableSpots} spots available`,
      });
    }

    let discount = 0;
    if (promoCode) {
      const promo = await prisma.promoCode.findFirst({
        where: {
          code: promoCode.toUpperCase(),
          active: true,
        },
      });
      if (promo) {
        discount = promo.discount;
      }
    }

    const subtotal = slot.experience.price * guests;
    const totalAmount = Math.max(0, subtotal - discount);

    const result = await prisma.$transaction(async (tx) => {
      const booking = await tx.booking.create({
        data: {
          experienceId,
          slotId,
          name: name.trim(),
          email: email.trim().toLowerCase(),
          phone: phone?.trim() || null,
          guests,
          promoCode: promoCode?.trim().toUpperCase() || null,
          discount,
          totalAmount,
          status: 'confirmed',
        },
      });

      await tx.slot.update({
        where: { id: slotId },
        data: {
          availableSpots: { decrement: guests },
        },
      });

      return booking;
    });

    res.status(201).json({
      success: true,
      bookingId: result.bookingId,
      message: 'Booking created successfully',
      total: totalAmount,
    });
  } catch (error) {
    console.error('Booking creation error:', error);
    next(error);
  }
};

export const getBookingById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { bookingId } = req.params;

    const booking = await prisma.booking.findUnique({
      where: { bookingId },
      include: {
        experience: true,
        slot: true,
      },
    });

    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    res.json(booking);
  } catch (error) {
    next(error);
  }
};