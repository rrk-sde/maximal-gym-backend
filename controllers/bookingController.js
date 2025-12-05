const Booking = require('../models/Booking');

// @desc    Create a new booking
// @route   POST /api/bookings
// @access  Public
exports.createBooking = async (req, res) => {
    try {
        const { name, email, phone, coach, sessionType, date, time, notes } = req.body;

        // Check if slot is already booked (within same tenant if tenantId exists)
        const conflictQuery = {
            coach,
            date: new Date(date),
            time,
            status: { $in: ['pending', 'confirmed'] }
        };
        if (req.tenantId) {
            conflictQuery.tenantId = req.tenantId;
        }

        const existingBooking = await Booking.findOne(conflictQuery);

        if (existingBooking) {
            return res.status(400).json({
                status: 'error',
                message: 'This time slot is already booked'
            });
        }

        // Create booking with tenantId
        const bookingData = {
            name,
            email,
            phone,
            coach,
            sessionType,
            date,
            time,
            notes,
            tenantId: req.tenantId || req.body.tenantId,
            ...(req.user && { userId: req.user.id })
        };

        const booking = await Booking.create(bookingData);

        res.status(201).json({
            status: 'success',
            message: 'Booking created successfully',
            data: { booking }
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
};

// @desc    Get all bookings
// @route   GET /api/bookings
// @access  Private/Admin
exports.getAllBookings = async (req, res) => {
    try {
        const { status, coach, page = 1, limit = 10 } = req.query;

        const query = {};
        if (status) query.status = status;
        if (coach) query.coach = coach;

        // Filter by tenantId if present (from middleware)
        if (req.tenantId) {
            query.tenantId = req.tenantId;
        }

        const bookings = await Booking.find(query)
            .sort({ date: -1, createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const total = await Booking.countDocuments(query);

        res.status(200).json({
            status: 'success',
            data: {
                bookings,
                pagination: {
                    page: Number(page),
                    limit: Number(limit),
                    total,
                    pages: Math.ceil(total / limit)
                }
            }
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
};

// @desc    Get user's bookings
// @route   GET /api/bookings/my-bookings
// @access  Private
exports.getMyBookings = async (req, res) => {
    try {
        const bookings = await Booking.find({
            $or: [
                { userId: req.user.id },
                { email: req.user.email }
            ]
        }).sort({ date: -1 });

        res.status(200).json({
            status: 'success',
            data: { bookings }
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
};

// @desc    Get booking by ID
// @route   GET /api/bookings/:id
// @access  Private
exports.getBookingById = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id);

        if (!booking) {
            return res.status(404).json({
                status: 'error',
                message: 'Booking not found'
            });
        }

        res.status(200).json({
            status: 'success',
            data: { booking }
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
};

// @desc    Update booking status
// @route   PUT /api/bookings/:id/status
// @access  Private/Admin
exports.updateBookingStatus = async (req, res) => {
    try {
        const { status, notes } = req.body;

        const booking = await Booking.findByIdAndUpdate(
            req.params.id,
            { status, ...(notes && { notes }) },
            { new: true, runValidators: true }
        );

        if (!booking) {
            return res.status(404).json({
                status: 'error',
                message: 'Booking not found'
            });
        }

        res.status(200).json({
            status: 'success',
            message: 'Booking status updated successfully',
            data: { booking }
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
};

// @desc    Cancel booking
// @route   PUT /api/bookings/:id/cancel
// @access  Private
exports.cancelBooking = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id);

        if (!booking) {
            return res.status(404).json({
                status: 'error',
                message: 'Booking not found'
            });
        }

        // Only allow cancellation if booking belongs to user or user is admin
        if (req.user.role !== 'admin' &&
            booking.userId?.toString() !== req.user.id &&
            booking.email !== req.user.email) {
            return res.status(403).json({
                status: 'error',
                message: 'You are not authorized to cancel this booking'
            });
        }

        booking.status = 'cancelled';
        await booking.save();

        res.status(200).json({
            status: 'success',
            message: 'Booking cancelled successfully',
            data: { booking }
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
};

// @desc    Delete booking
// @route   DELETE /api/bookings/:id
// @access  Private/Admin
exports.deleteBooking = async (req, res) => {
    try {
        const booking = await Booking.findByIdAndDelete(req.params.id);

        if (!booking) {
            return res.status(404).json({
                status: 'error',
                message: 'Booking not found'
            });
        }

        res.status(200).json({
            status: 'success',
            message: 'Booking deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
};
