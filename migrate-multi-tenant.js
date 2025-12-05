const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Tenant = require('./models/Tenant');
const User = require('./models/User');
const Booking = require('./models/Booking');
const Coach = require('./models/Coach');
const FAQ = require('./models/FAQ');
const Contact = require('./models/Contact');

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/maximal-gym';

const migrateToMultiTenant = async () => {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        // Step 1: Create default tenant
        console.log('\n📝 Creating default tenant...');
        let tenant = await Tenant.findOne({ slug: 'maximal-gym' });

        if (!tenant) {
            tenant = await Tenant.create({
                name: 'Maximal Gym',
                slug: 'maximal-gym',
                email: 'admin@maximalgym.com',
                phone: '+91 9876543210',
                address: {
                    city: 'Mumbai',
                    state: 'Maharashtra',
                    country: 'India'
                },
                subscription: {
                    plan: 'premium',
                    status: 'active'
                },
                isActive: true
            });
            console.log(`✅ Created default tenant: ${tenant.name}`);
        } else {
            console.log(`✅ Default tenant already exists: ${tenant.name}`);
        }

        // Step 2: Update users without tenantId
        console.log('\n👤 Updating users...');
        const usersUpdateResult = await User.updateMany(
            { tenantId: { $exists: false }, role: { $ne: 'superadmin' } },
            { $set: { tenantId: tenant._id } }
        );
        console.log(`✅ Updated ${usersUpdateResult.modifiedCount} users`);

        // Step 3: Update bookings
        console.log('\n📅 Updating bookings...');
        const bookingsUpdateResult = await Booking.updateMany(
            { tenantId: { $exists: false } },
            { $set: { tenantId: tenant._id } }
        );
        console.log(`✅ Updated ${bookingsUpdateResult.modifiedCount} bookings`);

        // Step 4: Update coaches
        console.log('\n👨‍🏫 Updating coaches...');
        const coachesUpdateResult = await Coach.updateMany(
            { tenantId: { $exists: false } },
            { $set: { tenantId: tenant._id } }
        );
        console.log(`✅ Updated ${coachesUpdateResult.modifiedCount} coaches`);

        // Step 5: Update FAQs
        console.log('\n❓ Updating FAQs...');
        const faqsUpdateResult = await FAQ.updateMany(
            { tenantId: { $exists: false } },
            { $set: { tenantId: tenant._id } }
        );
        console.log(`✅ Updated ${faqsUpdateResult.modifiedCount} FAQs`);

        // Step 6: Update contacts
        console.log('\n📧 Updating contacts...');
        const contactsUpdateResult = await Contact.updateMany(
            { tenantId: { $exists: false } },
            { $set: { tenantId: tenant._id } }
        );
        console.log(`✅ Updated ${contactsUpdateResult.modifiedCount} contacts`);

        console.log('\n✅ Migration completed successfully!');
        console.log(`\nDefault Tenant ID: ${tenant._id}`);
        console.log('\n📋 Summary:');
        console.log(`   Tenant: ${tenant.name} (${tenant.slug})`);
        console.log(`   Users updated: ${usersUpdateResult.modifiedCount}`);
        console.log(`   Bookings updated: ${bookingsUpdateResult.modifiedCount}`);
        console.log(`   Coaches updated: ${coachesUpdateResult.modifiedCount}`);
        console.log(`   FAQs updated: ${faqsUpdateResult.modifiedCount}`);
        console.log(`   Contacts updated: ${contactsUpdateResult.modifiedCount}`);

        process.exit(0);
    } catch (error) {
        console.error('❌ Migration error:', error);
        process.exit(1);
    }
};

// Run migration
migrateToMultiTenant();
