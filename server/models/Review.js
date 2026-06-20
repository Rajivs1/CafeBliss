import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  comment: {
    type: String,
    required: true,
    trim: true,
    maxlength: 500
  }
}, { timestamps: true });

// One review per user
reviewSchema.index({ user: 1 }, { unique: true });

reviewSchema.pre(/^find/, function (next) {
  this.populate('user', 'name');
  next();
});

export default mongoose.model('Review', reviewSchema);
