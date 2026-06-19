# Cafe Management System - Frontend

A modern React-based frontend for the Cafe Management System with role-based access control.

## Features

- 🔐 **Authentication** - Login/Register with JWT
- ☕ **Menu Browsing** - View menu items by category
- 🛒 **Shopping Cart** - Add items and checkout
- 📦 **Order Tracking** - Real-time order status updates
- 👨‍💼 **Admin Dashboard** - Manage menu, staff, and view analytics
- 👔 **Staff Dashboard** - Process and update orders
- 🎫 **Reservations** - Table booking system

## Tech Stack

- **React** - UI library
- **React Router** - Navigation
- **Axios** - HTTP client
- **Socket.io** - Real-time updates
- **Context API** - State management
- **Vite** - Build tool

## Installation

1. Install dependencies:
\`\`\`bash
npm install
\`\`\`

2. Create `.env` file:
\`\`\`
VITE_API_URL=http://localhost:5000
\`\`\`

3. Start development server:
\`\`\`bash
npm run dev
\`\`\`

4. Build for production:
\`\`\`bash
npm run build
\`\`\`

## Project Structure

\`\`\`
src/
├── components/        # Reusable UI components
│   ├── common/       # Navbar, Footer, Loader
│   ├── menu/         # Menu-related components
│   ├── cart/         # Cart components
│   ├── order/        # Order components
│   └── admin/        # Admin components
├── pages/            # Route-level pages
│   ├── customer/     # Customer pages
│   ├── staff/        # Staff pages
│   ├── admin/        # Admin pages
│   └── auth/         # Login/Register
├── context/          # React Context (state)
├── hooks/            # Custom hooks
├── services/         # API service functions
├── utils/            # Helper functions
├── App.jsx           # Main app component
└── main.jsx          # Entry point
\`\`\`

## User Roles

- **Customer** - Browse menu, order, track orders, make reservations
- **Staff** - View and update order status
- **Admin** - Full access to manage menu, staff, and view analytics

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Next Steps

1. Connect to backend API (ensure backend is running on port 5000)
2. Install optional chart library for analytics:
   \`\`\`bash
   npm install chart.js react-chartjs-2
   \`\`\`
3. Configure Cloudinary for image uploads (if needed)
