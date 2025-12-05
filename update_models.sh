#!/bin/bash

# Multi-Tenant Implementation Script
# This script completes the remaining multi-tenant setup

echo "🚀 Starting Multi-Tenant Implementation..."

# Step 1: Update FAQ Model
echo "📝 Updating FAQ Model..."
cat > models/FAQ_updated.js << 'EOF'
const mongoose = require('mongoose');

const faqSchema = new mongoose.Schema(
    {
        tenantId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Tenant',
            required: true,
            index: true
        },
        question: {
            type: String,
            required: [true, 'Please provide a question'],
            trim: true
        },
        answer: {
            type: String,
            required: [true, 'Please provide an answer'],
            trim: true
        },
        category: {
            type: String,
            enum: ['general', 'membership', 'training', 'facilities', 'other'],
            default: 'general'
        },
        order: {
            type: Number,
            default: 0
        },
        isActive: {
            type: Boolean,
            default: true
        }
    },
    {
        timestamps: true
    }
);

// Indexes
faqSchema.index({ tenantId: 1, category: 1, order: 1 });

module.exports = mongoose.model('FAQ', faqSchema);
EOF

# Step 2: Update Contact Model
echo "📝 Updating Contact Model..."
cat > models/Contact_updated.js << 'EOF'
const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema(
    {
        tenantId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Tenant',
            required: true,
            index: true
        },
        name: {
            type: String,
            required: [true, 'Please provide your name'],
            trim: true
        },
        email: {
            type: String,
            required: [true, 'Please provide your email'],
            lowercase: true,
            trim: true,
            match: [
                /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
                'Please provide a valid email'
            ]
        },
        phone: {
            type: String,
            trim: true
        },
        subject: {
            type: String,
            required: [true, 'Please provide a subject'],
            trim: true
        },
        message: {
            type: String,
            required: [true, 'Please provide a message'],
            trim: true
        },
        status: {
            type: String,
            enum: ['pending', 'in-progress', 'resolved', 'closed'],
            default: 'pending'
        },
        priority: {
            type: String,
            enum: ['low', 'medium', 'high'],
            default: 'medium'
        },
        assignedTo: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        notes: {
            type: String,
            trim: true
        }
    },
    {
        timestamps: true
    }
);

// Indexes
contactSchema.index({ tenantId: 1, status: 1, createdAt: -1 });

module.exports = mongoose.model('Contact', contactSchema);
EOF

echo "✅ Model files created successfully!"
echo ""
echo "⚠️  IMPORTANT: Manual steps required:"
echo "1. Replace models/FAQ.js with models/FAQ_updated.js"
echo "2. Replace models/Contact.js with models/Contact_updated.js"
echo ""
echo "Run the following commands:"
echo "  mv models/FAQ_updated.js models/FAQ.js"
echo "  mv models/Contact_updated.js models/Contact.js"
