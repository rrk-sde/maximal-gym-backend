# Maximal Gym Backend - Quick Start Guide

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or MongoDB Atlas)
- npm or yarn

## Setup Steps

### 1. Install MongoDB

**Option A: Local MongoDB**
- Download and install from https://www.mongodb.com/try/download/community
- Start MongoDB service

**Option B: MongoDB Atlas (Cloud)**
- Create account at https://www.mongodb.com/cloud/atlas
- Create a free cluster
- Get connection string and update in `.env`

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Configuration

Copy `.env.example` to `.env` and update with your settings:

```bash
cp .env.example .env
```

Edit `.env`:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/maximal-gym  # or your MongoDB Atlas URI
JWT_SECRET=change-this-to-a-random-secret-key
JWT_EXPIRE=7d
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

### 4. Seed Database (Optional but Recommended)

This will create an admin user, coaches, and FAQs:

```bash
npm run seed
```

**Default Admin Credentials:**
- Email: admin@maximalgym.com
- Password: admin123

⚠️ **Change the password after first login!**

### 5. Start the Server

**Development mode (with auto-restart):**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

The server will run on `http://localhost:5000`

### 6. Test the API

Visit `http://localhost:5000/api/health` - you should see:
```json
{
  "status": "success",
  "message": "Maximal Gym API is running",
  "timestamp": "2024-12-04T..."
}
```

## Testing Endpoints

### 1. Register a User

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123",
    "phone": "+91 9876543210"
  }'
```

### 2. Login

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@maximalgym.com",
    "password": "admin123"
  }'
```

Copy the `token` from the response.

### 3. Create a Booking

```bash
curl -X POST http://localhost:5000/api/bookings \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+91 9876543210",
    "coach": "vikram",
    "sessionType": "personal",
    "date": "2024-12-15",
    "time": "6am"
  }'
```

### 4. Get All Coaches

```bash
curl http://localhost:5000/api/coaches
```

### 5. Get FAQs

```bash
curl http://localhost:5000/api/faqs
```

## Project Structure

```
maximal-gym-backend/
├── controllers/         # Request handlers
│   ├── authController.js
│   ├── bookingController.js
│   ├── coachController.js
│   ├── faqController.js
│   └── contactController.js
├── models/             # Mongoose schemas
│   ├── User.js
│   ├── Booking.js
│   ├── Coach.js
│   ├── FAQ.js
│   └── Contact.js
├── routes/             # API routes
│   ├── authRoutes.js
│   ├── bookingRoutes.js
│   ├── coachRoutes.js
│   ├── faqRoutes.js
│   └── contactRoutes.js
├── middleware/         # Custom middleware
│   └── auth.js
├── server.js          # Main server file
├── seed.js            # Database seeding script
├── .env.example       # Environment variables template
├── .env               # Your environment variables (not in git)
├── .gitignore         # Git ignore rules
├── package.json       # Dependencies and scripts
└── README.md          # Full documentation
```

## Common Issues

### MongoDB Connection Error

**Error:** `MongoNetworkError: connect ECONNREFUSED`

**Solution:** Make sure MongoDB is running:
- Local: Start MongoDB service
- Atlas: Check connection string and whitelist your IP

### Port Already in Use

**Error:** `EADDRINUSE: address already in use`

**Solution:** Change PORT in `.env` or stop the process using port 5000

### JWT Token Issues

**Error:** `Invalid token`

**Solution:** Make sure you're including the token in the Authorization header:
```
Authorization: Bearer <your-token-here>
```

## Next Steps

1. ✅ Backend API is running
2. 🔗 Connect frontend to backend
3. 🧪 Test all endpoints
4. 🚀 Deploy to production (Heroku, Railway, or DigitalOcean)

## Support

For more information, check `README.md` or create an issue in the repository.
