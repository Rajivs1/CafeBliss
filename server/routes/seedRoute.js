import express from 'express';
import User from '../models/User.js';
import MenuItem from '../models/MenuItem.js';
import Order from '../models/Order.js';
import Reservation from '../models/Reservation.js';

const router = express.Router();

const sampleMenuItems = [
  { name: 'Espresso', description: 'Strong and bold Italian coffee shot', price: 120, category: 'Coffee', image: 'https://images.unsplash.com/photo-1510707577719-ae7c14805e3a?w=400', preparationTime: 5, isVegetarian: true },
  { name: 'Cappuccino', description: 'Espresso with steamed milk foam', price: 150, category: 'Coffee', image: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=400', preparationTime: 7, isVegetarian: true },
  { name: 'Cafe Latte', description: 'Smooth espresso with steamed milk', price: 160, category: 'Coffee', image: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400', preparationTime: 7, isVegetarian: true },
  { name: 'Mocha', description: 'Coffee with chocolate and steamed milk', price: 180, category: 'Coffee', image: 'https://images.unsplash.com/photo-1607681034540-2c46cc71896d?w=400', preparationTime: 8, isVegetarian: true },
  { name: 'Masala Chai', description: 'Traditional Indian spiced tea', price: 80, category: 'Tea', image: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=400', preparationTime: 5, isVegetarian: true },
  { name: 'Green Tea', description: 'Refreshing and healthy green tea', price: 90, category: 'Tea', image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400', preparationTime: 4, isVegetarian: true },
  { name: 'Croissant', description: 'Buttery, flaky French pastry', price: 120, category: 'Breakfast', image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=400', preparationTime: 10, isVegetarian: true },
  { name: 'Pancakes', description: 'Fluffy pancakes with maple syrup', price: 180, category: 'Breakfast', image: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400', preparationTime: 15, isVegetarian: true },
  { name: 'Avocado Toast', description: 'Smashed avocado on sourdough bread', price: 200, category: 'Breakfast', image: 'https://images.unsplash.com/photo-1541519227354-08fa5d50c44d?w=400', preparationTime: 10, isVegetarian: true },
  { name: 'Club Sandwich', description: 'Triple-decker sandwich with chicken and veggies', price: 250, category: 'Lunch', image: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=400', preparationTime: 15 },
  { name: 'Caesar Salad', description: 'Fresh romaine with caesar dressing and croutons', price: 220, category: 'Lunch', image: 'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=400', preparationTime: 10, isVegetarian: true },
  { name: 'Margherita Pizza', description: 'Classic pizza with tomato, mozzarella, and basil', price: 320, category: 'Lunch', image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400', preparationTime: 20, isVegetarian: true },
  { name: 'Chocolate Brownie', description: 'Rich chocolate brownie with vanilla ice cream', price: 150, category: 'Dessert', image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=400', preparationTime: 8, isVegetarian: true },
  { name: 'Cheesecake', description: 'Creamy New York style cheesecake', price: 180, category: 'Dessert', image: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=400', preparationTime: 5, isVegetarian: true },
  { name: 'Tiramisu', description: 'Italian coffee-flavored dessert', price: 200, category: 'Dessert', image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400', preparationTime: 5, isVegetarian: true },
  { name: 'French Fries', description: 'Crispy golden fries with ketchup', price: 100, category: 'Snacks', image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=400', preparationTime: 10, isVegetarian: true },
  { name: 'Nachos', description: 'Tortilla chips with cheese and salsa', price: 180, category: 'Snacks', image: 'https://images.unsplash.com/photo-1513456852971-30c0b8199d4d?w=400', preparationTime: 12, isVegetarian: true },
  { name: 'Fresh Orange Juice', description: 'Freshly squeezed orange juice', price: 120, category: 'Beverages', image: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=400', preparationTime: 5, isVegetarian: true },
  { name: 'Mango Smoothie', description: 'Creamy mango smoothie', price: 150, category: 'Beverages', image: 'https://images.unsplash.com/photo-1505252585461-04db1eb84625?w=400', preparationTime: 7, isVegetarian: true },
  { name: 'Iced Coffee', description: 'Cold brew coffee with ice', price: 140, category: 'Beverages', image: 'https://images.unsplash.com/photo-1517487881594-2787fef5ebf7?w=400', preparationTime: 5, isVegetarian: true },
];

const sampleUsers = [
  { name: 'Admin User', email: 'admin@cafe.com', password: 'admin123', role: 'admin', phone: '+91 9876543210' },
  { name: 'Staff Member', email: 'staff@cafe.com', password: 'staff123', role: 'staff', phone: '+91 9876543211' },
  { name: 'John Customer', email: 'customer@cafe.com', password: 'customer123', role: 'customer', phone: '+91 9876543212', address: '123 Main Street, Mumbai' },
];

// GET /api/seed — trigger from browser once
router.get('/', async (req, res) => {
  try {
    const existing = await MenuItem.countDocuments();
    if (existing > 0) {
      return res.json({ message: `Database already has ${existing} menu items. No seeding needed.` });
    }

    await User.deleteMany({});
    await MenuItem.deleteMany({});
    await Order.deleteMany({});
    await Reservation.deleteMany({});

    await User.create(sampleUsers);
    const menuItems = await MenuItem.create(sampleMenuItems);

    res.json({
      success: true,
      message: '🎉 Database seeded successfully!',
      menuItemsCreated: menuItems.length,
      credentials: {
        admin: 'admin@cafe.com / admin123',
        staff: 'staff@cafe.com / staff123',
        customer: 'customer@cafe.com / customer123',
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET /api/seed/make-admin?email=yourmail@gmail.com — promote user to admin
router.get('/make-admin', async (req, res) => {
  try {
    const { email } = req.query;
    if (!email) {
      return res.status(400).json({ error: 'Provide email as query param: /api/seed/make-admin?email=yourmail@gmail.com' });
    }
    const user = await User.findOneAndUpdate(
      { email },
      { role: 'admin' },
      { new: true }
    );
    if (!user) {
      return res.status(404).json({ error: `No user found with email: ${email}` });
    }
    res.json({ success: true, message: `${email} is now an admin`, user: { name: user.name, email: user.email, role: user.role } });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
