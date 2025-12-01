# Delivery Management System

A full-stack real-time order delivery management application with role-based access control for Admin, Seller, and Buyer users.

## 🚀 Project Overview

This system enables efficient management of delivery orders through a comprehensive workflow:
- Buyers can create orders and track them in real-time
- Admins can manage orders, associate buyers, and assign sellers
- Sellers can advance orders through delivery stages
- Real-time updates using Socket.IO for all users
- Stage-wise order tracking from placement to delivery

## 💻 Tech Stack Used

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **TypeScript** - Type-safe JavaScript
- **MongoDB** - NoSQL database for data persistence
- **Mongoose** - MongoDB object modeling
- **Socket.IO** - Real-time bidirectional communication
- **JWT** - JSON Web Tokens for authentication
- **bcryptjs** - Password hashing
- **express-validator** - Request validation

### Frontend
- **React** - UI library
- **TypeScript** - Type-safe JavaScript
- **Vite** - Fast build tool
- **Tailwind CSS** - Utility-first CSS framework
- **Axios** - HTTP client
- **Socket.IO Client** - Real-time updates
- **React Router** - Client-side routing

## 📋 Features

### Admin Dashboard
- View all orders with comprehensive details
- Associate buyers to orders
- Assign sellers to orders
- View detailed order history and stage durations
- Delete orders
- Visual statistics and analytics
- Real-time order updates

### Seller Dashboard
- View assigned orders
- Advance orders through delivery stages
- Mark orders as "Not Delivered" (if needed)
- Delete orders
- Real-time notifications
- Comprehensive order information

### Buyer Dashboard
- Create new orders
- Track order progress with visual indicators
- Real-time status updates
- View order details and timestamps

### Key Functionalities
- ✅ Role-based access control (Admin, Seller, Buyer)
- ✅ Real-time updates via WebSocket
- ✅ 7-stage order lifecycle tracking
- ✅ Order history with timestamps and actor information
- ✅ Stage duration calculations
- ✅ Responsive and modern UI/UX
- ✅ Data validation and error handling
- ✅ Secure authentication with JWT

## 🛠️ Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- npm or yarn package manager

### Backend Setup

1. Navigate to the backend directory:
```bash
cd delivery-backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the backend root directory:
```env
PORT=5001
MONGO_URI=mongodb://localhost:27017/delivery-system
JWT_SECRET=your-super-secret-jwt-key-here
FRONTEND_URL=http://localhost:5173
```

4. Start MongoDB (if running locally):
```bash
# macOS with Homebrew
brew services start mongodb-community

# Or run manually
mongod
```

5. Seed the database with initial users (optional):
```bash
npm run seed
```

This creates test users:
- Admin: admin@example.com / admin123
- Seller: seller@example.com / seller123
- Buyer: buyer@example.com / buyer123

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd delivery-frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the frontend root directory:
```env
VITE_API_URL=http://localhost:5001
```

## 🚀 How to Run Backend & Frontend

### Running Backend

**Development mode (with hot reload):**
```bash
cd delivery-backend
npm run dev
```

**Production mode:**
```bash
cd delivery-backend
npm run build
npm start
```

Backend will run on `http://localhost:5001`

### Running Frontend

**Development mode:**
```bash
cd delivery-frontend
npm run dev
```

Frontend will run on `http://localhost:5173`

**Production build:**
```bash
cd delivery-frontend
npm run build
npm run preview
```

### Running Both Together

Open two terminal windows:

**Terminal 1 - Backend:**
```bash
cd delivery-backend && npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd delivery-frontend && npm run dev
```

Then open your browser to `http://localhost:5173`

## 🔐 Test Users

You can register new users or use these pre-seeded accounts:

| Role   | Email                 | Password   |
|--------|-----------------------|------------|
| Admin  | admin@example.com     | admin123   |
| Seller | seller@example.com    | seller123  |
| Buyer  | buyer@example.com     | buyer123   |

## 📊 Order Lifecycle Stages

1. **Order Placed** - Initial stage when buyer creates order
2. **Buyer Associated** - Admin associates a buyer to the order
3. **Processing** - Seller begins processing
4. **Packed** - Order is packed and ready
5. **Shipped** - Order has been shipped
6. **Out for Delivery** - Order is out for delivery
7. **Delivered** - Order successfully delivered

## 🎯 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Orders
- `POST /api/orders` - Create order (Buyer)
- `GET /api/orders` - Get orders (role-based)
- `PUT /api/orders/:id/associate` - Associate buyer (Admin)
- `PUT /api/orders/:id/assign-seller` - Assign seller (Admin)
- `PUT /api/orders/:id/next-stage` - Move to next stage (Seller)
- `PUT /api/orders/:id/not-delivered` - Mark as not delivered (Seller)
- `DELETE /api/orders/:id` - Delete order (Seller)
- `DELETE /api/orders/:id/admin` - Delete order (Admin)
- `GET /api/orders/:id/details` - Get order details (Admin)
- `GET /api/orders/stats/all` - Get statistics (Admin)

### Users
- `GET /api/orders/admin/buyers` - Get all buyers (Admin)
- `GET /api/orders/admin/sellers` - Get all sellers (Admin)

## 🌐 Live Link

**[Add your deployed application URL here]**

Example: `https://delivery-system.herokuapp.com`

## 🎥 Short Video Link

**[Add your Google Drive video link here]**

Example: `https://drive.google.com/file/d/YOUR_VIDEO_ID/view`

## 📁 Project Structure

```
delivery-backend/
├── src/
│   ├── config/          # Database configuration
│   ├── middleware/      # Authentication & authorization
│   ├── models/          # Mongoose models
│   ├── routes/          # API routes
│   ├── socket/          # Socket.IO setup
│   └── server.ts        # Main server file
├── .env
└── package.json

delivery-frontend/
├── src/
│   ├── components/      # React components
│   │   ├── Admin/       # Admin-specific components
│   │   ├── Buyer/       # Buyer-specific components
│   │   └── Seller/      # Seller-specific components
│   ├── context/         # React context for auth
│   ├── hooks/           # Custom React hooks
│   ├── pages/           # Page components
│   ├── services/        # API service layer
│   ├── types/           # TypeScript type definitions
│   └── App.tsx          # Main app component
├── .env
└── package.json
```

## 🧪 Testing the Application

1. **Start both backend and frontend servers**
2. **Register/Login as different users** in separate browser windows/incognito tabs
3. **Test the complete flow:**
   - Buyer creates an order
   - Admin associates buyer and assigns seller
   - Seller advances order through stages
   - Buyer sees real-time updates
   - Admin monitors everything

## 🐛 Troubleshooting

### MongoDB Connection Issues
- Ensure MongoDB is running: `mongod` or check service status
- Verify MONGO_URI in `.env` file
- Check firewall settings for port 27017

### Port Already in Use
- Backend (5001): `lsof -ti:5001 | xargs kill -9`
- Frontend (5173): `lsof -ti:5173 | xargs kill -9`

### CORS Errors
- Verify FRONTEND_URL in backend `.env`
- Check that frontend is running on the correct port

### Real-time Updates Not Working
- Check Socket.IO connection in browser console
- Verify JWT token is being sent correctly
- Ensure backend WebSocket server is running

## 📝 Notes

- Orders start with no buyer associated (per assignment requirements)
- Admin must associate a buyer before seller can be assigned
- Sellers can only advance their assigned orders
- Orders cannot advance beyond "Delivered" stage
- Real-time updates use WebSocket for instant synchronization
- All passwords are hashed using bcrypt
- JWT tokens expire after 7 days

## 👨‍💻 Developer

**Adeel Javed**

---