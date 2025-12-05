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
