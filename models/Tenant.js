const mongoose = require('mongoose');

const tenantSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Tenant name is required'],
        trim: true
    },
    slug: {
        type: String,
        required: [true, 'Tenant slug is required'],
        unique: true,
        lowercase: true,
        trim: true
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        lowercase: true,
        trim: true
    },
    phone: {
        type: String,
        required: [true, 'Phone is required']
    },
    address: {
        street: String,
        city: String,
        state: String,
        zipCode: String,
        country: String
    },
    settings: {
        timezone: {
            type: String,
            default: 'Asia/Kolkata'
        },
        currency: {
            type: String,
            default: 'INR'
        },
        branding: {
            logo: String,
            primaryColor: String,
            secondaryColor: String
        }
    },
    subscription: {
        plan: {
            type: String,
            enum: ['free', 'basic', 'premium', 'enterprise'],
            default: 'free'
        },
        status: {
            type: String,
            enum: ['active', 'inactive', 'suspended'],
            default: 'active'
        },
        expiresAt: Date
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

// Indexes (slug index is created automatically by unique: true)
tenantSchema.index({ email: 1 });

module.exports = mongoose.model('Tenant', tenantSchema);
