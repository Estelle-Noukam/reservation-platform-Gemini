import { Router, Response } from 'express';
import { Op } from 'sequelize';
import { Booking } from '../models/Booking';
import { Resource } from '../models/Resource';
import { User } from '../models/User';
import { authenticateToken, AuthRequest } from '../middleware/auth';

const router = Router();

router.get('/my-bookings', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const bookings = await Booking.findAll({
      where: { userId: req.user!.id },
      include: [Resource],
      order: [['startTime', 'ASC']],
    });
    res.json(bookings);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/all', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const bookings = await Booking.findAll({
      include: [Resource, User],
      order: [['startTime', 'ASC']],
    });
    res.json(bookings);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const { resourceId, startTime, endTime } = req.body;
    const start = new Date(startTime);
    const end = new Date(endTime);

    const conflict = await Booking.findOne({
      where: {
        resourceId,
        status: 'confirmed',
        [Op.or]: [
          { startTime: { [Op.between]: [start, end] } },
          { endTime: { [Op.between]: [start, end] } },
          {
            [Op.and]: [
              { startTime: { [Op.lte]: start } },
              { endTime: { [Op.gte]: end } }
            ]
          }
        ]
      }
    });

    if (conflict) {
      return res.status(409).json({ error: 'Resource already booked for this time slot' });
    }

    const booking = await Booking.create({
      userId: req.user!.id,
      resourceId,
      startTime: start,
      endTime: end,
      status: 'confirmed'
    });

    res.status(201).json(booking);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

router.patch('/:id/cancel', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const booking = await Booking.findByPk(req.params.id);
    if (!booking) return res.status(404).json({ error: 'Booking not found' });
    
    if (req.user!.role !== 'admin' && booking.userId !== req.user!.id) {
      return res.status(403).json({ error: 'Unauthorized action' });
    }

    booking.status = 'cancelled';
    await booking.save();
    res.json(booking);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
