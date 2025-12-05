# Multi-Tenant Implementation Guide

## Overview
This guide outlines the steps to implement multi-tenancy in the Maximal Gym system, allowing multiple gyms to use the same platform with isolated data.

## Architecture

### Tenant Isolation Strategy
- **Database**: Single database with tenant-based data segregation
- **TenantId**: All data models include a `tenantId` field
- **Middleware**: Auto-filters queries by authenticated user's tenant
- **User Association**: Each user belongs to one tenant

## Implementation Steps

### 1. Backend Changes

#### 1.1 Update User Model
Add `tenantId` field to User model:

```javascript
// models/User.js
const userSchema = new mongoose.Schema({
    // ... existing fields
    tenantId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tenant',
        required: [true, 'Tenant is required']
    },
    // ... rest of schema
});
```

#### 1.2 Update All Data Models
Add `tenantId` to these models:
- **Booking.js**
- **Coach.js**
- **FAQ.js**
- **Contact.js**

Example:
```javascript
const bookingSchema = new mongoose.Schema({
    tenantId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tenant',
        required: true,
        index: true
    },
    // ... existing fields
});
```

#### 1.3 Create Tenant Middleware
Create middleware to auto-inject tenantId:

```javascript
// middleware/tenantMiddleware.js
const tenantMiddleware = (req, res, next) => {
    if (req.user && req.user.tenantId) {
        req.tenantId = req.user.tenantId;
    }
    next();
};

module.exports = tenantMiddleware;
```

#### 1.4 Update Controllers
Modify all controllers to filter by `tenantId`:

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

#### 1.5 Create Tenant Routes & Controller

```javascript
// routes/tenantRoutes.js
const express = require('express');
const router = express.Router();
const { protect, restrictTo } = require('../middleware/auth');
const {
    createTenant,
    getAllTenants,
    getTenantById,
    updateTenant,
    deleteTenant
} = require('../controllers/tenantController');

// Super admin routes
router.post('/', protect, restrictTo('superadmin'), createTenant);
router.get('/', protect, restrictTo('superadmin'), getAllTenants);
router.get('/:id', protect, getTenantById);
router.put('/:id', protect, restrictTo('admin', 'superadmin'), updateTenant);
router.delete('/:id', protect, restrictTo('superadmin'), deleteTenant);

module.exports = router;
```

### 2. Frontend Changes

#### 2.1 Update API Base Configuration
Store tenant context in localStorage:

```typescript
// app/store/api/baseApi.ts
prepareHeaders: (headers) => {
    const token = localStorage.getItem('gym-token');
    const tenantId = localStorage.getItem('gym-tenantId');
    
    if (token) {
        headers.set('authorization', `Bearer ${token}`);
    }
    if (tenantId) {
        headers.set('x-tenant-id', tenantId);
    }
    return headers;
}
```

#### 2.2 Update Login Flow
Store tenant info on login:

```typescript
const response = await login(formData).unwrap();
localStorage.setItem("gym-token", response.data.token);
localStorage.setItem("gym-user", JSON.stringify(response.data.user));
localStorage.setItem("gym-tenantId", response.data.user.tenantId); // NEW
```

#### 2.3 Create Tenant Context (Optional)
For React context-based tenant management:

```typescript
// app/contexts/TenantContext.tsx
import { createContext, useContext, useEffect, useState } from 'react';

interface TenantContextType {
    tenantId: string | null;
    tenantData: any;
}

const TenantContext = createContext<TenantContextType>({ 
    tenantId: null, 
    tenantData: null 
});

export const useTenant = () => useContext(TenantContext);

export function TenantProvider({ children }: { children: React.ReactNode }) {
    const [tenantId, setTenantId] = useState<string | null>(null);
    
    useEffect(() => {
        const id = localStorage.getItem('gym-tenantId');
        setTenantId(id);
    }, []);
    
    return (
        <TenantContext.Provider value={{ tenantId, tenantData: null }}>
            {children}
        </TenantContext.Provider>
    );
}
```

### 3. Database Migration

#### 3.1 Create Default Tenant
```javascript
// migrations/addDefaultTenant.js
const mongoose = require('mongoose');
const Tenant = require('../models/Tenant');
const User = require('../models/User');

const addDefaultTenant = async () => {
    const tenant = await Tenant.create({
        name: 'Maximal Gym',
        slug: 'maximal-gym',
        email: 'admin@maximalgym.com',
        phone: '+91 9876543210',
        subscription: {
            plan: 'premium',
            status: 'active'
        }
    });
    
    // Update existing users
    await User.updateMany(
        { tenantId: { $exists: false } },
        { $set: { tenantId: tenant._id } }
    );
    
    // Update existing data
    await Booking.updateMany({}, { $set: { tenantId: tenant._id } });
    await Coach.updateMany({}, { $set: { tenantId: tenant._id } });
    await FAQ.updateMany({}, { $set: { tenantId: tenant._id } });
    await Contact.updateMany({}, { $set: { tenantId: tenant._id } });
    
    console.log('✅ Default tenant created and data migrated');
};
```

### 4. User Roles Update

Add tenant-level roles:
- **superadmin**: Manages multiple tenants
- **admin**: Manages single tenant
- **user**: Regular user within tenant

### 5. Testing Checklist

- [ ] Create multiple tenants
- [ ] Create users for each tenant
- [ ] Verify data isolation (Tenant A can't see Tenant B's data)
- [ ] Test booking creation with tenantId
- [ ] Test coach management per tenant
- [ ] Test FAQ management per tenant
- [ ] Verify admin panel shows only own tenant's data

### 6. Future Enhancements

#### 6.1 Subdomain-based Tenancy
```
tenant1.maximalgym.com
tenant2.maximalgym.com
```

#### 6.2 Custom Branding
- Tenant-specific logo
- Custom colors
- White-labeling

#### 6.3 Per-Tenant Analytics
- Dashboard with tenant-specific metrics
- Reports and insights

#### 6.4 Tenant Management Portal
- Superadmin dashboard
- Tenant creation/management UI
- Subscription management

## Security Considerations

1. **Row-Level Security**: Always filter by tenantId
2. **Token Validation**: Include tenant in JWT payload
3. **API Validation**: Verify user belongs to tenant
4. **Data Leakage Prevention**: Never expose cross-tenant data

## API Changes

### Before (Single-tenant)
```
GET /api/bookings
```

### After (Multi-tenant)
```
GET /api/bookings
Headers: { "x-tenant-id": "tenant_123" }
// or automatic from JWT token
```

## Deployment Notes

1. Run migration script to add default tenant
2. Update all existing users with tenantId
3. Update all existing data with tenantId
4. Deploy backend with tenant middleware
5. Deploy frontend with tenant context
6. Test thoroughly before production

## Summary

This multi-tenant architecture provides:
- ✅ Complete data isolation
- ✅ Scalable for multiple gyms
- ✅ Secure tenant boundaries
- ✅ Easy to add new tenants
- ✅ Centralized management

## Next Steps

1. Implement Tenant model ✅
2. Update User model with tenantId
3. Update all data models with tenantId
4. Create tenant middleware
5. Update all controllers
6. Create migration script
7. Update frontend authentication
8. Test thoroughly
