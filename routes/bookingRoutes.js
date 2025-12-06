const express = require('express');
const router = express.Router();
const { protect, restrictTo } = require('../middleware/auth');
const tenantMiddleware = require('../middleware/tenantMiddleware');
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
router.post('/', tenantMiddleware, createBooking);

// Protected routes
router.get('/my-bookings', protect, tenantMiddleware, getMyBookings);
router.put('/:id/cancel', protect, tenantMiddleware, cancelBooking);

// Admin routes
router.get('/', protect, tenantMiddleware, restrictTo('admin', 'superadmin'), getAllBookings);
router.get('/:id', protect, tenantMiddleware, restrictTo('admin', 'superadmin'), getBookingById);
router.put('/:id/status', protect, tenantMiddleware, restrictTo('admin', 'superadmin'), updateBookingStatus);
router.delete('/:id', protect, tenantMiddleware, restrictTo('admin', 'superadmin'), deleteBooking);

module.exports = router;
