# Maximal Gym API - Complete Endpoint Reference

## Base URL
```
http://localhost:5000/api
```

## Authentication
Include JWT token in the Authorization header for protected routes:
```
Authorization: Bearer <your-jwt-token>
```

---

## 1. Authentication Endpoints

### Register User
```http
POST /auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "phone": "+91 9876543210"
}
```

**Response:**
```json
{
  "status": "success",
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "...",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "user"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "admin@maximalgym.com",
  "password": "admin123"
}
```

### Get Current User Profile (Protected)
```http
GET /auth/me
Authorization: Bearer <token>
```

### Update Profile (Protected)
```http
PUT /auth/update
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "John Updated",
  "phone": "+91 9999999999"
}
```

### Change Password (Protected)
```http
PUT /auth/change-password
Authorization: Bearer <token>
Content-Type: application/json

{
  "currentPassword": "oldpassword",
  "newPassword": "newpassword123"
}
```

---

## 2. Booking Endpoints

### Create Booking (Public)
```http
POST /bookings
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

**Coach Options:** `vikram`, `priya`, `arjun`
**Session Types:** `personal`, `assessment`, `nutrition`
**Time Slots:** `6am`, `8am`, `10am`, `4pm`, `6pm`, `8pm`

### Get All Bookings (Admin)
```http
GET /bookings?status=pending&coach=vikram&page=1&limit=10
Authorization: Bearer <admin-token>
```

**Query Parameters:**
- `status`: pending, confirmed, cancelled, completed
- `coach`: vikram, priya, arjun
- `page`: page number (default: 1)
- `limit`: results per page (default: 10)

### Get My Bookings (Protected)
```http
GET /bookings/my-bookings
Authorization: Bearer <token>
```

### Get Booking by ID (Admin)
```http
GET /bookings/:id
Authorization: Bearer <admin-token>
```

### Update Booking Status (Admin)
```http
PUT /bookings/:id/status
Authorization: Bearer <admin-token>
Content-Type: application/json

{
  "status": "confirmed",
  "notes": "Confirmed for tomorrow morning"
}
```

### Cancel Booking (Protected)
```http
PUT /bookings/:id/cancel
Authorization: Bearer <token>
```

### Delete Booking (Admin)
```http
DELETE /bookings/:id
Authorization: Bearer <admin-token>
```

---

## 3. Coach Endpoints

### Get All Coaches (Public)
```http
GET /coaches?isActive=true
```

### Get Coach by ID or Slug (Public)
```http
GET /coaches/vikram
# or
GET /coaches/507f1f77bcf86cd799439011
```

### Create Coach (Admin)
```http
POST /coaches
Authorization: Bearer <admin-token>
Content-Type: application/json

{
  "name": "New Coach",
  "slug": "new-coach",
  "specialty": "HIIT Training",
  "experience": "5+ years",
  "certifications": "ACE-CPT",
  "bio": "Expert in high-intensity training",
  "image": "https://example.com/image.jpg",
  "email": "coach@maximalgym.com",
  "phone": "+91 9876543214",
  "availability": [
    {
      "day": "monday",
      "slots": ["6am", "8am", "4pm"]
    }
  ]
}
```

### Update Coach (Admin)
```http
PUT /coaches/:id
Authorization: Bearer <admin-token>
Content-Type: application/json

{
  "specialty": "Updated Specialty",
  "experience": "10+ years"
}
```

### Delete Coach (Admin)
```http
DELETE /coaches/:id
Authorization: Bearer <admin-token>
```

---

## 4. FAQ Endpoints

### Get All FAQs (Public)
```http
GET /faqs?category=general&isActive=true
```

**Categories:** `general`, `membership`, `training`, `facilities`, `other`

### Get FAQ by ID (Public)
```http
GET /faqs/:id
```

### Create FAQ (Admin)
```http
POST /faqs
Authorization: Bearer <admin-token>
Content-Type: application/json

{
  "question": "What are your membership plans?",
  "answer": "We offer monthly, quarterly, and annual plans...",
  "category": "membership",
  "order": 1
}
```

### Update FAQ (Admin)
```http
PUT /faqs/:id
Authorization: Bearer <admin-token>
Content-Type: application/json

{
  "answer": "Updated answer..."
}
```

### Delete FAQ (Admin)
```http
DELETE /faqs/:id
Authorization: Bearer <admin-token>
```

---

## 5. Contact/Enquiry Endpoints

### Submit Enquiry (Public)
```http
POST /contact
Content-Type: application/json

{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "phone": "+91 9876543210",
  "subject": "Query about membership",
  "message": "I would like to know more about your annual membership plans."
}
```

### Get All Enquiries (Admin)
```http
GET /contact?status=pending&priority=high&page=1&limit=10
Authorization: Bearer <admin-token>
```

**Query Parameters:**
- `status`: pending, in-progress, resolved, closed
- `priority`: low, medium, high
- `page`: page number
- `limit`: results per page

### Get Enquiry by ID (Admin)
```http
GET /contact/:id
Authorization: Bearer <admin-token>
```

### Update Enquiry (Admin)
```http
PUT /contact/:id
Authorization: Bearer <admin-token>
Content-Type: application/json

{
  "status": "in-progress",
  "priority": "high",
  "assignedTo": "admin-user-id",
  "notes": "Following up tomorrow"
}
```

### Delete Enquiry (Admin)
```http
DELETE /contact/:id
Authorization: Bearer <admin-token>
```

---

## Standard Response Format

### Success Response
```json
{
  "status": "success",
  "message": "Operation completed successfully",
  "data": {
    // Response data
  }
}
```

### Error Response
```json
{
  "status": "error",
  "message": "Error description"
}
```

### Paginated Response
```json
{
  "status": "success",
  "data": {
    "items": [],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 50,
      "pages": 5
    }
  }
}
```

---

## Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

---

## Data Models

### User
```typescript
{
  name: string
  email: string
  password: string (hashed)
  role: 'user' | 'admin'
  phone: string
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}
```

### Booking
```typescript
{
  name: string
  email: string
  phone: string
  coach: 'vikram' | 'priya' | 'arjun'
  sessionType: 'personal' | 'assessment' | 'nutrition'
  date: Date
  time: string
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed'
  notes: string
  userId: ObjectId (optional)
  createdAt: Date
  updatedAt: Date
}
```

### Coach
```typescript
{
  name: string
  slug: string
  specialty: string
  experience: string
  certifications: string
  bio: string
  image: string
  email: string
  phone: string
  availability: [{
    day: string
    slots: string[]
  }]
  rating: number
  totalSessions: number
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}
```

### FAQ
```typescript
{
  question: string
  answer: string
  category: 'general' | 'membership' | 'training' | 'facilities' | 'other'
  order: number
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}
```

### Contact
```typescript
{
  name: string
  email: string
  phone: string
  subject: string
  message: string
  status: 'pending' | 'in-progress' | 'resolved' | 'closed'
  priority: 'low' | 'medium' | 'high'
  assignedTo: ObjectId
  notes: string
  createdAt: Date
  updatedAt: Date
}
```
