import express from 'express';
import Review from '../models/Review.js';
import Order from '../models/Order.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// GET /api/reviews — public, fetch all reviews
router.get('/', async (req, res) => {
  try {
    const reviews = await Review.find().sort({ createdAt: -1 }).limit(20);
    res.json({ success: true, data: reviews });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/reviews — logged-in user who has at least one order
router.post('/', protect, async (req, res) => {
  try {
    const { rating, comment } = req.body;

    if (!rating || !comment) {
      return res.status(400).json({ success: false, message: 'Rating and comment are required' });
    }

    // Check if user has placed at least one order
    const order = await Order.findOne({ user: req.user._id });
    if (!order) {
      return res.status(403).json({
        success: false,
        message: 'You can only leave a review after placing an order'
      });
    }

    // Check if already reviewed
    const existing = await Review.findOne({ user: req.user._id });
    if (existing) {
      return res.status(400).json({ success: false, message: 'You have already submitted a review' });
    }

    const review = await Review.create({ user: req.user._id, rating, comment });
    await review.populate('user', 'name');

    res.status(201).json({ success: true, data: review });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE /api/reviews/:id — admin only
router.delete('/:id', protect, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Admin only' });
    }
    await Review.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Review deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
