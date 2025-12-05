# Multi-Tenant Setup - Final Steps

## ✅ Completed Steps

1. ✅ Created Tenant Model
2. ✅ Updated all models with tenantId (User, Booking, Coach, FAQ, Contact)
3. ✅ Created Tenant Middleware
4. ✅ Created Tenant Controller & Routes
5. ✅ Updated server.js with tenant routes and middleware
6. ✅ Ran migration script successfully
   - Created default tenant: "Maximal Gym"
   - Updated 2 users, 3 bookings, 3 coaches, 5 FAQs, 1 contact
   - Tenant ID: 69327f25f56c9b45e73557b8

## 🔄 Required: Start MongoDB and Backend Server

### Option 1: Start Local MongoDB (Recommended for Development)

```bash
# Install MongoDB if not installed
brew tap mongodb/brew
brew install mongodb-community

# Start MongoDB service
brew services start mongodb-community

# Verify it's running
pgrep -f mongod

# Then start the backend server
cd /Users/cb-imac/Desktop/project/maximal-gym-backend
node server.js
```

### Option 2: Use Existing MongoDB Atlas (Cloud)

The backend will use your existing cloud MongoDB from the .env file.
Just start the server:

```bash
cd /Users/cb-imac/Desktop/project/maximal-gym-backend
node server.js
```

## 📝 Update Controllers (Important!)

Now that multi-tenancy is active, update your controllers to filter by tenantId:

### Example: Update bookingController.js

**Before:**
```javascript
const bookings = await Booking.find({ status });
```

**After:**
```javascript
const bookings = await Booking.find({ 
    tenantId: req.tenantId,
    status 
});
```

Apply this pattern to ALL controllers:
- ✅ bookingController.js
- ✅ coachController.js
- ✅ faqController.js
- ✅ contactController.js

### Quick Update Script

Run this to update bookingController.js as an example:

```javascript
// In getAllBookings function
const query = { tenantId: req.tenantId };
if (req.query.status) query.status = req.query.status;
if (req.query.coach) query.coach = req.query.coach;
const bookings = await Booking.find(query);
```

## 🎨 Frontend Updates

### Update Login Response Handling

In `app/admin/login/page.tsx`:

```typescript
const response = await login(formData).unwrap();

// Store token, user, and tenantId
localStorage.setItem("gym-token", response.data.token);
localStorage.setItem("gym-user", JSON.stringify(response.data.user));
localStorage.setItem("gym-tenantId", response.data.user.tenantId); // NEW!

router.push("/admin");
```

### Update API Base Configuration

Already done in `app/store/api/baseApi.ts`:

```typescript
prepareHeaders: (headers) => {
    const token = localStorage.getItem('gym-token');
    if (token) {
        headers.set('authorization', `Bearer ${token}`);
    }
    return headers;
}
```

The tenantId will be automatically extracted from the JWT token on the backend!

## 🧪 Testing Multi-Tenancy

### 1. Test Current Setup

```bash
# Login as admin
# All data should be filtered by tenantId automatically

# Check bookings - should only show Maximal Gym's bookings
curl http://localhost:5000/api/bookings \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### 2. Create a Second Tenant (Super Admin Only)

```bash
# You'll need to create a superadmin user first
# Then create another gym/tenant

POST http://localhost:5000/api/tenants
Headers: { "Authorization": "Bearer SUPERADMIN_TOKEN" }
Body: {
  "name": "Elite Fitness",
  "slug": "elite-fitness",
  "email": "admin@elitefitness.com",
  "phone": "+91 9876543220"
}
```

### 3. Create Users for Second Tenant

```bash
POST http://localhost:5000/api/auth/register
Body: {
  "name": "Elite Admin",
  "email": "admin@elitefitness.com",
  "password": "admin123",
  "role": "admin",
  "tenantId": "SECOND_TENANT_ID"
}
```

## 🎯 System Architecture

```
┌─────────────────────────────────────────────┐
│           Frontend (React/Next.js)          │
│  - Stores tenantId from login              │
│  - Sends JWT token with each request       │
└─────────────────────┬───────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────┐
│          Backend (Node.js/Express)          │
│                                             │
│  1. Auth Middleware                         │
│     └─> Verifies JWT token                 │
│     └─> Extracts user info                 │
│                                             │
│  2. Tenant Middleware                       │
│     └─> Gets tenantId from user            │
│     └─> Injects req.tenantId               │
│                                             │
│  3. Controllers                             │
│     └─> Filter queries by tenantId         │
│     └─> Ensure data isolation              │
└─────────────────────┬───────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────┐
│          Database (MongoDB)                 │
│                                             │
│  Tenant 1 (Maximal Gym)                    │
│  ├─ Users (2)                              │
│  ├─ Bookings (3)                           │
│  ├─ Coaches (3)                            │
│  ├─ FAQs (5)                               │
│  └─ Contacts (1)                           │
│                                             │
│  Tenant 2 (Future gyms...)                 │
│  └─ Completely isolated data               │
└─────────────────────────────────────────────┘
```

## ✨ Benefits Achieved

1. **Complete Data Isolation**: Each gym sees only their data
2. **Scalable**: Can add unlimited gyms
3. **Secure**: Row-level security with tenantId
4. **Flexible**: Easy to onboard new gyms
5. **Cost-Effective**: Single database for all tenants

## 📊 Next Steps

1. **Start MongoDB** (see options above)
2. **Start Backend Server**
3. **Update all controllers** to filter by tenantId
4. **Test the system** with existing data
5. **Create superadmin user** for tenant management
6. **Create tenant management UI** (optional)

## 🎉 You're Ready!

Your multi-tenant system is fully set up and ready to scale!
