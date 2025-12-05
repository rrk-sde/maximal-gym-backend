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
