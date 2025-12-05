# How to Create Tenants - Complete Guide

## 📋 Overview

In your multi-tenant system, each gym is a separate tenant with isolated data. Here's how to create new tenants.

---

## Method 1: Using the Script (Easiest) ⭐

### Step 1: Edit the tenant data

Open `create-tenant.js` and modify the `newTenantData` object:

```javascript
const newTenantData = {
    name: 'Your Gym Name',           // Change this
    slug: 'your-gym-slug',           // Change this (lowercase, no spaces)
    email: 'admin@yourgym.com',      // Change this
    phone: '+91 1234567890',         // Change this
    address: {
        street: 'Your Street Address',
        city: 'Your City',
        state: 'Your State',
        zipCode: '123456',
        country: 'India'
    },
    settings: {
        timezone: 'Asia/Kolkata',
        currency: 'INR',
        branding: {
            logo: 'https://your-logo-url.com/logo.png',
            primaryColor: '#FF4D00',      // Your brand color
            secondaryColor: '#000000'
        }
    },
    subscription: {
        plan: 'premium',                  // free, basic, premium, enterprise
        status: 'active'                  // active, inactive, suspended
    },
    isActive: true
};
```

### Step 2: Run the script

```bash
cd /Users/cb-imac/Desktop/project/maximal-gym-backend
node create-tenant.js
```

### Step 3: Save the Tenant ID

The script will output something like:
```
✅ Tenant created successfully!

📋 Tenant Details:
   ID: 67a3b4c5d6e7f8g9h0i1j2k3
   Name: Power Gym Elite
   Slug: power-gym-elite
   ...

📝 Next Steps:
1. Update frontend .env.local with tenant ID:
   NEXT_PUBLIC_TENANT_ID=67a3b4c5d6e7f8g9h0i1j2k3
```

Copy the ID and add it to your frontend's `.env.local`.

---

## Method 2: Via API Call (For Integration)

### Prerequisites
- You need a **superadmin** user token
- MongoDB must be running

### Create Tenant

```bash
curl -X POST http://localhost:5000/api/tenants \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_SUPERADMIN_TOKEN" \
  -d '{
    "name": "Elite Fitness",
    "slug": "elite-fitness",
    "email": "admin@elite.com",
    "phone": "+91 9876543210",
    "subscription": {
      "plan": "premium",
      "status": "active"
    }
  }'
```

### Response
```json
{
  "status": "success",
  "data": {
    "tenant": {
      "_id": "67a3b4c5d6e7f8g9h0i1j2k3",
      "name": "Elite Fitness",
      "slug": "elite-fitness",
      ...
    }
  }
}
```

---

## Method 3: Via Admin UI (Future Enhancement)

An admin page for tenant management can be created at `/admin/tenants` where superadmins can:
- View all tenants
- Create new tenants
- Edit tenant details
- Manage subscriptions
- Activate/deactivate tenants

---

## What Happens After Creating a Tenant?

### 1. Tenant is Created in Database ✅
The new gym organization is stored with all its details.

### 2. Create Admin User for This Tenant

You need to create an admin user associated with this tenant:

```bash
# Using the auth API
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Gym Admin",
    "email": "admin@yourgym.com",
    "password": "securepassword123",
    "phone": "+91 1234567890",
    "role": "admin",
    "tenantId": "PASTE_TENANT_ID_HERE"
  }'
```

### 3. Configure Frontend for This Tenant

Update frontend `.env.local`:
```
NEXT_PUBLIC_TENANT_ID=YOUR_NEW_TENANT_ID
```

Restart the frontend:
```bash
# Kill current dev server (Ctrl+C)
npm run dev
```

### 4. Login and Add Data

Now you can login as the admin of this tenant and add:
- Coaches
- FAQs
- Manage bookings
- Handle enquiries

**All data will be isolated to this tenant!** ✅

---

## Managing Multiple Tenants

### Scenario 1: Multiple Frontends (Separate Deployments)
Deploy separate frontend instances for each gym:
```
gym1.yourdomain.com -> NEXT_PUBLIC_TENANT_ID=tenant1_id
gym2.yourdomain.com -> NEXT_PUBLIC_TENANT_ID=tenant2_id
gym3.yourdomain.com -> NEXT_PUBLIC_TENANT_ID=tenant3_id
```

### Scenario 2: Subdomain-Based (Advanced)
Use subdomain routing where tenant is determined by subdomain:
```
maximal.gyms.com     -> Tenant: Maximal Gym
elite.gyms.com       -> Tenant: Elite Fitness
power.gyms.com       -> Tenant: Power Gym
```

### Scenario 3: Single Frontend with Switcher (Superadmin)
Superadmin can switch between tenants using tenant selector in admin panel.

---

## Tenant Data Structure

```javascript
{
  name: String,              // Gym name
  slug: String,              // URL-friendly identifier (unique)
  email: String,             // Primary contact email
  phone: String,             // Primary phone
  
  address: {                 // Physical location
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String
  },
  
  settings: {
    timezone: String,        // e.g., "Asia/Kolkata"
    currency: String,        // e.g., "INR"
    branding: {
      logo: String,          // URL to logo
      primaryColor: String,  // Hex color
      secondaryColor: String // Hex color
    }
  },
  
  subscription: {
    plan: String,            // free, basic, premium, enterprise
    status: String,          // active, inactive, suspended
    expiresAt: Date          // Optional expiration date
  },
  
  isActive: Boolean          // Enable/disable tenant
}
```

---

## Example: Creating 3 Gyms

### Gym 1: Maximal Gym (Already Created)
```javascript
{
  name: "Maximal Gym",
  slug: "maximal-gym",
  email: "admin@maximalgym.com",
  tenantId: "69327f25f56c9b45e73557b8"
}
```

### Gym 2: Elite Fitness
```bash
node create-tenant.js
# Edit newTenantData first with Elite Fitness details
```

### Gym 3: Power Gym
```bash
node create-tenant.js
# Edit newTenantData with Power Gym details
```

Each will have:
- Separate tenant ID
- Own admin users
- Isolated data (bookings, coaches, FAQs, contacts)
- Own branding/settings

---

## Tenant Management Commands

### List All Tenants
```bash
curl http://localhost:5000/api/tenants \
  -H "Authorization: Bearer SUPERADMIN_TOKEN"
```

### Get Tenant Details
```bash
curl http://localhost:5000/api/tenants/TENANT_ID \
  -H "Authorization: Bearer ADMIN_OR_SUPERADMIN_TOKEN"
```

### Update Tenant
```bash
curl -X PUT http://localhost:5000/api/tenants/TENANT_ID \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ADMIN_OR_SUPERADMIN_TOKEN" \
  -d '{
    "subscription": {
      "plan": "enterprise",
      "status": "active"
    }
  }'
```

### Delete Tenant
```bash
curl -X DELETE http://localhost:5000/api/tenants/TENANT_ID \
  -H "Authorization: Bearer SUPERADMIN_TOKEN"
```

---

## Quick Reference

| Task | Command |
|------|---------|
| Create tenant via script | `node create-tenant.js` |
| Create admin for tenant | POST `/api/auth/register` with `tenantId` |
| List all tenants | GET `/api/tenants` |
| Update tenant | PUT `/api/tenants/:id` |
| Delete tenant | DELETE `/api/tenants/:id` |

---

## Summary

Creating a new tenant is as simple as:

1. **Run the script**: `node create-tenant.js` (after editing data)
2. **Copy the tenant ID**
3. **Create admin user** for that tenant
4. **Update frontend** `.env.local` if needed
5. **Start managing** the new gym!

Each tenant gets complete data isolation and can be fully customized! 🎉
