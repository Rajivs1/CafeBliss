import express from 'express';
import Reservation from '../models/Reservation.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// @route   POST /api/reservations
// @desc    Create new reservation
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const { name, email, phone, date, time, guests, specialRequests } = req.body;

    const reservation = await Reservation.create({
      user: req.user._id,
      name,
      email,
      phone,
      date,
      time,
      guests,
      specialRequests
    });

    await reservation.populate('user', 'name email');

    res.status(201).json({
      success: true,
      data: reservation
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @route   GET /api/reservations/my-reservations
// @desc    Get current user's reservations
// @access  Private
router.get('/my-reservations', protect, async (req, res) => {
  try {
    const reservations = await Reservation.find({ user: req.user._id })
      .sort({ date: -1 });

    res.json({
      success: true,
      count: reservations.length,
      data: reservations
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/reservations
// @desc    Get all reservations (for staff/admin)
// @access  Private (Staff, Admin)
router.get('/', protect, authorize('staff', 'admin'), async (req, res) => {
  try {
    const { status, date } = req.query;
    
    let query = {};
    if (status) query.status = status;
    if (date) {
      const startDate = new Date(date);
      const endDate = new Date(date);
      endDate.setDate(endDate.getDate() + 1);
      query.date = { $gte: startDate, $lt: endDate };
    }

    const reservations = await Reservation.find(query).sort({ date: 1, time: 1 });

    res.json({
      success: true,
      count: reservations.length,
      data: reservations
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   PATCH /api/reservations/:id
// @desc    Update reservation
// @access  Private (Staff, Admin)
router.patch('/:id', protect, authorize('staff', 'admin'), async (req, res) => {
  try {
    const reservation = await Reservation.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!reservation) {
      return res.status(404).json({ message: 'Reservation not found' });
    }

    res.json({
      success: true,
      data: reservation
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @route   DELETE /api/reservations/:id
// @desc    Cancel reservation
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const reservation = await Reservation.findById(req.params.id);

    if (!reservation) {
      return res.status(404).json({ message: 'Reservation not found' });
    }

    // Check if user owns the reservation or is staff/admin
    if (reservation.user._id.toString() !== req.user._id.toString() && 
        !['staff', 'admin'].includes(req.user.role)) {
      return res.status(403).json({ message: 'Not authorized to cancel this reservation' });
    }

    reservation.status = 'cancelled';
    await reservation.save();

    res.json({
      success: true,
      message: 'Reservation cancelled successfully',
      data: reservation
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
