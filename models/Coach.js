const mongoose = require('mongoose');

const coachSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Please provide coach name'],
            trim: true
        },
        slug: {
            type: String,
            required: true,
            unique: true,
            lowercase: true
        },
        specialty: {
            type: String,
            required: [true, 'Please provide specialty'],
            trim: true
        },
        experience: {
            type: String,
            required: [true, 'Please provide experience'],
            trim: true
        },
        certifications: {
            type: String,
            required: [true, 'Please provide certifications'],
            trim: true
        },
        bio: {
            type: String,
            trim: true
        },
        image: {
            type: String,
            default: ''
        },
        email: {
            type: String,
            lowercase: true,
            trim: true
        },
        phone: {
            type: String,
            trim: true
        },
        availability: [{
            day: {
                type: String,
                enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
            },
            slots: [String]
        }],
        rating: {
            type: Number,
            default: 0,
            min: 0,
            max: 5
        },
        totalSessions: {
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

module.exports = mongoose.model('Coach', coachSchema);
