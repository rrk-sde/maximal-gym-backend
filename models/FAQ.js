const mongoose = require('mongoose');

const faqSchema = new mongoose.Schema(
    {
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

// Index for ordering
faqSchema.index({ order: 1, createdAt: -1 });

module.exports = mongoose.model('FAQ', faqSchema);
