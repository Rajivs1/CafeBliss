import mongoose from 'mongoose';

const menuItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Item name is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: 0
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    trim: true
  },
  image: {
    type: String,
    default: 'https://via.placeholder.com/300x200?text=Menu+Item'
  },
  available: {
    type: Boolean,
    default: true
  },
  preparationTime: {
    type: Number,
    default: 15,
    min: 0
  },
  isVegetarian: {
    type: Boolean,
    default: false
  },
  spicyLevel: {
    type: String,
    enum: ['none', 'mild', 'medium', 'hot'],
    default: 'none'
  }
}, {
  timestamps: true
});

export default mongoose.model('MenuItem', menuItemSchema);
