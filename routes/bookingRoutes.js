const express = require('express');
const router = express.Router();
const { protect, restrictTo } = require('../middleware/auth');
const {
    createBooking,
    getAllBookings,
    getMyBookings,
    getBookingById,
    updateBookingStatus,
    cancelBooking,
    deleteBooking
} = require('../controllers/bookingController');

// Public route
router.post('/', createBooking);

// Protected routes
router.get('/my-bookings', protect, getMyBookings);
router.put('/:id/cancel', protect, cancelBooking);

// Admin routes
router.get('/', protect, restrictTo('admin'), getAllBookings);
router.get('/:id', protect, restrictTo('admin'), getBookingById);
router.put('/:id/status', protect, restrictTo('admin'), updateBookingStatus);
router.delete('/:id', protect, restrictTo('admin'), deleteBooking);

module.exports = router;
