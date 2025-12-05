const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Tenant = require('./models/Tenant');

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/maximal-gym';

const createTenant = async (tenantData) => {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        const tenant = await Tenant.create(tenantData);

        console.log('\n✅ Tenant created successfully!');
        console.log('\n📋 Tenant Details:');
        console.log(`   ID: ${tenant._id}`);
        console.log(`   Name: ${tenant.name}`);
        console.log(`   Slug: ${tenant.slug}`);
        console.log(`   Email: ${tenant.email}`);
        console.log(`   Phone: ${tenant.phone}`);
        console.log(`   Plan: ${tenant.subscription.plan}`);
        console.log(`   Status: ${tenant.subscription.status}`);

        console.log('\n📝 Next Steps:');
        console.log('1. Update frontend .env.local with tenant ID:');
        console.log(`   NEXT_PUBLIC_TENANT_ID=${tenant._id}`);
        console.log('2. Create admin user for this tenant');
        console.log('3. Start adding coaches, FAQs, etc. for this tenant');

        process.exit(0);
    } catch (error) {
        console.error('❌ Error creating tenant:', error.message);
        process.exit(1);
    }
};

// Example tenant data - CUSTOMIZE THIS
const newTenantData = {
    name: 'Power Gym Elite',
    slug: 'power-gym-elite',
    email: 'admin@powergym.com',
    phone: '+91 9876543221',
    address: {
        street: '456 Fitness Avenue',
        city: 'Mumbai',
        state: 'Maharashtra',
        zipCode: '400001',
        country: 'India'
    },
    settings: {
        timezone: 'Asia/Kolkata',
        currency: 'INR',
        branding: {
            logo: 'https://example.com/powergym-logo.png',
            primaryColor: '#0066FF',
            secondaryColor: '#FF6600'
        }
    },
    subscription: {
        plan: 'premium',
        status: 'active'
    },
    isActive: true
};

// Run the script
console.log('🏢 Creating new tenant...\n');
createTenant(newTenantData);
