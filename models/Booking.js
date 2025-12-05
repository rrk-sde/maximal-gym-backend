const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
    {
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
                /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
                'Please provide a valid email'
            ]
        },
        tenantId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Tenant',
            required: true,
            index: true
        },
        phone: {
            type: String,
            required: [true, 'Please provide your phone number'],
            trim: true
        },
        coach: {
            type: String,
            required: [true, 'Please select a coach'],
            enum: ['vikram', 'priya', 'arjun']
        },
        sessionType: {
            type: String,
            required: [true, 'Please select a session type'],
            enum: ['personal', 'assessment', 'nutrition']
        },
        date: {
            type: Date,
            required: [true, 'Please provide a preferred date']
        },
        time: {
            type: String,
            required: [true, 'Please provide a preferred time'],
            enum: ['6am', '8am', '10am', '4pm', '6pm', '8pm']
        },
        status: {
            type: String,
            enum: ['pending', 'confirmed', 'cancelled', 'completed'],
            default: 'pending'
        },
        notes: {
            type: String,
            trim: true
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    },
    {
        timestamps: true
    }
);

// Index for faster queries
bookingSchema.index({ tenantId: 1, email: 1, date: 1 });
bookingSchema.index({ tenantId: 1, coach: 1, date: 1, time: 1 }, { unique: true });

module.exports = mongoose.model('Booking', bookingSchema);
