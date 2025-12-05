const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Coach = require('./models/Coach');
const FAQ = require('./models/FAQ');
const Tenant = require('./models/Tenant');

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/maximal-gym';

// Sample data
// Note: tenantId will be added to admin user during seeding
const users = [
    {
        name: 'Super Administrator',
        email: 'superadmin@maximalgym.com',
        password: 'superadmin123',
        role: 'superadmin',
        phone: '+91 9999999999'
        // No tenantId for superadmin
    },
    {
        name: 'Admin User',
        email: 'admin@maximalgym.com',
        password: 'admin123',
        role: 'admin',
        phone: '+91 9876543210'
        // tenantId will be added during seed process
    }
];

const coaches = [
    {
        name: 'Vikram Malhotra',
        slug: 'vikram',
        specialty: 'Strength & Conditioning',
        experience: '8+ years',
        certifications: 'NASM-CPT, CSCS',
        bio: 'Specializes in building strength and muscle gain with personalized training programs.',
        image: 'https://images.unsplash.com/photo-1567013127542-490d757e51fc?w=400&q=80',
        email: 'vikram@maximalgym.com',
        phone: '+91 9876543211',
        availability: [
            { day: 'monday', slots: ['6am', '8am', '4pm', '6pm'] },
            { day: 'wednesday', slots: ['6am', '8am', '4pm', '6pm'] },
            { day: 'friday', slots: ['6am', '8am', '4pm', '6pm'] }
        ],
        rating: 4.8,
        totalSessions: 325,
        isActive: true
    },
    {
        name: 'Anjali Gupta',
        slug: 'priya',
        specialty: 'Yoga & Mindfulness',
        experience: '10+ years',
        certifications: 'RYT-500, Yoga Alliance',
        bio: 'Expert in yoga, flexibility, and mindfulness practices for holistic wellness.',
        image: 'https://images.unsplash.com/photo-1594381898411-846e7d193883?w=400&q=80',
        email: 'anjali@maximalgym.com',
        phone: '+91 9876543212',
        availability: [
            { day: 'tuesday', slots: ['6am', '8am', '10am'] },
            { day: 'thursday', slots: ['6am', '8am', '10am'] },
            { day: 'saturday', slots: ['8am', '10am'] }
        ],
        rating: 4.9,
        totalSessions: 450,
        isActive: true
    },
    {
        name: 'Rohan Verma',
        slug: 'arjun',
        specialty: 'CrossFit & Endurance',
        experience: '6+ years',
        certifications: 'ACE-CPT, TRX',
        bio: 'Focuses on HIIT, cardio, and endurance training for maximum fitness.',
        image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&q=80',
        email: 'rohan@maximalgym.com',
        phone: '+91 9876543213',
        availability: [
            { day: 'monday', slots: ['4pm', '6pm', '8pm'] },
            { day: 'wednesday', slots: ['4pm', '6pm', '8pm'] },
            { day: 'friday', slots: ['4pm', '6pm', '8pm'] }
        ],
        rating: 4.7,
        totalSessions: 280,
        isActive: true
    }
];

const faqs = [
    {
        question: 'What are the gym timings?',
        answer: 'Our gym is open from 6:00 AM to 10:00 PM, Monday to Saturday, and 7:00 AM to 8:00 PM on Sundays.',
        category: 'general',
        order: 1,
        isActive: true
    },
    {
        question: 'Do you offer personal training?',
        answer: 'Yes, we offer one-on-one personal training sessions with certified coaches. You can book a session through our website or app.',
        category: 'training',
        order: 2,
        isActive: true
    },
    {
        question: 'What membership plans do you have?',
        answer: 'We offer monthly, quarterly, and annual membership plans. Each plan includes access to all gym equipment, group classes, and locker facilities.',
        category: 'membership',
        order: 3,
        isActive: true
    },
    {
        question: 'Are group classes included in the membership?',
        answer: 'Yes, all our memberships include unlimited access to group classes like yoga, HIIT, and strength training.',
        category: 'membership',
        order: 4,
        isActive: true
    },
    {
        question: 'Do I need to bring my own equipment?',
        answer: 'No, we provide all necessary equipment. However, you may bring your own yoga mat or workout towel if you prefer.',
        category: 'facilities',
        order: 5,
        isActive: true
    }
];

// Seed function
const seedDatabase = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        // Clear existing data
        await User.deleteMany({});
        await Coach.deleteMany({});
        await FAQ.deleteMany({});
        await Tenant.deleteMany({});
        console.log('🗑️  Cleared existing data');

        // Step 1: Create default tenant
        const tenant = await Tenant.create({
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
        console.log('🏢 Default tenant created');

        // Step 2: Create users
        const [superadmin, admin] = users;

        // Create superadmin (no tenantId)
        await User.create(superadmin);
        console.log('👤 Superadmin created');

        // Create admin with tenantId
        await User.create({ ...admin, tenantId: tenant._id });
        console.log('👤 Admin user created');

        // Step 3: Add tenantId to coaches and create them
        const coachesWithTenant = coaches.map(coach => ({
            ...coach,
            tenantId: tenant._id
        }));
        await Coach.create(coachesWithTenant);
        console.log('👨‍🏫 Coaches created');

        // Step 4: Add tenantId to FAQs and create them
        const faqsWithTenant = faqs.map(faq => ({
            ...faq,
            tenantId: tenant._id
        }));
        await FAQ.create(faqsWithTenant);
        console.log('❓ FAQs created');

        console.log('\n✅ Database seeded successfully!');
        console.log('\n� Tenant Information:');
        console.log(`   Tenant ID: ${tenant._id}`);
        console.log(`   Name: ${tenant.name}`);
        console.log(`   Slug: ${tenant.slug}`);
        console.log('\n📝 Superadmin Credentials:');
        console.log('   Email: superadmin@maximalgym.com');
        console.log('   Password: superadmin123');
        console.log('   Role: superadmin');
        console.log('\n📝 Admin Credentials:');
        console.log('   Email: admin@maximalgym.com');
        console.log('   Password: admin123');
        console.log('   Role: admin');
        console.log(`   TenantId: ${tenant._id}`);
        console.log('\n⚠️  Please change passwords after first login!\n');

        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding database:', error);
        process.exit(1);
    }
};

// Run seed function
seedDatabase();
