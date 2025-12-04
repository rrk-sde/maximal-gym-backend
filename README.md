# Maximal Gym Backend API

Backend API for Maximal Gym management system built with Node.js, Express, and MongoDB.

## Features

- 🔐 User Authentication & Authorization (JWT)
- 📅 Booking Management
- 👨‍🏫 Coach Management
- ❓ FAQ Management
- 📧 Contact/Enquiry System
- 🛡️ Role-based Access Control (User, Admin)

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcryptjs
- **CORS**: Enabled for cross-origin requests

## Installation

1. Clone the repository
2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory (copy from `.env.example`):
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/maximal-gym
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRE=7d
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

4. Start MongoDB locally or use MongoDB Atlas

5. Run the server:
```bash
# Development
npm run dev

# Production
npm start
```

## API Endpoints

### Authentication (`/api/auth`)

- `POST /register` - Register a new user
- `POST /login` - Login user
- `GET /me` - Get current user profile (Protected)
- `PUT /update` - Update profile (Protected)
- `PUT /change-password` - Change password (Protected)

### Bookings (`/api/bookings`)

- `POST /` - Create a new booking (Public)
- `GET /` - Get all bookings (Admin)
- `GET /my-bookings` - Get user's bookings (Protected)
- `GET /:id` - Get booking by ID (Admin)
- `PUT /:id/status` - Update booking status (Admin)
- `PUT /:id/cancel` - Cancel booking (Protected)
- `DELETE /:id` - Delete booking (Admin)

### Coaches (`/api/coaches`)

- `GET /` - Get all coaches (Public)
- `GET /:identifier` - Get coach by ID or slug (Public)
- `POST /` - Create new coach (Admin)
- `PUT /:id` - Update coach (Admin)
- `DELETE /:id` - Delete coach (Admin)

### FAQs (`/api/faqs`)

- `GET /` - Get all FAQs (Public)
- `GET /:id` - Get FAQ by ID (Public)
- `POST /` - Create FAQ (Admin)
- `PUT /:id` - Update FAQ (Admin)
- `DELETE /:id` - Delete FAQ (Admin)

### Contact/Enquiries (`/api/contact`)

- `POST /` - Submit enquiry (Public)
- `GET /` - Get all enquiries (Admin)
- `GET /:id` - Get enquiry by ID (Admin)
- `PUT /:id` - Update enquiry status (Admin)
- `DELETE /:id` - Delete enquiry (Admin)

## Request/Response Examples

### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "phone": "+91 9876543210"
}
```

### Create Booking
```http
POST /api/bookings
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+91 9876543210",
  "coach": "vikram",
  "sessionType": "personal",
  "date": "2024-12-15",
  "time": "6am",
  "notes": "Focus on strength training"
}
```

### Protected Route Example
```http
GET /api/auth/me
Authorization: Bearer <your-jwt-token>
```

## Database Models

### User
- name, email, password, role, phone, isActive

### Booking
- name, email, phone, coach, sessionType, date, time, status, notes

### Coach
- name, slug, specialty, experience, certifications, bio, image, availability

### FAQ
- question, answer, category, order, isActive

### Contact
- name, email, phone, subject, message, status, priority

## Error Handling

All API responses follow a consistent format:

**Success Response:**
```json
{
  "status": "success",
  "message": "Operation successful",
  "data": { }
}
```

**Error Response:**
```json
{
  "status": "error",
  "message": "Error description"
}
```

## Security

- Passwords are hashed using bcrypt
- JWT tokens for authentication
- Protected routes require valid JWT
- Role-based access control for admin features
- Input validation on all requests

## Development

The server will run on `http://localhost:5000` by default.

Use tools like Postman or Thunder Client to test the API endpoints.

## License

ISC
